import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

function LoginComponent() {
    /** Cambiar entre Modals */
    const handleSwitchToRegister = () => {
        const loginModal = document.getElementById('loginModal');
        const registerModal = document.getElementById('registerModal');

        // Cierra el modal de Iniciar Sesión
        const bsLoginModal = bootstrap.Modal.getInstance(loginModal);
        bsLoginModal.hide();

        // Abre el modal de Registrarse
        const bsRegisterModal = new bootstrap.Modal(registerModal);
        bsRegisterModal.show();
    };

    /** Cerrar Modal*/
    const handleCloseModal = () => {
        const loginModal = document.getElementById('loginModal');
        const bsLoginModal = bootstrap.Modal.getInstance(loginModal);
        bsLoginModal.hide();
    }

    /** Hooks */
    const [formValues, setFormValues] = useState({
        Email: undefined,
        Password: undefined
    });
    const [formErrors, setFormErrors] = useState({});
    const [messageError, setMessageError] = useState('');
    const nav = useNavigate();

    /** Modelo de datos */
    const data = {
        Email: formValues.Email,
        Password: formValues.Password
    }

    /** Validar Formulario */
    const validators = () => {
        const errors = {};
        const requiredFields = ['Email', 'Password'];

        requiredFields.forEach(field => {
            if (!formValues[field]) {
                errors[field] = 'Campo Requerido';
            }
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    /** Limpiar formulario */
    useEffect(() => {
        const loginModal = document.getElementById('loginModal');

        const resetForm = () => {
            setFormValues({
                Email: '',
                Password: ''
            });
            setFormErrors({});
        }

        loginModal.addEventListener('hidden.bs.modal', resetForm);

        return () => {
            // Aquí debes remover el listener en lugar de agregarlo
            loginModal.removeEventListener('hidden.bs.modal', resetForm);
        }
    }, []);

    /** Envió de datos a través del API RESful */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validators()) {
            return;
        }

        try {
            const res = await fetch('http://localhost:3200/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                const errorDetails = await res.json();
                console.log('Server response error:', errorDetails);
                setMessageError(errorDetails.message);

                setTimeout(() => {
                    setMessageError(undefined);
                }, 5000);
                return; // salir si no hay error
            }

            const result = await res.json();
            setMessageError('');

            // Guarda el token o datos importantes en el almacenamiento si es necesario
            localStorage.setItem('adminId', result.adminId);
            localStorage.setItem('token', result.token);
            localStorage.setItem('userName', result.userName);
            localStorage.setItem('loginSuccess', true);

            // Guardamos el id del perfil
            const adminId = localStorage.getItem('adminId');
            const homeUrl = `/home/${adminId}`;

            // Navegar a la siguiente vista
            handleCloseModal();
            nav(homeUrl);

        } catch (error) {
            console.log('Error en la solicitud ', error);
        }
    }

    return (
        <>
            <div className="modal fade" id="loginModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Iniciar Sesión</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                            <form onSubmit={handleSubmit}>
                                <div className="input-group mb-3">
                                    <span className="input-group-tex w-25 text-center align-content-center" style={{ background: '#efefef' }}>Correo:</span>

                                    <input type="email"
                                        className="form-control"
                                        value={formValues.Email}
                                        onChange={(e) => setFormValues({ ...formValues, Email: e.target.value })} />

                                    {formErrors?.Email && (<p style={{ color: 'red' }}>{formErrors.Email}</p>)}

                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-tex w-25 text-center align-content-center" style={{ background: '#efefef' }}>Contraseña:</span>

                                    <input type="password"
                                        className="form-control"
                                        value={formValues.Password}
                                        onChange={(e) => setFormValues({ ...formValues, Password: e.target.value })} />

                                    {formErrors?.Email && (<p style={{ color: 'red' }}>{formErrors.Email}</p>)}

                                </div>
                                <div className="d-flex justify-content-center" >
                                    <button className="btn btn-primary" type="submit">Iniciar Sesión</button>
                                </div>
                            </form>

                            {messageError && (<div className="alert alert-danger align-content-center h-25" role="alert">{messageError}</div>)}

                        </div>
                        <div className="modal-footer">
                            <span>¿No tienes cuenta? <a href="#" onClick={handleSwitchToRegister}>Regístrate</a></span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


export default LoginComponent;