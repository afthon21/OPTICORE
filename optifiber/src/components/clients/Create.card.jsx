import styleCreateCard from './css/createCard.module.css'

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { cleanData } from '../fragments/js/cleanData.js';
import { getDate } from '../fragments/js/getDate.js';
import ApiRequest from '../hooks/apiRequest.jsx'

function CardCreateClient() {
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
            InNumber: formValues.InNumber
        }
    }

    const handleChangue = (e) => {
        const { name, value } = e.target;

        setFormValues((prevValue) => ({
            ...prevValue,
            [name]: value
        }));

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cleanedData = cleanData(data);
        try {
            await makeRequest('/client/new', 'POST', cleanedData);

            if (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'error creando!',
                    timer: 1200,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    toast: true,
                    position: 'top',
                    background: '#e5e8e8'
                });
    
                return
            }

            Swal.fire({
                icon: 'success',
                title: 'Creado exitosamente!',
                timer: 1200,
                showConfirmButton: false,
                timerProgressBar: true,
                toast: true,
                position: 'bottom-end',
                background: '#e5e8e8'
            }).then(() => {
                setFormValues({
                    FirstName: '',
                    SecondName: '',
                    FatherLastName: '',
                    MotherLastName: '',
                    PhoneNumber: '',
                    Email: '',
                    State: '',
                    Municipally: '',
                    ZIP: '',
                    Address: '',
                    Cologne: '',
                    Locality: '',
                    OutNumber: '',
                    InNumber: ''
                });
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (

        <div className={`card ${styleCreateCard['card-container']}`}>

            <div className={`justify-content-between d-flex align-items-center ${styleCreateCard['header']}`}>
                <span>Nuevo Cliente</span>
                <span><i className="bi bi-person-lines-fill me-2"></i> {getDate()}</span>
            </div>

            <div className={`card-body text-wrap ${styleCreateCard['body']}`}>
                <form onSubmit={handleSubmit}>
                    {/** Datos personales */}

                    <div className="input-group mb-3">
                        <span className="input-group-text">Nombre</span>
                        <input type="text"
                            className={`form-control ${styleCreateCard['input']}`}
                            onChange={handleChangue}
                            name="FirstName"
                            value={formValues.FirstName}
                            placeholder="nombre..." />
                    </div>
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

                    <div className="input-group mb-3">
                        <span className="input-group-text">Apellido Materno</span>
                        <input type="text"
                            className={`form-control ${styleCreateCard['input']}`}
                            onChange={handleChangue}
                            name="MotherLastName"
                            value={formValues.MotherLastName}
                            placeholder="apellido..." />
                    </div>

                    <div className="input-group mb-3">
                        <span className="input-group-text">Teléfono</span>
                        <input type="number"
                            className={`form-control ${styleCreateCard['input']}`}
                            onChange={handleChangue}
                            name="PhoneNumber"
                            value={formValues.PhoneNumber}
                            placeholder="numero..." />
                    </div>

                    <div className="input-group mb-3|">
                        <span className="input-group-text">Correo Electrónico</span>
                        <input type="email"
                            className={`form-control ${styleCreateCard['input']}`}
                            onChange={handleChangue}
                            name="Email"
                            value={formValues.Email}
                            placeholder="Email..." />
                    </div>

                    {/** Ubicación */}

                    <div>
                        <div className="d-flex justify-content-between">
                            <div className="input-group mb-3">
                                <span className="input-group-text">Calle</span>
                                <input type="text"
                                    className={`form-control ${styleCreateCard['input']}`}
                                    onChange={handleChangue}
                                    name="Address"
                                    value={formValues.Address}
                                    placeholder="calle..." />
                            </div>
                        </div>

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
                            <div className="input-group mb-3 me-1">
                                <span className="input-group-text">Localidad</span>
                                <input type="text"
                                    className={`form-control ${styleCreateCard['input']}`}
                                    onChange={handleChangue}
                                    name="Locality"
                                    value={formValues.Locality}
                                    placeholder="localidad..." />
                            </div>
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
                            <div className="input-group mb-3">
                                <span className="input-group-text">Código Postal</span>
                                <input type="text"
                                    className={`form-control ${styleCreateCard['input']}`}
                                    onChange={handleChangue}
                                    name="ZIP"
                                    value={formValues.ZIP}
                                    placeholder="c.p..." />
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end">
                        <button
                            type="submit"
                            className={styleCreateCard['button']}>Aceptar</button>
                    </div>

                </form>
            </div>

        </div>
    );
}

export default CardCreateClient