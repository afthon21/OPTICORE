import './css/create.card.css'

import { useEffect, useState } from 'react';
import { cleanData } from "../fragments/js/cleanData.js";
import Swal from 'sweetalert2';
import { getDate } from '../fragments/js/getDate.js';

import { DropdownClients } from '../fragments/Dropdown.clients.jsx';

function CardCreatePayment({ clients = [] }) {
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
        }))
    }

    const handleInputChange = (e) => {
        setSearch(e.target.value);
        setIsOpen(true);
    };

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
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3200/api/pay/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(cleanedData)
            });

            if (!res.ok) {
                const errorDetails = await res.json(); // obtener el error
                console.log('Server response error:', errorDetails);

                return;
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
                    Method: '',
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
        <div className="card shadow p-3 mb-5 bg-body-tertiary rounded" style={{ width: '45rem' }}>
            <div className="card-header justify-content-between d-flex">
                <span>Nuevo Pago</span>
                <span><i className="bi bi-calendar-date"></i> {getDate()}</span>
            </div>

            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <label className="form-label">Cliente</label>
                    <div className="input-group">
                        <input className="form-control"
                            type="text"
                            value={search}
                            onChange={handleInputChange}
                            onFocus={() => setIsOpen(true)}
                            onBlur={() => setIsOpen(false)}
                            placeholder="Seleccionar Cliente..." />
                    </div>
                    <div className="text-bg-secondary">
                        {isOpen && (
                            <DropdownClients
                                filteredOptions={filteredOptions}
                                onOptionClick={handleOptionClick} />
                        )}
                    </div>
                    <br />

                    <label className="form-label">Forma de Pago</label>
                    <div className="input-group">
                        <input type="text"
                            className="form-control"
                            onChange={handleChangue}
                            name="Method"
                            value={formValues.Method} />
                    </div>
                    <br />

                    <label className="form-label">Monto</label>
                    <div className="input-group">
                        <input type="number"
                            className="form-control"
                            onChange={handleChangue}
                            name="Amount"
                            value={formValues.Amount} />
                    </div>
                    <br />

                    <label className="form-label">Nota</label>
                    <div className="input-group">
                        <textarea className="form-control"
                            onChange={handleChangue}
                            name="note"
                            value={formValues.Note}></textarea>
                    </div>
                    <br />

                    <div className="d-flex justify-content-end">
                        <button className="btn btn-success" type="submit">Aceptar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CardCreatePayment;