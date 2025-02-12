import { useEffect, useState } from "react";
import ApiRequest from "../../hooks/apiRequest";

import { cleanData } from "../../fragments/js/cleanData";
import Swal from "sweetalert2";

function CreateNote({ client }) {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [description, setDescription] = useState('');
    const data = { Description: description };

    const handleChangue = (e) => {
        setDescription(e.target.value);
    }

    const handleClear = () => {
        setDescription('');
    }

    useEffect(() => {
        const modal = document.getElementById('CreateNoteModal');

        if (modal) {
            modal.addEventListener("hidden.bs.modal", handleClear);
        }

        return () => {
            if (modal) {
                modal.removeEventListener("hidden.bs.modal", handleClear)
            }
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cleanedData = cleanData(data);
        try {
            const res = await makeRequest(`/note/new/${client}`, 'POST', cleanedData);
            
            Swal.fire({
                icon: 'success',
                title: 'Nota agregada',
                text: res.message,
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 1200,
                timerProgressBar: true
            }).then(() => {
                handleClear();
            })

            if (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: error,
                    toast: true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 1200,
                    timerProgressBar: true
                });

                return;
            }

            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="modal fade" id="CreateNoteModal" tabIndex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="ModalLabel">Modal title</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form action="" onSubmit={handleSubmit}>
                            <label htmlFor="">Agregar Nota</label>
                            <textarea className="form-control"
                                value={description}
                                onChange={handleChangue}></textarea>

                            <button type="submit">{loading ? 'Creando...' : 'Aceptar'}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateNote;