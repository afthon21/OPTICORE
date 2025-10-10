    // Función para mostrar detalles del cliente en un modal
        const handleShowClientDetails = (client) => {
            // Mostrar la dirección exactamente como la ingresó el usuario
            let direccion = 'Sin dirección';
            // Buscar dirección en Address o en Location
            if (client.Address) {
                if (typeof client.Address === 'string') {
                    direccion = client.Address;
                } else if (typeof client.Address === 'object') {
                    const municipio = client.Address.City || client.Address.Municipio || '';
                    const calle = client.Address.Street || '';
                    const cp = client.Address.PostalCode || client.Address.CP || '';
                    direccion = [municipio, calle, cp].filter(Boolean).join(', ');
                }
            } else if (client.Location) {
                // Algunos clientes pueden tener la dirección en Location
                const municipio = client.Location.Municipality || '';
                const calle = client.Location.Address || '';
                const cp = client.Location.ZIP || '';
                direccion = [municipio, calle, cp].filter(Boolean).join(', ');
            }
            if (!direccion || direccion === ', , ') direccion = 'Sin dirección';
            Swal.fire({
                title: `<div style='display:flex;justify-content:center;align-items:center;'><i class="bi bi-person-plus-fill text-success" style="font-size:2.5rem;"></i></div>` +
                    '<div style="margin-top:10px;font-size:1.5rem;font-weight:600;">' +
                    [
                        client.Name.FirstName,
                        client.Name.SecondName,
                        client.LastName.FatherLastName,
                        client.LastName.MotherLastName
                    ].filter(Boolean).join(' ').toUpperCase() +
                    '</div>',
                html: `
                    <b>Email:</b> ${client.Email || 'Sin email'}<br/>
                    <b>Tel:</b> ${(client.PhoneNumber && client.PhoneNumber.length > 0) ? client.PhoneNumber.join(', ') : 'Sin teléfono'}<br/>
                    <b>Región:</b> ${getClientRegion(client)}<br/>
                    <b>Registrado:</b> ${client.CreateDate ? new Date(client.CreateDate).toLocaleDateString('es-ES') : 'Sin fecha'}<br/>
                    <b>Dirección:</b> ${direccion}<br/>
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
import { useRegion, RegionProvider} from '../../hooks/RegionContext.jsx';

function HomeComponent() {
    const [tickets, setTickets] = useState([]);
    const [showAllTickets, setShowAllTickets] = useState(false);
    const [userName, setUserName] = useState('');
    const [clients, setClients] = useState([]);
    const {region} = useRegion();

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

    const getClientRegion = (client) => {
        if (!client) return 'Estado de México';
        const regionFound = client.region ||
                           client.Location?.region ||
                           client.Address?.region ||
                           'Estado de México';
        return regionFound;
    };

    const getAdminRegion = (admin) => {
        return admin.Region || admin.AssignedRegion || 'Estado de México';
    };

     const filterByRegion = (items, getRegionFunction) => {
        if (!region || region === 'Estado de México' || !items) {
            return items || [];
        }
        return items.filter(item => {
            const itemRegion = getRegionFunction(item);
            return itemRegion === region;
        });
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

     const pendientes = tickets.filter(t => t.Status === 'En espera');

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

    const clientesNuevosFiltrados = filterByRegion(clientesNuevos, getClientRegion);
    const ticketsFiltrados = filterByRegion(tickets, (ticket) => {
        const client = clients.find(c => c._id === ticket.Client);
        return getClientRegion(client);
    });

    const pendientesFiltrados = filterByRegion(pendientes, (ticket) => {
        const client = clients.find(c => c._id === ticket.Client);
        return getClientRegion(client);
    });

    return (
        <div className="content mt-3" style={{ marginLeft: '70px' }}>
            <div className="mb-3 p-2 bg-light rounded">
                <small className="text-muted">Región activa: </small>
                <strong className="text-primary">{region}</strong>
            </div>
            {/* Primera fila */}
            <div className="dashboard-row" style={{ minHeight: '250px' }}>
                <div className="dashboard-card" style={{ background: boxColors.clientesNuevos }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="border-bottom">Clientes Nuevos ({region})</h5>
                    </div>
                    <div className="flex-grow-1" style={{ overflowY: 'auto', maxHeight: 200 }}>
                        {clientesNuevosFiltrados.length === 0 ? (
                            <span className="text-muted">No hay clientes nuevos ({region})</span>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {(showAllTickets ? clientesNuevosFiltrados : clientesNuevosFiltrados.slice(0, 8)).map(client => (
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
                                {clientesNuevosFiltrados.length > 8 && (
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
                                                    +{clientesNuevosFiltrados.length - 8} clientes más...
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
                        <h5 className="border-bottom">Administradores Activos ({region})</h5>
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
                        <h6 className="border-bottom">Todos los Tickets ({region})</h6>
                    </div>
                    <div className="flex-grow-1" style={{ overflowY: 'auto', maxHeight: 200 }}>
                        {ticketsFiltrados.length === 0 ? (
                            <span className="text-muted">No hay tickets registrados en {region}</span>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {(showAllTickets ? ticketsFiltrados : ticketsFiltrados.slice(0, 8)).map(ticket => (
                                    <li
                                        key={ticket._id}
                                        className="list-group-item py-1 px-2"
                                        style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', marginBottom: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', cursor: 'pointer' }}
                                        title="Ver detalles del ticket"
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>
                                                    <i className="bi bi-ticket-detailed text-primary me-1"></i>
                                                    {ticket.Folio}
                                                </strong>
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
                                {ticketsFiltrados.length > 8 && (
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
                                                    +{ticketsFiltrados.length - 8} tickets más...
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
                        <h6 className="border-bottom">Tickets Pendientes ({region})</h6>
                    </div>
                    <div className="flex-grow-1" style={{ overflowY: 'auto', maxHeight: 200 }}>
                        {pendientesFiltrados.length === 0 ? (
                            <span className="text-muted">Sin tickets pendientes en {region}</span>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {pendientesFiltrados.slice(0, 8).map(ticket => (
                                    <li
                                        key={ticket._id}
                                        className="list-group-item py-1 px-2"
                                        style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', marginBottom: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', cursor: 'pointer' }}
                                        title="Ver detalles del ticket pendiente"
                                    >
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
