import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
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
    // Estados para modal de edición
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState(null);

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

    // Zonas disponibles por mercado
    const zonesByMercado = {
        'Estado de México': [
            'Zona de los Volcanes',
            'Zona Metropolitana del Valle de México',
            'Zona Norte',
            'Zona Oriente',
            'Zona Sur',
            'Zona de Tierra Caliente',
            'Zona de las Sierras'
        ],
        'Puebla': [
            'Centro',
            'Angelópolis',
            'Mixteca',
            'Sierra Norte',
            'Sierra Nororiental',
            'Sierra Negra',
            'Valle de Tehuacán',
            'Valle de Serdán',
            'Valle de Atlixco y Matamoros',
            'Mixteca Baja'
        ]
    };

    // Funciones para el modal de edición
    const handleOpenEditModal = () => {
        if (!selectedTechnician) return;
        setEditFormData({
            nombre: selectedTechnician.nombre || '',
            apellidoP: selectedTechnician.apellidoP || '',
            apellidoA: selectedTechnician.apellidoA || '',
            email: selectedTechnician.email || '',
            telefono: selectedTechnician.telefono || '',
            mercado: selectedTechnician.mercado || 'Estado de México',
            zona: selectedTechnician.zona || '',
            activo: selectedTechnician.activo
        });
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setEditFormData(null);
    };

    const handleEditFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFormData(prev => {
            const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
            if (name === 'mercado') {
                next.zona = '';
            }
            return next;
        });
    };

    const handleSaveEdit = async () => {
        if (!selectedTechnician || !editFormData) return;
        
        try {
            const response = await makeRequest(`/tecnicos/edit/${selectedTechnician._id}`, 'POST', editFormData);
            
            // Actualizar la lista de técnicos
            const updatedTech = { ...selectedTechnician, ...editFormData };
            setAllTechnicians(allTechnicians.map(tech => 
                tech._id === selectedTechnician._id ? updatedTech : tech
            ));
            setSelectedTechnician(updatedTech);
            
            // Si el nombre cambió, recargar los tickets del técnico actualizado
            const oldFullName = `${selectedTechnician.nombre} ${selectedTechnician.apellidoP} ${selectedTechnician.apellidoA}`.trim();
            const newFullName = `${editFormData.nombre} ${editFormData.apellidoP} ${editFormData.apellidoA}`.trim();
            
            if (oldFullName !== newFullName) {
                // Recargar tickets con el nombre actualizado
                fetchTechnicianTickets(newFullName);
            }
            
            handleCloseEditModal();
            
            // Mostrar mensaje con información de tickets actualizados
            const ticketsUpdated = response?.ticketsUpdated || 0;
            const message = ticketsUpdated > 0 
                ? `Técnico actualizado correctamente.\n${ticketsUpdated} ticket(s) actualizado(s) en cascada.`
                : 'Técnico actualizado correctamente';
            
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: message,
                toast: true,
                position: 'top',
                timer: ticketsUpdated > 0 ? 3500 : 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error al editar técnico:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el técnico',
                toast: true,
                position: 'top',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        }
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
                                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedTechnician && selectedTechnician._id === tech._id ? 'tech-selected' : ''}`}
                                    onClick={() => handleSelectTechnician(tech)}
                                >
                                    <div>
                                        {tech.nombre} {tech.apellidoP}<br />
                                        <small className={`text-${tech.activo ? 'success' : 'danger'}`}>{tech.activo ? 'Activo' : 'Inactivo'}</small>
                                    </div>
                                    {selectedTechnician && selectedTechnician._id === tech._id && (
                                        <button
                                            className="btn btn-sm btn-light"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenEditModal();
                                            }}
                                            title="Editar técnico"
                                            style={{ marginLeft: '10px' }}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                    )}
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
            
            {/* Modal de Edición de Técnico */}
            {editModalOpen && editFormData && (
                <div style={{ 
                    position: 'fixed', 
                    inset: 0, 
                    zIndex: 1050, 
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} onClick={(e) => e.target === e.currentTarget && handleCloseEditModal()}>
                    <div style={{ 
                        background: 'white', 
                        padding: 0, 
                        minWidth: 600, 
                        maxWidth: '90vw', 
                        maxHeight: '85vh', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        overflow: 'hidden', 
                        borderRadius: 12,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                    }}>
                        {/* Header del modal */}
                        <div style={{ 
                            background: 'linear-gradient(135deg, #26a69a 0%, #4db6ac 100%)', 
                            color: 'white', 
                            padding: '20px 24px', 
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <i className="bi bi-pencil-square" style={{ fontSize: 24 }}></i>
                                <h5 style={{ margin: 0, fontWeight: 600, fontSize: '1.3rem' }}>
                                    Editar Técnico
                                </h5>
                            </div>
                            <button 
                                onClick={handleCloseEditModal}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: 36,
                                    height: 36,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: 'white',
                                    fontSize: 20,
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        
                        {/* Contenido del modal */}
                        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Nombre *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        name="nombre"
                                        value={editFormData.nombre}
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Apellido Paterno *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        name="apellidoP"
                                        value={editFormData.apellidoP}
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Apellido Materno *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        name="apellidoA"
                                        value={editFormData.apellidoA}
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Teléfono</label>
                                    <input 
                                        type="tel" 
                                        className="form-control" 
                                        name="telefono"
                                        value={editFormData.telefono}
                                        onChange={handleEditFormChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Correo Electrónico *</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        name="email"
                                        value={editFormData.email}
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Mercado *</label>
                                    <select 
                                        className="form-select" 
                                        name="mercado"
                                        value={editFormData.mercado}
                                        onChange={handleEditFormChange}
                                        required
                                    >
                                        <option value="Estado de México">Estado de México</option>
                                        <option value="Puebla">Puebla</option>
                                    </select>
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label fw-bold">Zona *</label>
                                    <select 
                                        className="form-select" 
                                        name="zona"
                                        value={editFormData.zona}
                                        onChange={handleEditFormChange}
                                        required
                                    >
                                        <option value="">Seleccione una zona</option>
                                        {(zonesByMercado[editFormData.mercado] || []).map((z) => (
                                            <option key={z} value={z}>{z}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-check form-switch">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            role="switch" 
                                            id="activoSwitchEdit"
                                            name="activo"
                                            checked={editFormData.activo}
                                            onChange={handleEditFormChange}
                                        />
                                        <label className="form-check-label fw-bold" htmlFor="activoSwitchEdit">
                                            Técnico Activo
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Footer del modal */}
                        <div style={{ 
                            padding: '16px 24px', 
                            borderTop: '1px solid #dee2e6',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 12,
                            background: '#f8f9fa'
                        }}>
                            <button 
                                className="btn btn-secondary"
                                onClick={handleCloseEditModal}
                            >
                                <i className="bi bi-x-circle me-2"></i>
                                Cancelar
                            </button>
                            <button 
                                className="btn btn-success"
                                onClick={handleSaveEdit}
                            >
                                <i className="bi bi-check-lg me-2"></i>
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}