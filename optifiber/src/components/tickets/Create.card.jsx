import styleCreate from './css/createCard.module.css';

import { useEffect, useState } from 'react';
import ApiRequest from '../hooks/apiRequest.jsx';

import { getDate } from '../fragments/js/getDate.js';
import { cleanData } from '../fragments/js/cleanData.js';
import Swal from 'sweetalert2';

import { DropdownClients } from '../fragments/Dropdown.clients.jsx';

export function CardCreateTicket({ clients = [] }) {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [formValues, setFormValues] = useState({
        Issue: '',
        Priority: '',
        Description: ''
    });

    const data = {
        Issue: formValues.Issue,
        Description: formValues.Description,
        Priority: formValues.Priority,
        Client: selected,
    };

    const priority = [
        { id: '0', name: 'Seleccione la prioridad...', hide: true, selected: true },
        { id: '1', name: 'Urgente'},
        { id: '2', name: 'Alta' },
        { id: '3', name: 'Media' },
        { id: '4', name: 'Baja' }
    ];

    useEffect(() => {
        setFormValues((prevValues) => ({
            ...prevValues,
            Client: selected,
        }));
    }, [selected]);

    const handleChangue = (e) => {
        const { name, value } = e.target;

        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleInputChange = (e) => {
        setSearch(e.target.value);
        setIsOpen(true);
    };

    const handleOptionClick = (option) => {
        const clientName = `${option.Name.FirstName} 
            ${option.Name.SecondName || ''} 
            ${option.LastName.FatherLastName}  
            ${option.LastName.MotherLastName}`
            .replace(/\s+/g, ' ')
            .trim();

        const clientId = option._id;

        setSelected(clientId);
        setSearch(clientName);
        setIsOpen(false);
    };

    const filteredOptions = clients.filter((option) => {
        const clientName = `${option.Name.FirstName} 
            ${option.Name.SecondName || ''} 
            ${option.LastName.FatherLastName} 
            ${option.LastName.MotherLastName}`
            .replace(/\s+/g, ' ')
            .trim();
        return clientName.toLowerCase().includes(search.toLowerCase());
    });

    const validators = () => {
        const errors = {};

        if (formValues.Issue.trim() === '' || !formValues.Issue) {
            errors.Issue = 'El asunto es obligatorio.';
        }
        if (formValues.Description.trim() === '' || !formValues.Description) {
            errors.Description = 'La descripción es obligatoria.';
        }
        if (!selected) {
            errors.Client = 'Debe seleccionar un cliente.';
        }
        if (!formValues.Priority || formValues.Priority === priority[0].name){
            errors.Priority = 'Selecciona la prioridad';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validators()) {
            setTimeout(() => {
                setFormErrors({});
            }, 1200);
            return
        }

        const cleanedData = cleanData(data);

        try {
            await makeRequest('/ticket/new', 'POST', cleanedData);

            Swal.fire({
                icon: 'success',
                title: 'Creado exitosamente!',
                timer: 1200,
                showConfirmButton: false,
                timerProgressBar: true,
                toast: true,
                position: 'bottom-end',
                background: '#e5e8e8',
            }).then(() => {
                setFormValues({
                    Issue: '',
                    Description: '',
                });

                setSearch('');
                setSelected('');
            });

            if (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el servidor!',
                    text: error,
                    timer: 1200,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    toast: true,
                    position: 'bottom-end',
                    background: '#e5e8e8'
                }).then(() => {
                    return;
                });
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className={`card p-3 mb-5 ${styleCreate['card-container']}`}>
            <div className={`justify-content-between d-flex align-items-center ${styleCreate['header']}`}>
                <span>Nuevo Ticket</span>
                <span>
                    <i className="bi bi-calendar-date"></i> {getDate()}
                </span>
            </div>

            <div className={`card-body ${styleCreate['body']}`}>
                <form onSubmit={handleSubmit}>
                    <label className="form-label">Cliente</label>

                    <div className="d-flex input-group">
                        <input
                            className={`form-control ${styleCreate['input']}`}
                            type="text"
                            value={search}
                            onChange={handleInputChange}
                            onFocus={() => setIsOpen(true)}
                            onBlur={() => setIsOpen(false)}
                            placeholder="Seleccionar Cliente"
                        />
                    </div>
                    {formErrors.Client && <p className={styleCreate['error']}>{formErrors.Client}</p>}
                    {isOpen && (
                        <DropdownClients filteredOptions={filteredOptions} onOptionClick={handleOptionClick} />
                    )}

                    <br />

                    <label className="form-label">Asunto</label>
                    <div className="d-flex input-group">
                        <input
                            type="text"
                            className={`form-control ${styleCreate['input']}`}
                            name="Issue"
                            value={formValues.Issue}
                            placeholder="Asunto..."
                            onChange={handleChangue}
                        />
                    </div>
                    {formErrors.Issue && <p className={styleCreate['error']}>{formErrors.Issue}</p>}
                    <br />

                    <label className="form-label">Prioridad</label>
                    <div className="d-flex input-group">
                        <select className={`form-select ${styleCreate['select']}`}
                            name='Priority'
                            onChange={handleChangue}
                            value={formValues.Priority || priority[0].name}>
                            {priority.map((index) => (
                                <option
                                    key={index.id}
                                    value={index.name}
                                    hidden={index.hide}>
                                    {index.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {formErrors.Priority && <p className={styleCreate['error']}>{formErrors.Priority}</p>}
                    <br />

                    <label className="form-label">Descripción</label>
                    <div className="d-flex input-group">
                        <textarea
                            className={`form-control ${styleCreate['text-area']}`}
                            name="Description"
                            value={formValues.Description}
                            placeholder="Descripción..."
                            onChange={handleChangue}
                        ></textarea>
                    </div>
                    {formErrors.Description && <p className={styleCreate['error']}>{formErrors.Description}</p>}
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
