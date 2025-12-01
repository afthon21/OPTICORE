import ApiRequest from '../hooks/apiRequest.jsx';
import Swal from 'sweetalert2';
import {useState, useEffect} from 'react';

function TicketInfo({ ticket: ticketProp, onStatusChange }) {
    const [ticket, setTicket] = useState(ticketProp);

    useEffect(() => {
        setTicket(ticketProp);
    }, [ticketProp]);

    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);

    const states = [
        { id: '0', name: 'Abierto' },
        { id: '1', name: 'En espera' },
        { id: '2', name: 'En Progreso' },
        { id: '3', name: 'Retenido' },
        { id: '4', name: 'Cerrado' }
    ];

    const handleChange = async (value) => {
        const data = { Status: value };

        // Error al cambiar un ticket cerrado
        if (ticket.Status === states[4].name) {
            Swal.fire({
                icon: 'error',
                title: 'Error al cambiar!',
                text: 'El ticket ha sido cerrado, no es posible cambiar su estado.',
                toast: true,
                position: 'top',
                timer: 1200,
                timerProgressBar: true,
                showConfirmButton: false,
                customClass: {
                    container: 'swal2-top-center'
                }
            });
            return;
        }

        // Error al colocar el mismo estado
        if (value === ticket.Status) {
            Swal.fire({
                icon: 'warning',
                title: 'Estado actual',
                text: 'El ticket ya tiene este estado asignado.',
                toast: true,
                position: 'top',
                iconColor: '#ff9800',
                timer: 1400,
                timerProgressBar: true,
                showConfirmButton: false,
                customClass: {
                    container: 'swal2-top-center'
                }
            });
            return;
        }

        // Cambiar el estado
        const confirm = await Swal.fire({
            icon: 'warning',
            iconColor: '#002b5b',
            title: '¿Está seguro de cambiar el estado?',
            text: `Nuevo estado: ${data.Status}`,
            toast: true,
            position: 'top',
            width: '400px',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#2a9d8f',
            cancelButtonColor: '#404040',
            background: '#ffffff',
            backdrop: false,
            timer: 0,
            customClass: {
                container: 'swal2-top-center',
                popup: 'swal2-no-backdrop'
            }
        });

        if (confirm.isConfirmed) {
            try {
                const response = await makeRequest(`/ticket/edit/${ticket._id}`, 'PUT', data);

                if (response && !error) {
                    // Actualizar el ticket local con el estado nuevo
                    const updatedTicket = { ...ticket, Status: value };
                    setTicket(updatedTicket);
                    
                    // Notificar al componente padre del cambio
                    if (onStatusChange) {
                        onStatusChange(updatedTicket);
                    }

                    Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'Estado actualizado correctamente',
                        toast: true,
                        position: 'top',
                        timer: 1500,
                        timerProgressBar: true,
                        showConfirmButton: false,
                        customClass: {
                            container: 'swal2-top-center'
                        }
                    });
                } else {
                    // Mostrar error específico del servidor o error genérico
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al actualizar',
                        text: error || 'No se pudo actualizar el estado del ticket',
                        toast: true,
                        position: 'top',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                        customClass: {
                            container: 'swal2-top-center'
                        }
                    });
                }

            } catch (err) {
                console.error('Error al cambiar estado del ticket:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor',
                    toast: true,
                    position: 'top',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    customClass: {
                        container: 'swal2-top-center'
                    }
                });
            }
        }
    }
    
    return (
        <div className="modal fade" id="TicketModal" tabIndex="-1" aria-labelledby="ModalLabel" aria-hidden="true" style={{ zIndex: 2060 }}>
            <div
                className="modal-dialog"
                style={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '1200px',
                    maxWidth: '95vw',
                    margin: 0,
                    padding: 0,
                }}
            >
                <div className="modal-content" style={{
                    borderRadius: '15px',
                    border: 'none',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
                    overflow: 'hidden',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}>
                    {/* Header estilo cliente - Verde/Turquesa */}
                    <div className="modal-header" style={{
                        background: 'linear-gradient(135deg, #26a69a 0%, #4db6ac 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '1.5rem 2rem',
                        position: 'relative'
                    }}>
                        <div className="d-flex align-items-center w-100">
                            <div style={{
                                width: '45px',
                                height: '45px',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '15px'
                            }}>
                                <i className="bi bi-ticket-detailed-fill" style={{ fontSize: '22px' }}></i>
                            </div>
                            <h5 className="modal-title mb-0" style={{ 
                                fontWeight: '600',
                                fontSize: '1.4rem'
                            }}>
                                Información del Ticket
                            </h5>
                        </div>
                        
                        <button 
                            type="button" 
                            className="btn-close btn-close-white"
                            data-bs-dismiss="modal" 
                            aria-label="Close"
                            style={{
                                position: 'absolute',
                                right: '1.5rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '1.2rem'
                            }}>
                        </button>
                    </div>

                    {/* Body estilo cliente - SIN imagen */}
                    <div className="modal-body" style={{ padding: '2rem' }}>
                        {/* Información principal */}
                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
                                <div style={{
                                    borderLeft: '4px solid #26a69a',
                                    paddingLeft: '15px',
                                    paddingTop: '5px',
                                    paddingBottom: '5px'
                                }}>
                                    <label style={{ 
                                        color: '#26a69a', 
                                        fontWeight: '600', 
                                        fontSize: '0.9rem',
                                        marginBottom: '5px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <i className="bi bi-hash me-2"></i>
                                        Folio:
                                    </label>
                                    <p style={{ 
                                        margin: '0', 
                                        fontSize: '1.1rem',
                                        fontWeight: '500',
                                        color: '#333'
                                    }}>
                                        {ticket?.Folio || 'Sin folio'}
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div style={{
                                    borderLeft: '4px solid #26a69a',
                                    paddingLeft: '15px',
                                    paddingTop: '5px',
                                    paddingBottom: '5px'
                                }}>
                                    <label style={{ 
                                        color: '#26a69a', 
                                        fontWeight: '600', 
                                        fontSize: '0.9rem',
                                        marginBottom: '5px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <i className="bi bi-flag me-2"></i>
                                        Estado:
                                    </label>
                                    <span className={`badge ${
                                        ticket?.Status === 'Abierto' ? 'bg-primary' :
                                        ticket?.Status === 'En espera' ? 'bg-warning' :
                                        ticket?.Status === 'En Progreso' ? 'bg-info' :
                                        ticket?.Status === 'Retenido' ? 'bg-danger' :
                                        ticket?.Status === 'Cerrado' ? 'bg-success' : 'bg-secondary'
                                    }`} style={{ fontSize: '0.9rem', padding: '8px 12px' }}>
                                        {ticket?.Status || 'Sin estado'}
                                    </span>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div style={{
                                    borderLeft: '4px solid #26a69a',
                                    paddingLeft: '15px',
                                    paddingTop: '5px',
                                    paddingBottom: '5px'
                                }}>
                                    <label style={{ 
                                        color: '#26a69a', 
                                        fontWeight: '600', 
                                        fontSize: '0.9rem',
                                        marginBottom: '5px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        Prioridad:
                                    </label>
                                    <span className={`badge ${
                                        ticket?.Priority === 'Urgente' ? 'bg-danger' :
                                        ticket?.Priority === 'Alta' ? 'bg-warning' :
                                        ticket?.Priority === 'Media' ? 'bg-info' :
                                        ticket?.Priority === 'Baja' ? 'bg-secondary' : 'bg-light text-dark'
                                    }`} style={{ fontSize: '0.9rem', padding: '8px 12px' }}>
                                        {ticket?.Priority || 'Sin prioridad'}
                                    </span>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div style={{
                                    borderLeft: '4px solid #26a69a',
                                    paddingLeft: '15px',
                                    paddingTop: '5px',
                                    paddingBottom: '5px'
                                }}>
                                    <label style={{ 
                                        color: '#26a69a', 
                                        fontWeight: '600', 
                                        fontSize: '0.9rem',
                                        marginBottom: '5px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <i className="bi bi-calendar3 me-2"></i>
                                        Fecha:
                                    </label>
                                    <p style={{ 
                                        margin: '0', 
                                        color: '#333',
                                        fontWeight: '500'
                                    }}>
                                        {ticket?.CreateDate ? new Date(ticket.CreateDate).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'Sin fecha'}
                                    </p>
                                </div>
                            </div>

                            <div className="col-12">
                                <div style={{
                                    borderLeft: '4px solid #26a69a',
                                    paddingLeft: '15px',
                                    paddingTop: '5px',
                                    paddingBottom: '5px'
                                }}>
                                    <label style={{ 
                                        color: '#26a69a', 
                                        fontWeight: '600', 
                                        fontSize: '0.9rem',
                                        marginBottom: '5px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <i className="bi bi-person me-2"></i>
                                        Cliente:
                                    </label>
                                    <p style={{ 
                                        margin: '0', 
                                        fontSize: '1.1rem',
                                        fontWeight: '500',
                                        color: '#333'
                                    }}>
                                        {ticket?.Client ? 
                                            `${ticket.Client.Name?.FirstName || ''} ${ticket.Client.Name?.SecondName || ''} ${ticket.Client.LastName?.FatherLastName || ''} ${ticket.Client.LastName?.MotherLastName || ''}`.trim()
                                            : 'Sin cliente asignado'
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div style={{
                                    borderLeft: '4px solid #26a69a',
                                    paddingLeft: '15px',
                                    paddingTop: '5px',
                                    paddingBottom: '5px'
                                }}>
                                    <label style={{ 
                                        color: '#26a69a', 
                                        fontWeight: '600', 
                                        fontSize: '0.9rem',
                                        marginBottom: '5px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <i className="bi bi-tools me-2"></i>
                                        Técnico:
                                    </label>
                                    <p style={{ 
                                        margin: '0', 
                                        color: '#333',
                                        fontWeight: '500'
                                    }}>
                                        {ticket?.tecnico || 'Sin técnico asignado'}
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div style={{
                                    borderLeft: '4px solid #26a69a',
                                    paddingLeft: '15px',
                                    paddingTop: '5px',
                                    paddingBottom: '5px'
                                }}>
                                    <label style={{ 
                                        color: '#26a69a', 
                                        fontWeight: '600', 
                                        fontSize: '0.9rem',
                                        marginBottom: '5px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <i className="bi bi-person-badge me-2"></i>
                                        Administrador:
                                    </label>
                                    <p style={{ 
                                        margin: '0', 
                                        color: '#333',
                                        fontWeight: '500'
                                    }}>
                                        {ticket?.Admin?.UserName || 'Sin administrador'}
                                    </p>
                                </div>
                            </div>

                            <div className="col-12">
                                <div style={{
                                    borderLeft: '4px solid #26a69a',
                                    paddingLeft: '15px',
                                    paddingTop: '5px',
                                    paddingBottom: '5px'
                                }}>
                                    <label style={{ 
                                        color: '#26a69a', 
                                        fontWeight: '600', 
                                        fontSize: '0.9rem',
                                        marginBottom: '5px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <i className="bi bi-chat-left-text me-2"></i>
                                        Asunto:
                                    </label>
                                    <p style={{ 
                                        margin: '0', 
                                        fontSize: '1.1rem',
                                        fontWeight: '500',
                                        color: '#333'
                                    }}>
                                        {ticket?.Issue || 'Sin asunto'}
                                    </p>
                                </div>
                            </div>

                            <div className="col-12">
                                <div style={{
                                    borderLeft: '4px solid #26a69a',
                                    paddingLeft: '15px',
                                    paddingTop: '5px',
                                    paddingBottom: '5px'
                                }}>
                                    <label style={{ 
                                        color: '#26a69a', 
                                        fontWeight: '600', 
                                        fontSize: '0.9rem',
                                        marginBottom: '5px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <i className="bi bi-card-text me-2"></i>
                                        Descripción:
                                    </label>
                                    <div style={{
                                        backgroundColor: '#f8f9fa',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #e9ecef',
                                        minHeight: '80px',
                                        maxHeight: '150px',
                                        overflowY: 'auto'
                                    }}>
                                        <p style={{ 
                                            margin: '0', 
                                            whiteSpace: 'pre-wrap',
                                            color: '#333',
                                            lineHeight: '1.5'
                                        }}>
                                            {ticket?.Description || 'Sin descripción'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="d-flex justify-content-center gap-2 mb-3">
                            <div className="dropdown">
                                <button 
                                    className="btn"
                                    style={{
                                        backgroundColor: '#ff9800',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '8px 16px',
                                        fontWeight: '500'
                                    }}
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    <i className="bi bi-pause-circle me-2"></i>
                                    Retener
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <button className="dropdown-item"
                                            value={states[3].name}
                                            onClick={(e) => handleChange(e.target.value)}>
                                            <i className="bi bi-pause-circle me-2"></i>
                                            Retener ticket
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div className="dropdown">
                                <button 
                                    className="btn"
                                    style={{
                                        backgroundColor: '#2196f3',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '8px 16px',
                                        fontWeight: '500'
                                    }}
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    <i className="bi bi-arrow-repeat me-2"></i>
                                    Cambiar Estado
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <button className="dropdown-item"
                                            value={states[1].name}
                                            onClick={(e) => handleChange(e.target.value)}>
                                            <i className="bi bi-clock me-2"></i>
                                            En espera
                                        </button>
                                    </li>
                                    <li>
                                        <button className="dropdown-item"
                                            value={states[2].name}
                                            onClick={(e) => handleChange(e.target.value)}>
                                            <i className="bi bi-gear me-2"></i>
                                            En progreso
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div className="dropdown">
                                <button 
                                    className="btn"
                                    style={{
                                        backgroundColor: '#4caf50',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '8px 16px',
                                        fontWeight: '500'
                                    }}
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    <i className="bi bi-check-circle me-2"></i>
                                    Cerrar
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <button className="dropdown-item"
                                            value={states[4].name}
                                            onClick={(e) => handleChange(e.target.value)}>
                                            <i className="bi bi-check-circle me-2"></i>
                                            Cerrar ticket
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Footer estilo cliente */}
                    <div className="modal-footer" style={{
                        backgroundColor: '#f8f9fa',
                        borderTop: '1px solid #dee2e6',
                        padding: '1rem 2rem',
                        justifyContent: 'center'
                    }}>
                        <button 
                            type="button" 
                            className="btn"
                            data-bs-dismiss="modal"
                            style={{
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '10px 25px',
                                fontWeight: '500'
                            }}>
                            <i className="bi bi-x-circle me-2"></i>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TicketInfo;

// Añadir estilos CSS para posicionar las alertas
const style = document.createElement('style');
style.textContent = `
    .swal2-top-center {
        top: 20px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        z-index: 10000 !important;
    }
    
    .swal2-container.swal2-top {
        align-items: flex-start !important;
        padding-top: 20px !important;
    }
    
    .swal2-no-backdrop {
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
        border: 1px solid #e0e0e0 !important;
        border-radius: 12px !important;
    }
    
    .swal2-container.swal2-backdrop-show .swal2-no-backdrop {
        backdrop-filter: none !important;
    }
`;

if (!document.head.querySelector('style[data-ticket-info]')) {
    style.setAttribute('data-ticket-info', 'true');
    document.head.appendChild(style);
}