import { useState, useEffect, useCallback } from 'react';

import ClientsCard from './Clients.card';
import { LoadFragment } from '../fragments/Load.fragment.jsx';
import ClientsInfo from './Clients.info';
import ApiRequest from '../hooks/apiRequest.jsx';

function ClientsComponent() {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [data, setData] = useState([]);
    const [select, setSelect] = useState(null);

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

    if (loading) return <LoadFragment />

    if (error) return <p>Error!</p>

    const handleUpdateClient = (updated) => {
        setData(prev => prev.map(c => c._id === updated._id ? updated : c));
        setSelect(prev => prev && prev._id === updated._id ? updated : prev);
    }

    return (
        <div className="container-fluid d-flex mt-1 ms-4">
            <ClientsCard clients={data ? data : []} onSelected={setSelect} />
            <ClientsInfo 
                client={select ? select: ''} 
                clients={data}
                onGlobalUpdate={handleUpdateClient}
            />
        </div>
    );
}

export default ClientsComponent;