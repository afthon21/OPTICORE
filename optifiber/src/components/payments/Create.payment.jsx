import { useState, useEffect } from 'react';
import ApiRequest from '../hooks/apiRequest';

import CardCreatePayment from './Create.card';
import { LoadFragment } from '../fragments/Load.fragment';

function CreatePayment() {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [data, setData] = useState([]);

    const handleLoadClients = async () => {
        try {
            const result = await makeRequest('/client/all');
            setData(result);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleLoadClients();
    }, [makeRequest]);

    if (loading) return <LoadFragment />

    if (error) return <p>Error: {error}</p>

    return (
        <div className="container-fluid d-flex justify-content-center mt-4">
            <CardCreatePayment clients={data ? data : []} />
        </div>
    );
}

export default CreatePayment;