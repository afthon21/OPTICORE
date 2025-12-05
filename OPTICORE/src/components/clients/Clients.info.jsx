import styleCard from './css/clientInfo.module.css';
import styleNav from './css/navbar.module.css';

import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import ApiRequest from '../hooks/apiRequest.jsx';
import Swal from 'sweetalert2';
import ClientPayments from './payment/Client.payments';
import ClientData from './Client.data';
import ClientDocuments from './documents/Clients.documents';
import ClientTickets from './tickets/Client.tickets';
import ClientNotes from './notes/client.notes';
import ClientLocation from './location/location.map';
import ActiveClientPanel from './ActiveClientPanel';
import ActiveClientsModal from './ActiveClientsModal';


function ClientsInfo({ client, initialActiveTab = 'personal', onGlobalUpdate }) {


    const [show, setShow] = useState({
        personal: initialActiveTab === 'personal',
        payments: initialActiveTab === 'payments',
        documents: initialActiveTab === 'documents',
        location: initialActiveTab === 'location',
        tickets: initialActiveTab === 'tickets',
        notes: initialActiveTab === 'notes'
    });

    // Estado local para el cliente seleccionado
    const [currentClient, setCurrentClient] = useState(client);

    
    // Estado para la lista completa de clientes (modal de activos)
    const [clients, setClients] = useState([]);
    const [paymentsRefreshKey, setPaymentsRefreshKey] = useState(0);

    // Estados para modal + panel de clientes activos
    const [showActiveClientsModal, setShowActiveClientsModal] = useState(false);
    const [showActiveClientPanel, setShowActiveClientPanel] = useState(false);
    const [selectedActiveClient, setSelectedActiveClient] = useState(null);


    // Si el prop client cambia (por ejemplo, seleccionas otro cliente), actualiza el estado local
    useEffect(() => {
        setCurrentClient(client);
    }, [client]);

    // Escuchar eventos globales de pago creado para refrescar la vista de cliente si aplica
    useEffect(() => {
        const handler = (e) => {
            const created = e && e.detail ? e.detail : null;
            if (!created) return;
            const paymentClientId = created.Client && (created.Client._id || created.Client);
            if (currentClient && currentClient._id && paymentClientId && String(currentClient._id) === String(paymentClientId)) {
                setPaymentsRefreshKey(k => k + 1);
            }
        };

        window.addEventListener('payment:created', handler);
        return () => window.removeEventListener('payment:created', handler);
    }, [currentClient]);

    // Actualizar la pestaña activa cuando cambie initialActiveTab
    useEffect(() => {
        setShow({
            personal: initialActiveTab === 'personal',
            payments: initialActiveTab === 'payments',
            documents: initialActiveTab === 'documents',
            location: initialActiveTab === 'location',
            tickets: initialActiveTab === 'tickets',
            notes: initialActiveTab === 'notes'
        });
    }, [initialActiveTab]);

    const toggleData = (data) => {
        setShow({
            personal: false,
            payments: false,
            documents: false,
            location: false,
            tickets: false,
            notes: false,
            [data]: true
        });
    };

    const { makeRequest } = ApiRequest(import.meta.env.VITE_API_BASE);

    // Función para cargar todos los clientes (necesario para el apartado "Activos")
    const loadAllClients = useCallback(async () => {
        try {
            const response = await makeRequest('/client/all');
            setClients(response || []);
        } catch (error) {
            console.error('Error loading clients:', error);
            setClients([]);
        }
    }, [makeRequest]);


    const toggleStatusFromActive = async (item) => {
        const willArchive = !item.Archived;
        const actionText = willArchive ? 'archivar' : 'desarchivar';
        const clientName = `${item.Name.FirstName} ${item.Name.SecondName || ''} ${item.LastName.FatherLastName} ${item.LastName.MotherLastName}`.replace(/\s+/g, ' ').trim();
        
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: willArchive 
                ? `¿Quieres archivar al cliente ${clientName}? Esto archivará todos sus pagos, tickets y paquetes relacionados.`
                : `¿Quieres desarchivar al cliente ${clientName}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: willArchive ? '#dc3545' : '#28a745',
            cancelButtonColor: '#6c757d',
            confirmButtonText: `Sí, ${actionText}`,
            cancelButtonText: 'Cancelar'
        });
        
        if (result.isConfirmed) {
            const endpoint = willArchive ? `/client/archive/${item._id}` : `/client/unarchive/${item._id}`;
            const response = await makeRequest(endpoint, 'POST');
            
            if (response) {
                if (onGlobalUpdate) onGlobalUpdate(item._id);
                
                // Remover de la lista si fue archivado
                if (willArchive) {
                    setClients(prev => prev.filter(c => c._id !== item._id));
                    // Si el cliente actual es el que se archivó, limpiarlo
                    if (currentClient && currentClient._id === item._id) {
                        setCurrentClient(null);
                    }
                }
                
                Swal.fire({
                    icon: 'success',
                    title: willArchive ? 'Cliente archivado' : 'Cliente desarchivado',
                    text: willArchive 
                        ? 'El cliente y todos sus datos relacionados han sido archivados' 
                        : 'El cliente ha sido desarchivado',
                    timer: 2000,
                    toast: true,
                    position: 'top',
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `No se pudo ${actionText} el cliente`,
                    timer: 1400,
                    toast: true,
                    position: 'top',
                    showConfirmButton: false
                });
            }
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
                        </ul>
                    </div>
                </div>
            </nav>

            <div className={`card ${styleCard['card-container']}`}>

                <div className={`d-flex justify-content-between align-items-center mt-1 mx-3 ${styleCard['header']}`}>
                  <span className={styleCard['title']}><i className="bi bi-person-fill"></i> Client Details</span>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => {
                        loadAllClients();
                        setShowActiveClientsModal(true);
                      }}
                    >
                      <i className="bi bi-people-fill me-1"></i>
                      Activos
                    </button>
                  </div>
                </div>

                <div className={`card-body ${styleCard['body']}`}>
                    {/* datos personales */}
                    {show.personal && (
                        <ClientData
                            client={currentClient}
                            onUpdateClient={(u)=>{ setCurrentClient(u); 
                                if(onGlobalUpdate) onGlobalUpdate(u);} }
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
                        <ClientPayments isArchived={currentClient?.Archived} client={currentClient?._id} refreshKey={paymentsRefreshKey} />
                    )}

                    {/* Ver tickets */}
                    {show.tickets && (
                        <ClientTickets client={currentClient?._id}/>
                    )}

                    {/* Ver notas */}
                    {show.notes && (
                        <ClientNotes client={currentClient?._id}/>
                    )}

      </div>
    </div>

        {/* Modal centrado con listado de clientes activos */}
        <ActiveClientsModal
            clients={clients}
            isOpen={showActiveClientsModal}
            onClose={() => setShowActiveClientsModal(false)}
            onSelectClient={(selected) => {
                setSelectedActiveClient(selected);
                setShowActiveClientsModal(false);
                setShowActiveClientPanel(true);
            }}
            onToggleStatus={toggleStatusFromActive}
        />

        {/* Panel lateral con detalle del cliente activo */}
        <ActiveClientPanel
            client={selectedActiveClient}
            isOpen={showActiveClientPanel}
            onClose={() => {
                setShowActiveClientPanel(false);
                setSelectedActiveClient(null);
            }}
            onToggleStatus={(item) => toggleStatusFromActive(item)}
        />
  </div>
);
}

export default ClientsInfo;

ClientsInfo.propTypes = {
    client: PropTypes.object,
    initialActiveTab: PropTypes.string,
    onGlobalUpdate: PropTypes.func
};