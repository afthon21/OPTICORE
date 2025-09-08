import styleInfo from '../css/infoTickets.module.css';

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

        /**
         * Error al cambiar un ticket cerrado
         */
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

            return
        }

        /**
         * Error al colocar el mismo estado
         */
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

            return
        }

        /**
         * Mostrar advertencia al cerrar un ticket
         */
        if (value === states[4].name) {
            await Swal.fire({
                icon: 'warning',
                title: 'Precaución!',
                text: 'No sera posible cambiar el estado después de que el ticket haya sido cerrado.',
                toast: true,
                position: 'top',
                iconColor: '#002b5b',
                timer: 1400,
                timerProgressBar: true,
                showConfirmButton: false
            });
        }

        /**
         * Cambiar el estado
         */
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
                confirmButtonColor: '#2a9d8f'
            });

            if (confirm.isConfirmed) {
                try {
                    await makeRequest(`/ticket/edit/${ticket._id}`, 'POST', data);

                    Swal.fire({
                        toast: true,
                        position: 'top',
                        width: '30rem',
                        icon: 'success',
                        iconColor: '#2a9d8f',
                        title: 'Completado',
                        text: 'Estado actualizado',
                        timer: 1200,
                        timerProgressBar: true,
                        showConfirmButton: false
                    });

                    if (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: error,
                            toast: true,
                            position: 'top',
                            width: '30rem'
                        });

                        return;
                    }

                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
    
    return (
        <div className="modal fade" id="TicketClientModal" tabIndex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header justify-content-between">
                        <span className={`modal-title fs-5 ${styleInfo['title']}`}>
                            <i className="bi bi-clipboard2-pulse-fill"></i>
                            Ticket Details
                        </span>

                        <div className={styleInfo['tools']}>
                            <div className={`dropdown ${styleInfo['circle']}`}>
                                <span className={`${styleInfo['red']} ${styleInfo['box']}`}
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"></span>

                                <ul className="dropdown-menu">
                                    <li>
                                        <button className="dropdown-item"
                                            value={states[3].name}
                                            onClick={(e) => handleChange(e.target.value)}>
                                            Retener
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div className={`dropdown ${styleInfo['circle']}`}>
                                <span className={`${styleInfo['yellow']} ${styleInfo['box']}`}
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"></span>

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
                                            En progreso
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div className={`dropdown ${styleInfo['circle']}`}>
                                <span className={`${styleInfo['green']} ${styleInfo['box']}`}
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"></span>

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
                    <div className={`modal-body ${styleInfo['body']}`}>

                        <div className="d-flex justify-content-between">
                            <p className="form-label"><strong>Folio:</strong> {ticket.Folio || ''}</p>

                            <p>Estado: {ticket.Status}</p>
                        </div>

                        <br />
                        <p className="form-label"><strong>Cliente:</strong></p>
                        <div className="input-group">
                            <input
                                type="text"
                                className={`form-control ${styleInfo['input']}`}
                                value={ticket?.Client?.Name
                                    ? `${ticket.Client.Name.FirstName || ''} 
                            ${ticket.Client.Name.SecondName || ''} 
                            ${ticket.Client.LastName?.FatherLastName || ''} 
                            ${ticket.Client.LastName?.MotherLastName || ''}`
                                        .replace(/\s+/g, ' ').trim()
                                    : 'Información no disponible'}
                                disabled
                            />
                        </div>
                        <br />

                        <p className="form-label"><strong>Asunto:</strong></p>
                        <div className="d-flex input-group">
                            <input type="text"
                                className={`form-control ${styleInfo['input']}`}
                                disabled
                                value={ticket.Issue || ''} />
                        </div>
                        <br />

                        <p className="form-label"><strong>Descripción:</strong></p>
                        <div className="d-flex input-group">
                            <textarea
                                className={`form-control ${styleInfo['textarea']}`}
                                disabled
                                value={ticket.Description || ''}></textarea>
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className={styleInfo['btn-exit']} 
                            data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TicketInfo;