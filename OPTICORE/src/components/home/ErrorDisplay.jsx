import { useState, useEffect } from 'react';
import ApiRequest from '../hooks/apiRequest';

function ErrorDisplay() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAllErrors, setShowAllErrors] = useState(false);
    const { makeRequest } = ApiRequest(import.meta.env.VITE_API_BASE);

    useEffect(() => {
        const fetchErrorLogs = async () => {
            try {
                const response = await makeRequest('/logs');
                // Mostrar todos los logs existentes, no solo errores
                const allLogs = response || [];
                setLogs(allLogs);
            } catch (err) {
                setError('Error al cargar los logs');
                // Removido console.error para no mostrar en terminal
            } finally {
                setLoading(false);
            }
        };

        fetchErrorLogs();
        
        // Set up interval to refresh every 30 seconds for automatic updates
        const interval = setInterval(fetchErrorLogs, 30000);
        
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
        <div className="flex-grow-1" style={{ 
            overflowY: 'scroll', 
            maxHeight: '200px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#909090ff #f8f9fa'
        }}>
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
            {logs.length === 0 ? (
                <span className="text-muted">No hay registros recientes</span>
            ) : (
                <ul className="list-group list-group-flush">
                    {(showAllErrors ? logs : logs.slice(0, 3)).map((log, index) => {
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
                    {logs.length > 3 && (
                        <li className="list-group-item py-1 px-2 text-center">
                            <button
                                className="btn btn-link btn-sm p-0 text-decoration-none"
                                onClick={() => setShowAllErrors(!showAllErrors)}
                                style={{ fontSize: '0.8rem' }}
                            >
                                {showAllErrors ? (
                                    <>
                                        <i className="bi bi-chevron-up me-1"></i>
                                        Mostrar menos
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-chevron-down me-1"></i>
                                        +{logs.length - 3} registros más...
                                    </>
                                )}
                            </button>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}

export default ErrorDisplay;