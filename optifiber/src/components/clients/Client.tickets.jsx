import styleTickets from './css/clientTickets.module.css';

import { useEffect, useState } from 'react';
import { handleLoadTicket } from './js/clientLoadData.js';
import CreateTicket from './CreateTicket.modal.jsx';
import { LoadFragment } from '../fragments/Load.fragment.jsx';

function ClientTickets({ client }) {
    const [data, setData] = useState([]);
    const [select, setSelect] = useState(null);

    const fetchData = async () => {
        try {
            const result = await handleLoadTicket(client);
            setData(result)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [client])

    if (!client) return <LoadFragment />

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
                    </tr>
                </thead>
                <tbody className={`text-wrap ${styleTickets['body']}`}>
                    {
                        data.map((item) => (
                            <tr key={item._id} onClick={() => setSelect(item)} style={{ cursor: 'pointer' }}>
                                <td>{item.Folio}</td>
                                <td>{item.Issue}</td>
                                <td>{item.Description}</td>
                            </tr>
                        ))

                    }
                </tbody>
            </table>
        </>
    );
}

export default ClientTickets;