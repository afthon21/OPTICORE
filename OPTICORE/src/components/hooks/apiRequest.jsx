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
            if (requiresAuth && token) {
                headers['Authorization'] = `Bearer ${token}`;
            } else if (requiresAuth && !token) {
                setError('No authorization token found. Please login again.');
                return null;
            }

            const res = await fetch(`${baseUrl}${endpoint}`, {
                method,
                headers,
                body: isFormData ? body : body ? JSON.stringify(body) : null
            });

            if (!res.ok) {
                const contentType = res.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorDetails = await res.json();
                    setError(errorDetails.message);
                } else {
                    setError(`Server error: ${res.status} ${res.statusText}`);
                }
                return null;
            }

            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                setError('Server returned non-JSON response');
                return null;
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