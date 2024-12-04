import StyleFormPay from './css/CreatePay.module.css';

import { useState } from "react";

function CreatePay({ client }) {
    const [formValues, setFormValues] = useState({
        Method: undefined,
        Amount: undefined,
        Note: undefined,
    });
    const paymentMethods = [
        { id: '0', name: 'Método de pago...', hide: true, selected: true },
        { id: '1', name: 'Tarjeta de Crédito', icon: 'bi bi-credit-card' },
        { id: '2', name: 'Transferencia Bancaria', icon: 'bi bi-cash-coin' },
        { id: '3', name: 'Efectivo', icon: 'bi bi-cash-stack' },
        { id: '4', name: 'PayPal', icon: 'bi bi-paypal' }
    ];


    return (
        <div className="modal fade" id="CreatePayModal" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="ModalLabel">Modal title</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">

                        <form action="">
                            {/* Selección de método de pago */}
                            <label className="form-label">Forma de Pago</label>
                            <div className="input-group">
                                <select
                                    className={`form-select ${StyleFormPay['select']}`}
                                    name="Method"
                                    value={formValues.Method}
                                >
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
                                    placeholder='...' />
                            </div>
                            <br />

                            <label className="form-label">Nota</label>
                            <div className="input-group">
                                <input className={`form-control ${StyleFormPay['input']}`}
                                    name="note"
                                    value={formValues.Note}
                                    placeholder='Nota...' />
                            </div>
                            <br />
                        </form>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreatePay;