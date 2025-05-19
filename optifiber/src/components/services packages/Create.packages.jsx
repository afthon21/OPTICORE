import { useEffect, useState } from "react";
import ApiRequest from "../hooks/apiRequest";

import { LoadFragment } from "../fragments/Load.fragment";
import CardCreatePackage from "./Create.card";

function CreatePackage() {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [data,setData] = useState([])

    const handleLoadClients = async () => {
        try {
            const result = await makeRequest('/client/all');
            setData(result);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleLoadClients()
    },[makeRequest]);

    if (loading) return <LoadFragment />

    if (error) return <p>Error: {error}</p>

    return(
        <div className="container-fluid d-flex justify-content-center mt-1">
            <CardCreatePackage />
        </div>
    );
}

export default CreatePackage;