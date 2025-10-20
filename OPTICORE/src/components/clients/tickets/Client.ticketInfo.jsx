import ApiRequest from '../../hooks/apiRequest';
import Swal from 'sweetalert2';

function TicketInfo({ ticket }) {
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
        if (value === ticket.Status) {
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
        if (value !== ticket.Status) {
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
                    const response = await makeRequest(`/ticket/edit/${ticket._id}`, 'PUT', data);

                    if (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Exito!',
                            text: 'Estado actualizado',
                            timer: 1200,
                            timerProgressBar: true,
                            showConfirmButton: false
                        });
                        
                        // Recargar la página para mostrar los cambios
                        setTimeout(() => {
                            window.location.reload();
                        }, 1300);
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
                }
            }
        }
    }
    
    return (
        <div className="modal fade" id="TicketClientModal" tabIndex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content" style={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}>
                    {/* Header estilo moderno */}
                    <div className="modal-header" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        borderTopLeftRadius: '12px',
                        borderTopRightRadius: '12px',
                        borderBottom: 'none',
                        padding: '1.5rem'
                    }}>
                        <div className="d-flex align-items-center">
                            <div style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '12px'
                            }}>
                                <i className="bi bi-clipboard2-pulse-fill" style={{ fontSize: '20px' }}></i>
                            </div>
                            <div>
                                <h5 className="modal-title mb-0" style={{ fontWeight: '600' }}>
                                    Información del Ticket
                                </h5>
                                <small style={{ opacity: '0.9' }}>
                                    Folio: {ticket?.Folio || 'Sin folio'}
                                </small>
                            </div>
                        </div>

                        {/* Opciones de estado en el header */}
                        <div className="d-flex align-items-center gap-2">
                            <small style={{ opacity: '0.9', marginRight: '8px' }}>OPCIONES:</small>
                            
                            <div className="dropdown">
                                <button 
                                    className="btn btn-sm"
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        padding: '6px 12px'
                                    }}
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    title="Retener ticket">
                                    <i className="bi bi-pause-circle me-1"></i>
                                    Retener
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <button className="dropdown-item"
                                            value={states[3].name}
                                            onClick={(e) => handleChange(e.target.value)}>
                                            <i className="bi bi-pause-circle me-2"></i>
                                            Retener
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div className="dropdown">
                                <button 
                                    className="btn btn-sm"
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        padding: '6px 12px'
                                    }}
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    title="Cambiar estado">
                                    <i className="bi bi-arrow-repeat me-1"></i>
                                    Estado
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
                                    className="btn btn-sm"
                                    style={{
                                        backgroundColor: 'rgba(40, 167, 69, 0.8)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        padding: '6px 12px'
                                    }}
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    title="Cerrar ticket">
                                    <i className="bi bi-check-circle me-1"></i>
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

                            <button 
                                type="button" 
                                className="btn-close btn-close-white ms-3" 
                                data-bs-dismiss="modal" 
                                aria-label="Close"
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: '6px',
                                    padding: '8px'
                                }}>
                            </button>
                        </div>
                    </div>

                    {/* Body estilo moderno */}
                    <div className="modal-body" style={{ padding: '2rem' }}>
                        {/* Información principal del ticket */}
                        <div className="row g-4">
                            <div className="col-md-6">
                                <div style={{
                                    backgroundColor: '#f8f9fa',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <label className="form-label" style={{ 
                                        fontWeight: '600', 
                                        color: '#495057',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <i className="bi bi-hash me-2"></i>
                                        Folio
                                    </label>
                                    <p style={{ 
                                        margin: '0',
                                        fontSize: '1.1rem',
                                        fontWeight: '500'
                                    }}>
                                        {ticket?.Folio || 'Sin folio'}
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div style={{
                                    backgroundColor: '#f8f9fa',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <label className="form-label" style={{ 
                                        fontWeight: '600', 
                                        color: '#495057',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <i className="bi bi-flag me-2"></i>
                                        Estado
                                    </label>
                                    <p style={{ margin: '0' }}>
                                        <span className={`badge ${
                                            ticket?.Status === 'Abierto' ? 'bg-primary' :
                                            ticket?.Status === 'En espera' ? 'bg-warning' :
                                            ticket?.Status === 'En Progreso' ? 'bg-info' :
                                            ticket?.Status === 'Retenido' ? 'bg-danger' :
                                            ticket?.Status === 'Cerrado' ? 'bg-success' : 'bg-secondary'
                                        }`} style={{ fontSize: '0.9rem' }}>
                                            {ticket?.Status || 'Sin estado'}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div style={{
                                    backgroundColor: '#f8f9fa',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <label className="form-label" style={{ 
                                        fontWeight: '600', 
                                        color: '#495057',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        Prioridad
                                    </label>
                                    <p style={{ margin: '0' }}>
                                        <span className={`badge ${
                                            ticket?.Priority === 'Urgente' ? 'bg-danger' :
                                            ticket?.Priority === 'Alta' ? 'bg-warning' :
                                            ticket?.Priority === 'Media' ? 'bg-info' :
                                            ticket?.Priority === 'Baja' ? 'bg-secondary' : 'bg-light text-dark'
                                        }`} style={{ fontSize: '0.9rem' }}>
                                            {ticket?.Priority || 'Sin prioridad'}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div style={{
                                    backgroundColor: '#f8f9fa',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <label className="form-label" style={{ 
                                        fontWeight: '600', 
                                        color: '#495057',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <i className="bi bi-calendar3 me-2"></i>
                                        Fecha de Creación
                                    </label>
                                    <p style={{ margin: '0' }}>
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
                                    backgroundColor: '#f8f9fa',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <label className="form-label" style={{ 
                                        fontWeight: '600', 
                                        color: '#495057',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <i className="bi bi-person me-2"></i>
                                        Cliente
                                    </label>
                                    <p style={{ margin: '0', fontSize: '1.1rem' }}>
                                        {ticket?.Client ? 
                                            `${ticket.Client.Name?.FirstName || ''} ${ticket.Client.Name?.SecondName || ''} ${ticket.Client.LastName?.FatherLastName || ''} ${ticket.Client.LastName?.MotherLastName || ''}`.trim()
                                            : 'Sin cliente asignado'
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div style={{
                                    backgroundColor: '#f8f9fa',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <label className="form-label" style={{ 
                                        fontWeight: '600', 
                                        color: '#495057',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <i className="bi bi-tools me-2"></i>
                                        Técnico Asignado
                                    </label>
                                    <p style={{ margin: '0' }}>
                                        {ticket?.tecnico || 'Sin técnico asignado'}
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div style={{
                                    backgroundColor: '#f8f9fa',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <label className="form-label" style={{ 
                                        fontWeight: '600', 
                                        color: '#495057',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <i className="bi bi-person-badge me-2"></i>
                                        Administrador
                                    </label>
                                    <p style={{ margin: '0' }}>
                                        {ticket?.Admin?.UserName || 'Sin administrador asignado'}
                                    </p>
                                </div>
                            </div>

                            <div className="col-12">
                                <div style={{
                                    backgroundColor: '#f8f9fa',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <label className="form-label" style={{ 
                                        fontWeight: '600', 
                                        color: '#495057',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <i className="bi bi-chat-left-text me-2"></i>
                                        Asunto
                                    </label>
                                    <p style={{ margin: '0', fontSize: '1.1rem' }}>
                                        {ticket?.Issue || 'Sin asunto'}
                                    </p>
                                </div>
                            </div>

                            <div className="col-12">
                                <div style={{
                                    backgroundColor: '#f8f9fa',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <label className="form-label" style={{ 
                                        fontWeight: '600', 
                                        color: '#495057',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <i className="bi bi-card-text me-2"></i>
                                        Descripción
                                    </label>
                                    <div style={{
                                        backgroundColor: 'white',
                                        padding: '0.75rem',
                                        borderRadius: '6px',
                                        border: '1px solid #dee2e6',
                                        minHeight: '100px',
                                        maxHeight: '200px',
                                        overflowY: 'auto'
                                    }}>
                                        <p style={{ margin: '0', whiteSpace: 'pre-wrap' }}>
                                            {ticket?.Description || 'Sin descripción'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer estilo moderno */}
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
                            data-bs-dismiss="modal"
                            style={{
                                borderRadius: '8px',
                                padding: '0.5rem 1.5rem',
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