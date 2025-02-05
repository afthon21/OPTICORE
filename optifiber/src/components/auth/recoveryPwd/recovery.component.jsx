import { useState, useEffect } from "react";
import ApiRequest from '../../hooks/apiRequest'
import Swal from "sweetalert2";

function RecoveryPwdComponent() {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [input, setInput] = useState('');
    const mail = { input };

    const handleChangue = (e) => {
        setInput(e.targetValue);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(mail);
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
                    onChange={handleChangue} />

                <button 
                    type="submit" 
                    className="btn btn-success mt-2">{ loading ? 'Buscando...' : 'Enviar'}</button>
            </form>
        </div>
    );
}

export default RecoveryPwdComponent;