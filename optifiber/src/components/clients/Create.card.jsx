import './css/create.card.css';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { cleanData } from '../fragments/js/cleanData.js';
import { getDate } from '../fragments/js/getDate.js';

import MapGoogle from '../fragments/Map.fragment';

function CardCreateClient() {
    const [show, setShow] = useState({
        personalData: true,
        contactData: false,
        addressData: false
    });
    const [formValues, setFormValues] = useState({
        FirstName: undefined,
        SecondName: undefined,
        FatherLastName: undefined,
        MotherLastName: undefined,
        PhoneNumber: [],
        Email: undefined,
    });
    const [mapValues,setMapValues] = useState({
        State: undefined,
        Municipally: undefined,
        ZIP: undefined,
        Address: undefined,
        Cologne: undefined,
        Locality: undefined,
        OutNumber: undefined,
        InNumber: undefined
    });
    const [mapPosition, setMapPosition] = useState({ lat: 23.23207252910053, lng: -102.74473891287083 });
    const [zoom, setZoom] = useState(5);

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
            State: mapValues.State,
            Municipally: formValues.Municipally,
            ZIP: mapValues.ZIP,
            Address: mapValues.Address,
            Cologne: mapValues.Cologne,
            Locality: mapValues.Locality,
            OutNumber: mapValues.OutNumber,
            InNumber: mapValues.InNumber
        }
    }

    const toggleForm = (form) => {
        setShow((prevState) => ({
            ...prevState,
            [form]: !prevState[form]
        }));
    }

    const handleChangue = (e) => {
        const { name, value } = e.target;

        if (['State', 'Municipally', 'ZIP', 'Address', 'Cologne', 'Locality', 'OutNumber', 'InNumber'].includes(name)) {
            setMapValues((prevValue) => ({
                ...prevValue,
                [name]: value
            }));
        } else {
            setFormValues((prevValue) => ({
                ...prevValue,
                [name]: value
            }));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cleanedData = cleanData(data);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3200/api/client/new',{
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
                toast:true,
                position:'bottom-end',
                background: '#e5e8e8'
            }).then(() => {
                setFormValues({
                    FirstName: '',
                    SecondName: '',
                    FatherLastName: '',
                    MotherLastName: '',
                    PhoneNumber: '',
                    Email: ''
                });

                setMapValues({
                    State: '',
                    Municipally: '',
                    ZIP: '',
                    Address: '',
                    Cologne: '',
                    Locality: '',
                    OutNumber: '',
                    InNumber: ''
                });

                setMapPosition({ lat: 23.23207252910053, lng: -102.74473891287083 });
                setZoom(5)
            })
        } catch (error) {
            console.log(error);
        }
    }

    const fetchCoordinates = async () => {
        const address = `${mapValues.State} ${mapValues.ZIP} ${mapValues.Address} ${mapValues.Municipally} ${mapValues.Cologne} ${mapValues.OutNumber} ${mapValues.Locality}`;
        if (!address.trim()) return;
  
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyChLoPQvv1n4ueqaHvbPlO1AoAXOoXIltM `
        );
        const data = await response.json();
  
        if (data.status === 'OK') {
          const { lat, lng } = data.results[0].geometry.location;
          setMapPosition({ lat, lng });
          setZoom(20); // Ajusta el zoom al nivel deseado
        } else {
            console.error('Error fetching coordinates:', data.status);
        }
    };

    useEffect(() => {
        fetchCoordinates();
    }, [mapValues]);



    return (
        <div className="card shadow p-3 mb-5 bg-body-tertiary rounded border-0" style={{ width: '50rem' }}>
            <div className="card-body">
                <div className="card-header justify-content-between d-flex">
                    <span>Registrar Cliente</span>
                    <span><i className="bi bi-calendar-date"></i> {getDate()}</span>
                </div>

                <div className="card-body text-wrap">

                    <form onSubmit={handleSubmit}>
                        {/** Formulario datos personales */}
                        <div className="d-flex justify-content-center line-title mt-3">
                            <a className="drop-form btn btn-outline-secondary border-0 shadow"
                                onClick={() => toggleForm('personalData')}
                                role="button">Datos Personales</a>
                        </div>

                        {show.personalData && (
                            <>
                                <label className="form-label mt-4">Nombre(s)</label>
                                <div className="input-group mb-3">
                                    <span className="input-group-text span-group">Nombre</span>
                                    <input type="text"
                                        className="form-control"
                                        onChange={handleChangue}
                                        name="FirstName"
                                        value={formValues.FirstName} />
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text span-group">Segundo Nombre</span>
                                    <input type="text"
                                        className="form-control"
                                        placeholder="(Opcional)"
                                        onChange={handleChangue}
                                        name="SecondName"
                                        value={formValues.SecondName} />
                                </div>

                                <label className="form-label">Apellidos</label>
                                <div className="input-group mb-3">
                                    <span className="input-group-text span-group">Apellido Paterno</span>
                                    <input type="text"
                                        className="form-control"
                                        onChange={handleChangue}
                                        name="FatherLastName"
                                        value={formValues.FatherLastName} />
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text span-group">Apellido Materno</span>
                                    <input type="text"
                                        className="form-control"
                                        onChange={handleChangue}
                                        name="MotherLastName"
                                        value={formValues.MotherLastName} />
                                </div>
                            </>
                        )}

                        {/** Formulario datos personales */}
                        <div className="d-flex justify-content-center line-title mt-4">
                            <a className="drop-form btn btn-outline-secondary border-0 shadow"
                                onClick={() => toggleForm('contactData')}
                                role="button">Datos de Contacto</a>
                        </div>

                        {show.contactData && (
                            <>
                                <label className="form-label mt-4">Teléfono(s)</label>
                                <div className="input-group mb-3">
                                    <span className="input-group-text span-group">Teléfono</span>
                                    <input type="text"
                                        className="form-control"
                                        onChange={handleChangue}
                                        name="PhoneNumber"
                                        value={formValues.PhoneNumber} />
                                </div>

                                <label className="form-label">Correo Electrónico</label>
                                <div className="input-group mb-3|">
                                    <span className="input-group-text span-group">Correo Electrónico</span>
                                    <input type="email"
                                        className="form-control"
                                        onChange={handleChangue}
                                        name="Email"
                                        value={formValues.Email} />
                                </div>
                            </>
                        )}

                        {/** Formulario datos de ubicación */}
                        <div className="d-flex justify-content-center line-title mt-4">
                            <a className="drop-form btn btn-outline-secondary border-0 shadow"
                                onClick={() => toggleForm('addressData')}
                                role="button">Datos de Ubicación</a>
                        </div>

                        {show.addressData && (
                            <>
                                <label className="form-label mt-4">Ubicación</label>

                                <div className="d-flex justify-content-between">
                                    <div className="input-group mb-3">
                                        <span className="input-group-text">Calle</span>
                                        <input type="text"
                                            className="form-control"
                                            onChange={handleChangue}
                                            name="Address"
                                            value={formValues.Address} />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <div className="input-group mb-3 me-3">
                                        <span className="input-group-text">Numero Exterior</span>
                                        <input type="text"
                                            className="form-control"
                                            onChange={handleChangue}
                                            name="OutNumber"
                                            value={formValues.OutNumber} />
                                    </div>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text">Numero Interior</span>
                                        <input type="text"
                                            className="form-control"
                                            placeholder="(opcional)"
                                            onChange={handleChangue}
                                            name="InNumber"
                                            value={formValues.InNumber} />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <div className="input-group mb-3 me-1">
                                        <span className="input-group-text">Colonia</span>
                                        <input type="text"
                                            className="form-control"
                                            onChange={handleChangue}
                                            name="Cologne"
                                            value={formValues.Cologne} />
                                    </div>
                                    <div className="input-group mb-3 me-1">
                                        <span className="input-group-text">Localidad</span>
                                        <input type="text"
                                            className="form-control"
                                            onChange={handleChangue}
                                            name="Locality"
                                            value={formValues.Locality} />
                                    </div>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text">Municipio</span>
                                        <input type="text"
                                            className="form-control"
                                            onChange={handleChangue}
                                            name="Municipally"
                                            value={formValues.Municipally} />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <div className="input-group mb-3 me-5">
                                        <span className="input-group-text">Estado</span>
                                        <input type="text"
                                            className="form-control"
                                            onChange={handleChangue}
                                            name="State"
                                            value={formValues.State} />
                                    </div>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text">Código Postal</span>
                                        <input type="text"
                                            className="form-control"
                                            onChange={handleChangue}
                                            name="ZIP"
                                            value={formValues.ZIP} />
                                    </div>
                                </div>

                                <MapGoogle zoom={zoom} marker={mapPosition}/>
                            </>
                        )}

                        <div className="card-footer d-flex justify-content-end mt-5">
                            <button className="btn btn-success" type="submit">Aceptar</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}

export default CardCreateClient