import { useState } from "react";
import ApiRequest from "../../hooks/apiRequest";

function ResetPwdComponent() {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [code, setCode] = useState('');
    const email = localStorage.getItem('email')
    const data = { Email: email, Code: code };

    const handleChange = (e) => {
        setCode(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await makeRequest('/auth/verify-recovery-code', 'POST', data, { requiresAuth: false });
            
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1>Ingresa el código de recuperación</h1>
            <form action="" onSubmit={handleSubmit}>
                <input type="text"
                    value={code}
                    onChange={handleChange}
                    className="form-control" />

                <button type="submit">Aceptar</button>
            </form>
        </div>
    );
}

export default ResetPwdComponent;