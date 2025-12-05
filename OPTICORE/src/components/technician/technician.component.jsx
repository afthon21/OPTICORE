import { useState, useEffect } from 'react';
import ApiRequest from "../hooks/apiRequest";
import TechnicianTicketInfo from './TechnicianTicketInfo';
import './technician.css';

export function ViewTechnicians() {
    const [allTechnicians, setAllTechnicians] = useState([]);
    const [selectedTechnician, setSelectedTechnician] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [technicianTickets, setTechnicianTickets] = useState([]);
    const [loadingTickets, setLoadingTickets] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [ticketsModalOpen, setTicketsModalOpen] = useState(false);

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
        setSelectedTicket(null);
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

    const handleTicketSelect = (ticket) => {
        setSelectedTicket(ticket);
    };

    const openTicketsModal = () => {
        if (technicianTickets.length === 0) return;
        setTicketsModalOpen(true);
    };

    const closeTicketsModal = () => {
        setTicketsModalOpen(false);
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
                            </div>
                        ) : <p className="mt-4 text-muted">Seleccione un técnico de la lista izquierda para ver sus detalles.</p>}
                    </div>
                </div>
            </div>
            
            {/* Modal centrado con lista de tickets */}
            {ticketsModalOpen && (
                <div style={{ 
                    position: 'fixed', 
                    inset: 0, 
                    zIndex: 1040, 
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} onClick={(e) => e.target === e.currentTarget && closeTicketsModal()}>
                    <div style={{ 
                        background: 'white', 
                        padding: 0, 
                        minWidth: 360, 
                        maxWidth: '90vw', 
                        width: 'min(720px, 90vw)', 
                        maxHeight: '70vh', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        overflow: 'hidden', 
                        borderRadius: 12,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ 
                            padding: '16px 20px', 
                            background: 'linear-gradient(135deg, #26a69a 0%, #4db6ac 100%)', 
                            color: '#fff', 
                            fontWeight: 700, 
                            fontSize: 18,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <i className="bi bi-ticket-detailed-fill" style={{ fontSize: 20 }}></i>
                                <span>Tickets Asignados</span>
                            </div>
                            <button 
                                onClick={closeTicketsModal}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: 32,
                                    height: 32,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: 'white',
                                    fontSize: 18,
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div style={{ padding: 16, flex: 1, overflowY: 'auto' }}>
                            {technicianTickets.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6c757d' }}>
                                    <i className="bi bi-inbox" style={{ fontSize: 48, marginBottom: 10 }}></i>
                                    <p>No hay tickets asignados.</p>
                                </div>
                            ) : (
                                technicianTickets.map((ticket) => (
                                    <div 
                                        key={ticket._id} 
                                        onClick={() => handleTicketSelect(ticket)}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            background: '#f8f9fa',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: 8,
                                            padding: '12px 16px',
                                            marginBottom: 12,
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#e9ecef';
                                            e.currentTarget.style.boxShadow = '0 3px 8px rgba(0,0,0,0.1)';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#f8f9fa';
                                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <i className="bi bi-ticket-detailed" style={{ color: '#26a69a', fontSize: 20 }}></i>
                                                <span style={{ fontWeight: 'bold', fontSize: 16, color: '#002b5b' }}>{ticket.Folio}</span>
                                            </div>
                                            <span className={`badge ${
                                                ticket.Status === 'Abierto' ? 'bg-primary' :
                                                ticket.Status === 'En espera' ? 'bg-warning' :
                                                ticket.Status === 'En Progreso' ? 'bg-info' :
                                                ticket.Status === 'Retenido' ? 'bg-danger' :
                                                ticket.Status === 'Cerrado' ? 'bg-success' : 'bg-secondary'
                                            }`} style={{ fontSize: 13, padding: '4px 10px' }}>
                                                {ticket.Status}
                                            </span>
                                        </div>
                                        <div style={{ color: '#495057', fontSize: 14, marginBottom: 4 }}>
                                            <strong>Asunto:</strong> {ticket.Issue}
                                        </div>
                                        <div style={{ color: '#6c757d', fontSize: 13 }}>
                                            <i className="bi bi-calendar3 me-1"></i>
                                            {ticket.CreateDate ? new Date(ticket.CreateDate).toLocaleDateString('es-ES') : 'Sin fecha'}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            {/* Panel lateral de información del ticket */}
            {selectedTicket && (
                <TechnicianTicketInfo
                    ticket={selectedTicket}
                    onStatusChange={(updatedTicket) => {
                        // Actualizar la lista de tickets con el ticket modificado
                        setTechnicianTickets(prev =>
                            prev.map(t => t._id === updatedTicket._id ? updatedTicket : t)
                        );
                        // Actualizar también el ticket seleccionado
                        setSelectedTicket(updatedTicket);
                    }}
                    onClose={() => setSelectedTicket(null)}
                />
            )}
            {/* Modal de información del ticket removido, ahora se usa SweetAlert2 */}
        </div>
    );
}