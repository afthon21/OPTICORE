import ApiRequest from '../../hooks/apiRequest';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';

function TicketInfo({ ticket, showModal, onClose, onTicketUpdate }) {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [currentTicket, setCurrentTicket] = useState(ticket);

    const states = [
        { id: '0', name: 'Abierto' },
        { id: '1', name: 'En espera' },
        { id: '2', name: 'En Progreso' },
        { id: '3', name: 'Retenido' },
        { id: '4', name: 'Cerrado' }
    ];

    // Actualizar el estado local cuando cambie el ticket prop
    useEffect(() => {
        setCurrentTicket(ticket);
    }, [ticket]);

    // Función para cerrar el modal
    const closeModal = () => {
        if (onClose) {
            onClose();
        }
    };

    // Agregar listener para cerrar con Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && showModal) {
                closeModal();
            }
        };

        if (showModal) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [showModal]);

    const handleChange = async (value) => {
        const data = { Status: value };

        // Error al cambiar un ticket cerrado
        if (currentTicket.Status === states[4].name) {
            Swal.fire({
                icon: 'error',
                title: 'Error al cambiar!',
                text: 'El ticket a sido cerrado no es posible cambiar su estado.',
                toast: true,
                position: 'top',
                timer: 1200,
                timerProgressBar: true,
                showConfirmButton: false
            });
            return;
        }

        // Error al colocar el mismo estado
        if (value === currentTicket.Status) {
            Swal.fire({
                icon: 'error',
                title: 'Error al cambiar!',
                text: 'Seleccione un estado diferente al actual.',
                toast: true,
                position: 'top',
                timer: 1200,
                timerProgressBar: true,
                showConfirmButton: false
            });
            return;
        }

        // Cambiar el estado
        if (value !== currentTicket.Status) {
            const confirm = await Swal.fire({
                icon: 'warning',
                iconColor: '#002b5b',
                title: '¿Esta seguro de cambiar el estado a?',
                text: data.Status,
                toast: true,
                position: 'top',
                width: '30rem',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#2a9d8f',
                cancelButtonColor: '#404040'
            });

            if (confirm.isConfirmed) {
                try {
                    const response = await makeRequest(`/ticket/edit/${currentTicket._id}`, 'PUT', data);

                    if (response) {
                        // Actualizar el estado local inmediatamente
                        const updatedTicket = { ...currentTicket, Status: value };
                        setCurrentTicket(updatedTicket);

                        // Notificar al componente padre sobre el cambio si la función existe
                        if (onTicketUpdate) {
                            onTicketUpdate(updatedTicket);
                        }

                        Swal.fire({
                            icon: 'success',
                            title: 'Exito!',
                            text: 'Estado actualizado',
                            timer: 1200,
                            timerProgressBar: true,
                            showConfirmButton: false
                        });
                    }

                    if (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: error,
                            toast: true,
                            position: 'top',
                            width: '30rem'
                        });
                    }

                } catch (error) {
                    console.log(error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Ocurrió un error al actualizar el estado',
                        toast: true,
                        position: 'top',
                        width: '30rem'
                    });
                }
            }
        }
    }

    // No renderizar si el modal no debe mostrarse
    if (!showModal) return null;

    return (
        <div 
            className={`modal fade ${showModal ? 'show' : ''}`}
            id="TicketClientModal" 
            tabIndex="-1" 
            aria-labelledby="ModalLabel" 
            aria-hidden={!showModal}
            style={{ 
                display: showModal ? 'block' : 'none',
                backgroundColor: showModal ? 'rgba(0,0,0,0.5)' : 'transparent'
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    closeModal();
                }
            }}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    {!currentTicket ? (
                        // Modal vacío cuando no hay ticket seleccionado
                        <>
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="bi bi-info-circle me-2"></i>
                                    Información del Ticket
                                </h5>
                                <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                            </div>
                            <div className="modal-body text-center py-5">
                                <i className="bi bi-clipboard-x" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                                <h6 className="mt-3 text-muted">No hay ticket seleccionado</h6>
                                <p className="text-muted mb-0">Haz clic en un ticket de la tabla para ver su información</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    <i className="bi bi-x-circle me-2"></i>
                                    Cerrar
                                </button>
                            </div>
                        </>
                    ) : (
                        // Modal con información del ticket
                        <>
                            {/* Header estilo cliente - Verde/Turquesa igual al modal principal */}
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
                            </div>

                            {/* Body estilo cliente - SIN imagen, igual al modal principal */}
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
                                                {currentTicket?.Folio || 'Sin folio'}
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
                                                currentTicket?.Status === 'Abierto' ? 'bg-primary' :
                                                currentTicket?.Status === 'En espera' ? 'bg-warning' :
                                                currentTicket?.Status === 'En Progreso' ? 'bg-info' :
                                                currentTicket?.Status === 'Retenido' ? 'bg-danger' :
                                                currentTicket?.Status === 'Cerrado' ? 'bg-success' : 'bg-secondary'
                                            }`} style={{ fontSize: '0.9rem', padding: '8px 12px' }}>
                                                {currentTicket?.Status || 'Sin estado'}
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
                                                currentTicket?.Priority === 'Urgente' ? 'bg-danger' :
                                                currentTicket?.Priority === 'Alta' ? 'bg-warning' :
                                                currentTicket?.Priority === 'Media' ? 'bg-info' :
                                                currentTicket?.Priority === 'Baja' ? 'bg-secondary' : 'bg-light text-dark'
                                            }`} style={{ fontSize: '0.9rem', padding: '8px 12px' }}>
                                                {currentTicket?.Priority || 'Sin prioridad'}
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
                                                Fecha de Creación:
                                            </label>
                                            <p style={{ 
                                                margin: '0', 
                                                color: '#333',
                                                fontWeight: '500'
                                            }}>
                                                {currentTicket?.CreateDate ? new Date(currentTicket.CreateDate).toLocaleDateString('es-ES', {
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
                                                {currentTicket?.Client ? 
                                                    `${currentTicket.Client.Name?.FirstName || ''} ${currentTicket.Client.Name?.SecondName || ''} ${currentTicket.Client.LastName?.FatherLastName || ''} ${currentTicket.Client.LastName?.MotherLastName || ''}`.trim()
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
                                                Técnico Asignado:
                                            </label>
                                            <p style={{ 
                                                margin: '0',
                                                color: '#333',
                                                fontWeight: '500'
                                            }}>
                                                {currentTicket?.tecnico || 'Sin técnico asignado'}
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
                                                {currentTicket?.Admin?.UserName || 'Sin administrador asignado'}
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
                                                {currentTicket?.Issue || 'Sin asunto'}
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
                                                padding: '15px',
                                                borderRadius: '8px',
                                                border: '1px solid #e9ecef',
                                                minHeight: '100px',
                                                maxHeight: '200px',
                                                overflowY: 'auto'
                                            }}>
                                                <p style={{ 
                                                    margin: '0', 
                                                    whiteSpace: 'pre-wrap',
                                                    color: '#333',
                                                    lineHeight: '1.5'
                                                }}>
                                                    {currentTicket?.Description || 'Sin descripción'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Botones de acción para cambiar estado */}
                                <div className="d-flex justify-content-center gap-2 mb-3">
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
                                                    onClick={() => handleChange('Abierto')}>
                                                    <i className="bi bi-folder2-open me-2"></i>
                                                    Abierto
                                                </button>
                                            </li>
                                            <li>
                                                <button className="dropdown-item"
                                                    onClick={() => handleChange('En espera')}>
                                                    <i className="bi bi-clock me-2"></i>
                                                    En espera
                                                </button>
                                            </li>
                                            <li>
                                                <button className="dropdown-item"
                                                    onClick={() => handleChange('En Progreso')}>
                                                    <i className="bi bi-gear me-2"></i>
                                                    En progreso
                                                </button>
                                            </li>
                                            <li>
                                                <button className="dropdown-item"
                                                    onClick={() => handleChange('Retenido')}>
                                                    <i className="bi bi-pause-circle me-2"></i>
                                                    Retenido
                                                </button>
                                            </li>
                                            <li>
                                                <button className="dropdown-item"
                                                    onClick={() => handleChange('Cerrado')}>
                                                    <i className="bi bi-check-circle me-2"></i>
                                                    Cerrado
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Footer del modal */}
                            <div className="modal-footer" style={{
                                backgroundColor: '#f8f9fa',
                                borderTop: '1px solid #dee2e6',
                                borderBottomLeftRadius: '12px',
                                borderBottomRightRadius: '12px',
                                padding: '1rem 2rem'
                            }}>
                                <button 
                                    type="button" 
                                    className="btn btn-outline-secondary"
                                    onClick={closeModal}
                                    style={{
                                        borderRadius: '8px',
                                        padding: '0.5rem 1.5rem',
                                        fontWeight: '500'
                                    }}>
                                    <i className="bi bi-x-circle me-2"></i>
                                    Cerrar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TicketInfo;