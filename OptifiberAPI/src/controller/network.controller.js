// controller/network.controller.js
import snmp from 'net-snmp';
import Log from '../models/logSchema.js';

const host = "192.168.10.10";
const community = "public";
const sessionOptions = { version: snmp.Version2c, timeout: 5000 };

const ifDescrBase = "1.3.6.1.2.1.2.2.1.2";
const ifOperStatusBase = "1.3.6.1.2.1.2.2.1.8";
const ifInOctetsBase = "1.3.6.1.2.1.2.2.1.10";
const ifOutOctetsBase = "1.3.6.1.2.1.2.2.1.16";
const ifSpeedBase = "1.3.6.1.2.1.2.2.1.5";
const ifHighSpeedBase = "1.3.6.1.2.1.31.1.1.1.15";

let lastSample = {};
let lastTimestamp = {};
let networkHealthHistory = [];

export async function detectarPuertos() {
  return new Promise((resolve, reject) => {
    const session = snmp.createSession(host, community, sessionOptions);
    const baseOids = Array.from({ length: 64 }, (_, i) => `${ifDescrBase}.${i + 1}`);

    session.get(baseOids, (error, varbinds) => {
      session.close();
      if (error) return reject(error);

      const ethernet = [];
      const pon = [];

      varbinds.forEach((vb) => {
        if (!vb || !vb.value || vb.type === snmp.ObjectType.NoSuchInstance) return;
        const descr = vb.value.toString().toLowerCase();
        const index = parseInt(vb.oid.split('.').pop());

        if (!descr || descr === 'vlan1' || descr.includes('onu')) return;

        if (/^g?pon[\d\/]*$/.test(descr)) {
          pon.push(index);
        } else if (descr.includes('ge') || descr.includes('eth') || descr.includes('ethernet')) {
          ethernet.push(index);
        }
      });

      resolve({ ethernet, pon });
    });
  });
}

export async function getOLTPorts(req, res) {
  try {
    const type = req.query.type || 'ethernet';
    const ports = await detectarPuertos();
    const portIndices = ports[type] || [];

    const session = snmp.createSession(host, community, sessionOptions);
    const oids = portIndices.flatMap(idx => [
      `${ifDescrBase}.${idx}`,
      `${ifOperStatusBase}.${idx}`,
      `${ifInOctetsBase}.${idx}`,
      `${ifOutOctetsBase}.${idx}`,
      `${ifSpeedBase}.${idx}`,
      `${ifHighSpeedBase}.${idx}`
    ]);

    session.get(oids, (error, varbinds) => {
      session.close();
      const now = Date.now();
      if (error) return res.status(500).json({ error: error.toString() });

      const results = [];
      for (let i = 0; i < portIndices.length; i++) {
        const [descr, status, inOctets, outOctets, speed, highSpeed] = varbinds.slice(i * 6, i * 6 + 6);

        if (!descr || !descr.value) continue;

        let portSpeed = speed?.value || 0;
        if (portSpeed === 0 && highSpeed?.value) {
          portSpeed = highSpeed.value * 1000000;
        }

        const port = {
          port: i + 1,
          realIndex: portIndices[i],
          name: descr.value.toString(),
          status: status?.value === 1 ? "Up" : "Down",
          inOctets: inOctets?.value || 0,
          outOctets: outOctets?.value || 0,
          speed: portSpeed
        };

        if (port.status === "Down") {
          const logMessage = `El puerto ${port.name} (Índice real: ${port.realIndex}) está caído.`;
          const newLog = new Log({
            source: 'Monitoreo de Red',
            eventType: 'Caída de Puerto',
            message: logMessage,
            level: 'warning'
          });
          newLog.save();
        }

        const lastList = lastSample[type] || [];
        const last = lastList.find(p => p.realIndex === port.realIndex);

        if (last && lastTimestamp[type]) {
          const deltaT = (now - lastTimestamp[type]) / 1000;
          port.inBps = deltaT > 0 ? Math.max(0, (port.inOctets - last.inOctets) / deltaT) : 0;
          port.outBps = deltaT > 0 ? Math.max(0, (port.outOctets - last.outOctets) / deltaT) : 0;
        } else {
          port.inBps = 0;
          port.outBps = 0;
        }

        results.push(port);
      }

      lastSample[type] = results.map(p => ({
        realIndex: p.realIndex,
        inOctets: p.inOctets,
        outOctets: p.outOctets
      }));
      lastTimestamp[type] = now;

      res.json(results);
    });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
}

export function getNetworkHealthHistory(req, res) {
  return res.json(networkHealthHistory);
}

export function getDeviceInfo(req, res) {
  const session = snmp.createSession(host, community, sessionOptions);
  const oids = [
    "1.3.6.1.2.1.1.1.0",
    "1.3.6.1.2.1.2.2.1.6.1"
  ];

  session.get(oids, (error, varbinds) => {
    session.close();
    if (error) return res.status(500).json({ error: error.toString() });

    const model = varbinds[0]?.value?.toString() || '';
    const mac = varbinds[1]?.value
      ? Array.from(varbinds[1].value, b => b.toString(16).padStart(2, '0')).join(':')
      : '';

    res.json({ model, mac, ip: host, firmware: model });
  });
}

// Tarea periódica
export function iniciarMonitoreoSalud() {
  setInterval(async () => {
    try {
      const ports = await detectarPuertos();
      const allIndices = [...(ports.ethernet || []), ...(ports.pon || [])];
      const oids = allIndices.map(idx => `${ifOperStatusBase}.${idx}`);

      const session = snmp.createSession(host, community, sessionOptions);
      session.get(oids, (error, varbinds) => {
        session.close();

        let health = 100;
        if (!error && varbinds.length > 0) {
          const upCount = varbinds.filter(vb => vb.value === 1).length;
          health = Math.round((upCount / varbinds.length) * 100);
        }

        networkHealthHistory.push({
          timestamp: new Date().toISOString(),
          health
        });

        if (networkHealthHistory.length > 288) {
          networkHealthHistory = networkHealthHistory.slice(-288);
        }
      });
    } catch (err) {
      console.error("Error al actualizar la salud de la red:", err);
      const newLog = new Log({
        source: 'Monitoreo de Salud de Red',
        eventType: 'Error de Monitoreo',
        message: err.message,
        level: 'error'
      });
      await newLog.save();
    }
  }, 5 * 60 * 1000);
}
