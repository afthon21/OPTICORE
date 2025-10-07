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

            console.log(`🔍 Making request to: ${baseUrl}${endpoint}`);
            console.log(`🔍 Method: ${method}`);
            console.log(`🔍 Headers:`, headers);
            console.log(`🔍 Body:`, body);
            console.log(`🔍 Token present:`, !!token);

            const res = await fetch(`${baseUrl}${endpoint}`, {
                method,
                headers,
                body: isFormData ? body : body ? JSON.stringify(body) : null
            });

            console.log(`🔍 Response status: ${res.status}`);
            console.log(`🔍 Response ok: ${res.ok}`);

            if (!res.ok) {
                const errorDetails = await res.json();
                console.log(`❌ Error details:`, errorDetails);
                setError(errorDetails.message);
                return null;
            }

            const responseData = await res.json();
            console.log(`✅ Response data:`, responseData);
            return responseData;
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