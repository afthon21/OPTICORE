import styleNotes from '../css/clientNotes.module.css';

import { useEffect, useState } from 'react';
import ApiRequest from '../../hooks/apiRequest';

import { LoadFragment } from '../../fragments/Load.fragment';
import ClientNoteInfo from './Client.infoNotes';
import CreateNote from './CreateNote.modal';

function ClientNotes({ client }) {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [data, setData] = useState([]);
    const [select, setSelect] = useState(null);
    const [sortOrder, setSortOrder] = useState('desc');

    const fetchData = async () => {
        try {
            const res = await makeRequest(`/note/all/${client}`);
            setData(res);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (client) {
            fetchData();
        }
    }, [client]);

    const handleSortByDate = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const sortedData = [...data].sort((a, b) => {
        const dateA = new Date(a.CreateDate);
        const dateB = new Date(b.CreateDate);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    if (loading) return <LoadFragment />;
    if (error) return <p>Error!</p>;

    return (
        <>
            <div className="justify-content-end d-flex">
                <button
                    data-bs-toggle="modal"
                    data-bs-target="#CreateNoteModal"
                    className={`${styleNotes['btn']}`}>
                    <i className="bi bi-plus-square-fill"></i>
                </button>
            </div>

            {/* PASAMOS fetchData COMO PROP para recargar tabla */}
            <CreateNote client={client} onNoteCreated={fetchData} />

            <table className={`table table-hover table-sm ${styleNotes['container']}`}>
                <thead className={`${styleNotes['header']}`}>
                    <tr>
                        <th>Nota</th>
                        <th
                            onClick={handleSortByDate}
                            style={{ cursor: 'pointer' }}
                        >
                            Fecha {sortOrder === 'asc' ? '↑' : '↓'}
                        </th>
                    </tr>
                </thead>
                <tbody className={`text-wrap ${styleNotes['body']}`}>
                    {
                        sortedData.map((item) => (
                            <tr key={item._id}
                                onClick={() => setSelect(item)}
                                data-bs-toggle="modal"
                                data-bs-target="#NoteModal"
                                style={{ cursor: 'pointer' }}
                            >
                                <td>{item.Description}</td>
                                <td>{item.CreateDate.split("T")[0]}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <ClientNoteInfo note={select} />
        </>
    );
}

export default ClientNotes;
