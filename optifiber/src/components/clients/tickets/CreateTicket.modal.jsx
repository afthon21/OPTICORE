import styleFormTIcket from '../css/createTicket.module.css';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { cleanData } from '../../fragments/js/cleanData';

function CreateTicket({ client }) {
    const [formValues, setFormValues] = useState({
        Issue: undefined,
        Description: undefined,
    });
    const data = {
        Issue: formValues.Issue,
        Description: formValues.Description
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
            Issue: '',
            Description: ''
        })
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
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cleanedData = cleanData(data);

        try {
            await fetch(`/ticket/new/${client}`, 'POST', cleanedData);

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
                handleClear();
            });
        } catch (error) {

        }
    }
    return (
        <div className="modal fade" id="CreateTicketModal" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="ModalLabel">TIcket</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                            <br />

                            <div className="d-flex justify-content-end mt-4">
                                <button
                                    className={`mt-2 ${styleFormTIcket['btn-submit']}`}
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

export default CreateTicket;