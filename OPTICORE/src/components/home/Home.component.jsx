import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import ApiRequest from '../hooks/apiRequest'; //importacion de la API
import EstadoRedResumen from '../network/EstadoRedResumen.jsx';
import ErrorDisplay from './ErrorDisplay.jsx';
import FibraChart from './FibraChart.jsx';
import RadioChart from './RadioChart.jsx';

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

function HomeComponent() {
    const [tickets, setTickets] = useState([]);
    const [showAllClients, setShowAllClients] = useState(false);
    const [showAllTicketsState, setShowAllTicketsState] = useState(false);
    const [userName, setUserName] = useState('');
    const [clients, setClients] = useState([]);
    const [clientDocuments, setClientDocuments] = useState({});
    // Estado para los colores de cada recuadro
    const [boxColors, setBoxColors] = useState({
        clientes: '#ecebebff',
        admins: '#ecebebff',
        red: '#ecebebff',
        errores: '#ecebebff',
        radio: '#ecebebff',
        fibra: '#ecebebff',
        tickets: '#ecebebff',
        pendientes: '#ecebebff',
    });
    const { makeRequest } = ApiRequest(import.meta.env.VITE_API_BASE);

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

        // Obtener la foto de fachada del cliente (ya cargada previamente)
        const fotoFachada = clientDocuments[client._id];

        // Crear el HTML para la foto de fachada
        const fotoFachadaHTML = fotoFachada 
            ? `<div style="margin-bottom: 8px; display: flex; justify-content: center;">
                 <img src="${fotoFachada}" alt="Foto de Fachada" 
                      style="width: 300px; height: 260px; object-fit: cover; border-radius: 8px; border: 2px solid #dee2e6;" />
               </div>`
            : `<div style="margin-bottom: 8px; display: flex; justify-content: center;">
                 <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; 
                             background-color: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; color: #6c757d; font-size: 10px;">
                   Sin foto
                 </div>
               </div>`;

        // Crear contenido HTML para el modal
        const clientInfoHTML = `
            <div style="text-align: center;">
                <div style="margin-bottom: 10px;">
                    <i class="bi bi-house-check-fill text-success" style="font-size: 2rem;"></i>
                </div>
                ${fotoFachadaHTML}
                <h4 style="font-weight: 600; margin-bottom: 15px; color: #333;">
                    ${[
                        client.Name.FirstName,
                        client.Name.SecondName,
                        client.LastName.FatherLastName,
                        client.LastName.MotherLastName
                    ].filter(Boolean).join(' ').toUpperCase()}
                </h4>
                <div style="text-align: left; font-size: 14px; line-height: 1.6;">
                    <p><strong>Tel:</strong> ${(client.PhoneNumber && client.PhoneNumber.length > 0) ? client.PhoneNumber.join(', ') : 'Sin teléfono'}</p>
                    <p><strong>Dirección:</strong> ${direccion}</p>
                    ${fotoFachada ? `<div style="text-align: center; margin-top: 15px;">
                        <button id="download-foto-btn" style="background-color: #28a745; color: white; border: none; padding: 8px; border-radius: 50%; cursor: pointer; font-size: 14px; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; margin: 0 auto;" title="Descargar Foto de Fachada">
                            <i class="bi bi-download"></i>
                        </button>
                    </div>` : ''}
                </div>
            </div>
        `;

        const clientName = [
            client.Name.FirstName,
            client.Name.SecondName,
            client.LastName.FatherLastName,
            client.LastName.MotherLastName
        ].filter(Boolean).join(' ');

        Swal.fire({
            html: clientInfoHTML,
            showCloseButton: true,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Cerrar',
            cancelButtonColor: '#404040',
            background: '#ededed',
            width: 400,
            padding: '2em',
            didOpen: () => {
                // Agregar evento de clic al botón de descarga
                const downloadBtn = document.getElementById('download-foto-btn');
                if (downloadBtn && fotoFachada) {
                    downloadBtn.addEventListener('click', () => {
                        handleDownloadFotoFachada(fotoFachada, clientName);
                    });
                }
            }
        });
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
     
                <b>Cliente:</b> ${ticket.Client?.Name?.FirstName ? ticket.Client.Name.FirstName + ' ' + (ticket.Client.Name.LastName || '') : 'Sin cliente'}<br/>
                <b>Técnico:</b> ${ticket.tecnico || 'Sin técnico'}<br/>
                <b>Prioridad: </b> ${ticket.Priority || 'Sin prioridad'}<br/>

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

    // Función para cambiar color
    const handleColorChange = (box, color) => {
        setBoxColors(prev => ({ ...prev, [box]: color }));
    };

    // Función para descargar la foto de fachada
    const handleDownloadFotoFachada = async (url, clientName) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            
            // Usar el nombre del cliente como nombre del archivo
            const fileName = `Foto_Fachada_${clientName.replace(/\s+/g, '_')}.${url.split('.').pop()}`;
            link.download = fileName;
            
            link.click();
            
            // Limpia la URL para evitar problemas de memoria
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error al descargar la foto:', error);
        }
    };

    // Función para obtener la foto de fachada de un cliente
    const getFotoFachada = async (clientId) => {
        try {
            const documents = await makeRequest(`/document/all/${clientId}`);
            const fotoFachada = documents.find(doc => doc.Description === 'Foto de Fachada');
            return fotoFachada ? fotoFachada.Document : null;
        } catch (error) {
            console.log('Error obteniendo foto de fachada:', error);
            return null;
        }
    };

    // Función para cargar todas las fotos de fachada
    const loadFotosFachada = async (clientsList) => {
        const documentsMap = {};
        for (const client of clientsList) {
            const fotoFachada = await getFotoFachada(client._id);
            documentsMap[client._id] = fotoFachada;
        }
        setClientDocuments(documentsMap);
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
                // Cargar fotos de fachada después de obtener los clientes
                if (res && res.length > 0) {
                    await loadFotosFachada(res);
                }
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

    // Ordenar todos los clientes de reciente a antiguo
    const todosLosClientes = clients
        .filter(client => client.CreateDate) // Solo clientes con fecha válida
        .sort((a, b) => new Date(b.CreateDate) - new Date(a.CreateDate));

    return (
        <div className="content mt-3" style={{ marginLeft: '70px' }}>
            {/* Primera fila */}
            <div className="dashboard-row" style={{ minHeight: '250px' }}>
                <div className="dashboard-card" style={{ background: boxColors.clientes }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="border-bottom">Clientes</h5>
                    </div>
                    <div className="flex-grow-1" style={{ overflowY: 'auto', maxHeight: 200 }}>
                        {todosLosClientes.length === 0 ? (
                            <span className="text-muted">No hay clientes registrados</span>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {(showAllClients ? todosLosClientes : todosLosClientes.slice(0, 8)).map(client => (
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
                                                    <i className="bi bi-person-fill text-info me-1"></i>
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
                                            {(() => {
                                                // Calcular si es cliente nuevo (últimos 30 días)
                                                if (!client.CreateDate) return <span className="badge bg-secondary">Sin fecha</span>;
                                                const fechaRegistro = new Date(client.CreateDate);
                                                const fechaActual = new Date();
                                                const diasDiferencia = (fechaActual - fechaRegistro) / (1000 * 60 * 60 * 24);
                                                
                                                if (diasDiferencia <= 30) {
                                                    return <span className="badge bg-success">Nuevo</span>;
                                                } else {
                                                    return <span className="badge bg-info">Cliente</span>;
                                                }
                                            })()}
                                        </div>
                                    </li>
                                ))}
                                {todosLosClientes.length > 8 && (
                                    <li className="list-group-item py-1 px-2 text-center">
                                        <button
                                            className="btn btn-link btn-sm p-0 text-decoration-none"
                                            onClick={() => setShowAllClients(!showAllClients)}
                                            style={{ fontSize: '0.8rem' }}
                                        >
                                            {showAllClients ? (
                                                <>
                                                    <i className="bi bi-chevron-up me-1"></i>
                                                    Mostrar menos
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-chevron-down me-1"></i>
                                                    +{todosLosClientes.length - 8} clientes más...
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
                    <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
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
                        <RadioChart />
                    </div>
                </div>
                <div className="dashboard-card" style={{ background: boxColors.fibra }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="border-bottom">Fibra Optica - Paquetes</h6>
                    </div>
                    <p>Total de Clientes: </p>
                    <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                        <FibraChart />
                    </div>
                </div>
                <div className="dashboard-card dashboard-table" style={{ background: boxColors.tickets }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="border-bottom">Tickets</h6>
                    </div>
                    <div className="flex-grow-1" style={{ overflowY: 'auto', maxHeight: 200 }}>
                        {tickets.length === 0 ? (
                            <span className="text-muted">No hay tickets registrados</span>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {(showAllTicketsState ? tickets : tickets.slice(0, 8)).map(ticket => (
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
                                        title="Ver detalles del ticket">
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
                                            onClick={() => setShowAllTicketsState(!showAllTicketsState)}
                                            style={{ fontSize: '0.8rem' }}
                                        >
                                            {showAllTicketsState ? (
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
