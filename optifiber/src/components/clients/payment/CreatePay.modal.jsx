import StyleFormPay from '../css/CreatePay.module.css';

import { cleanData } from '../../fragments/js/cleanData';
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import ApiRequest from '../../hooks/apiRequest.jsx'

function CreatePay({ client }) {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE)
    const [formValues, setFormValues] = useState({
        Method: undefined,
        Amount: undefined,
        Note: undefined
    });
    const paymentMethods = [
        { id: '0', name: 'Método de pago...', hide: true, selected: true },
        { id: '1', name: 'Tarjeta de Crédito', icon: 'bi bi-credit-card' },
        { id: '2', name: 'Transferencia Bancaria', icon: 'bi bi-cash-coin' },
        { id: '3', name: 'Efectivo', icon: 'bi bi-cash-stack' },
        { id: '4', name: 'PayPal', icon: 'bi bi-paypal' }
    ];
    const data = {
        Method: formValues.Method,
        Amount: formValues.Amount,
        Note: formValues.Note
    }

    const handleChangue = (e) => {
        const { name, value } = e.target;

        setFormValues((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleClear = () => {
        setFormValues({
            Method: paymentMethods.find((item) => item.id === '0').name,
            Amount: '',
            Note: ''
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cleanedData = cleanData(data);

        try {
            await makeRequest(`/pay/new/${client}`, 'POST', cleanedData);

            if (loading) {
                await Swal.fire({
                    icon: 'info',
                    title: 'Espere!',
                    text: 'creando...',
                    toast: true,
                    position: top,
                    timer: 1200,
                    timerProgressBar: true
                });
            }

            Swal.fire({
                icon: 'success',
                title: 'Creado exitosamente!',
                timer: 1200,
                showConfirmButton: false,
                timerProgressBar: true,
                toast: true,
                position: 'top',
                background: '#e5e8e8'
            }).then(() => {
                handleClear();
            });
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        /**
         * Limpiar modal al cerrar lo
         */
        const modal = document.getElementById('CreatePayModal');

        if (modal) {
            modal.addEventListener("hidden.bs.modal", handleClear);
        }

        return () => {
            if (modal) {
                modal.removeEventListener("hidden.bs.modal", handleClear)
            }
        }
    }, []);

    if (error) return <p>Error!</p>

    return (
        <div className="modal fade" id="CreatePayModal" tabIndex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="ModalLabel">Pago</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className={`${StyleFormPay['body']} modal-body`}>

                        <form onSubmit={handleSubmit}>
                            {/* Selección de método de pago */}
                            <label className="form-label">Forma de Pago</label>
                            <div className="input-group">
                                <select
                                    className={`form-select ${StyleFormPay['select']}`}
                                    name="Method"
                                    value={formValues.Method}
                                    onChange={handleChangue} >
                                    {paymentMethods.map((method) => (
                                        <option
                                            key={method.id}
                                            value={method.name}
                                            hidden={method.hide}
                                            selected={method.selected}
                                            className={StyleFormPay['option']}>

                                            {method.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <br />

                            <label className="form-label">Monto</label>
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input type="number"
                                    className={`form-control ${StyleFormPay['input']}`}
                                    name="Amount"
                                    value={formValues.Amount}
                                    onChange={handleChangue}
                                    placeholder='...' />
                            </div>
                            <br />

                            <label className="form-label">Nota</label>
                            <div className="input-group">
                                <input className={`form-control ${StyleFormPay['input']}`}
                                    name="Note"
                                    value={formValues.Note}
                                    onChange={handleChangue}
                                    placeholder='Nota...' />
                            </div>
                            <br />

                            <div className="d-flex justify-content-end mt-4">
                                <button
                                    className={`mt-2 ${StyleFormPay['btn-submit']}`}
                                    type="submit"
                                    data-bs-dismiss="modal"
                                    aria-label="Close">
                                    Aceptar
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