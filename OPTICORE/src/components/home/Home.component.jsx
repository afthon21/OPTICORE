    // Función para mostrar detalles del cliente en un modal
    const handleShowClientDetails = (client) => {
        // ...existing code...
    };

    // Función para mostrar detalles del ticket en un modal
    const handleShowTicketDetails = (ticket) => {
        Swal.fire({
            title: `<div style='display:flex;justify-content:center;align-items:center;'><i class="bi bi-ticket-perforated-fill text-primary" style="font-size:2.5rem;"></i></div>` +
                `<div style="margin-top:10px;font-size:1.2rem;font-weight:600;">Folio: ${ticket.Folio || 'Sin folio'}</div>`,
            html: `
                <b>Asunto:</b> ${ticket.Issue || 'Sin asunto'}<br/>
                <b>Descripción:</b> ${ticket.Description || 'Sin descripción'}<br/>
                <b>Estado:</b> ${ticket.Status || 'Sin estado'}<br/>
                <b>Fecha de creación:</b> ${ticket.CreateDate ? new Date(ticket.CreateDate).toLocaleDateString('es-ES') : 'Sin fecha'}<br/>
<<<<<<< HEAD
                <b>Cliente:</b> ${ticket.Client?.Name?.FirstName ? ticket.Client.Name.FirstName + ' ' + (ticket.Client.Name.LastName || '') : 'Sin cliente'}<br/>
                <b>Técnico:</b> ${ticket.tecnico || 'Sin técnico'}<br/>
                <b>Prioridad: </b> ${ticket.Priority || 'Sin prioridad'}<br/>
=======
                <b>Cliente:</b> ${ticket.ClientName || 'Sin cliente'}<br/>
                <b>Técnico:</b> ${ticket.TechnicianName || 'Sin técnico'}<br/>
>>>>>>> 328e915e317b813ad3412c42d210b8e8b60a8758
            `,
            icon: undefined,
            showClass: {
                popup: 'swal2-show'
            },
            hideClass: {
                popup: 'swal2-hide'
            },
            confirmButtonText: 'Cerrar',
            width: 350,
            customClass: {
                popup: 'swal2-border-radius swal2-small-popup'
            }
        });
    };
// SweetAlert2 popup size custom CSS
const swalSmallStyle = document.createElement('style');
swalSmallStyle.innerHTML = `
    .swal2-small-popup {
        font-size: 0.95rem !important;
        padding: 1.2em 1.2em 1em 1.2em !important;
    }
`;
if (!document.getElementById('swal2-small-popup-style')) {
    swalSmallStyle.id = 'swal2-small-popup-style';
    document.head.appendChild(swalSmallStyle);
}
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import ApiRequest from '../hooks/apiRequest'; //importacion de la API
import EstadoRedResumen from '../network/EstadoRedResumen.jsx';
import ErrorDisplay from './ErrorDisplay.jsx';

function HomeComponent() {
    const [tickets, setTickets] = useState([]);
    const [showAllTickets, setShowAllTickets] = useState(false);
    const [userName, setUserName] = useState('');
    const [clients, setClients] = useState([]);
    // Estado para los colores de cada recuadro
    const [boxColors, setBoxColors] = useState({
        clientesNuevos: '#ecebebff',
        admins: '#ecebebff',
        red: '#ecebebff',
        errores: '#ecebebff',
        radio: '#ecebebff',
        fibra: '#ecebebff',
        tickets: '#ecebebff',
        pendientes: '#ecebebff',
    });
    const { makeRequest } = ApiRequest(import.meta.env.VITE_API_BASE);

    // Función para cambiar color
    const handleColorChange = (box, color) => {
        setBoxColors(prev => ({ ...prev, [box]: color }));
    };

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
        <div className="content mt-3" style={{ marginLeft: '70px' }}>
            {/* Primera fila */}
            <div className="dashboard-row" style={{ minHeight: '250px' }}>
                <div className="dashboard-card" style={{ background: boxColors.clientesNuevos }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="border-bottom">Clientes Nuevos</h5>
                    </div>
                    <div className="flex-grow-1" style={{ overflowY: 'auto', maxHeight: 200 }}>
                        {clientesNuevos.length === 0 ? (
                            <span className="text-muted">No hay clientes nuevos</span>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {(showAllTickets ? clientesNuevos : clientesNuevos.slice(0, 8)).map(client => (
                                    <li
                                        key={client._id}
                                        className="list-group-item py-1 px-2"
                                        style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', marginBottom: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', cursor: 'pointer' }}
                                        onClick={() => handleShowClientDetails(client)}
                                        title="Ver detalles del cliente"
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>
                                                    <i className="bi bi-person-plus-fill text-success me-1"></i>
                                                    {[
                                                        client.Name.FirstName,
                                                        client.Name.SecondName,
                                                        client.LastName.FatherLastName,
                                                        client.LastName.MotherLastName
                                                    ].filter(Boolean).join(' ').toUpperCase()}
                                                </strong>
                                                <br />
                                                <small className="text-muted">{client.CreateDate ? new Date(client.CreateDate).toLocaleDateString('es-ES') : 'Sin fecha'}</small>
                                            </div>
                                            <span className="badge bg-primary">Nuevo</span>
                                        </div>
                                    </li>
                                ))}
                                {clientesNuevos.length > 8 && (
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
                                                    +{clientesNuevos.length - 8} clientes más...
                                                </>
                                            )}
                                        </button>
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="dashboard-card" style={{ background: boxColors.admins }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="border-bottom">Administradores Activos</h5>
                    </div>
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
                <div className="dashboard-card" style={{ background: boxColors.red, flex: '2 1 400px' }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="border-bottom">Estado de Red</h6>
                    </div>
                    <div className="flex-grow-1">
                        <EstadoRedResumen />
                    </div>
                </div>
                <div className="dashboard-card" style={{ background: boxColors.errores, flex: '1 1 200px' }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="border-bottom">Registro de Errores</h5>
                    </div>
                    <ErrorDisplay />
                </div>
            </div>

            {/* Segunda fila */}
            <div className="dashboard-row" style={{ minHeight: '250px' }}>
                <div className="dashboard-card" style={{ background: boxColors.radio }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="border-bottom">Radio Frecuencia - Paquetes</h6>
                    </div>
                    <p>Total de Clientes: </p>
                    <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                        {/* Aquí va tu gráfica circular */}
                    </div>
                </div>
                <div className="dashboard-card" style={{ background: boxColors.fibra }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="border-bottom">Fibra Optica - Paquetes</h6>
                    </div>
                    <p>Total de Clientes: </p>
                    <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                        {/* Aquí va tu gráfica circular */}
                    </div>
                </div>
                <div className="dashboard-card dashboard-table" style={{ background: boxColors.tickets }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="border-bottom">Todos los Tickets</h6>
                    </div>
                    <div className="flex-grow-1" style={{ overflowY: 'auto', maxHeight: 200 }}>
                        {tickets.length === 0 ? (
                            <span className="text-muted">No hay tickets registrados</span>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {(showAllTickets ? tickets : tickets.slice(0, 8)).map(ticket => (
<<<<<<< HEAD
                                    <li
                                        key={ticket._id}
                                        className="list-group-item py-1 px-2"
                                        style={{ 
                                            background: '#fff', 
                                            border: '1px solid #e0e0e0', 
                                            borderRadius: '6px', 
                                            marginBottom: '4px', 
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.04)', 
                                            cursor: 'pointer' }}
                                        onClick={() => handleShowTicketDetails(ticket)}
                                        title="Ver detalles del ticket"
                                    >

=======
                                    <li key={ticket._id} className="list-group-item py-1 px-2" style={{cursor: 'pointer'}} onClick={() => handleShowTicketDetails(ticket)} title="Ver detalles del ticket">
>>>>>>> 328e915e317b813ad3412c42d210b8e8b60a8758
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>
                                                    <i className="bi bi-ticket-detailed text-primary me-1"></i>
                                                    {ticket.Folio}
                                                </strong>
                                                <br />
                                                <small className="text-muted">{ticket.Issue}</small>
                                            </div>
                                            <span className={`badge ${
                                            ticket.Status === 'Resuelto' 
                                            ? 'bg-success' 
                                            :ticket.Status === 'En espera' 
                                            ? 'bg-warning text-dark' 
                                            :ticket.Status === 'En proceso' 
                                            ? 'bg-info text-dark' 
                                            :'bg-secondary'
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
                <div className="dashboard-card dashboard-table" style={{ background: boxColors.pendientes }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="border-bottom">Tickets Pendientes</h6>
                    </div>
                    <div className="flex-grow-1" style={{ overflowY: 'auto', maxHeight: 200 }}>
                        {pendientes.length === 0 ? (
                            <span className="text-muted">Sin tickets pendientes</span>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {pendientes.slice(0, 8).map(ticket => (
<<<<<<< HEAD
                                    <li key={ticket._id} 
                                    className="list-group-item py-1 px-2" 
                                    style={{
                                        background: '#fff', 
                                        border: '1px solid #e0e0e0', 
                                        borderRadius: '6px', 
                                        marginBottom: '4px', 
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)', 
                                        cursor: 'pointer' }}
                                    onClick={() => handleShowTicketDetails(ticket)} 
                                    title="Ver detalles del ticket pendiente">
=======
                                    <li key={ticket._id} className="list-group-item py-1 px-2" style={{cursor: 'pointer'}} onClick={() => handleShowTicketDetails(ticket)} title="Ver detalles del ticket">
>>>>>>> 328e915e317b813ad3412c42d210b8e8b60a8758
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>
                                                    <i className="bi bi-hourglass-split text-warning me-1"></i>
                                                    {ticket.Folio}
                                                </strong>
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
