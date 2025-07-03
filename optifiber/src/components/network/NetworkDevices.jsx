import { useEffect, useState } from 'react';

function NetworkDevices() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let intervalId;

        const fetchDevices = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_API_BASE}/network/devices-traffic`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Error al obtener interfaces');
                const data = await res.json();
                setDevices(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDevices(); // Primera carga inmediata
        intervalId = setInterval(fetchDevices, 1000); // Actualiza cada 3 segundos

        return () => clearInterval(intervalId); // Limpia el intervalo al desmontar
    }, []);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Tráfico por interfaz (kbps)</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Interfaz</th>
                        <th>RX (kbps)</th>
                        <th>TX (kbps)</th>
                    </tr>
                </thead>
                <tbody>
                    {devices.map((d, i) => (
                        <tr key={i}>
                            <td>{d.interface}</td>
                            <td>{d.rx}</td>
                            <td>{d.tx}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default NetworkDevices;