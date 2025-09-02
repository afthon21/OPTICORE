import StyleFormPay from '../css/CreatePay.module.css';
import { cleanData } from '../../fragments/js/cleanData';
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import ApiRequest from '../../hooks/apiRequest.jsx';

function CreatePay({ client, onPaymentCreated }) {
    const { makeRequest, loading } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [formValues, setFormValues] = useState({
        Method: '',
        Amount: '',
        Note: ''
    });

    const [formErrors, setFormErrors] = useState({});

    const paymentMethods = [
        { id: '0', name: 'Método de pago...', hide: true },
        { id: '1', name: 'Tarjeta de Crédito' },
        { id: '2', name: 'Transferencia Bancaria' },
        { id: '3', name: 'Efectivo' },
        { id: '4', name: 'PayPal' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value
        }));
        setFormErrors((prev) => ({
            ...prev,
            [name]: ''
        }));
    };

    const handleClear = () => {
        setFormValues({
            Method: '',
            Amount: '',
            Note: ''
        });
        setFormErrors({});
    };

    const validateForm = () => {
        const errors = {};
        if (!formValues.Method || formValues.Method === 'Método de pago...') {
            errors.Method = 'La forma de pago es obligatoria.';
        }
        if (!formValues.Amount || Number(formValues.Amount) <= 0) {
            errors.Amount = 'El monto debe ser mayor a cero.';
        }
        if (!formValues.Note.trim()) {
            errors.Note = 'La nota es obligatoria.';
        }

        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Completa todos los campos correctamente.',
                toast: true,
                position: 'top',
                background: '#f8d7da',
                timer: 1800,
                timerProgressBar: true,
                showConfirmButton: false
            });
        }

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const cleanedData = cleanData(formValues);

        try {
            const res = await makeRequest(`/pay/new/${client}`, 'POST', cleanedData);

            Swal.fire({
                icon: 'success',
                title: 'Creado exitosamente!',
                text: res.message,
                timer: 1200,
                showConfirmButton: false,
                timerProgressBar: true,
                toast: true,
                position: 'top',
                background: '#e5e8e8'
            }).then(() => {
                handleClear();
                if (onPaymentCreated) onPaymentCreated();
            });

        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Error del servidor',
                text: 'No se pudo registrar el pago.',
                toast: true,
                position: 'top',
                background: '#f8d7da',
                timer: 1800,
                showConfirmButton: false,
                timerProgressBar: true
            });
        }
    };

    useEffect(() => {
        const modal = document.getElementById('CreatePayModal');
        if (modal) modal.addEventListener("hidden.bs.modal", handleClear);
        return () => modal?.removeEventListener("hidden.bs.modal", handleClear);
    }, []);

    return (
        <div className="modal fade" id="CreatePayModal" tabIndex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="ModalLabel">Pago</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className={`${StyleFormPay['body']} modal-body`}>
                        <form onSubmit={handleSubmit} noValidate>
                            {/* Método de Pago */}
                            <label className="form-label">Forma de Pago</label>
                            <select
                                className={`form-select ${formErrors.Method ? 'is-invalid' : ''}`}
                                name="Method"
                                value={formValues.Method}
                                onChange={handleChange}>
                                {paymentMethods.map((method) => (
                                    <option key={method.id} value={method.name} hidden={method.hide}>
                                        {method.name}
                                    </option>
                                ))}
                            </select>
                            {formErrors.Method && (
                                <div className="text-danger mt-1" style={{ fontSize: '0.9em' }}>{formErrors.Method}</div>
                            )}
                            <br />

                            {/* Monto */}
                            <label className="form-label">Monto</label>
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input
                                    type="number"
                                    className={`form-control ${formErrors.Amount ? 'is-invalid' : ''}`}
                                    name="Amount"
                                    value={formValues.Amount}
                                    onChange={handleChange}
                                    placeholder="..." />
                            </div>
                            {formErrors.Amount && (
                                <div className="text-danger mt-1" style={{ fontSize: '0.9em' }}>{formErrors.Amount}</div>
                            )}
                            <br />

                            {/* Nota */}
                            <label className="form-label">Nota</label>
                            <input
                                type="text"
                                className={`form-control ${formErrors.Note ? 'is-invalid' : ''}`}
                                name="Note"
                                value={formValues.Note}
                                onChange={handleChange}
                                placeholder="Nota..." />
                            {formErrors.Note && (
                                <div className="text-danger mt-1" style={{ fontSize: '0.9em' }}>{formErrors.Note}</div>
                            )}

                            {/* Botones */}
                            <div className="d-flex justify-content-end mt-4">
                                <button
                                    className={`mt-2 ${StyleFormPay['btn-submit']}`}
                                    type="submit"
                                    disabled={loading}
                                    data-bs-dismiss={!loading ? 'modal' : null}>
                                    {loading ? 'Enviando...' : 'Aceptar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreatePay;
