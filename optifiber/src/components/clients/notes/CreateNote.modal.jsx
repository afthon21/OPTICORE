import { useEffect, useRef, useState } from "react";
import ApiRequest from "../../hooks/apiRequest";

import { cleanData } from "../../fragments/js/cleanData";
import Swal from "sweetalert2";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";

function CreateNote({ client, onNoteCreated }) {
    const { makeRequest, loading } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [description, setDescription] = useState('');
    const modalRef = useRef(null);

    const handleChange = (e) => {
        setDescription(e.target.value);
    };

    const handleClear = () => {
        setDescription('');
    };

    useEffect(() => {
        const modal = modalRef.current;
        if (!modal) return;

        const instance = bootstrap.Modal.getOrCreateInstance(modal);
        modal.addEventListener("hidden.bs.modal", handleClear);

        return () => {
            modal.removeEventListener("hidden.bs.modal", handleClear);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cleanedData = cleanData({ Description: description });

        try {
            const res = await makeRequest(`/note/new/${client}`, 'POST', cleanedData);

            await Swal.fire({
                icon: 'success',
                title: 'Nota agregada',
                text: res.message,
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 1200,
                timerProgressBar: true
            });

            // Cierra el modal
            const modalElement = modalRef.current;
            if (modalElement) {
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                modalInstance.hide();
            }

            // Limpia campo y actualiza tabla
            setDescription('');
            if (typeof onNoteCreated === 'function') {
                onNoteCreated();
            }

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error al crear la nota',
                text: 'Inténtalo de nuevo más tarde.',
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true
            });
        }
    };

    
    return (
        <div className="modal fade" id="CreateNoteModal" tabIndex="-1" aria-labelledby="ModalLabel" aria-hidden="true" ref={modalRef}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="ModalLabel">Agregar Nota</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="note">Descripción</label>
                            <textarea
                                id="note"
                                className="form-control"
                                value={description}
                                onChange={handleChange}
                                required
                            ></textarea>

                            <button type="submit" className="btn btn-primary mt-3 w-100">
                                {loading ? 'Creando...' : 'Aceptar'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateNote;
