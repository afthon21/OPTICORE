import { useState, useEffect } from 'react';
import ApiRequest from "../hooks/apiRequest";
import Swal from 'sweetalert2';
import './technician.css';

export function ViewTechnicians() {
    const [allTechnicians, setAllTechnicians] = useState([]);
    const [selectedTechnician, setSelectedTechnician] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [technicianTickets, setTechnicianTickets] = useState([]);
    const [loadingTickets, setLoadingTickets] = useState(false);
    const [showAllTickets, setShowAllTickets] = useState(false);
    const [ticketsModalOpen, setTicketsModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const { makeRequest } = ApiRequest(import.meta.env.VITE_API_BASE);

    useEffect(() => {
        let mounted = true;
        const fetchTechnicians = async () => {
            setIsLoading(true);
            try {
                const data = await makeRequest('/tecnicos/all');
                if (mounted) setAllTechnicians(data || []);
            } catch (error) {
                console.error('Error al obtener la lista de técnicos:', error);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };
        fetchTechnicians();
        return () => { mounted = false; };
    }, [makeRequest]);

    const filteredTechnicians = allTechnicians.filter(tech => {
        const fullName = `${tech.nombre} ${tech.apellidoP} ${tech.apellidoA}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

    const normalize = str => (str || '').toLowerCase().replace(/\s+/g, ' ').trim();
    const fetchTechnicianTickets = async (technicianName) => {
        setLoadingTickets(true);
        try {
            const allTickets = await makeRequest('/ticket/all');
            const normalizedTechName = normalize(technicianName);
            const filteredTickets = allTickets.filter(t =>
                normalize(t.tecnico) === normalizedTechName && t.Status !== 'Cerrado' && !t.Archived
            );
            setTechnicianTickets(filteredTickets || []);
        } catch (error) {
            console.error('Error al obtener tickets del técnico:', error);
            setTechnicianTickets([]);
        } finally {
            setLoadingTickets(false);
        }
    };

    const handleSelectTechnician = (tech) => {
        setSelectedTechnician(tech);
        setShowAllTickets(false);
        // setTicketsModalOpen(false); // ya no se usa
        const fullName = `${tech.nombre} ${tech.apellidoP} ${tech.apellidoA}`;
        fetchTechnicianTickets(fullName);
    };

    const handleToggleStatus = async () => {
        if (!selectedTechnician) return;
        try {
            const updatedStatus = !selectedTechnician.activo;
            await makeRequest(`/tecnicos/edit/${selectedTechnician._id}`, 'POST', { activo: updatedStatus });
            setSelectedTechnician({ ...selectedTechnician, activo: updatedStatus });
            setAllTechnicians(allTechnicians.map(tech => tech._id === selectedTechnician._id ? { ...tech, activo: updatedStatus } : tech));
        } catch (error) {
            console.error('Error al cambiar el estado del técnico:', error);
        }
    };

    const openTicketsModal = () => {
        if (technicianTickets.length === 0) return;
        setShowAllTickets(false);
        setTicketsModalOpen(true);
    };

    const closeTicketsModal = () => {
        setTicketsModalOpen(false);
        setShowAllTickets(false);
    };

    // Reutilizar la función de Home para mostrar el modal SweetAlert2
    const handleTicketClick = (ticket) => {
        const colors = {
            primary: '#26a69a',
            secondary: '#4db6ac',
        };
        Swal.fire({
            title: false,
            html: `
                <div style="margin: -29px -29px 0 -29px;">
                    <div style="
                        background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
                        color: white;
                        padding: 20px 10px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        border-radius: 19px 15px 0 0;
                    ">
                        <div style="
                            width: 35px;
                            height: 35px;
                            backgroundColor: rgba(255,255,255,0.2);
                            borderRadius: 50%;
                            display: flex;
                            alignItems: center;
                            justifyContent: center;
                        ">
                            <i class="bi bi-ticket-detailed-fill" style="font-size: 18px;"></i>
                        </div>
                        <h5 style="margin: 0; fontWeight: 600; fontSize: 1.2rem;">
                            Información del Ticket
                        </h5>
                    </div>
                    <div style="padding: 2rem;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                            <div style="
                                border-left: 4px solid ${colors.primary};
                                padding-left: 15px;
                                padding-top: 5px;
                                padding-bottom: 5px;
                            ">
                                <label style="
                                    color: ${colors.primary};
                                    font-weight: 600;
                                    font-size: 0.9rem;
                                    margin-bottom: 5px;
                                    display: flex;
                                    align-items: center;
                                ">
                                    <i class="bi bi-hash" style="margin-right: 8px;"></i>
                                    Folio:
                                </label>
                                <p style="
                                    margin: 0;
                                    font-size: 1.1rem;
                                    font-weight: 500;
                                    color: #333;
                                ">
                                    ${ticket.Folio || 'Sin folio'}
                                </p>
                            </div>
                            <div style="
                                border-left: 4px solid ${colors.primary};
                                padding-left: 15px;
                                padding-top: 5px;
                                padding-bottom: 5px;
                            ">
                                <label style="
                                    color: ${colors.primary};
                                    font-weight: 600;
                                    font-size: 0.9rem;
                                    margin-bottom: 5px;
                                    display: flex;
                                    align-items: center;
                                ">
                                    <i class="bi bi-flag" style="margin-right: 8px;"></i>
                                    Estado:
                                </label>
                                <span class="badge ${
                                    ticket.Status === 'Abierto' ? 'bg-primary' :
                                    ticket.Status === 'En espera' ? 'bg-warning' :
                                    ticket.Status === 'En Progreso' || ticket.Status === 'En proceso' ? 'bg-info' :
                                    ticket.Status === 'Retenido' ? 'bg-danger' :
                                    ticket.Status === 'Cerrado' || ticket.Status === 'Resuelto' ? 'bg-success' : 'bg-secondary'
                                }" style="font-size: 0.9rem; padding: 8px 12px;">
                                    ${ticket.Status || 'Sin estado'}
                                </span>
                            </div>
                            <div style="
                                border-left: 4px solid ${colors.primary};
                                padding-left: 15px;
                                padding-top: 5px;
                                padding-bottom: 5px;
                            ">
                                <label style="
                                    color: ${colors.primary};
                                    font-weight: 600;
                                    font-size: 0.9rem;
                                    margin-bottom: 5px;
                                    display: flex;
                                    align-items: center;
                                ">
                                    <i class="bi bi-exclamation-triangle" style="margin-right: 8px;"></i>
                                    Prioridad:
                                </label>
                                <span class="badge ${
                                    ticket.Priority === 'Urgente' ? 'bg-danger' :
                                    ticket.Priority === 'Alta' ? 'bg-warning' :
                                    ticket.Priority === 'Media' ? 'bg-info' :
                                    ticket.Priority === 'Baja' ? 'bg-secondary' : 'bg-light text-dark'
                                }" style="font-size: 0.9rem; padding: 8px 12px;">
                                    ${ticket.Priority || 'Sin prioridad'}
                                </span>
                            </div>
                            <div style="
                                border-left: 4px solid ${colors.primary};
                                padding-left: 15px;
                                padding-top: 5px;
                                padding-bottom: 5px;
                            ">
                                <label style="
                                    color: ${colors.primary};
                                    font-weight: 600;
                                    font-size: 0.9rem;
                                    margin-bottom: 5px;
                                    display: flex;
                                    align-items: center;
                                ">
                                    <i class="bi bi-calendar3" style="margin-right: 8px;"></i>
                                    Fecha:
                                </label>
                                <p style="
                                    margin: 0;
                                    color: #333;
                                    font-weight: 500;
                                ">
                                    ${ticket.CreateDate ? new Date(ticket.CreateDate).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : 'Sin fecha'}
                                </p>
                            </div>
                        </div>
                        <div style="
                            border-left: 4px solid ${colors.primary};
                            padding-left: 15px;
                            padding-top: 5px;
                            padding-bottom: 5px;
                            margin-bottom: 1rem;
                        ">
                            <label style="
                                color: ${colors.primary};
                                font-weight: 600;
                                font-size: 0.9rem;
                                margin-bottom: 5px;
                                display: flex;
                                align-items: center;
                            ">
                                <i class="bi bi-card-text" style="margin-right: 8px;"></i>
                                Asunto:
                            </label>
                            <p style="
                                margin: 0;
                                color: #333;
                                font-weight: 500;
                            ">
                                ${ticket.Issue || 'Sin asunto'}
                            </p>
                        </div>
                        <div style="
                            border-left: 4px solid ${colors.primary};
                            padding-left: 15px;
                            padding-top: 5px;
                            padding-bottom: 5px;
                            margin-bottom: 1rem;
                        ">
                            <label style="
                                color: ${colors.primary};
                                font-weight: 600;
                                font-size: 0.9rem;
                                margin-bottom: 5px;
                                display: flex;
                                align-items: center;
                            ">
                                <i class="bi bi-file-text" style="margin-right: 8px;"></i>
                                Descripción:
                            </label>
                            <p style="
                                margin: 0;
                                color: #333;
                            ">
                                ${ticket.Description || 'Sin descripción'}
                            </p>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div style="
                                border-left: 4px solid ${colors.primary};
                                padding-left: 15px;
                                padding-top: 5px;
                                padding-bottom: 5px;
                            ">
                                <label style="
                                    color: ${colors.primary};
                                    font-weight: 600;
                                    font-size: 0.9rem;
                                    margin-bottom: 5px;
                                    display: flex;
                                    align-items: center;
                                ">
                                    <i class="bi bi-person" style="margin-right: 8px;"></i>
                                    Cliente:
                                </label>
                                <p style="
                                    margin: 0;
                                    color: #333;
                                    font-weight: 500;
                                ">
                                    ${ticket.Client && ticket.Client.Name && ticket.Client.LastName
                                        ? `${ticket.Client.Name.FirstName || ''} ${ticket.Client.Name.SecondName || ''} ${ticket.Client.LastName.FatherLastName || ''} ${ticket.Client.LastName.MotherLastName || ''}`.replace(/ +/g, ' ').trim() 
                                        : 'Sin cliente'}
                                </p>
                            </div>
                            <div style="
                                border-left: 4px solid ${colors.primary};
                                padding-left: 15px;
                                padding-top: 5px;
                                padding-bottom: 5px;
                            ">
                                <label style="
                                    color: ${colors.primary};
                                    font-weight: 600;
                                    font-size: 0.9rem;
                                    margin-bottom: 5px;
                                    display: flex;
                                    align-items: center;
                                ">
                                    <i class="bi bi-tools" style="margin-right: 8px;"></i>
                                    Técnico:
                                </label>
                                <p style="
                                    margin: 0;
                                    color: #333;
                                    font-weight: 500;
                                ">
                                    ${ticket.tecnico || 'Sin técnico'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            showClass: {
                popup: 'swal2-show'
            },
            hideClass: {
                popup: 'swal2-hide'
            },
            confirmButtonText: 'Cerrar',
            confirmButtonColor: colors.primary,
            width: 700,
            position: 'center',
            allowOutsideClick: true,
            customClass: {
                popup: 'swal2-border-radius',
                htmlContainer: 'swal2-html-custom'
            },
            didOpen: () => {
                const popup = Swal.getPopup();
                if (popup) {
                    popup.style.borderRadius = '15px';
                    popup.style.boxShadow = `0 15px 35px rgba(0,0,0,0.15)`;
                    popup.style.overflow = 'hidden';
                    popup.style.padding = '0';
                    popup.style.setProperty('position', 'fixed', 'important');
                    popup.style.setProperty('top', '50%', 'important');
                    popup.style.setProperty('left', '50%', 'important');
                    popup.style.setProperty('transform', 'translate(-50%, -50%)', 'important');
                    popup.style.setProperty('margin', '0', 'important');
                    popup.style.setProperty('margin-left', '0', 'important');
                    popup.style.setProperty('margin-right', '0', 'important');
                }
            }
        });
    };

    if (isLoading) return <div className="p-5 text-center">Cargando técnicos...</div>;

    return (
        <div className="container-fluid py-3">
            <h2 className="title-text mb-3">Técnicos</h2>
            <div className="row">
                <div className="col-md-4">
                    <div className="p-2 bg-white shadow-sm rounded">
                        <div className="input-group mb-3">
                            <span className="input-group-text"><i className="bi bi-search"></i></span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar técnico..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="list-group list-group-flush technician-list">
                            {filteredTechnicians.map(tech => (
                                <button
                                    key={tech._id}
                                    type="button"
                                    className={`list-group-item list-group-item-action ${selectedTechnician && selectedTechnician._id === tech._id ? 'active' : ''}`}
                                    onClick={() => handleSelectTechnician(tech)}
                                >
                                    {tech.nombre} {tech.apellidoP}<br />
                                    <small className={`text-${tech.activo ? 'success' : 'danger'}`}>{tech.activo ? 'Activo' : 'Inactivo'}</small>
                                </button>
                            ))}
                            {filteredTechnicians.length === 0 && <p className="text-center text-muted mt-3">No se encontraron técnicos.</p>}
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="p-3 bg-white shadow-sm rounded detail-panel" style={{ maxHeight: 'calc(100vh - 110px)', overflowY: 'auto' }}>
                        <div className="d-flex mb-3 nav-tabs-style">
                            <button className="nav-link active">Datos personales</button>
                            <button className="nav-link">Activos Asignados</button>
                            <button className="nav-link">Tickets Abiertos</button>
                        </div>
                        <h3><i className="bi bi-person-workspace me-2"></i> Detalles del Técnico</h3>
                        {selectedTechnician ? (
                            <div className="mt-3 tech-details">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h4 className="mb-0">{selectedTechnician.nombre} {selectedTechnician.apellidoP} {selectedTechnician.apellidoA}</h4>
                                    <button
                                        className={`btn btn-sm ${selectedTechnician.activo ? 'btn-success' : 'btn-danger'}`}
                                        onClick={handleToggleStatus}
                                        title={selectedTechnician.activo ? 'Marcar como inactivo' : 'Marcar como activo'}
                                    >
                                        <i className={`bi ${selectedTechnician.activo ? 'bi-toggle-on' : 'bi-toggle-off'} me-1`}></i>
                                        {selectedTechnician.activo ? 'Activo' : 'Inactivo'}
                                    </button>
                                </div>
                                <div className="info-row">
                                    <div className="icon-badge"><i className="bi bi-person"></i></div>
                                    <div className="label">Nombre:</div>
                                    <div className="value">{selectedTechnician.nombre} {selectedTechnician.apellidoP} {selectedTechnician.apellidoA}</div>
                                </div>
                                <div className="info-row">
                                    <div className="icon-badge"><i className="bi bi-telephone"></i></div>
                                    <div className="label">Teléfono:</div>
                                    <div className="value">{selectedTechnician.telefono ? selectedTechnician.telefono : <span className="muted">Sin teléfono registrado</span>}</div>
                                </div>
                                <div className="info-row">
                                    <div className="icon-badge"><i className="bi bi-envelope"></i></div>
                                    <div className="label">Correo:</div>
                                    <div className="value">{selectedTechnician.email ? selectedTechnician.email : <span className="muted">Sin correo registrado</span>}</div>
                                </div>
                                <div className="info-row">
                                    <div className="icon-badge"><i className="bi bi-geo-alt"></i></div>
                                    <div className="label">Zona:</div>
                                    <div className="value"><span className="pill">{selectedTechnician.zona ? selectedTechnician.zona : '—'}</span></div>
                                </div>
                                <div className="info-row">
                                    <div className="icon-badge"><i className="bi bi-globe"></i></div>
                                    <div className="label">Mercado:</div>
                                    <div className="value">{selectedTechnician.mercado ? selectedTechnician.mercado : '—'}</div>
                                </div>
                                <div className="info-row" style={{ cursor: technicianTickets.length > 0 ? 'pointer' : 'default' }} onClick={openTicketsModal}>
                                    <div className="icon-badge" style={{ background: '#e7f1ff', color: '#0d6efd' }}><i className="bi bi-ticket-detailed"></i></div>
                                    <div className="label">Tickets asignados:</div>
                                    <div className="value">{loadingTickets ? '...' : technicianTickets.length}</div>
                                </div>
                                {/* La lista inline se ha reemplazado por un modal */}
                            </div>
                        ) : <p className="mt-4 text-muted">Seleccione un técnico de la lista izquierda para ver sus detalles.</p>}
                    </div>
                </div>
            </div>
            {ticketsModalOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1040, background: 'rgba(0,0,0,0.3)' }} onClick={(e) => e.target === e.currentTarget && closeTicketsModal()}>
                    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: 0, minWidth: 360, maxWidth: '90vw', width: 'min(720px, 90vw)', maxHeight: '60vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 8 }}>
                        <div style={{ padding: '12px 16px', background: 'linear-gradient(180deg, #2cb5a5 0%, #2a7b6f 100%)', color: '#fff', fontWeight: 700, fontSize: 18 }}>
                            <span>Tickets</span>
                        </div>
                        <div style={{ padding: 12, flex: 1, overflowY: 'auto' }}>
                            {technicianTickets.length === 0 ? (
                                <div>No hay tickets asignados.</div>
                            ) : (
                                (showAllTickets ? technicianTickets : technicianTickets.slice(0, 3)).map((ticket, idx) => (
                                    <div 
                                        key={ticket._id} 
                                        onClick={() => handleTicketClick(ticket)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#TicketModal"
                                        style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        background: '#f8f9fa',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 8,
                                        padding: '10px 14px',
                                        marginBottom: 10,
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                        cursor: 'pointer'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <i className="bi bi-ticket-detailed" style={{ color: '#1976d2', fontSize: 18, marginRight: 4 }}></i>
                                                <span style={{ fontWeight: 'bold', fontSize: 16 }}>{ticket.Folio}</span>
                                            </div>
                                            <span style={{ background: '#757d85', color: '#fff', borderRadius: 6, padding: '2px 12px', fontWeight: 600, fontSize: 15 }}>{ticket.Status}</span>
                                        </div>
                                        <div style={{ color: '#222', fontSize: 15, marginTop: 4 }}>{ticket.Issue}</div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: 12, borderTop: '1px solid #eaeaea' }}>
                            {technicianTickets.length > 3 && (
                                <button onClick={() => setShowAllTickets(!showAllTickets)} style={{ background: 'white', border: '1px solid #ccc', padding: '6px 12px', cursor: 'pointer' }}>
                                    {showAllTickets ? 'Mostrar menos' : `Mostrar todos (${technicianTickets.length})`}
                                </button>
                            )}
                            <button onClick={closeTicketsModal} style={{ background: 'white', border: '1px solid #ccc', padding: '6px 12px', cursor: 'pointer' }}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal de información del ticket removido, ahora se usa SweetAlert2 */}
        </div>
    );
}