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
        <div className="container-fluid d-flex mt-1 ms-4">
            <ClientsCard clients={data ? data : []} onSelected={setSelect} />

            <ClientsInfo 
                client={select ? select: ''} 
                initialActiveTab={activeTab} 
                onGlobalUpdate={refreshClientAndPackages}
            />
        </div>
    );
}

export default ClientsComponent;