import { useState, useEffect } from "react";
import ApiRequest from '../../hooks/apiRequest';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { handleResetPassword } from '../../fragments/js/Routes.js'

function RecoveryPwdComponent() {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [email, setEmail] = useState('');
    const data = { Email: email };
    const navigate = useNavigate();

    const handleChangue = (e) => {
        setEmail(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await makeRequest('/auth/sent-recovery-code', 'POST', data, { requiresAuth: false });

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: res.message,
                toast: true,
                position: 'top',
                timer: 1200,
                timerProgressBar: true,
                showConfirmButton: false
            }).then (() => {
                handleResetPassword(navigate)
            });

            localStorage.setItem('email', email);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="row justify-content-center">
            <h1>Recuperar contraseña</h1>
            <p>Enviaremos un correo con un código de recuperación a tu bandeja</p>
            <p>El código es valido por 15 min</p>
            <label htmlFor="">Ingresa tu dirección Correo</label>
            <form action="" onSubmit={handleSubmit}>
                <input type="text"
                    className="form-control"
                    value={email}
                    onChange={handleChangue} />

                <button
                    type="submit"
                    className="btn btn-success mt-2">{loading ? 'Buscando...' : 'Enviar'}</button>
            </form>
        </div>
    );
}

export default RecoveryPwdComponent;