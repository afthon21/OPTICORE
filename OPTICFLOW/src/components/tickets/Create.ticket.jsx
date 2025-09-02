import { CardCreateTicket } from './Create.card';
import ApiRequest from '../hooks/apiRequest';
import { useEffect, useState } from 'react';
import { LoadFragment } from '../fragments/Load.fragment';

function CreateTicket() {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [data, setData] = useState([]);
    const [technicians, setTechnicians] = useState([]);

    const handleLoadClients = async () => {
        try {
            const result = await makeRequest('/client/all');
            setData(result);
        } catch (error) {
            console.log(error);
        }
    };

    const handleLoadTechnicians = async () => {
        try {
            const result = await makeRequest('/technician/all');
            setTechnicians(result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleLoadClients();
        handleLoadTechnicians();
    }, []);

    if (loading) return <LoadFragment />
    if (error) return <p>{error}</p>

    return (
        <div className="container-fluid d-flex justify-content-center mt-4">
            <CardCreateTicket clients={data ? data : []} technician={technicians} />
        </div>
    );
}

export default CreateTicket;


