import { useEffect, useState } from 'react';
import ApiRequest from '../hooks/apiRequest.jsx';

import TicketsCard from './Tickets.card.jsx';
import TicketInfo from './Tickets.info.jsx';
import { LoadFragment } from '../fragments/Load.fragment.jsx'

function TicketComponent() {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE)
    const [data, setData] = useState([]);
    const [select, setSelect] = useState(null);

    const handleLoad = async () => {
        try {
            const res = await makeRequest('/ticket/all');
            setData(res);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        handleLoad();
    }, [makeRequest]);

    if (loading) return <LoadFragment />;

    if (error) return <p>Error: {error}</p>;
    
    return (
        <div className="container-fluid d-flex justify-content-center mt-1 ms-4">
            <TicketsCard tickets={data ? data : []}  onSelected={setSelect}/>

            <TicketInfo ticket={select ? select: ''}/>
        </div>
    );
}

export default TicketComponent;