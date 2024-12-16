import styleCard from './css/clientInfo.module.css';
import styleNav from './css/navbar.module.css';

import { useState } from 'react';
import ClientPayments from './Client.payments';
import ClientData from './Client.data';
import ClientDocuments from './Clients.documents';
import ClientTickets from './Client.tickets';
import Swal from 'sweetalert2';

function ClientsInfo({ client }) {
    const [show, setShow] = useState({
        personal: true,
        payments: false,
        documents: false,
        location: false,
        tickets: false,
    });

    const toggleData = (data) => {
        if (!client) {
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
                [data]: true
            })
        }
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg w-100">
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
                        </ul>
                    </div>
                </div>
            </nav>

            <div className={`card ${styleCard['card-container']}`}>

                <div className={`d-flex justify-content-between align-items-center mt-1 mx-3 ${styleCard['header']}`}>
                    <span className={styleCard['title']}><i className="bi bi-person-fill"></i> Client Details</span>

                    <div className={styleCard['tools']}>
                        <div className={styleCard['circle']}>
                            <span className={`${styleCard['red']} ${styleCard['box']}`}></span>
                        </div>
                        <div className={styleCard['circle']}>
                            <span className={`${styleCard['yellow']} ${styleCard['box']}`}></span>
                        </div>
                        <div className={styleCard['circle']}>
                            <span className={`${styleCard['green']} ${styleCard['box']}`}></span>
                        </div>
                    </div>
                </div>

                <div className={`card-body ${styleCard['body']}`}>

                    {/** datos personales  */}
                    {show.personal && (
                        <ClientData client={client} />
                    )}

                    {/** Ver Documentos */}
                    {show.documents && (
                        <ClientDocuments client={client._id} />
                    )}

                    {/** Ver pagos */}
                    {show.payments && (
                        <ClientPayments client={client._id} />
                    )}

                    {/** Ver tickets */}
                    {show.tickets && (
                        <ClientTickets client={client._id}/>
                    )}

                </div>
            </div>
        </div>
    );
}

export default ClientsInfo;