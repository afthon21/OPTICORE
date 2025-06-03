import { useState, useEffect } from 'react';

import ClientsCard from './Clients.card';
import { LoadFragment } from '../fragments/Load.fragment.jsx';
import ClientsInfo from './Clients.info';
import ApiRequest from '../hooks/apiRequest.jsx';

function ClientsComponent() {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [data, setData] = useState([]);
    const [select, setSelect] = useState(null);

    const handleLoad = async () => {
        try {
            const res = await makeRequest('/client/all');
            setData(res);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleLoad();
    }, []);

    if (loading) return <LoadFragment />

    if (error) return <p>Error!</p>

    return (
        <div className="container-fluid d-flex mt-1 ms-4">
            <ClientsCard clients={data ? data : []} onSelected={setSelect} />

            <ClientsInfo client={select ? select: ''} />
        </div>
    );
}

export default ClientsComponent;