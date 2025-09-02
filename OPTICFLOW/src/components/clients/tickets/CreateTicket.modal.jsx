import styleFormTIcket from '../css/createTicket.module.css';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { cleanData } from '../../fragments/js/cleanData';
import ApiRequest from '../../hooks/apiRequest';
import { DropdownTechnicians } from '../../fragments/Dropdown.technician.jsx';


function CreateTicket({ client, technicians = [], onTicketCreated }) {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [searchTech, setSearchTech] = useState('');
    const [isTechOpen, setIsTechOpen] = useState(false);
    const [selectedTech, setSelectedTech] = useState('');
    const [formValues, setFormValues] = useState({
        Issue: '',
        Description: '',
        Priority: '',
        tecnico: ''
    });
    
    const [formErrors, setFormErrors] = useState({});
    
    const priority = [
        { id: '0', name: 'Seleccione la prioridad...', hide: true, selected: true },
        { id: '1', name: 'Urgente' },
        { id: '2', name: 'Alta' },
        { id: '3', name: 'Media' },
        { id: '4', name: 'Baja' }
    ];
    const filteredTechOptions = technicians.filter(option => {
    const fullName = `${option.nombre} ${option.apellidoP || ''} ${option.apellidoA || ''}`.replace(/\s+/g, ' ').trim();
    return fullName.toLowerCase().includes(searchTech.toLowerCase());
});

    const handleChangue = (e) => {
        const { name, value } = e.target;

        setFormValues((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleClear = () => {
        setFormValues({
            Issue: '',
            Description: '',
            Priority: priority.find((item) => item.id === '0').name,
            tecnico: ''
        });
        setSearchTech('');
        setSelectedTech('');
        setIsTechOpen(false);
        setFormErrors({});
    }

    useEffect(() => {
        /**
        * Limpiar modal al cerrar lo
        */
        const modal = document.getElementById('CreateTicketModal');

        if (modal) {
            modal.addEventListener("hidden.bs.modal", handleClear);
        }

        return () => {
            if (modal) {
                modal.removeEventListener("hidden.bs.modal", handleClear)
            }
        }
    });

    const validators = () => {
        const errors = {};

        if (formValues.Issue.trim() === '' || !formValues.Issue) {
            errors.Issue = 'El asunto es obligatorio.';
        }
        if (formValues.Description.trim() === '' || !formValues.Description) {
            errors.Description = 'La descripción es obligatoria.';
        }

        if (!formValues.Priority || formValues.Priority === priority[0].name){
            errors.Priority = 'Selecciona la prioridad';
        }
        if (!formValues.tecnico || formValues.tecnico.trim() === '') {
            errors.tecnico = 'Selecciona un técnico';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        const data = {
        Issue: formValues.Issue,
        Description: formValues.Description,
        Priority: formValues.Priority,
        tecnico: formValues.tecnico
    };



        const cleanedData = cleanData(data);

        if (!validators()) {
            setTimeout(() => {
                setFormErrors({});
            }, 1200);
            return
        }

        try {
            await makeRequest(`/ticket/new/${client}`, 'POST', cleanedData);

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
                // Actualizar la tabla de tickets en el componente padre
                if (onTicketCreated) {
                    onTicketCreated();
                }
                // Cerrar el modal usando el botón oculto
                const closeButton = document.getElementById('closeModalButton');
                if (closeButton) {
                    closeButton.click();
                }
            });

            if (error) {
                Swal.fire({
                    icon:'error',
                    title: 'Error!',
                    text: error,
                    showConfirmButton: false,
                    timer: 1200,
                    toast: true,
                    timerProgressBar: true,
                    position: 'top'
                });

                return
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <div className="modal fade" id="CreateTicketModal" tabIndex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="ModalLabel">Ticket</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        {/* Botón oculto para cerrar el modal programáticamente */}
                        <button 
                            id="closeModalButton" 
                            type="button" 
                            className="d-none" 
                            data-bs-dismiss="modal" 
                            aria-label="Close">
                        </button>
                    </div>
                    <div className={`modal-body ${styleFormTIcket['body']}`}>

                        <form onSubmit={handleSubmit}>
                            <label className="form-label">Asunto</label>
                            <div className="d-flex input-group">
                                <input type="text"
                                    className={`form-control ${styleFormTIcket['input']}`}
                                    name="Issue"
                                    value={formValues.Issue}
                                    onChange={handleChangue}
                                    placeholder='Asunto...'
                                />
                            </div>
                            {formErrors.Issue && <p className={styleFormTIcket['error']}>{formErrors.Issue}</p>}
                            <br />

                            <label className="form-label">Prioridad</label>
                            <div className="d-flex input-group">
                                <select className={`form-select ${styleFormTIcket['select']}`}
                                    name="Priority"
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
                            {formErrors.Priority && <p className={styleFormTIcket['error']}>{formErrors.Priority}</p>}
                            <br />

                            <label className="form-label">Descripción</label>
                            <div className="d-flex input-group">
                                <textarea className={`form-control ${styleFormTIcket['text-area']}`}
                                    name="Description"
                                    value={formValues.Description}
                                    onChange={handleChangue}
                                    placeholder='Descripción...'
                                ></textarea>
                            </div>
                            {formErrors.Description && <p className={styleFormTIcket['error']}>{formErrors.Description}</p>}
                            <br />
                            <label className="form-label">Técnico</label>
<div className="d-flex input-group">
    <input
        className={`form-control ${styleFormTIcket['input']}`}
        type="text"
        value={searchTech}
        
        onFocus={() => setIsTechOpen(true)}
        onBlur={() => setTimeout(() => setIsTechOpen(false), 100)}
        placeholder="Seleccionar Técnico"
        name="tecnico"
        autoComplete="off"
        readOnly
    />
</div>
{formErrors.tecnico && <p className={styleFormTIcket['error']}>{formErrors.tecnico}</p>}
{isTechOpen && (
    <DropdownTechnicians
        filteredOptions={filteredTechOptions}
        onOptionClick={option => {
            const techName = `${option.nombre} ${option.apellidoP || ''} ${option.apellidoA || ''}`.replace(/\s+/g, ' ').trim();
            setSelectedTech(techName);
            setSearchTech(techName);
            setIsTechOpen(false);
            setFormValues(prev => ({ ...prev, tecnico: techName }));
        }}
    />
)}

                            <div className="d-flex justify-content-end mt-4">
                                <button
                                    className={`mt-2 ${styleFormTIcket['btn-submit']}`}
                                    type="submit" >
                                    {loading ? 'Creando...' : 'Aceptar'}
                                </button>

                                <button
                                    className={`ms-2 mt-2 ${styleFormTIcket['btn-exit']}`}
                                    data-bs-dismiss="modal"
                                    aria-label="Close">Cerrar</button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateTicket;