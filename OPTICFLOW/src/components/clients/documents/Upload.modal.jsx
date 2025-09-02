import styleFormModal from '../css/uploadModal.module.css'

import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import ApiRequest from '../../hooks/apiRequest';

export function UploadDoc({ client, onUploadSuccess }) { //se agrego lo segundo
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [file, setFile] = useState(null);
    const [value, setValue] = useState('');
    const [formErrors, setFormErrors] = useState({});

    const documentName = [
        { id: '0', name: 'Nombre del archivo...', hide: true, selected: true },
        { id: '1', name: 'Comprobante de domicilio' },
        { id: '2', name: 'INE - Frente' },
        { id: '3', name: 'INE - Reverso' },
        { id: '4', name: 'Foto de Fachada' },
        { id: '5', name: 'Dirección MAC' },
        { id: '6', name: 'Megas' },
        { id: '7', name: 'Contraseña de modem' },
        { id: '8', name: 'Potencia' }
    ];

    const handleChangue = (e) => {
        setValue(e.target.value);
    }

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    // Manejar el evento de soltar
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Verificar si hay archivos en el objeto de transferencia
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]); // Guardar el archivo en el estado
            console.log('Archivo cargado:', e.dataTransfer.files[0]);
            e.dataTransfer.clearData(); // Limpia los datos del drag & drop
        }
    };

    // Capturar archivo desde el input
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    /**
     * Limpiar formulario
     */
    const handleClear = () => {
        setValue(documentName.find((item) => item.id === '0').name);
        setFile(null);
    }

    useEffect(() => {
        /**
         * Usar para eliminar el contenido del formulario cuando se cierra el modal
         */
        const modal = document.getElementById('uploadModal');
        if (modal) {
            modal.addEventListener("hidden.bs.modal", handleClear);
        }

        return () => {
            if (modal) {
                modal.removeEventListener("hidden.bs.modal", handleClear)
            }
        }
    }, []);

    const validators = () => {
        const errors = {};

        if (value === documentName[0].name || !value) {
            errors.Description = 'Selecciona el nombre del documento';
        }

        if (!file) {
            errors.File = 'Sin archivo cargado'
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validators()) {
            setTimeout(() => {
                setFormErrors({});
            }, 1200);

            return;
        }

        const formData = new FormData();
        formData.append('Description', value);
        if (file) {
            formData.append('file', file)
        }

        try {
            await makeRequest(`/document/new/${client}`, 'POST', formData, { isFormData: true });

            // Simula click en el botón de cerrar del modal
            const closeBtn = document.querySelector('#uploadModal .btn-close');
            if (closeBtn) closeBtn.click();

            // Espera un poco para que el backdrop desaparezca antes del SweetAlert
            setTimeout(() => {
                Swal.fire({
                    toast: true,
                    icon: 'success',
                    title: 'Creado exitosamente!',
                    timer: 1500,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    position: 'top',
                    background: '#e5e8e8',
                });
            }, 300);

            if (onUploadSuccess) onUploadSuccess();
            handleClear();
            
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="modal fade"
            id="uploadModal"
            tabIndex="-1"
            aria-labelledby="#staticBackdropLabel"
            aria-hidden="true"
            data-bs-backdrop="static"
            data-bs-keyboard="false" >

            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Subir Archivo</h1>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div className="modal-body d-flex justify-content-center">

                        <form
                            onSubmit={handleSubmit}
                            className={styleFormModal['form']}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <span className={styleFormModal['form-title']}>Cargar archivo</span>
                            <p className={styleFormModal['form-paragraph']}>
                                El archivo debe ser una imagen o un PDF.
                            </p>

                            <div className="input-group">
                                <span className={`input-group-text ${styleFormModal['title']}`}>Archivo:</span>

                                <select
                                    className={`form-select ${styleFormModal['select']}`}
                                    name="Method"
                                    onChange={handleChangue}
                                    value={value}>

                                    {documentName.map((name) => (
                                        <option
                                            className={styleFormModal['option']}
                                            key={name.id}
                                            hidden={name.hide}
                                            selected={name.selected}
                                            value={name.name}>

                                            {name.name}
                                        </option>
                                    ))}

                                </select>
                            </div>
                            {formErrors.Description && <p style={{ color: 'red' }}>{formErrors.Description}</p>}

                            <label htmlFor="file-input" className={styleFormModal['drop-container']}>
                                <span className="drop-title">Suelta los archivos aquí</span>
                                <span>o</span>
                                <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    id="file-input"
                                    className={styleFormModal['file-input']}
                                    onChange={handleFileChange}
                                />
                                <span className={`mb-2 ${styleFormModal['input']}`}>Selecciona un Archivo</span>
                            </label>
                            {formErrors.File && <p style={{ color: 'red' }}>{formErrors.File}</p>}

                            {/* Mostrar detalles del archivo cargado */}
                            {file && (
                                <div className={styleFormModal['file-details']}>
                                    <div className="justify-content-between d-flex">
                                        <p>Archivo cargado: {file.name}</p>
                                        <button className="btn-close" onClick={handleClear}></button>
                                    </div>
                                    {/* Vista previa si es una imagen */}
                                    {file.type.startsWith('image/') && (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="Vista previa"
                                            className={styleFormModal['preview']}
                                            onLoad={() => URL.revokeObjectURL(file)}
                                        />
                                    )}
                                    {/*Enlace para descargar PDF*/}
                                    {file.type === 'application/pdf' &&(
                                        <a
                                            href={URL.createObjectURL(file)}
                                            terget="_blank"
                                            rel="noopener noreferrer"
                                            className={styleFormModal['pdf-link']}
                                        >
                                            Ver PDF
                                        </a>
                                    )}
                                </div>
                            )}

                            <div className="d-flex justify-content-end">
                                <button
                                    className={`mt-2 ${styleFormModal['btn-submit']}`}
                                    type="submit">    
                                    Aceptar
                                </button>

                                <button className={`mt-2 ms-2 ${styleFormModal['btn-exit']}`}
                                    data-bs-dismiss="modal"
                                    type="button"
                                    aria-label="Close">
                                    Cerrar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}