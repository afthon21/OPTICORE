import styleCreate from './css/createCard.module.css'

import { useEffect, useState } from 'react';
import { getDate } from '../fragments/js/getDate.js';
import { cleanData } from '../fragments/js/cleanData.js';
import Swal from 'sweetalert2';

import { DropdownClients } from '../fragments/Dropdown.clients.jsx';

export function CardCreateTicket({ clients = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState('');
    const { formErrors, setFormErrors } = useState({});
    const [formValues, setFormValues] = useState({
        Issue: undefined,
        Description: undefined,
    });

    const data = {
        Issue: formValues.Issue,
        Description: formValues.Description,
        Client: selected
    }
    /** Actualizar el valor del id del cliente al seleccionar otro diferente */
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

        const cleanedData = cleanData(data)
        try {
            const token = sessionStorage.getItem('token');
            const res = await fetch('http://localhost:3200/api/ticket/new', {
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
                timer: 1000,
                showConfirmButton: false,
                timerProgressBar: true,
                toast: true,
                position: 'bottom-end',
                background: '#e5e8e8'
            }).then(() => {
                setFormValues({
                    Issue: '',
                    Description: '',
                });
                setSearch('');
                setSelected('')
            });

        } catch (error) {
            console.log(error);
        }
    }

    return (

        <div className={`card p-3 mb-5 ${styleCreate['card-container']}`}>

            <div className={`justify-content-between d-flex align-items-center ${styleCreate['header']}`}>
                <span>Nuevo Ticket</span>
                <span><i className="bi bi-calendar-date"></i> {getDate()}</span>
            </div>

            <div className={`card-body ${styleCreate['body']}`}>

                <form onSubmit={handleSubmit}>
                    <label className="form-label">Cliente</label>

                    <div className="d-flex input-group">
                        <input className={`form-control ${styleCreate['input']}`}
                            type="text"
                            value={search}
                            onChange={handleInputChange}
                            onFocus={() => setIsOpen(true)}
                            onBlur={() => setIsOpen(false)}
                            placeholder="Seleccionar Cliente" />
                    </div>
                    {isOpen && (
                        <DropdownClients
                            filteredOptions={filteredOptions}
                            onOptionClick={handleOptionClick} />
                    )}

                    <br />

                    <label className="form-label">Asunto</label>
                    <div className="d-flex input-group">
                        <input type="text"
                            className={`form-control ${styleCreate['input']}`}
                            name="Issue"
                            value={formValues.Issue}
                            placeholder='Asunto...'
                            onChange={handleChangue} />
                    </div>
                    <br />

                    <label className="form-label">Descripción</label>
                    <div className="d-flex input-group">
                        <textarea className={`form-control ${styleCreate['text-area']}`}
                            name="Description"
                            value={formValues.Description}
                            placeholder='Descripción...'
                            onChange={handleChangue}></textarea>
                    </div>
                    <br />

                    {formErrors && (<p style={{ color: 'red' }} >{formErrors}</p>)}

                    <div className="d-flex justify-content-end">
                        <button className={styleCreate['button']} type="submit">
                            Aceptar
                        </button>
                    </div>
                </form>

            </div>
        </div>

    );
}