import styleTickets from '../css/clientTickets.module.css';

import { useEffect, useState } from 'react';
import CreateTicket from './CreateTicket.modal.jsx';
import { LoadFragment } from '../../fragments/Load.fragment.jsx';
import ApiRequest from '../../hooks/apiRequest.jsx';

function ClientTickets({ client }) {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [data, setData] = useState([]);
    const [select, setSelect] = useState(null);

    const fetchData = async () => {
        try {
            const res = await makeRequest(`/ticket/all/${client}`);
            setData(res);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData()
    }, [makeRequest])

    if (loading) return <LoadFragment />

    if (error) return <p>Error!</p>

    return (
        <>
            <div className="justify-content-end d-flex">
                <button
                    data-bs-toggle="modal"
                    data-bs-target="#CreateTicketModal"
                    className={`${styleTickets['btn']}`}>
                    <i class="bi bi-plus-square-fill"></i>
                </button>

                <CreateTicket client={client} />
            </div>
            <table className={`table table-hover table-sm ${styleTickets['container']}`}>
                <thead className={`${styleTickets['header']}`}>
                    <tr>
                        <th>Folio</th>
                        <th>Asunto</th>
                        <th>Detalles</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody className={`text-wrap ${styleTickets['body']}`}>
                    {
                        data.map((item) => (
                            <tr key={item._id} onClick={() => setSelect(item)} style={{ cursor: 'pointer' }}>
                                <td>{item.Folio}</td>
                                <td>{item.Issue}</td>
                                <td>{item.Description}</td>
                                <td>{item.CreateDate.split("T")[0]}</td>
                            </tr>
                        ))

                    }
                </tbody>
            </table>
        </>
    );
}

export default ClientTickets;