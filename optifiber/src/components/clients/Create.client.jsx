import styleCreateCard from './css/createClient.module.css';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { cleanData } from '../fragments/js/cleanData.js';
import { getDate } from '../fragments/js/getDate.js';
import ApiRequest from '../hooks/apiRequest.jsx';
import ModalGoogleMap from './Modal.map.jsx';

function CreateClient() {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [formValues, setFormValues] = useState({
        FirstName: '',
        SecondName: '',
        FatherLastName: '',
        MotherLastName: '',
        PhoneNumber: [],
        Email: '',
        State: '',
        Municipality: '',
        ZIP: '',
        Address: '',
        Cologne: '',
        Locality: '',
        OutNumber: '',
        InNumber: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [center, setCenter] = useState({ lat: 0, lng: 0 });
    const [marker,setMarker] = useState({ lat: 0, lng: 0});
    const data = {
        Name: {
            FirstName: formValues.FirstName,
            SecondName: formValues.SecondName
        },
        LastName: {
            FatherLastName: formValues.FatherLastName,
            MotherLastName: formValues.MotherLastName
        },
        PhoneNumber: formValues.PhoneNumber,
        Email: formValues.Email,
        Location: {
            State: formValues.State,
            Municipality: formValues.Municipality,
            ZIP: formValues.ZIP,
            Address: formValues.Address,
            Cologne: formValues.Cologne,
            Locality: formValues.Locality,
            OutNumber: formValues.OutNumber,
            InNumber: formValues.InNumber,
            Latitude: marker.lat,
            Length: marker.lng
        }
    }

    const handleClear = () => {
        setFormValues({
            FirstName: '',
            SecondName: '',
            FatherLastName: '',
            MotherLastName: '',
            PhoneNumber: '',
            Email: '',
            State: '',
            Municipality: '',
            ZIP: '',
            Address: '',
            Cologne: '',
            Locality: '',
            OutNumber: '',
            InNumber: ''
        });
        setCenter({ lat: 0, lng: 0});
        setMarker({ lat: 0, lng: 0});
    }

    const handleChangue = (e) => {
        const { name, value } = e.target;

        setFormValues((prevValue) => ({
            ...prevValue,
            [name]: value
        }));

    }

    const validators = () => {
        const errors = {};

        // Campos requeridos
        const requiredFields = [
            'FirstName', 'FatherLastName', 'MotherLastName', 'PhoneNumber',
            'Email', 'State', 'Municipality', 'ZIP', 'Address', 'Cologne',
            'Locality', 'OutNumber'
        ];

        requiredFields.forEach(field => {
            if (!formValues[field] || (Array.isArray(formValues[field]) && formValues[field].length === 0)) {
                errors[field] = 'Campo requerido';
            }
        });

        // Validación de correo electrónico
        if (formValues.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.Email)) {
            errors.Email = 'Correo electrónico no válido';
        }

        // Validación de número de teléfono (asumiendo formato de 10 dígitos)
        if (formValues.PhoneNumber && !/^\d{10}$/.test(formValues.PhoneNumber)) {
            errors.PhoneNumber = 'Número de teléfono inválido (debe tener 10 dígitos)';
        }
        //Validación del código postal
        if (formValues.ZIP && !/^\d{5}$/.test(formValues.ZP)){
            errors.ZIP = 'El código postal debe tener 5 dígitos';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSearchLocation = async () => {
        const apiKey = import.meta.env.VITE_GOOGLE_MAP;
        const address = `${formValues.Address}, ${formValues.Municipality}, ${formValues.State}, ${formValues.ZIP}`;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

        try {
            const res = await fetch(url);
            const data = await res.json();

            if (data.status === 'OK') {
                const { lat, lng } = data.results[0].geometry.location;
                setCenter({ lat, lng });
            } else {
                console.log('Ubicación no encontrada');
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validators()) {
            setTimeout(() => {
                setFormErrors({})
            }, 1200);
            return;
        }

        const cleanedData = cleanData(data);
        try {
            const res = await makeRequest('/client/new', 'POST', cleanedData);
            Swal.fire({
                icon: 'success',
                title: 'Completado',
                text: res.message,
                toast: true,
                position: 'top',
                timer: 1200,
                timerProgressBar: true,
                showConfirmButton: false
            }).then(() => {
                handleClear();
            })

            if(error){
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: error,
                    toast: true,
                    timer: 1200,
                    timerProgressBar: true,
                    position: 'top',
                    showConfirmButton:false
                });
            }
        } catch (error) {
            console.log(error);
        }

    }

    const saveMarker = (markerPosition) =>{
        setMarker(markerPosition);
    }

    return (
        <div className="container-fluid" style={{ paddingLeft: '65px' }}>
            <div className={`row align-items-center mt-4 ${styleCreateCard['header']}`}>
                <div className="col">
                    <h3 className="mb-3">Nuevo Cliente</h3>
                </div>
                <div className="col text-end">
                    <span>
                        <i className="bi bi-person-lines-fill me-2"></i> {getDate()}
                    </span>
                </div>
            </div>

            <div className={`row align-items-center mt-3 ${styleCreateCard['body']}`}>
                <form className="row" onSubmit={handleSubmit}>
                    {/** Datos personales */}
                    <div className="col-6">
                        <div className="input-group mb-3">
                            <span className="input-group-text">Nombre</span>
                            <input type="text"
                                className={`form-control ${styleCreateCard['input']}`}
                                onChange={handleChangue}
                                name="FirstName"
                                value={formValues.FirstName}
                                placeholder="nombre..." />
                        </div>
                        {formErrors.FirstName && <p className={styleCreateCard['error']}>{formErrors.FirstName}</p>}

                        <div className="input-group mb-3">
                            <span className="input-group-text">Segundo Nombre</span>
                            <input type="text"
                                className={`form-control ${styleCreateCard['input']}`}
                                placeholder="(opcional)"
                                onChange={handleChangue}
                                name="SecondName"
                                value={formValues.SecondName} />
                        </div>

                        <div className="input-group mb-3">
                            <span className="input-group-text">Apellido Paterno</span>
                            <input type="text"
                                className={`form-control ${styleCreateCard['input']}`}
                                onChange={handleChangue}
                                name="FatherLastName"
                                value={formValues.FatherLastName}
                                placeholder="apellido..." />
                        </div>
                        {formErrors.FatherLastName && <p className={styleCreateCard['error']}>{formErrors.FatherLastName}</p>}

                        <div className="input-group mb-3">
                            <span className="input-group-text">Apellido Materno</span>
                            <input type="text"
                                className={`form-control ${styleCreateCard['input']}`}
                                onChange={handleChangue}
                                name="MotherLastName"
                                value={formValues.MotherLastName}
                                placeholder="apellido..." />
                        </div>
                        {formErrors.MotherLastName && <p className={styleCreateCard['error']}>{formErrors.MotherLastName}</p>}

                        <div className="input-group mb-3">
                            <span className="input-group-text">Teléfono</span>
                            <input type="number"
                                className={`form-control ${styleCreateCard['input']}`}
                                onChange={handleChangue}
                                name="PhoneNumber"
                                value={formValues.PhoneNumber}
                                placeholder="numero..." />
                        </div>
                        {formErrors.PhoneNumber && <p className={styleCreateCard['error']}>{formErrors.PhoneNumber}</p>}

                        <div className="input-group mb-3|">
                            <span className="input-group-text">Correo Electrónico</span>
                            <input type="email"
                                className={`form-control ${styleCreateCard['input']}`}
                                onChange={handleChangue}
                                name="Email"
                                value={formValues.Email}
                                placeholder="Email..." />
                        </div>
                        {formErrors.Email && <p className={styleCreateCard['error']}>{formErrors.Email}</p>}
                    </div>

                    {/** Ubicación */}
                    <div className="col-6">
                        <div className="input-group mb-3">
                            <span className="input-group-text">Calle</span>
                            <input type="text"
                                className={`form-control ${styleCreateCard['input']}`}
                                onChange={handleChangue}
                                name="Address"
                                value={formValues.Address}
                                placeholder="calle..." />
                        </div>
                        {formErrors.Address && <p className={styleCreateCard['error']}>{formErrors.Address}</p>}

                        <div className="d-flex justify-content-between">
                            <div className="input-group mb-3 me-3">
                                <span className="input-group-text">Numero Exterior</span>
                                <input type="text"
                                    className={`form-control ${styleCreateCard['input']}`}
                                    onChange={handleChangue}
                                    name="OutNumber"
                                    value={formValues.OutNumber}
                                    placeholder="#..." />
                            </div>
                            {formErrors.OutNumber && <p className={styleCreateCard['error']}>{formErrors.OutNumber}</p>}

                            <div className="input-group mb-3">
                                <span className="input-group-text">Numero Interior</span>
                                <input type="text"
                                    className={`form-control ${styleCreateCard['input']}`}
                                    placeholder="(opcional)"
                                    onChange={handleChangue}
                                    name="InNumber"
                                    value={formValues.InNumber} />
                            </div>
                        </div>

                        <div className="input-group mb-3 me-5">
                            <span className="input-group-text">Estado</span>
                            <input type="text"
                                className={`form-control ${styleCreateCard['input']}`}
                                onChange={handleChangue}
                                name="State"
                                value={formValues.State}
                                placeholder="estado..." />
                        </div>
                        {formErrors.State && <p className={styleCreateCard['error']}>{formErrors.State}</p>}

                        <div className="d-flex justify-content-between">
                            <div className="input-group mb-3 me-1">
                                <span className="input-group-text">Colonia</span>
                                <input type="text"
                                    className={`form-control ${styleCreateCard['input']}`}
                                    onChange={handleChangue}
                                    name="Cologne"
                                    value={formValues.Cologne}
                                    placeholder="colonia..." />
                            </div>
                            {formErrors.Cologne && <p className={styleCreateCard['error']}>{formErrors.Cologne}</p>}

                            <div className="input-group mb-3 me-1">
                                <span className="input-group-text">Localidad</span>
                                <input type="text"
                                    className={`form-control ${styleCreateCard['input']}`}
                                    onChange={handleChangue}
                                    name="Locality"
                                    value={formValues.Locality}
                                    placeholder="localidad..." />
                            </div>
                            {formErrors.Locality && <p className={styleCreateCard['error']}>{formErrors.Locality}</p>}

                        </div>

                        <div className="d-flex justify-content-between">
                            <div className="input-group mb-3">
                                <span className="input-group-text">Municipio</span>
                                <input type="text"
                                    className={`form-control ${styleCreateCard['input']}`}
                                    onChange={handleChangue}
                                    name="Municipality"
                                    value={formValues.Municipality}
                                    placeholder="municipio..." />
                            </div>
                            {formErrors.Municipality && <p className={styleCreateCard['error']}>{formErrors.Municipality}</p>}

                            <div className="input-group mb-3">
                                <span className="input-group-text">Código Postal</span>
                                <input type="text"
                                    className={`form-control ${styleCreateCard['input']}`}
                                    onChange={handleChangue}
                                    name="ZIP"
                                    value={formValues.ZIP}
                                    placeholder="c.p ..."
                                    maxLength={5}
                                />
                            </div>
                            {formErrors.ZIP && <p className={styleCreateCard['error']}>{formErrors.ZIP}</p>}

                        </div>

                        <button
                            className={styleCreateCard['btn-map']}
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target="#GoogleMapModal"
                            onClick={handleSearchLocation}>
                            Colocar Marcador en el mapa
                            <i className="bi bi-geo-alt-fill ms-2"></i>
                        </button>

                        <ModalGoogleMap center={center} handleMarker={saveMarker}/>
                    </div>

                    <div className="d-flex justify-content-end mt-3">
                        <button
                            className={styleCreateCard['btn-submit']}
                            type="submit">{loading ? 'Guardando...' : 'Aceptar'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateClient;