import styleInfo from './css/paymentInfo.module.css';
import ApiRequest from '../hooks/apiRequest';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function PaymentInfo({ payment: paymentProp, onStatusChange }) {
    const [payment, setPayment] = useState(paymentProp);

    useEffect(() => {
        setPayment(paymentProp);
    }, [paymentProp]);

    const { makeRequest, error } = ApiRequest(import.meta.env.VITE_API_BASE);

    const states = [
        { id: '0', name: 'Exitoso' },
        { id: '1', name: 'En proceso' },
        { id: '2', name: 'Pendiente' },
        { id: '3', name: 'Rechazado' },
        { id: '4', name: 'Vencido' }
    ];

    const handleArchive = async () => {
        const clientName = payment?.Client?.Name
            ? `${payment.Client.Name.FirstName || ''} ${payment.Client.Name.SecondName || ''} ${payment.Client.LastName?.FatherLastName || ''} ${payment.Client.LastName?.MotherLastName || ''}`.replace(/\s+/g, ' ').trim()
            : 'Cliente no disponible';

        const result = await Swal.fire({
            title: '¿Archivar pago?',
            text: `¿Estás seguro de que quieres archivar el pago de ${clientName} (Folio: ${payment.Folio})?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, archivar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6'
        });

        if (result.isConfirmed) {
            try {
                const response = await makeRequest(`/pay/archive/${payment._id}`);
                console.log('Respuesta del archivado:', response);

                // Actualizar el estado local
                const updatedPayment = { ...payment, Archived: true };
                setPayment(updatedPayment);

                // Notificar al componente padre
                if (onStatusChange) {
                    onStatusChange(updatedPayment);
                }

                await Swal.fire({
                    title: '¡Éxito!',
                    text: 'El pago ha sido archivado correctamente',
                    icon: 'success',
                    toast: true,
                    position: 'top',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });

            } catch (error) {
                console.error('Error al archivar:', error);
                await Swal.fire({
                    title: 'Error',
                    text: 'No se pudo archivar el pago',
                    icon: 'error',
                    toast: true,
                    position: 'top',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            }
        }
    };

    const handleChange = async (value) => {
        const data = { Status: value };

        // Si ya fue exitoso
        if (payment.Status === states[0].name) {
            Swal.fire({
                icon: 'error',
                title: 'Error al cambiar!',
                text: 'El pago ha sido exitoso y no puede modificarse.',
                toast: true,
                position: 'top',
                timer: 1200,
                timerProgressBar: true,
                showConfirmButton: false
            });
            return;
        }

        // Si el estado es igual al actual
        if (value === payment.Status) {
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
        if (value===states[4].name){
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
        if (value !== payment.Status){
        const confirm = await Swal.fire({
            icon: 'warning',
            iconColor: '#002b5b',
            title: '¿Está seguro de cambiar el estado a?',
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
                await makeRequest(`/pay/edit/${payment._id}`, 'POST', data);

                const updated = { ...payment, Status: value };
                setPayment(updated);

                if (onStatusChange) {
                    onStatusChange(updated);
                }
                   // Emitir evento global para que vistas que escuchan ('payment:created') refresquen datos
                    try {
                        window.dispatchEvent(new CustomEvent('payment:created', { detail: updated }));
                    } catch (e) {
                        // silenciar en caso de entornos donde CustomEvent no esté disponible
                    }
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
                if (error){
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: error || 'Hubo un problema al actualizar el estado.',
                        toast: true,
                        position: 'top',
                        width: '30rem'
                });
                return;

                }
                // Emitir evento global para que componentes interesados (ej. vista de cliente) refresquen datos
                try {
                    window.dispatchEvent(new CustomEvent('payment:created', { detail: updated }));
                } catch (e) {
                    // Silenciar si el navegador no soporta CustomEvent de esta manera
                }
            } catch (error) {
                console.log(error);
                }
            }
        }
    }

    return (
        <div className={`${styleInfo['info-container']} position-fixed end-0 top-0 h-100 shadow-lg`} style={{ width: '400px', zIndex: 1000, overflowY: 'auto', backgroundColor: '#fff' }}>
            <div className={`${styleInfo['header']} d-flex justify-content-between align-items-center p-3 border-bottom`} style={{ backgroundColor: '#f8f9fa' }}>
                <span className={`${styleInfo['title']} fs-5`} style={{ margin: 0 }}>
                    <i className="bi bi-clipboard2-pulse-fill me-2"></i> 
                    Detalles del Pago
                </span>
                <button 
                    type="button" 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => window.dispatchEvent(new CustomEvent('closePaymentInfo'))}
                    aria-label="Cerrar"
                    title="Cerrar panel"
                    style={{ minWidth: '32px', minHeight: '32px', padding: '4px 8px' }}>
                    <i className="bi bi-x-lg"></i>
                </button>
            </div>

            <div className={`p-3 ${styleInfo['body']}`}>
                <div className="mb-3 d-flex justify-content-between">
                    <p className="form-label mb-0"><strong>Folio:</strong> {payment.Folio || ''}</p>
                    <p className="badge bg-info">{payment.Status}</p>
                </div>
                <hr />

                <p className="form-label"><strong>Cliente</strong></p>
                <div className="input-group mb-3">
                    <input type="text"
                        className={`form-control ${styleInfo['input']}`}
                        value={payment?.Client?.Name
                            ? `${payment.Client.Name.FirstName || ''} 
                            ${payment.Client.Name.SecondName || ''} 
                            ${payment.Client.LastName?.FatherLastName || ''} 
                            ${payment.Client.LastName?.MotherLastName || ''}`
                                .replace(/\s+/g, ' ').trim()
                            : 'Información no disponible'}
                        disabled />
                </div>

                <p className="form-label"><strong>Forma de pago</strong></p>
                <div className="input-group mb-3">
                    <input type="text"
                        className={`form-control ${styleInfo['input']}`}
                        disabled
                        value={payment.Method || ''} />
                </div>

                <p className="form-label"><strong>Monto:</strong></p>
                <div className="input-group mb-3">
                    <input
                        className={`form-control ${styleInfo['input']}`}
                        disabled
                        value={`$${payment.Amount || '0'}`} />
                </div>

                <p className="form-label"><strong>Nota:</strong></p>
                <div className="input-group mb-3">
                    <textarea
                        className={`form-control ${styleInfo['input']}`}
                        disabled
                        rows="3"
                        value={payment.Note || 'Sin nota'}
                        style={{ resize: 'none' }}
                    ></textarea>
                </div>

                <p className="form-label"><strong>Fecha:</strong></p>
                <div className="input-group mb-3">
                    <input
                        className={`form-control ${styleInfo['input']}`}
                        disabled
                        value={payment.CreateDate ? new Date(payment.CreateDate).toLocaleDateString('es-ES') : 'Sin fecha'} />
                </div>

                <hr />

                <div className="mb-3">
                    <p className="form-label"><strong>Cambiar Estado:</strong></p>
                    <div className="d-flex gap-2 flex-wrap">
                        <div className={`dropdown ${styleInfo['circle']}`}>
                            <span 
                                className={`${styleInfo['red']} ${styleInfo['box']}`}
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                title="Rechazado - Vencido"
                            ></span>
                            <ul className="dropdown-menu">
                                <li>
                                    <button className="dropdown-item"
                                        value={states[3].name}
                                        onClick={(e) => handleChange(e.target.value)}>
                                        Rechazado
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item"
                                        value={states[4].name}
                                        onClick={(e) => handleChange(e.target.value)}>
                                        Vencido
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div className={`dropdown ${styleInfo['circle']}`}>
                            <span 
                                className={`${styleInfo['yellow']} ${styleInfo['box']}`}
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                title="En proceso - Pendiente"
                            ></span>
                            <ul className="dropdown-menu">
                                <li>
                                    <button className="dropdown-item"
                                        value={states[1].name}
                                        onClick={(e) => handleChange(e.target.value)}>
                                        En proceso
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item"
                                        value={states[2].name}
                                        onClick={(e) => handleChange(e.target.value)}>
                                        Pendiente
                                    </button>
                                </li>
                            </ul>
                        </div>
                        
                        <div className={`dropdown ${styleInfo['circle']}`}>
                            <span 
                            className={`${styleInfo['green']} ${styleInfo['box']}`}
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            title="Pago Exitoso"
                            ></span>
                            <ul className="dropdown-menu">
                                <li>
                                    <button className="dropdown-item"
                                        value={states[0].name}
                                        onClick={(e) => handleChange(e.target.value)}>
                                        Pago exitoso
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <hr />

                <div className="d-flex gap-2">
                    <button 
                        type="button" 
                        className="btn btn-warning btn-sm flex-grow-1"
                        onClick={handleArchive}>
                        <i className="fas fa-archive me-1"></i> Archivar
                    </button>
                </div>
            </div>
        </div>
    );
}

PaymentInfo.propTypes = {
    payment: PropTypes.shape({
        _id: PropTypes.string,
        Folio: PropTypes.string,
        Status: PropTypes.string,
        Method: PropTypes.string,
        Amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        Note: PropTypes.string,
        Archived: PropTypes.bool,
        Client: PropTypes.shape({
            Name: PropTypes.shape({
                FirstName: PropTypes.string,
                SecondName: PropTypes.string
            }),
            LastName: PropTypes.shape({
                FatherLastName: PropTypes.string,
                MotherLastName: PropTypes.string
            })
        })
    }),
    onStatusChange: PropTypes.func
};

export default PaymentInfo;