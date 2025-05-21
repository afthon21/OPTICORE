import { useEffect, useState } from 'react';
import ApiRequest from '../hooks/apiRequest.jsx';

import TicketsCard from './Tickets.card.jsx';
import TicketInfo from './Tickets.info.jsx';
import { LoadFragment } from '../fragments/Load.fragment.jsx'
import Swal from 'sweetalert2';

function TicketComponent() {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE)
    const [data, setData] = useState([]);
    const [select, setSelect] = useState(null);
    const [tickets, setTickets] = useState([]);

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

    if (error) {
    }
    
    return (
        <div className="container-fluid d-flex justify-content-center mt-1 ms-4">
            <TicketsCard tickets={data ? data : []}  onSelected={setSelect}/>
           {select && (
            <TicketInfo
           ticket={select}
           onStatusChange={(updatedTicket) => {
            setData (prev =>
                prev.map(t => t._id === updatedTicket._id ? updatedTicket : t)
            );
           }}
           />
           )}
           
        </div>
    );
}

export default TicketComponent;