import styleCreateCard from './css/createCard.module.css'

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { cleanData } from '../fragments/js/cleanData.js';
import { getDate } from '../fragments/js/getDate.js';

function CardCreateClient() {
    const [show, setShow] = useState({
        personalData: true,
        addressData: false
    });

    const [formValues, setFormValues] = useState({
        FirstName: undefined,
        SecondName: undefined,
        FatherLastName: undefined,
        MotherLastName: undefined,
        PhoneNumber: [],
        Email: undefined,
        State: undefined,
        Municipality: undefined,
        ZIP: undefined,
        Address: undefined,
        Cologne: undefined,
        Locality: undefined,
        OutNumber: undefined,
        InNumber: undefined
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

    const toggleForm = (form) => {
        setShow({
            personalData: false,
            documents: false,
            addressData: false,
            [form]: true // Activar solo el formulario seleccionado
        });
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
            const token = sessionStorage.getItem('token');
            const res = await fetch('http://localhost:3200/api/client/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(cleanedData)
            });

            if (!res.ok) {
                const errorDetails = await res.json(); // obtener el error
                console.log('Server response error:', errorDetails);

                return;
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
        <div className="container-fluid row-cols-4">

            <nav className="navbar navbar-expand-lg bg-body-tertiary w-100">
                <div className="container-fluid align-content-center">
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    role="button"
                                    onClick={() => toggleForm('personalData')}
                                >
                                    Datos personales
                                </a>
                            </li>


                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    role="button"
                                    onClick={() => toggleForm('addressData')}
                                >
                                    Ubicación
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>



            <div className={`card ${styleCreateCard['card-container']}`}>

                <div className={`justify-content-between d-flex align-items-center ${styleCreateCard['header']}`}>
                    <span>Nuevo Cliente</span>
                    <span><i className="bi bi-person-lines-fill me-2"></i> {getDate()}</span>
                </div>

                <div className={`card-body text-wrap ${styleCreateCard['body']}`}>
                    <form onSubmit={handleSubmit}>
                        {show.personalData && (
                            <>
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
                            </>
                        )}

                        {show.addressData && (
                            <>
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

                                <div className="d-flex justify-content-end">
                                    <button 
                                        type="submit"
                                        className={styleCreateCard['button']}>Aceptar</button>
                                </div>
                            </>
                        )}
                    </form>
                </div>

            </div>


        </div>
    );
}

export default CardCreateClient