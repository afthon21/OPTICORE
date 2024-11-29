import { useState } from 'react';
import ClientPayments from './Client.payments';
import ClientData from './Client.data';
import ClientDocuments from './Clients.documents';

function ClientsInfo({ client }) {
    const [show, setShow] = useState({
        personal: true,
        payments: false,
        documents: false,
        location: false,
        tickets: false,
    });

    const toggleData = (data) => {
        setShow({
            personal: false,
            payments: false,
            documents: false,
            location: false,
            tickets: false,
            [data]: true
        })
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary w-100">
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

            <div className="card ms-3 me-5 border-0" style={{ width: '45rem' }}>
                <div className="card-body shadow">
                    <div className="card-header d-flex justify-content-between">
                        <span><i className="bi bi-person-fill"></i> Client Details</span>
                    </div>

                    <div className="card-body">

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
                            <div className="d-flex justify-content-center">
                                <ClientPayments client={client._id} />
                            </div>
                        )}

                    </div>

                    <div className="card-footer d-flex justify-content-between">
                        <div className="row" style={{ fontSize: "0.7em" }}>
                            <span>Dia: {client.CreateDate.split("T")[0]}</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClientsInfo;