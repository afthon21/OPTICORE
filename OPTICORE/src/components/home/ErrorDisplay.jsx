import { useState, useEffect } from 'react';
import ApiRequest from '../hooks/apiRequest';

function ErrorDisplay({ showAll = false, onToggleShowAll = null, onLastUpdateChange = null }) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAllErrors, setShowAllErrors] = useState(showAll);
    const [lastUpdate, setLastUpdate] = useState(null);
    const { makeRequest } = ApiRequest(import.meta.env.VITE_API_BASE);

    // Mantener sincronizado el estado local con la prop recibida desde el padre
    useEffect(() => {
        setShowAllErrors(Boolean(showAll));
    }, [showAll]);

    useEffect(() => {
        const fetchErrorLogs = async () => {
            try {
                const response = await makeRequest('/logs');
                // Verificar si la respuesta es válida
                if (response && typeof response === 'object') {
                    const allLogs = Array.isArray(response) ? response : [];
                    // Ordenar logs de más reciente a más antiguo
                    const sortedLogs = allLogs.sort((a, b) => {
                        // Usar timestamp o createdAt según esté disponible
                        const dateA = new Date(a.timestamp || a.createdAt || a.date || 0);
                        const dateB = new Date(b.timestamp || b.createdAt || b.date || 0);
                        return dateB - dateA; // De más reciente a más antiguo
                    });
                    setLogs(sortedLogs);
                    const now = new Date();
                    setLastUpdate(now);
                    if (typeof onLastUpdateChange === 'function') onLastUpdateChange(now);
                } else {
                    setError('Respuesta inválida del servidor');
                }
            } catch (err) {
                setError('Error al cargar los logs');
                // Si hay error de JSON, registrarlo de manera más específica
                if (err.message && err.message.includes('DOCTYPE')) {
                    setError('Error del servidor - respuesta HTML recibida');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchErrorLogs();
        
            // Set up interval to refresh every 15 seconds for more responsive updates
            const interval = setInterval(fetchErrorLogs, 15000);

            return () => clearInterval(interval);
    }, []);

    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('es-ES') + ', ' + date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getRemainingLogsCount = () => Math.max(0, logs.length - 5);



    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                <div className="spinner-border spinner-border-sm text-danger" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-muted">
                <small>Error al cargar registros</small>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', height: '100%' }}>
            <style>
                {`
                .error-display-container {
                    scrollbar-gutter: stable;
                }
                .error-display-container::-webkit-scrollbar {
                    width: 6px;
                    display: block;
                }
                .error-display-container::-webkit-scrollbar-track {
                    background: #f8f9fa;
                    border-radius: 3px;
                }
                .error-display-container::-webkit-scrollbar-thumb {
                    background: #dc3545;
                    border-radius: 3px;
                    min-height: 20px;
                }
                .error-display-container::-webkit-scrollbar-thumb:hover {
                    background: #c82333;
                }
                `}
            </style>
            
            {/* Área de contenido scrollable */}
            <div 
                className="error-display-container" 
                style={{ 
                    overflowY: 'auto', 
                    maxHeight: '180px',
                    paddingBottom: '10px',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#909090ff #f8f9fa'
                }}
            >
                {logs.length === 0 ? (
                    <span className="text-muted">No hay registros recientes</span>
                ) : (
                    <ul className="list-group list-group-flush">
                        {(showAllErrors ? logs : logs.slice(0, 5)).map((log, index) => {
                        // Definir colores e iconos según el nivel del log
                        const getLogStyle = (level) => {
                            switch(level) {
                                case 'error':
                                    return {
                                        icon: 'bi-exclamation-triangle-fill text-danger',
                                        badge: 'bg-danger',
                                        text: 'error'
                                    };
                                case 'warning':
                                    return {
                                        icon: 'bi-exclamation-triangle-fill text-warning',
                                        badge: 'bg-warning',
                                        text: 'warning'
                                    };
                                case 'info':
                                    return {
                                        icon: 'bi-info-circle-fill text-info',
                                        badge: 'bg-info',
                                        text: 'info'
                                    };
                                default:
                                    return {
                                        icon: 'bi-circle-fill text-secondary',
                                        badge: 'bg-secondary',
                                        text: 'log'
                                    };
                            }
                        };
                        
                        const logStyle = getLogStyle(log.level);
                        
                        return (
                            <li
                                key={log._id || index}
                                className="list-group-item py-1 px-2"
                                style={{ 
                                    background: '#fff', 
                                    border: '1px solid #e0e0e0', 
                                    borderRadius: '6px', 
                                    marginBottom: '4px', 
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                                }}
                            >
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>
                                            <i className={`bi ${logStyle.icon} me-1`}></i>
                                            {log.eventType || 'Registro del Sistema'}
                                        </strong>
                                        <br />
                                        <small className="text-muted">{formatDateTime(log.timestamp)}</small>
                                        <br />
                                        <small style={{ color: '#495057' }}>{log.message}</small>
                                    </div>
                                    <span className={`badge ${logStyle.badge}`}>{logStyle.text}</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                )}
            </div>
            
            {/* Controles de fecha / mostrar más ahora se renderizan en el header por el componente padre */}
        </div>
    );
}

export default ErrorDisplay;