import styleCreate from './css/createCard.module.css';

import { useEffect, useState } from 'react';
import ApiRequest from '../hooks/apiRequest.jsx';

import { cleanData } from "../fragments/js/cleanData.js";
import Swal from 'sweetalert2';
import { getDate } from '../fragments/js/getDate.js';

import { DropdownClients } from '../fragments/Dropdown.clients.jsx';

function CardCreatePayment({ clients = [] }) {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState('');
    const [formValues, setFormValues] = useState({
        Method: '',
        Amount: '',
        Note: ''
    });
    const [formErrors, setFormErrors] = useState({})

    const data = {
        Client: selected,
        Method: formValues.Method,
        Amount: formValues.Amount,
        Abono: formValues.Abono,
        Note: formValues.Note
    }

    const paymentMethods = [
        { id: '0', name: 'Método de pago...', hide: true, selected: true },
        { id: '1', name: 'Tarjeta de Crédito' },
        { id: '2', name: 'Transferencia Bancaria' },
        { id: '3', name: 'Efectivo' },
        { id: '4', name: 'PayPal' }
    ];

    useEffect(() => {
        setFormValues(prevValues => ({
            ...prevValues,
            Client: selected
        }));
    }, [selected]);

    const handleChangue = (e) => {
        const { name, value } = e.target;

        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    }

    const handleInputChange = (e) => {
        setSearch(e.target.value);
        setIsOpen(false)
    }

    // Selecciona una opción y cierra la lista
    const handleOptionClick = (option) => {

        const clientName = `${option.Name.FirstName} 
                ${option.Name.SecondName || ''} 
                ${option.LastName.FatherLastName}  
                ${option.LastName.MotherLastName}`
            .replace(/\s+/g, ' ').trim();

        const clientId = option._id;

        setSelected(clientId);
        setSearch(clientName);
        setIsOpen(false);
    };

    // Filtra las opciones usando el nombre completo
    const filteredOptions = clients.filter(option => {
        const clientName = `${option.Name.FirstName} 
                ${option.Name.SecondName || ''} 
                ${option.LastName.FatherLastName} 
                ${option.LastName.MotherLastName}`
            .replace(/\s+/g, ' ').trim();
        return clientName.toLowerCase().includes(search.toLowerCase());
    });

    const validators = () => {
        const errors = {}

        if (!selected) {
            errors.Client = 'Debe seleccionar un cliente.';
        }

        if (!formValues.Amount || formValues.Amount.trim() === '' || isNaN(formValues.Amount) || Number(formValues.Amount) <= 0) {
            errors.Amount = 'El monto es obligatorio';
        }

        if (!formValues.Method || formValues.Method === paymentMethods[0].name) {
            errors.Method = 'Selecciona un método de pago valido';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cleanedData = cleanData(data);

        if (!validators()) {
            setTimeout(() => {
                setFormErrors({});
            }, 1200);
            return
        }

        try {
            await makeRequest('/pay/new', 'POST', cleanedData);

            if (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el servidor!',
                    text: error || 'Error desconocido',
                    timer: 1200,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    toast: true,
                    position: 'bottom-end',
                    background: '#e5e8e8'
                });
            }

            Swal.fire({
                icon: 'success',
                title: 'Creado exitosamente!',
                timer: 1200,
                showConfirmButton: false,
                timerProgressBar: true,
                toast: true,
                position: 'bottom-end',
                background: '#e5e8e8'
            }).then(() => {
                setFormValues({
                    Method: paymentMethods[0].name,
                    Amount: '',
                    Note: '',
                });

                setSearch('');
            });

        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div className={`card p-3 mb-5 ${styleCreate['card-container']}`}>

            <div className={`justify-content-between d-flex align-items-center ${styleCreate['header']}`}>
                <span>Nuevo Pago</span>
                <span><i className="bi bi-calendar-date"></i> {getDate()}</span>
            </div>

            <div className={`card-body ${styleCreate['body']}`}>
                <form onSubmit={handleSubmit}>
                    <label className="form-label">Cliente</label>
                    <div className="input-group d-flex">
                        <input className={`form-control ${styleCreate['input']}`}
                            type="text"
                            value={search}
                            onChange={handleInputChange}
                            onBlur={() => setIsOpen(false)}
                            onFocus={() => setIsOpen(true)}
                            placeholder="Seleccionar Cliente..." />
                    </div>

                    {isOpen && (
                        <DropdownClients
                            filteredOptions={filteredOptions}
                            onOptionClick={handleOptionClick} />
                    )}
                    {formErrors.Client && <p className={styleCreate['error']}>{formErrors.Client}</p>}
                    <br />

                    {/* Selección de método de pago */}
                    <label className="form-label">Forma de Pago</label>
                    <div className="input-group d-flex">
                        <select
                            className={`form-select ${styleCreate['select']}`}
                            name="Method"
                            onChange={handleChangue}
                            value={formValues.Method || paymentMethods[0].name}>
                            {paymentMethods.map((method) => (
                                <option
                                    key={method.id}
                                    value={method.name}
                                    hidden={method.hide}>

                                    {method.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {formErrors.Method && <p className={styleCreate['error']}>{formErrors.Method}</p>}
                    <br />

                    <label className="form-label">Monto</label>
                    <div className="input-group d-flex">
                        <span className="input-group-text">$</span>
                        <input type="number"
                            className={`form-control ${styleCreate['input']}`}
                            onChange={handleChangue}
                            name="Amount"
                            value={formValues.Amount}
                            placeholder='...' />
                    </div>

                    <label className="form-label">Abono</label>
                    <div className="input-group d-flex">
                        <span className="input-group-text">$</span>
                        <input 
                        type="number"
                        className={`form-control ${styleCreate['input']}`}
                        onChange={handleChangue}
                        name="Abono"
                        value={formValues.Abono}
                        placeholder='...'/>
                    </div>
                    
                    {formErrors.Amount && <p className={styleCreate['error']}>{formErrors.Amount}</p>}
                    <br />

                    <label className="form-label">Nota</label>
                    <div className="input-group d-flex">
                        <input className={`form-control ${styleCreate['input']}`}
                            onChange={handleChangue}
                            name="Note"
                            value={formValues.Note}
                            placeholder='Nota...' />
                    </div>
                    <br />

                    <div className="d-flex justify-content-end">
                        <button className={styleCreate['button']} 
                            type="submit"
                            disabled={loading}>
                            {loading ? 'Creando...' : 'Crear'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default CardCreatePayment;