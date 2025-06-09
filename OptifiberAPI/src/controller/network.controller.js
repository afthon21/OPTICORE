import pkg from 'node-routeros';
const RouterOSAPI = pkg.RouterOSAPI;

export const getInterfacesTraffic = async(req, res) => {
    const conn = new RouterOSAPI({
        host: '192.168.88.1',
        user: 'admin',
        password: '',
        port: 8728
    });

    try {
        await conn.connect();

        const interfaces = await conn.write('/interface/print');
        const data = [];

        // Para cada interfaz, obten el tráfico actual en kbps
        for (const iface of interfaces) {
            const [mon] = await conn.write('/interface/monitor-traffic', [
                `=interface=${iface.name}`,
                '=once='
            ]);
            // RX y TX vienen en bits por segundo, conviértelo a kbps (divide entre 1000)
            data.push({
                interface: iface.name,
                rx: Number(mon['rx-bits-per-second']) / 1000,
                tx: Number(mon['tx-bits-per-second']) / 1000
            });
        }

        res.json(data);
    } catch (error) {
        console.error('Mikrotik API error:', error);
        res.status(500).json({ message: 'Mikrotik API error', error });
    } finally {
        conn.close();
    }
};