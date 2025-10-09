import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { cleanData } from "../../fragments/js/cleanData.js";
import ApiRequest from '../../hooks/apiRequest.jsx';
import { LoadFragment } from '../../fragments/Load.fragment.jsx';

function RegisterComponent() {
    /** Cambiar entre Modals */
    const handleSwitchToLogin = () => {
        const registerModal = document.getElementById('registerModal');
        const loginModal = document.getElementById('loginModal');

        // Cierra el modal de Registrarse
        const bsRegisterModal = bootstrap.Modal.getInstance(registerModal);
        bsRegisterModal.hide();

        // Abre el modal de Iniciar Sesión
        const bsLoginModal = new bootstrap.Modal(loginModal);
        bsLoginModal.show();
    };

    /** Hooks */
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [formValues, setFormValues] = useState({
        FirstName: '',
        SecondName: '',
        FatherLastName: '',
        MotherLastName: '',
        Email: '',
        Password: '',
        ConfirmPassword: '',
        Region: 'Estado de México' // Valor por defecto
    });
    const [formErrors, setFormErrors] = useState({});

    /** Modelo de datos */
    const data = {
        Name: {
            FirstName: formValues.FirstName,
            SecondName: formValues.SecondName
        },
        LastName: {
            FatherLastName: formValues.FatherLastName,
            MotherLastName: formValues.MotherLastName
        },
        Email: formValues.Email,
        Password: formValues.Password,
        Role: 'admin', // Valor por defecto
        Region: formValues.Region
    }

    /** Validar Inputs */
    const validators = () => {
        const errors = {};

        const requiredFields = ['Password', 'ConfirmPassword', 'Email', 'MotherLastName', 'FatherLastName', 'FirstName'];
        requiredFields.forEach(field => {
            if (!formValues[field]) {
                errors[field] = 'Campo Requerido';
            }
        });

        // Validación de longitud de contraseña
        if (formValues.Password && formValues.Password.length < 8) {
            errors.Password = 'La contraseña debe tener al menos 8 caracteres';
        }

        // Validación de coincidencia de contraseñas
        if (formValues.Password && formValues.ConfirmPassword && formValues.Password !== formValues.ConfirmPassword) {
            errors.ConfirmPassword = 'Las contraseñas no coinciden';
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0;
    }

    /** Limpiar Formulario */
    useEffect(() => {
        const registerModal = document.getElementById('registerModal');
        const resetForm = () => {
            setFormValues({
                FirstName: '',
                SecondName: '',
                FatherLastName: '',
                MotherLastName: '',
                Email: '',
                Password: '',
                ConfirmPassword: '',
                Region: 'Estado de México' // Valor por defecto
            });
            setFormErrors({});
        };

        // cierre del modal
        registerModal.addEventListener('hidden.bs.modal', resetForm);

        // Cleanup para eliminar cuando el componente se desmonta
        return () => {
            registerModal.removeEventListener('hidden.bs.modal', resetForm);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validators()) {
            setTimeout(() => {
               setFormErrors({}); 
            }, 1200);
            return;
        }

        // Filtra los campos vacíos del objeto 'data'
        const cleanedData = cleanData(data);

        try {
            const res = await makeRequest('/auth/register', 'POST', cleanedData);

            /**
             * Mostrar alerta de error
             */
            if (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el servidor!',
                    text: error || 'Error desconocido',
                    timer: 1200,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    toast: true,
                    position: 'top',
                    background: '#e5e8e8'
                });
            }

            // Mostrar alerta de éxito
            Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: res.message,
                position: 'top',
                timer: 1200,
                showConfirmButton: false,
                toast: true,
                timerProgressBar: true,
            }).then(() => {
                // Cambiar al modal de login después de cerrar la alerta
                handleSwitchToLogin();
            });
        } catch (error) {
            console.log('Error en la solicitud', error);
        }
    }

    return (
        <>
            <div className="modal fade" id="registerModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Regístrate</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                            <form onSubmit={handleSubmit}>
                                <div className="input-group mb-3">
                                    <span className="input-group-tex w-25 text-center align-content-center" style={{ background: '#efefef' }}>Nombre(s):</span>

                                    <input type="text"
                                        className="form-control"
                                        placeholder="Primer Nombre"
                                        value={formValues.FirstName}
                                        onChange={(e) => setFormValues({ ...formValues, FirstName: e.target.value })} />

                                    {formErrors?.FirstName && (<p style={{ color: 'red' }}>{formErrors.FirstName}</p>)}

                                    <input type="text"
                                        className="form-control"
                                        placeholder="Segundo Nombre (Opcional)"
                                        value={formValues.SecondName}
                                        onChange={(e) => setFormValues({ ...formValues, SecondName: e.target.value })} />
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-tex w-25 text-center align-content-center" style={{ background: '#efefef' }}>Apellidos:</span>

                                    <input type="text"
                                        className="form-control"
                                        placeholder="Apellido Paterno"
                                        value={formValues.FatherLastName}
                                        onChange={(e) => setFormValues({ ...formValues, FatherLastName: e.target.value })} />

                                    {formErrors?.FatherLastName && (<p style={{ color: 'red' }}>{formErrors.FatherLastName}</p>)}

                                    <input type="text"
                                        className="form-control"
                                        placeholder="Apellido Materno"
                                        value={formValues.MotherLastName}
                                        onChange={(e) => setFormValues({ ...formValues, MotherLastName: e.target.value })} />
                                    {formErrors?.MotherLastName && (<p style={{ color: 'red' }}>{formErrors.MotherLastName}</p>)}

                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-tex w-25 text-center align-content-center" style={{ background: '#efefef' }}>Correo:</span>

                                    <input type="email"
                                        className="form-control"
                                        placeholder="Correo Electrónico"
                                        value={formValues.Email}
                                        onChange={(e) => setFormValues({ ...formValues, Email: e.target.value })} />

                                    {formErrors?.Email && (<p style={{ color: 'red' }}>{formErrors.Email}</p>)}

                                </div>

                                <div className="input-group mb-3">
                                    <span className="input-group-tex w-25 text-center align-content-center" style={{ background: '#efefef' }}>Contraseña:</span>

                                    <input type="password"
                                        className="form-control"
                                        placeholder="Crear Contraseña"
                                        value={formValues.Password}
                                        onChange={(e) => setFormValues({ ...formValues, Password: e.target.value })} />

                                    {formErrors?.Password && (<p style={{ color: 'red' }}>{formErrors.Password}</p>)}

                                    <input type="password"
                                        className="form-control"
                                        placeholder="Confirmar Contraseña"
                                        value={formValues.ConfirmPassword}
                                        onChange={(e) => setFormValues({ ...formValues, ConfirmPassword: e.target.value })} />

                                    {formErrors?.ConfirmPassword && (<p style={{ color: 'red' }}>{formErrors.ConfirmPassword}</p>)}

                                </div>
                                                                <div className="input-group mb-3">
                                    <span className="input-group-tex w-25 text-center align-content-center" style={{ background: '#efefef' }}>Región:</span>

                                    <select 
                                        className="form-control"
                                        value={formValues.Region}
                                        onChange={(e) => setFormValues({ ...formValues, Region: e.target.value })}
                                    >
                                        <option value="Estado de México">Estado de México</option>
                                        <option value="Puebla">Puebla</option>
                                    </select>

                                    {formErrors?.Region && (<p style={{ color: 'red' }}>{formErrors.Region}</p>)}

                                </div>
                                <div className="d-flex justify-content-center" >
                                    <button className="btn btn-primary" type="submit">{loading ? 'Creando...' : 'Regístrate'}</button>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <span>¿Ya tienes cuenta? <a href="#" onClick={handleSwitchToLogin}>Inicia Sesión</a></span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RegisterComponent;