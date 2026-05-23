import { useState, useEffect } from 'react';
import ApiRequest from '../hooks/apiRequest';
import Swal from 'sweetalert2';
import './TechnicianTicketInfo.css';

function TechnicianTicketInfo({ ticket: ticketProp, onStatusChange, onClose }) {
    const [ticket, setTicket] = useState(ticketProp);

    useEffect(() => {
        setTicket(ticketProp);
    }, [ticketProp]);

    const { makeRequest, error } = ApiRequest(import.meta.env.VITE_API_BASE);

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
                showConfirmButton: false
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
                showConfirmButton: false
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
            backdrop: false
        });

        if (confirm.isConfirmed) {
            try {
                const response = await makeRequest(`/ticket/edit/${ticket._id}`, 'PUT', data);

                if (response && !error) {
                    const updatedTicket = { ...ticket, Status: value };
                    setTicket(updatedTicket);
                    
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
                        showConfirmButton: false
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al actualizar',
                        text: error || 'No se pudo actualizar el estado del ticket',
                        toast: true,
                        position: 'top',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false
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
                    showConfirmButton: false
                });
            }
        }
    };

    return (
        <div className="technician-ticket-info position-fixed end-0 top-0 h-100 shadow-lg" style={{ width: '450px', zIndex: 1050, overflowY: 'auto', backgroundColor: '#fff' }}>
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ backgroundColor: '#f8f9fa' }}>
                <span className="fs-5 fw-bold" style={{ margin: 0, color: '#002b5b' }}>
                    <i className="bi bi-ticket-detailed-fill me-2"></i> 
                    Detalles del Ticket
                </span>
                <button 
                    type="button" 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={onClose}
                    aria-label="Cerrar"
                    title="Cerrar panel"
                    style={{ minWidth: '32px', minHeight: '32px', padding: '4px 8px' }}>
                    <i className="bi bi-x-lg"></i>
                </button>
            </div>

            <div className="p-3" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="mb-3 d-flex justify-content-between align-items-center">
                    <p className="form-label mb-0"><strong>Folio:</strong> {ticket.Folio || ''}</p>
                    <span className={`badge ${
                        ticket?.Status === 'Abierto' ? 'bg-primary' :
                        ticket?.Status === 'En espera' ? 'bg-warning' :
                        ticket?.Status === 'En Progreso' ? 'bg-info' :
                        ticket?.Status === 'Retenido' ? 'bg-danger' :
                        ticket?.Status === 'Cerrado' ? 'bg-success' : 'bg-secondary'
                    }`}>
                        {ticket?.Status || 'Sin estado'}
                    </span>
                </div>
                <hr />

                <p className="form-label"><strong>Cliente</strong></p>
                <div className="input-group mb-3">
                    <input type="text"
                        className="form-control ticket-input"
                        value={ticket?.Client ? 
                            `${ticket.Client.Name?.FirstName || ''} ${ticket.Client.Name?.SecondName || ''} ${ticket.Client.LastName?.FatherLastName || ''} ${ticket.Client.LastName?.MotherLastName || ''}`.replace(/\s+/g, ' ').trim()
                            : 'Sin cliente asignado'}
                        disabled />
                </div>

                <p className="form-label"><strong>Técnico</strong></p>
                <div className="input-group mb-3">
                    <input type="text"
                        className="form-control ticket-input"
                        disabled
                        value={ticket?.tecnico || 'Sin técnico asignado'} />
                </div>

                <p className="form-label"><strong>Administrador</strong></p>
                <div className="input-group mb-3">
                    <input type="text"
                        className="form-control ticket-input"
                        disabled
                        value={ticket?.Admin?.UserName || 'Sin administrador'} />
                </div>

                <p className="form-label"><strong>Prioridad:</strong></p>
                <div className="input-group mb-3">
                    <input
                        className="form-control ticket-input"
                        disabled
                        value={ticket?.Priority || 'Sin prioridad'} />
                </div>

                <p className="form-label"><strong>Asunto:</strong></p>
                <div className="input-group mb-3">
                    <input
                        className="form-control ticket-input"
                        disabled
                        value={ticket?.Issue || 'Sin asunto'} />
                </div>

                <p className="form-label"><strong>Descripción:</strong></p>
                <div className="input-group mb-3">
                    <textarea
                        className="form-control ticket-input"
                        disabled
                        rows="4"
                        value={ticket?.Description || 'Sin descripción'}
                        style={{ resize: 'none' }}
                    ></textarea>
                </div>

                <p className="form-label"><strong>Fecha:</strong></p>
                <div className="input-group mb-3">
                    <input
                        className="form-control ticket-input"
                        disabled
                        value={ticket?.CreateDate ? new Date(ticket.CreateDate).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }) : 'Sin fecha'} />
                </div>

                <hr />

                <div className="mb-3">
                    <p className="form-label"><strong>Cambiar Estado:</strong></p>
                    <div className="d-flex gap-2 flex-wrap">
                        <div className="dropdown ticket-circle">
                            <span 
                                className="ticket-box ticket-red"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                title="Retenido"
                            ></span>
                            <ul className="dropdown-menu">
                                <li>
                                    <button className="dropdown-item"
                                        value={states[3].name}
                                        onClick={(e) => handleChange(e.target.value)}>
                                        Retenido
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div className="dropdown ticket-circle">
                            <span 
                                className="ticket-box ticket-yellow"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                title="En espera - En Progreso"
                            ></span>
                            <ul className="dropdown-menu">
                                <li>
                                    <button className="dropdown-item"
                                        value={states[1].name}
                                        onClick={(e) => handleChange(e.target.value)}>
                                        En espera
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item"
                                        value={states[2].name}
                                        onClick={(e) => handleChange(e.target.value)}>
                                        En Progreso
                                    </button>
                                </li>
                            </ul>
                        </div>
                        
                        <div className="dropdown ticket-circle">
                            <span 
                            className="ticket-box ticket-green"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            title="Cerrar Ticket"
                            ></span>
                            <ul className="dropdown-menu">
                                <li>
                                    <button className="dropdown-item"
                                        value={states[4].name}
                                        onClick={(e) => handleChange(e.target.value)}>
                                        Cerrar
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TechnicianTicketInfo;
