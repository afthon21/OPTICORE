import { useCallback, useState } from "react";

/**
 * Custom hook para manejar todas las solicitudes HTTP de la APIRest
 * @param {*} baseUrl 
 * @returns 
 */

function ApiRequest(baseUrl) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const makeRequest = useCallback(async (endpoint, method = 'GET', body = null, { isFormData = false, requiresAuth = true } = {}) => {
        setLoading(true);
        setError(null);

        try {
            const token = sessionStorage.getItem('token');
            const headers = {};

            if (!isFormData) headers['Content-Type'] = 'application/json';
            if (requiresAuth && token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${baseUrl}${endpoint}`, {
                method,
                headers,
                body: isFormData ? body : body ? JSON.stringify(body) : null
            });

            if (!res.ok) {
                const errorDetails = await res.json();
                setError(errorDetails.message);
                return;
            }

            return await res.json();
        } catch (error) {
            setError(error.message);
            return null;
        } finally {
            setLoading(false)
        }
    }, [baseUrl])

    return { makeRequest, loading, error };
}

export default ApiRequest;