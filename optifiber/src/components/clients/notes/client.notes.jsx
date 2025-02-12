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

    const fetchData = async () => {
        try {
            const res = await makeRequest(`/note/all/${client}`);
            setData(res)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData()
    }, [makeRequest]);

    if (loading) return <LoadFragment />

    if (error) return <p>Error!</p>

    return (
        <>
            <div className="justify-content-end d-flex">
                <button
                    data-bs-toggle="modal"
                    data-bs-target="#CreateNoteModal"
                    className={`${styleNotes['btn']}`}>
                    <i class="bi bi-plus-square-fill"></i>
                </button>
            </div>

            <CreateNote client={client ? client: ''}/>

            <table className={`table table-hover table-sm ${styleNotes['container']}`}>
                <thead className={`${styleNotes['header']}`}>
                    <tr>
                        <th>Nota</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody className={`text-wrap ${styleNotes['body']}`}>
                    {
                        data.map((item) => (
                            <tr key={item._id} onClick={() => setSelect(item)} style={{ cursor: 'pointer' }}
                                data-bs-toggle="modal" data-bs-target="NoteModal">
                                <td>{item.Description}</td>
                                <td>{item.CreateDate.split("T")[0]}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <ClientNoteInfo note={select ? select : ''} />
        </>
    );
}

export default ClientNotes;