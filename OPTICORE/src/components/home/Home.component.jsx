import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import ApiRequest from '../hooks/apiRequest'; //importacion de la API
import EstadoRedResumen from '../network/EstadoRedResumen.jsx';
import ErrorDisplay from './ErrorDisplay.jsx';
import FibraChart from './FibraChart.jsx';
import RadioChart from './RadioChart.jsx';
import AddressModal from './AddressModal.jsx';
import ClientAddressDetailModal from './ClientAddressDetailModal.jsx';
import ClientDetailsModal from './ClientDetailsModal.jsx';

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
    const [packages, setPackages] = useState([]);
    const [chartData, setChartData] = useState({
        fibra: { labels: [], data: [], total: 0 },
        radio: { labels: [], data: [], total: 0 }
    });
    // Estado para el modal de detalles de dirección
    const [addressDetailModalOpen, setAddressDetailModalOpen] = useState(false);
    const [selectedClientForAddressDetail, setSelectedClientForAddressDetail] = useState(null);
    // Estado para el modal de mapa
    const [addressModalOpen, setAddressModalOpen] = useState(false);
    const [selectedClientForAddress, setSelectedClientForAddress] = useState(null);
    // Estado para el modal de detalles del cliente
    const [clientDetailsModalOpen, setClientDetailsModalOpen] = useState(false);
    const [selectedClientForDetails, setSelectedClientForDetails] = useState(null);
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

    // Función para obtener paquetes
    const fetchPackages = async () => {
        try {
            const res = await makeRequest('/packages/all');
            if (res) {
                setPackages(res);
                processChartData(res, clients);
            }
        } catch (error) {
            console.error('Error fetching packages:', error);
        }
    };

    // Función para procesar datos de las gráficas
    const processChartData = (packagesData, clientsData) => {
        // Inicializar contadores
        const fibraStats = {
            '50 Megas': 0,
            '100 Megas': 0, 
            '200 Megas': 0,
            '300 Megas': 0
        };
        
        const radioStats = {
            '10 Megas': 0,
            '15 Megas': 0,
            '20 Megas': 0
        };
        
        let fibraTotal = 0;
        let radioTotal = 0;
        
        // Contar paquetes por tipo y velocidad
        packagesData.forEach(pkg => {
            const speed = pkg.type || 'No especificado';
            const connectionType = pkg.connectionType || '';
            
            if (connectionType.includes('Fibra')) {
                if (fibraStats.hasOwnProperty(speed)) {
                    fibraStats[speed]++;
                    fibraTotal++;
                }
            } else if (connectionType.includes('Radio')) {
                if (radioStats.hasOwnProperty(speed)) {
                    radioStats[speed]++;
                    radioTotal++;
                }
            }
        });
        
        // Convertir a porcentajes basado en cada tipo específico
        const fibraLabels = Object.keys(fibraStats).filter(key => fibraStats[key] > 0);
        const fibraData = fibraLabels.map(key => 
            fibraTotal > 0 ? Math.round((fibraStats[key] / fibraTotal) * 100) : 0
        );
        
        const radioLabels = Object.keys(radioStats).filter(key => radioStats[key] > 0);
        const radioData = radioLabels.map(key => 
            radioTotal > 0 ? Math.round((radioStats[key] / radioTotal) * 100) : 0
        );
        
        setChartData({
            fibra: {
                labels: fibraLabels.length > 0 ? fibraLabels : ['Sin datos'],
                data: fibraData.length > 0 ? fibraData : [0],
                total: fibraTotal
            },
            radio: {
                labels: radioLabels.length > 0 ? radioLabels : ['Sin datos'],
                data: radioData.length > 0 ? radioData : [0],
                total: radioTotal
            }
        });
    };

    // Funciones para manejar el modal de dirección
    const handleOpenAddressModal = (client) => {
        setSelectedClientForAddress(client);
        setAddressModalOpen(true);
    };

    const handleCloseAddressModal = () => {
        setAddressModalOpen(false);
        setSelectedClientForAddress(null);
    };

    // Funciones para manejar el modal de detalles de dirección
    const handleOpenAddressDetailModal = (client) => {
        setSelectedClientForAddressDetail(client);
        setAddressDetailModalOpen(true);
    };

    const handleCloseAddressDetailModal = () => {
        setAddressDetailModalOpen(false);
        setSelectedClientForAddressDetail(null);
    };

    // Función para abrir el modal de mapa desde el modal de detalles
    const handleOpenMapFromDetails = (client) => {
        // Cerrar el modal de detalles primero
        setAddressDetailModalOpen(false);
        setSelectedClientForAddressDetail(null);
        // Abrir el modal de mapa
        setTimeout(() => {
            setSelectedClientForAddress(client);
            setAddressModalOpen(true);
        }, 300);
    };

    // Funciones para manejar el modal de detalles del cliente
    const handleShowClientDetails = (client) => {
        setSelectedClientForDetails(client);
        setClientDetailsModalOpen(true);
    };

    const handleCloseClientDetailsModal = () => {
        setClientDetailsModalOpen(false);
        setSelectedClientForDetails(null);
    };

    // Debug de estados
    useEffect(() => {
    }, [addressModalOpen]);

    useEffect(() => {
    }, [selectedClientForAddress]);

    // Funciones globales para abrir modales (disponibles en window)
    useEffect(() => {
        window.openAddressDetailModal = (client) => {
            handleOpenAddressDetailModal(client);
        };
        
        window.openAddressModal = (client) => {
            handleOpenAddressModal(client);
        };
        
        return () => {
            delete window.openAddressDetailModal;
            delete window.openAddressModal;
        };
    }, []);

    // Función para mostrar detalles del ticket en un modal
    const handleShowTicketDetails = (ticket) => {
        Swal.fire({
            title: `
                <div style="
                    background: linear-gradient(135deg, #2a9d8f 0%, #264653 100%);
                    color: white;
                    padding: 1.2rem 1.5rem;
                    margin: -20px -20px 15px -20px;
                    border-radius: 12px 12px 0 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 1.2rem;
                    font-weight: 600;
                ">
                    <i class="bi bi-ticket-detailed-fill" style="font-size: 1.2rem;"></i>
                    Información del Ticket
                </div>
            `,
            html: `
                <div style="text-align: left; padding: 10px;">
                    <div style="display: grid; gap: 15px;">
                        <div style="border-left: 4px solid #17a2b8; padding-left: 15px; background: #f8f9fa; padding: 12px; border-radius: 5px;">
                            <strong style="color: #17a2b8; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Folio</strong>
                            <p style="margin: 5px 0 0 0; color: #495057; font-weight: 500;">${ticket.Folio || 'Sin folio'}</p>
                        </div>
                        
                        <div style="border-left: 4px solid #20c997; padding-left: 15px; background: #f8f9fa; padding: 12px; border-radius: 5px;">
                            <strong style="color: #20c997; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Asunto</strong>
                            <p style="margin: 5px 0 0 0; color: #495057; font-weight: 500;">${ticket.Issue || 'Sin asunto'}</p>
                        </div>
                        
                        <div style="border-left: 4px solid #20c997; padding-left: 15px; background: #f8f9fa; padding: 12px; border-radius: 5px;">
                            <strong style="color: #20c997; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Descripción</strong>
                            <p style="margin: 5px 0 0 0; color: #495057;">${ticket.Description || 'Sin descripción'}</p>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div style="border-left: 4px solid #17a2b8; padding-left: 15px; background: #f8f9fa; padding: 12px; border-radius: 5px;">
                                <strong style="color: #17a2b8; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Estado</strong>
                                <p style="margin: 5px 0 0 0; color: #495057; font-weight: 500;">${ticket.Status || 'Sin estado'}</p>
                            </div>
                            
                            <div style="border-left: 4px solid #20c997; padding-left: 15px; background: #f8f9fa; padding: 12px; border-radius: 5px;">
                                <strong style="color: #20c997; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Prioridad</strong>
                                <p style="margin: 5px 0 0 0; color: #495057; font-weight: 500;">${ticket.Priority || 'Sin prioridad'}</p>
                            </div>
                        </div>
                        
                        <div style="border-left: 4px solid #17a2b8; padding-left: 15px; background: #f8f9fa; padding: 12px; border-radius: 5px;">
                            <strong style="color: #17a2b8; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Fecha de Creación</strong>
                            <p style="margin: 5px 0 0 0; color: #495057; font-weight: 500;">${ticket.CreateDate ? new Date(ticket.CreateDate).toLocaleDateString('es-ES') : 'Sin fecha'}</p>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div style="border-left: 4px solid #20c997; padding-left: 15px; background: #f8f9fa; padding: 12px; border-radius: 5px;">
                                <strong style="color: #20c997; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Cliente</strong>
                                <p style="margin: 5px 0 0 0; color: #495057; font-weight: 500;">${ticket.Client?.Name?.FirstName ? ticket.Client.Name.FirstName + ' ' + (ticket.Client.Name.LastName || '') : 'Sin cliente'}</p>
                            </div>
                            
                            <div style="border-left: 4px solid #17a2b8; padding-left: 15px; background: #f8f9fa; padding: 12px; border-radius: 5px;">
                                <strong style="color: #17a2b8; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Técnico</strong>
                                <p style="margin: 5px 0 0 0; color: #495057; font-weight: 500;">${ticket.tecnico || 'Sin técnico'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            icon: undefined,
            showClass: {
                popup: 'swal2-show'
            },
            hideClass: {
                popup: 'swal2-hide'
            },
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#17a2b8',
            width: 600,
            customClass: {
                popup: 'swal2-border-radius',
                title: 'swal2-title-custom',
                htmlContainer: 'swal2-html-custom'
            },
            didOpen: () => {
                // Estilos adicionales para el modal
                const popup = Swal.getPopup();
                if (popup) {
                    popup.style.borderRadius = '15px';
                    popup.style.boxShadow = '0 20px 60px rgba(23, 162, 184, 0.15)';
                }
            }
        });
    };

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
                return res || [];
            } catch (error) {
                console.log(error);
                return [];
            }
        };

        const loadInitialData = async () => {
            fetchTickets();
            const clientsData = await fetchClients();
            // Cargar paquetes después de obtener clientes para calcular porcentajes
            try {
                const packagesRes = await makeRequest('/packages/all');
                if (packagesRes) {
                    setPackages(packagesRes);
                    processChartData(packagesRes, clientsData);
                }
            } catch (error) {
                console.error('Error fetching packages:', error);
            }
        };

        loadInitialData();
    }, []);

    // Recargar datos cuando cambien los clientes
    useEffect(() => {
        if (packages.length > 0 && clients.length > 0) {
            processChartData(packages, clients);
        }
    }, [clients, packages]);

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
                    <p>Total de Clientes: <strong>{chartData.radio.total}</strong></p>
                    <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                        <RadioChart data={chartData.radio} />
                    </div>
                </div>
                <div className="dashboard-card" style={{ background: boxColors.fibra }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="border-bottom">Fibra Optica - Paquetes</h6>
                    </div>
                    <p>Total de Clientes: <strong>{chartData.fibra.total}</strong></p>
                    <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                        <FibraChart data={chartData.fibra} />
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
            
            {/* Modal de detalles de dirección */}
            <ClientAddressDetailModal 
                client={selectedClientForAddressDetail}
                isOpen={addressDetailModalOpen}
                onClose={handleCloseAddressDetailModal}
            />
            
            {/* Modal de mapa */}
            <AddressModal 
                client={selectedClientForAddress}
                isOpen={addressModalOpen}
                onClose={handleCloseAddressModal}
            />

            {/* Modal de detalles del cliente */}
            <ClientDetailsModal 
                client={selectedClientForDetails}
                isOpen={clientDetailsModalOpen}
                onClose={handleCloseClientDetailsModal}
            />
        </div>
    );
}

export default HomeComponent;
