import styleInfo from './css/paymentInfo.module.css';
import ApiRequest from '../hooks/apiRequest';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';

function PaymentInfo({ payment: paymentProp, onStatusChange }) {
    const [payment, setPayment] = useState(paymentProp);

    useEffect(() => {
        setPayment(paymentProp);
    }, [paymentProp]);

    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);

    const states = [
        { id: '0', name: 'Exitoso' },
        { id: '1', name: 'En proceso' },
        { id: '2', name: 'Pendiente' },
        { id: '3', name: 'Rechazado' },
        { id: '4', name: 'Vencido' }
    ];

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
                await makeRequest(`/payment/edit/${payment._id}`, 'POST', data);

                const updated = { ...payment, Status: value };
                setPayment(updated);

                if (onStatusChange) onStatusChange(updated);

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
            } catch (err) {
                console.error(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: error || 'Hubo un problema al actualizar el estado.',
                    toast: true,
                    position: 'top',
                    width: '30rem'
                });
            }
        }
    };

    return (
        <div className="modal fade" id="PaymentModal" tabIndex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header justify-content-between">
                        <span className={`modal-title fs-5 ${styleInfo['title']}`}>
                            <i className="bi bi-clipboard2-pulse-fill"></i> 
                            Payment Details
                        </span>
                        
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <span className="fw-bold">OPCIONES --</span>
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
                                role= "button"
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

                    <div className={`modal-body ${styleInfo['body']}`}>
                        <div className="d-flex justify-content-between">
                            <p className="form-label"><strong>Folio:</strong> {payment.Folio || ''}</p>
                            <p>Estado: {payment.Status}</p>
                        </div>
                        <br />
                        <p className="form-label"><strong>Cliente</strong></p>
                        <div className="input-group">
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
                        <br />

                        <p className="form-label"><strong>Forma de pago</strong></p>
                        <div className="d-flex input-group">
                            <input type="text"
                                className={`form-control ${styleInfo['input']}`}
                                disabled
                                value={payment.Method || ''} />
                        </div>
                        <br />

                        <p className="form-label"><strong>Monto:</strong></p>
                        <div className="d-flex input-group">
                            <input
                                className={`form-control ${styleInfo['input']}`}
                                disabled
                                value={payment.Amount || ''} />
                        </div>
                        <br />

                        <p className="form-label"><strong>Nota:</strong></p>
                        <div className="d-flex input-group">
                            <input
                                className={`form-control ${styleInfo['input']}`}
                                disabled
                                value={payment.Note || ''} />
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

export default PaymentInfo;