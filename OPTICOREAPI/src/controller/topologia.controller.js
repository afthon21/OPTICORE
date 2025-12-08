import 'dotenv/config';
// Si Node tiene fetch global (Node 18+), no hace falta importar node-fetch
// import fetch from 'node-fetch';

function mapNode(n) {
  if (!n) return null;
  return {
    id: (n.id ?? n._id ?? n.coreId ?? n.uid ?? String(n.name ?? n.hostname ?? n.label ?? Math.random())),
    label: (n.name ?? n.title ?? n.hostname ?? n.label ?? ''),
    type: (n.type ?? n.deviceType ?? (n.model ? 'device' : 'unknown')),
    ip: n.ip ?? n.address ?? n.host ?? null,
    model: n.model ?? n.vendor ?? null,
    status: (n.status ?? (n.state ? (n.state === 'online' ? 'up' : n.state) : null)) || null,
    raw: n
  };
}

function mapLink(l) {
  if (!l) return null;
  const src = l.source ?? l.src ?? l.a ?? l.from ?? l.endpointA ?? l.uplink ?? null;
  const dst = l.target ?? l.dst ?? l.b ?? l.to ?? l.endpointB ?? l.downlink ?? null;
  return {
    id: l.id ?? l._id ?? `${src}-${dst}` ?? Math.random().toString(36).slice(2),
    source: src,
    target: dst,
    type: l.type ?? l.linkType ?? 'link',
    util: l.utilization ?? l.util ?? l.capacity ? (l.utilization ?? 0) : (l.util ?? null),
    state: l.state ?? l.status ?? null,
    raw: l
  };
}

async function fetchUisp(path, headers) {
  const base = process.env.UISP_BASE;
  const url = `${base}${path}`;
  const resp = await fetch(url, { headers });
  if (!resp.ok) {
    const text = await resp.text();
    const err = new Error(`UISP ${resp.status}: ${text}`);
    err.status = resp.status;
    throw err;
  }
  return resp.json();
}

export async function getUispTopology(req, res) {
  try {
    const siteId = req.query.siteId;
    if (!siteId) return res.status(400).json({ message: 'siteId required' });

    const base = process.env.UISP_BASE;
    if (!base) return res.status(500).json({ message: 'UISP_BASE not configured' });

    const uispEndpoint = `/nms/api/sites/${encodeURIComponent(siteId)}/topology`;

    const headers = { Accept: 'application/json' };
    if (process.env.UISP_API_KEY) {
      headers['Authorization'] = `Bearer ${process.env.UISP_API_KEY}`;
    } else if (process.env.UISP_USER && process.env.UISP_PASS) {
      const b64 = Buffer.from(`${process.env.UISP_USER}:${process.env.UISP_PASS}`).toString('base64');
      headers['Authorization'] = `Basic ${b64}`;
    } else {
      return res.status(500).json({ message: 'No UISP credentials configured' });
    }

    const data = await fetchUisp(uispEndpoint, headers);

    // Normalización flexible:
    let nodes = [];
    let links = [];

    // Caso 1: respuesta contiene topology { nodes, links }
    if (data?.topology?.nodes || data?.topology?.links) {
      const topo = data.topology;
      nodes = (topo.nodes ?? []).map(mapNode).filter(Boolean);
      links = (topo.links ?? []).map(mapLink).filter(Boolean);
    } else if (Array.isArray(data?.nodes) || Array.isArray(data?.links)) {
      // Caso 2: estructura plana nodes/links
      nodes = (data.nodes ?? []).map(mapNode).filter(Boolean);
      links = (data.links ?? []).map(mapLink).filter(Boolean);
    } else {
      // Caso 3: intentar endpoints devices / links si topology no provee nodos/enlaces
      // intentamos obtener devices y links desde el API UISP si existen
      try {
        const [devicesResp, linksResp] = await Promise.allSettled([
          fetchUisp(`/nms/api/sites/${encodeURIComponent(siteId)}/devices`, headers),
          fetchUisp(`/nms/api/sites/${encodeURIComponent(siteId)}/links`, headers)
        ]);

        if (devicesResp.status === 'fulfilled' && Array.isArray(devicesResp.value)) {
          nodes = devicesResp.value.map(mapNode).filter(Boolean);
        } else if (Array.isArray(data?.devices)) {
          nodes = data.devices.map(mapNode).filter(Boolean);
        }

        if (linksResp.status === 'fulfilled' && Array.isArray(linksResp.value)) {
          links = linksResp.value.map(mapLink).filter(Boolean);
        } else if (Array.isArray(data?.links)) {
          links = data.links.map(mapLink).filter(Boolean);
        }
      } catch (e) {
        // ignore inner errors, devolvemos lo que tengamos
      }

      // Fallback: si todavía vacío, buscar arrays en la raíz con posible información
      if (!nodes.length) {
        const candidates = Object.values(data).flatMap(v => Array.isArray(v) ? v : []);
        // heurística: tomar objetos con name/hostname como nodos
        nodes = candidates.filter(c => c && (c.name || c.hostname || c.id)).map(mapNode).filter(Boolean);
      }
    }

    // Devuelve la estructura normalizada
    return res.json({
      siteId,
      nodes,
      links,
      raw: data
    });
  } catch (err) {
    const status = err.status || 502;
    return res.status(status).json({ message: 'UISP proxy error', error: String(err) });
  }
}