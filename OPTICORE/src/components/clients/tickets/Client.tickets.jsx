import styleTickets from '../css/clientTickets.module.css';

import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import CreateTicket from './CreateTicket.modal.jsx';
import { LoadFragment } from '../../fragments/Load.fragment.jsx';
import ApiRequest from '../../hooks/apiRequest.jsx';
import TicketInfo from './Client.ticketInfo.jsx';

function ClientTickets({ client }) {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [data, setData] = useState([]);
    const [select, setSelect] = useState(null);
    const [technicians, setTechnicians] = useState([]); 

    const fetchData = useCallback(async () => {
        if (!client) return; // No hacer fetch si no hay cliente
        try {
            const res = await makeRequest(`/ticket/all/${client}`);
            setData(res);
        } catch (error) {
            console.log(error);
        }
    }, [client, makeRequest]);
   
    const fetchTechnicians = useCallback(async () => {
        try {
            const res = await makeRequest('/technician/all');
            setTechnicians(res);
        } catch (error) {
            console.log(error);
        }
    }, [makeRequest]);

    useEffect(() => {
        fetchData();
        fetchTechnicians();
    }, [fetchData, fetchTechnicians]);

    // Mostrar mensaje si no hay cliente seleccionado
    if (!client) {
        return <p>Seleccione un cliente para ver sus tickets.</p>;
    }
    
    if (loading) return <LoadFragment />

    if (error) return <p>Error cargando tickets!</p>

    return (
        <>
            <div className="justify-content-end d-flex">
                <button
                    data-bs-toggle="modal"
                    data-bs-target="#CreateTicketModal"
                    className={`${styleTickets['btn']}`}>
                    <i className="bi bi-plus-square-fill"></i>
                </button>

                <CreateTicket client={client} technicians={technicians} onTicketCreated={fetchData} />
            </div>
            <table className={`table table-hover table-sm ${styleTickets['container']}`}>
                <thead className={`${styleTickets['header']}`}>
                    <tr>
                        <th>Folio</th>
                        <th>Prioridad</th>
                        <th>Asunto</th>
                        <th>Técnico</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody className={`text-wrap ${styleTickets['body']}`}>
                    {
                        data.map((item) => (
                            <tr key={item._id} onClick={() => setSelect(item)} style={{ cursor: 'pointer' }}
                                data-bs-toggle="modal" data-bs-target="#TicketClientModal">
                                <td>{item.Folio}</td>
                                <td>{item.Priority}</td>
                                <td>{item.Issue}</td>
                                <td>{item.tecnico || ''}</td>
                                <td>{item.Status}</td>
                                <td>{item.CreateDate.split("T")[0]}</td>
                            </tr>
                        ))

                    }
                </tbody>
            </table>

            <TicketInfo ticket={select ? select : ''} />
        </>
    );
}

ClientTickets.propTypes = {
    client: PropTypes.string
};

export default ClientTickets;