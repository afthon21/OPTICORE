import styleCard from './css/clientInfo.module.css';
import styleNav from './css/navbar.module.css';

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ApiRequest from '../hooks/apiRequest.jsx';
import Swal from 'sweetalert2';
import ClientPayments from './payment/Client.payments';
import ClientData from './Client.data';
import ClientDocuments from './documents/Clients.documents';
import ClientTickets from './tickets/Client.tickets';
import ClientNotes from './notes/client.notes';
import ClientLocation from './location/location.map';

function ClientsInfo({ client, clients = [], onGlobalUpdate }) {
    const [show, setShow] = useState({
        personal: true,
        payments: false,
        documents: false,
        location: false,
        tickets: false,
        notes: false,
        active: false
    });

    // Estado local para el cliente seleccionado
    const [currentClient, setCurrentClient] = useState(client);

    // Si el prop client cambia (por ejemplo, seleccionas otro cliente), actualiza el estado local
    useEffect(() => {
        setCurrentClient(client);
    }, [client]);

    const toggleData = (data) => {
        if (!currentClient) {
            Swal.fire({
                icon: 'warning',
                iconColor: 'red',
                title: 'Advertencia',
                text: 'Seleccione un cliente',
                timer: 700,
                toast: true,
                position: 'top',
                showConfirmButton: false
            })
        } else {
            setShow({
                personal: false,
                payments: false,
                documents: false,
                location: false,
                tickets: false,
                notes: false,
                active: false,
                [data]: true
            })
        }
    }

    const { makeRequest } = ApiRequest(import.meta.env.VITE_API_BASE);

    const toggleStatusFromActive = async (item) => {
        const newStatus = item.Status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        const updated = await makeRequest(`/client/edit/${item._id}`,'POST',{ Status: newStatus });
        if (updated) {
            if (onGlobalUpdate) onGlobalUpdate(updated);
            // si el cliente mostrado es el que se actualizó, reflejarlo
            setCurrentClient(prev => prev && prev._id === updated._id ? updated : prev);
            Swal.fire({
                icon: 'success',
                title: 'Estado actualizado',
                text: `Cliente ahora ${newStatus === 'ACTIVE' ? 'Activo' : 'Inactivo'}`,
                timer: 1100,
                toast: true,
                position: 'top',
                showConfirmButton: false
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el estado',
                timer: 1400,
                toast: true,
                position: 'top',
                showConfirmButton: false
            });
        }
    }

    return (
        <div>
            <nav className={`navbar navbar-expand-lg w-100 ${styleNav['nav']}`}>
                <div className="container-fluid align-content-center">
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    role="button"
                                    onClick={() => toggleData('personal')}
                                >
                                    Datos personales
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    role="button"
                                    onClick={() => toggleData('documents')}
                                >
                                    Documentos
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    role="button"
                                    onClick={() => toggleData('location')}
                                >
                                    Ubicación
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    role="button"
                                    onClick={() => toggleData('payments')}
                                >
                                    Pagos
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    role="button"
                                    onClick={() => toggleData('tickets')}
                                >
                                    Tickets
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link"
                                    role="button"
                                    onClick={() => toggleData('notes')}>
                                        Notas
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link"
                                    role="button"
                                    onClick={() => toggleData('active')}>
                                        Activos
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className={`card ${styleCard['card-container']}`}>

                <div className={`d-flex justify-content-between align-items-center mt-1 mx-3 ${styleCard['header']}`}>
                    <span className={styleCard['title']}><i className="bi bi-person-fill"></i> Client Details</span>
                </div>

                <div className={`card-body ${styleCard['body']}`}>
                    {/* datos personales */}
                    {show.personal && (
                        <ClientData
                            client={currentClient}
                            onUpdateClient={(u)=>{ setCurrentClient(u); if(onGlobalUpdate) onGlobalUpdate(u);} }
                        />
                    )}

                    {/* Ver Documentos */}
                    {show.documents && (
                        <ClientDocuments client={currentClient?._id} />
                    )}

                    {/* Ver Marcador */}
                    {show.location && (
                        <ClientLocation client={currentClient}/>
                    )}

                    {/* Ver pagos */}
                    {show.payments && (
                        <ClientPayments client={currentClient?._id} />
                    )}

                    {/* Ver tickets */}
                    {show.tickets && (
                        <ClientTickets client={currentClient?._id}/>
                    )}

                    {/* Ver notas */}
                    {show.notes && (
                        <ClientNotes client={currentClient?._id}/>
                    )}

                    {/* Estado Activo */}
                    {show.active && (
                        <div className="mt-2">
                            <h5>Clientes Activos</h5>
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Estado</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clients.filter(c => c.Status === 'ACTIVE').map(item => (
                                        <tr key={item._id} style={{ cursor:'pointer' }}>
                                            <td onClick={()=>{ setCurrentClient(item); setShow(s=>({...s, personal:true, active:false})); }}>
                                                {`${item.Name.FirstName} ${item.Name.SecondName || ''} ${item.LastName.FatherLastName} ${item.LastName.MotherLastName}`.replace(/\s+/g,' ').trim()}
                                            </td>
                                            <td>
                                                <span className={`badge ${item.Status === 'ACTIVE' ? 'bg-success':'bg-secondary'}`}>{item.Status === 'ACTIVE' ? 'Activo':'Inactivo'}</span>
                                            </td>
                                            <td>
                                                <button className={`btn btn-sm ${item.Status === 'ACTIVE' ? 'btn-outline-danger':'btn-outline-success'}`} onClick={()=>toggleStatusFromActive(item)}>
                                                    {item.Status === 'ACTIVE' ? 'Desactivar':'Activar'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {clients.filter(c => c.Status === 'ACTIVE').length === 0 && (
                                        <tr><td colSpan="3">No hay clientes activos.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ClientsInfo;

ClientsInfo.propTypes = {
    client: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
    ]),
    clients: PropTypes.array,
    onGlobalUpdate: PropTypes.func
};