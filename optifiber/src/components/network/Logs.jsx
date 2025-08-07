import { useState, useEffect } from 'react';
import api from '../../../hooks/apiRequest';

function Logs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get('/logs');
                setLogs(response.data);
            } catch (err) {
                setError('Error al cargar los logs');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    if (loading) {
        return <div>Cargando logs...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Logs de Fibra Óptica</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={tableHeaderStyle}>Timestamp</th>
                        <th style={tableHeaderStyle}>Nivel</th>
                        <th style={tableHeaderStyle}>Fuente</th>
                        <th style={tableHeaderStyle}>Tipo de Evento</th>
                        <th style={tableHeaderStyle}>Mensaje</th>
                        <th style={tableHeaderStyle}>Usuario</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(log => (
                        <tr key={log._id}>
                            <td style={tableCellStyle}>{new Date(log.timestamp).toLocaleString()}</td>
                            <td style={getLogLevelStyle(log.level)}>{log.level}</td>
                            <td style={tableCellStyle}>{log.source}</td>
                            <td style={tableCellStyle}>{log.eventType}</td>
                            <td style={tableCellStyle}>{log.message}</td>
                            <td style={tableCellStyle}>{log.user}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const tableHeaderStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2'
};

const tableCellStyle = {
    border: '1px solid #ddd',
    padding: '8px'
};

const getLogLevelStyle = (level) => {
    const style = { ...tableCellStyle };
    switch (level) {
        case 'error':
            style.color = 'red';
            break;
        case 'warning':
            style.color = 'orange';
            break;
        case 'info':
            style.color = 'blue';
            break;
        default:
            break;
    }
    return style;
};

export default Logs;
