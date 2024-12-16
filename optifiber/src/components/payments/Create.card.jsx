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
        Client: selected,
        Method: undefined,
        Amount: undefined,
        Note: undefined,
    });

    const data = {
        Client: formValues.Client,
        Method: formValues.Method,
        Amount: formValues.Amount,
        Note: formValues.Note
    }

    const paymentMethods = [
        { id: '0', name: 'Método de pago...', hide: true, selected: true },
        { id: '1', name: 'Tarjeta de Crédito', icon: 'bi bi-credit-card' },
        { id: '2', name: 'Transferencia Bancaria', icon: 'bi bi-cash-coin' },
        { id: '3', name: 'Efectivo', icon: 'bi bi-cash-stack' },
        { id: '4', name: 'PayPal', icon: 'bi bi-paypal' }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cleanedData = cleanData(data);

        try {
            await makeRequest('/pay/new', 'POST', cleanedData);
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
                    Method: paymentMethods.find((item) => item.id === '0').name,
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
                    <div className="input-group">
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

                    <br />

                    {/* Selección de método de pago */}
                    <label className="form-label">Forma de Pago</label>
                    <div className="input-group">
                        <select
                            className={`form-select ${styleCreate['select']}`}
                            name="Method"
                            onChange={handleChangue}
                            value={formValues.Method}
                        >
                            {paymentMethods.map((method) => (
                                <option
                                    key={method.id}
                                    value={method.name}
                                    hidden={method.hide}
                                    selected={method.selected}
                                    className={styleCreate['option']}>

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
                            className={`form-control ${styleCreate['input']}`}
                            onChange={handleChangue}
                            name="Amount"
                            value={formValues.Amount}
                            placeholder='...' />
                    </div>
                    <br />

                    <label className="form-label">Nota</label>
                    <div className="input-group">
                        <input className={`form-control ${styleCreate['input']}`}
                            onChange={handleChangue}
                            name="Note"
                            value={formValues.Note}
                            placeholder='Nota...' />
                    </div>
                    <br />

                    <div className="d-flex justify-content-end">
                        <button className={styleCreate['button']} type="submit">
                            {loading ? 'Creando...' : 'Crear'}
                        </button>
                    </div>
                </form>

                {error && <p>Error: {error}</p>}
            </div>
        </div>
    );
}

export default CardCreatePayment;