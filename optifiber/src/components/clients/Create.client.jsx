import styleCreateCard from './css/createCard.module.css';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { cleanData } from '../fragments/js/cleanData.js';
import { getDate } from '../fragments/js/getDate.js';
import ApiRequest from '../hooks/apiRequest.jsx';

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

        const requiredFields = ['FirstName', 'SecondName', 'FatherLastName', 'MotherLastName', 'PhoneNumber',
            'Email', 'State', 'Municipality', 'ZIP', 'Address', 'Cologne', 'Locality', 'OutNumber', 'InNumber'
        ];
        requiredFields.forEach(item => {
            if (!formValues[item]) {
                errors[item] = 'Campo requerido';
            }
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
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
            await makeRequest('/client/new', 'POST', cleanedData);

            if (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: error,
                    timer: 1200,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top'
                });

                return;
            }

            if (loading) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Creando',
                    text: 'Guardando...',
                    timer: 1200,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top'
                });
            }

            Swal.fire({
                icon: 'success',
                title: 'Creado exitosamente!',
                timer: 1200,
                showConfirmButton: false,
                timerProgressBar: true,
                toast: true,
                position: 'top',
                background: '#e5e8e8'
            }).then(() => {
                handleClear();
            })
        } catch (error) {
            console.log(error);
        }

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
                        {formErrors.FirstName && <p>{formErrors.FirstName}</p>}

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
                                    placeholder="c.p ..." />
                            </div>
                        </div>

                        <button type="button">Colocar Marcador en el mapa<i className="bi bi-geo-alt-fill ms-2"></i></button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateClient;