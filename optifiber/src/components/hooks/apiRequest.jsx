import { useCallback, useState } from "react";

/**
 * Custom hook para manejar todas las solicitudes HTTP de la APIRest
 * @param {*} baseUrl 
 * @returns 
 */

function ApiRequest(baseUrl) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const makeRequest = useCallback(async (endpoint, method = 'GET', body = null, isFormData = false) => {
        setLoading(true);
        setError(null);

        try {
            const token = sessionStorage.getItem('token');
            const headers = isFormData ? { 'Authorization': `Bearer ${token}` } :
                {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }

            const res = await fetch(`${baseUrl}${endpoint}`, {
                method,
                headers,
                body: isFormData ? body : body ? JSON.stringify(body) : null
            });

            if (!res.ok) {
                const errorDetails = await res.json();
                throw await res.json(errorDetails.message || 'Error en la solicitud');
            }

            return await res.json();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [baseUrl]);

    return { makeRequest, loading, error }
}

export default ApiRequest;