import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import ClientsCard from './Clients.card';
import { LoadFragment } from '../fragments/Load.fragment.jsx';
import ClientsInfo from './Clients.info';
import ApiRequest from '../hooks/apiRequest.jsx';

function ClientsComponent() {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const location = useLocation();
    const [data, setData] = useState([]);
    const [select, setSelect] = useState(null);
    const [activeTab, setActiveTab] = useState('personal');

    const handleLoad = useCallback(async () => {
        try {
            const res = await makeRequest('/client/all');
            setData(res);
        } catch (error) {
            console.log(error);
        }
    }, [makeRequest]);

    useEffect(() => {
        handleLoad();
    }, [handleLoad]);

    // Manejar navegación desde otros componentes
    useEffect(() => {
        if (location.state?.selectedClient) {
            setSelect(location.state.selectedClient);
            setActiveTab(location.state.activeTab || 'personal');
        }
    }, [location.state]);

    if (loading) return <LoadFragment />

    if (error) return <p>Error!</p>

    // Función global para refrescar cliente y paquetes
    const refreshClientAndPackages = async (clientId) => {
        try {
            const clientsRes = await makeRequest('/client/all');
            setData(clientsRes);
            if (clientId) {
                // Buscar el cliente actualizado
                const updatedClient = clientsRes.find(c => c._id === clientId);
                setSelect(updatedClient || null);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <style>{`
                @media (max-width: 992px) {
                    .clients-container {
                        flex-direction: column !important;
                    }
                    .clients-list-wrapper {
                        max-width: 100% !important;
                        margin-bottom: 1rem;
                    }
                    .clients-info-wrapper {
                        min-width: 100% !important;
                        max-width: 100% !important;
                    }
                }
            `}</style>
            <div className="container-fluid mt-1 clients-container" style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '1rem',
                padding: '0 1rem',
                maxWidth: '100%',
                overflow: 'hidden'
            }}>
                <div className="clients-list-wrapper" style={{
                    flex: '0 0 auto',
                    minWidth: '280px',
                    maxWidth: '350px',
                    width: '100%'
                }}>
                    <ClientsCard clients={data ? data : []} onSelected={setSelect} />
                </div>

                <div className="clients-info-wrapper" style={{
                    flex: '1 1 auto',
                    minWidth: '300px',
                    overflow: 'auto'
                }}>
                    {select ? (
                        <ClientsInfo 
                            client={select} 
                            initialActiveTab={activeTab} 
                            onGlobalUpdate={refreshClientAndPackages}
                        />
                    ) : (
                        <div className="card mt-3" style={{
                            background: 'transparent',
                            border: '1px solid #ededed',
                            height: 'calc(100vh - 120px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <div style={{
                                textAlign: 'center',
                                color: '#6c757d',
                                padding: '2rem'
                            }}>
                                <i className="bi bi-person-x" style={{ fontSize: '4rem', marginBottom: '1rem' }}></i>
                                <h5>Selecciona un cliente</h5>
                                <p>Haz clic en un cliente de la lista para ver su información</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default ClientsComponent;