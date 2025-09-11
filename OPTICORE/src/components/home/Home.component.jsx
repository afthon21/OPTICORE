import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import ApiRequest from '../hooks/apiRequest'; //importacion de la API
import EstadoRedResumen from '../network/EstadoRedResumen.jsx';

function HomeComponent() {

    const [tickets, setTickets] = useState([]);
    const [showAllTickets, setShowAllTickets] = useState(false);
    const [userName, setUserName] = useState('');
    const [clients, setClients] = useState([]);
    const { makeRequest } = ApiRequest(import.meta.env.VITE_API_BASE);

    useEffect(() => {
        const loginSuccess = sessionStorage.getItem('loginSuccess');

        if (loginSuccess) {
            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Has iniciado sesión correctamente.',
                position: 'top',
                timer: 1200,
                showConfirmButton: false,
                toast: true,
                timerProgressBar: true,
            });

            sessionStorage.removeItem('loginSuccess');
        }

        // Obtener el nombre del usuario logueado
        const storedUserName = sessionStorage.getItem('userName');
        if (storedUserName) {
            setUserName(storedUserName);
        }

        const fetchTickets = async () => {
            try {
                const res = await makeRequest('/ticket/all');
                setTickets(res || [])
            } catch (error) {
                console.log(error);
            }
        };

        const fetchClients = async () => {
            try {
                const res = await makeRequest('/client/all');
                setClients(res || []);
            } catch (error) {
                console.log(error);
            }
        };

        fetchTickets();
        fetchClients();
    }, []);

    const pendientes = tickets.filter(
        t => t.Status === 'En espera'
    );

    // Filtrar clientes nuevos (últimos 30 días) y ordenar de reciente a antiguo
    const clientesNuevos = clients
        .filter(client => {
            if (!client.CreateDate) return false;
            const fechaRegistro = new Date(client.CreateDate);
            const fechaActual = new Date();
            const diasDiferencia = (fechaActual - fechaRegistro) / (1000 * 60 * 60 * 24);
            return diasDiferencia <= 30;
        })
        .sort((a, b) => new Date(b.CreateDate) - new Date(a.CreateDate));

    return (
        <div className="container-fluid mt-3" style={{ marginLeft: '70px' }}>
            {/* Primera fila */}
            <div className="row mb-2" style={{ minHeight: '250px' }}>
                <div className="col-3 border p-2 d-flex flex-column">
                    <h5 className="border-bottom">Clientes Nuevos</h5>
                    <div className="flex-grow-1" style={{ overflowY: 'auto', maxHeight: 200 }}>
                        {clientesNuevos.length === 0 ? (
                            <span className="text-muted">No hay clientes nuevos</span>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {clientesNuevos.slice(0, 8).map(client => (
                                    <li key={client._id} className="list-group-item py-1 px-2" style={{ background: '#e3fcec', borderLeft: '4px solid #2a9d8f' }}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>
                                                    <i className="bi bi-person-plus-fill text-success me-1"></i>
                                                    {`${client.Name.FirstName} ${client.Name.SecondName || ''} ${client.LastName.FatherLastName} ${client.LastName.MotherLastName}`.replace(/\s+/g, ' ').trim()}
                                                </strong>
                                                <br />
                                                <small className="text-muted">
                                                    Registrado: {client.CreateDate ? new Date(client.CreateDate).toLocaleDateString('es-ES') : 'Sin fecha'}
                                                </small>
                                                {client.Email && (
                                                    <><br /><small className="text-muted">Email: {client.Email}</small></>
                                                )}
                                                {client.PhoneNumber && client.PhoneNumber.length > 0 && (
                                                    <><br /><small className="text-muted">Tel: {client.PhoneNumber.join(', ')}</small></>
                                                )}
                                            </div>
                                            <span className="badge bg-primary">Nuevo</span>
                                        </div>
                                    </li>
                                ))}
                                {clientesNuevos.length > 8 && (
                                    <li className="list-group-item py-1 px-2 text-center">
                                        <small className="text-muted">
                                            +{clientesNuevos.length - 8} clientes más...
                                        </small>
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="col-3 border p-2 d-flex flex-column">
                    <h5 className="border-bottom">Administradores Activos</h5>
                    <div className="flex-grow-1" style={{ overflowY: 'auto', maxHeight: 200 }}>
                        {userName ? (
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item py-1 px-2">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{userName}</strong>
                                            <br />
                                            <small className="text-muted">Usuario administrador</small>
                                        </div>
                                        <span className="badge bg-success">Activo</span>
                                    </div>
                                </li>
                            </ul>
                        ) : (
                            <span className="text-muted">No hay usuario logueado</span>
                        )}
                    </div>
                </div>
                <div className="col-3 border p-2 d-flex flex-column">
                    <h6 className="border-bottom">Estado de Red</h6>
                    <div className="flex-grow-1">
                        <EstadoRedResumen />
                    </div>
                </div>
                <div className="col-2 border p-2 d-flex flex-column">
                    <h5 className="border-bottom">Registro de Errores</h5>
                    <p className="flex-grow-1">(Registro de errores o alertas registradas)</p>
                </div>
            </div>

            {/* Segunda fila */}
            <div className="row mb-2" style={{ minHeight: '250px' }}>
                <div className="col-3 border p-2 d-flex flex-column">
                    <h6 className="border-bottom">Radio Frecuencia - Paquetes</h6>
                    <p>Total de Clientes: </p>
                    <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                        {/* Aquí va tu gráfica circular */}
                    </div>
                </div>
                <div className="col-3 border p-2 d-flex flex-column">
                    <h6 className="border-bottom">Fibra Optica - Paquetes</h6>
                    <p>Total de Clientes: </p>
                    <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                        {/* Aquí va tu gráfica circular */}
                    </div>
                </div>
                <div className="col-3 border p-2 d-flex flex-column">
                    <h6 className="border-bottom">Todos los Tickets</h6>
                    <div className="flex-grow-1" style={{ overflowY: 'auto', maxHeight: 200 }}>
                        {tickets.length === 0 ? (
                            <span className="text-muted">No hay tickets registrados</span>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {(showAllTickets ? tickets : tickets.slice(0, 8)).map(ticket => (
                                    <li key={ticket._id} className="list-group-item py-1 px-2">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>{ticket.Folio}</strong>
                                                <br />
                                                <small className="text-muted">{ticket.Issue}</small>
                                            </div>
                                            <span className={`badge ${ticket.Status === 'Resuelto' ? 'bg-success' :
                                                    ticket.Status === 'En espera' ? 'bg-warning text-dark' :
                                                        ticket.Status === 'En proceso' ? 'bg-info text-dark' :
                                                            'bg-secondary'
                                                }`}>
                                                {ticket.Status}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                                {tickets.length > 8 && (
                                    <li className="list-group-item py-1 px-2 text-center">
                                        <button
                                            className="btn btn-link btn-sm p-0 text-decoration-none"
                                            onClick={() => setShowAllTickets(!showAllTickets)}
                                            style={{ fontSize: '0.8rem' }}
                                        >
                                            {showAllTickets ? (
                                                <>
                                                    <i className="bi bi-chevron-up me-1"></i>
                                                    Mostrar menos
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-chevron-down me-1"></i>
                                                    +{tickets.length - 8} tickets más...
                                                </>
                                            )}
                                        </button>
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="col-3 border p-2 d-flex flex-column">
                    <h6 className="border-bottom">Tickets Pendientes</h6>
                    <div className="flex-grow-1" style={{ overflowY: 'auto', maxHeight: 200 }}>
                        {pendientes.length === 0 ? (
                            <span className="text-muted">Sin tickets pendientes</span>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {pendientes.slice(0, 8).map(ticket => (
                                    <li key={ticket._id} className="list-group-item py-1 px-2">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>{ticket.Folio}</strong>
                                                <br />
                                                <small className="text-muted">{ticket.Issue}</small>
                                            </div>
                                            <span className="badge bg-warning text-dark">{ticket.Status}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeComponent;
