import { useEffect, useState } from "react";
import ApiRequest from "../hooks/apiRequest.jsx";

import { cleanData } from "../fragments/js/cleanData.js";
import { getDate } from "../fragments/js/getDate.js";
import Swal from "sweetalert2";

function CardCreatePackage() {
    const {makeRequest, loading, error} = ApiRequest(import.meta.env.VITE_API_BASE);
    const [formValues, setFormValues] = useState({
        Name: '',
        Price: '',
        Services: [],
        Description: ''
    });
    const [formErrors, setFormErrors] = useState({});

    const data = {
        Name: formValues.Name,
        Price: formValues.Price,
        Service: formValues.Services,
        Description: formValues.Description
    }

    
    return(
        <div className="p-3 mb-5 "> 
            <div className="justify-content-between d-flex align-items-center">
                <span>Nuevo Paquete</span>
                <span><i className="bi bi-calendar-date"></i> {getDate()}</span>
            </div>

            <div>
                <form action="">
                    <label htmlFor="">Nombre</label>
                    <input type="text"
                        className="form-control" />

                    <label htmlFor="">Precio</label>
                    <input type="number"
                        className="form-control" />

                    <label htmlFor="">Servicios</label>
                    <input type="text"
                        className="form-control" />

                    <label htmlFor="">Descripción</label>
                    <input type="text"
                        className="form-control" />

                    <button type="submit"
                        className="btn btn-success">{loading ? 'Creando...' : 'Crear'}</button>
                </form>
            </div>
        </div>
    );
}

export default CardCreatePackage;