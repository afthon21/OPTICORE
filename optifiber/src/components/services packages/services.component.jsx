import { useState, useEffect } from "react";
import ApiRequest from "../hooks/apiRequest";

import { LoadFragment } from "../fragments/Load.fragment";

function ServicePackagesComponent() {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [data, setData] = useState([]);

    const handleLoad = async () => {
        try {
            const res = await makeRequest('/packages/all');
            setData(res);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleLoad()
    }, [makeRequest]);

    if (loading) return <LoadFragment />

    if (error) return <p>Error: {error}</p>
}