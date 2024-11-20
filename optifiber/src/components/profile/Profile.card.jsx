import styleCard from './css/profileCard.module.css'

import { useState } from 'react';

import Swal from 'sweetalert2';

/**
 * function ProfileCard({ profile }) {
    const [disable, setDisable] = useState({
        inputGroupA: true,
        inputGroupB: true
    });

    const [showSend, setShowSend] = useState({
        inputGroupA: false,
        inputGroupB: false
    });

    const [input, setInput] = useState({
        inputGroupB: false
    });

    const toggleInput = (inputGroup) => {
        setDisable((prevState) => ({
            ...prevState,
            [inputGroup]: !prevState[inputGroup]
        }));
        setShowSend((prevShowButton) => ({
            ...prevShowButton,
            [inputGroup]: !prevShowButton[inputGroup]
        }));
        setInput((prevInput) => ({
            ...prevInput,
            [inputGroup]: !prevInput[inputGroup]
        }));
    }

    const [formErrors, setFormErrors] = useState({});

    const [setMessageError] = useState('');

    const validators = (field) => {
        const errors = {};
        const requiredFields = ['Password', 'ConfirmPassword', 'Email'];

        if (field !== 'Password' && field !== 'ConfirmPassword') {
            setFormErrors({});
            return true;
        }

        requiredFields.forEach(fields => {
            if (!values[fields]) {
                errors[fields] = 'Campo Requerido';
            }
        });

        if (values.Password && values.Password.length < 8) {
            errors.Password = 'La contraseña debe tener al menos 8 caracteres';
        }

        // Validación de coincidencia de contraseñas
        if (values.Password && values.ConfirmPassword && values.Password !== values.ConfirmPassword) {
            errors.ConfirmPassword = 'Las contraseñas no coinciden';
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0;
    }

    const [values, setValues] = useState({
        FirstName: profile.Name.FirstName || '',
        SecondName: profile.Name.SecondName || '',
        FatherLastName: profile.LastName.FatherLastName || '',
        MotherLastName: profile.LastName.MotherLastName || '',
        Email: profile.Email || '',
        Password: profile.Password.slice(0, 4) + '****' + profile.Password.slice(-4) || '',
        ConfirmPassword: ''
    });

    const handleChangue = (e) => {
        const { name, value } = e.target;

        setValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    }

    const handleSubmit = async (e, fieldName) => {
        e.preventDefault();

        if (!validators(fieldName)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const toSend = { [fieldName]: values[fieldName] };

            const res = await fetch('http://localhost:3200/api/profile/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(toSend)
            });

            if (!res.ok) {
                const errorDetails = await res.json(); // obtener el error
                console.log('Server response error:', errorDetails);

                setMessageError(errorDetails.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: errorDetails.message,
                    toast: true,
                    position: 'bottom-right',
                    timer: 1500,
                    showCloseButton: true,
                    timerProgressBar: true
                }).then(() => {
                    setMessageError('');
                })
            }

            const result = await res.json();

            Swal.fire({
                icon: 'success',
                title: 'Actualizado!',
                text: result.message,
                timer: 1000,
                showConfirmButton: false,
                timerProgressBar: true,
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={`card ${styleCard['profile-card']} border-0 z-1`}>
            <div className="card-header d-flex justify-content-between">
                <span className={styleCard['header-content']}>Perfil</span>
                <span className={styleCard['header-content']}>{profile.UserName}</span>
            </div>

            <div className="card-body d-flex gap-3 flex-column justify-content-center align-items-center">
                <div className={`d-flex gap-2 row flex-column mb-3 ${styleCard['content-items']}`}>
                    <label className={styleCard['label']}>
                        <i className="bi bi-person-fill me-2"></i>
                        Datos Personales
                    </label>
                    <div className={`mb-2 ${styleCard['group']}`}>
                        <span className={styleCard['span']}>Nombres(s)</span>
                        <input type="text"
                            className={styleCard['input']}
                            disabled={disable.inputGroupA}
                            value={
                                `${values.FirstName} ${values.SecondName || ''}`
                            } />
                    </div>
                    <div className={`mb-2 ${styleCard['group']}`}>
                        <span className={styleCard['span']}>Apellidos</span>
                        <input type="text"
                            className={styleCard['input']}
                            disabled={disable.inputGroupA}
                            value={
                                ` ${values.FatherLastName} ${values.MotherLastName}`
                            } />
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={`d-flex gap-2 row flex-column mb-3 ${styleCard['content-items']}`}>
                        <div className="d-flex justify-content-between">
                            <label className={styleCard['label']}>
                                <i className="bi bi-envelope-check-fill me-2"></i>
                                Datos de Inicio
                            </label>

                            <a role="button" onClick={() => toggleInput('inputGroupB')}
                                className={styleCard['btn-edit']}>
                                Editar
                                <i className="bi bi-pencil-square"></i>
                            </a>
                        </div>
                        <div className={`mb-2 ${styleCard['group']}`}>
                            <span className={styleCard['span']}>Correo</span>
                            <input type="email"
                                className={styleCard['input']}
                                disabled={disable.inputGroupB}
                                onChange={handleChangue}
                                name='Email'
                                value={values.Email} />

                            {showSend.inputGroupB && (
                                <button
                                    type="submit"
                                    className={styleCard['btn-send']}>
                                    <i className="bi bi-send-fill"></i>
                                </button>
                            )}
                        </div>

                        {formErrors?.Password && (<p style={{ color: 'red', backgroundColor: 'red' }}>{formErrors.Password}</p>)}


                        <div className={`mb-2 ${styleCard['group']}`}>
                            <span className={styleCard['span']}>Contraseña</span>
                            <input type="password"
                                className={styleCard['input']}
                                disabled={disable.inputGroupB}
                                onChange={handleChangue}
                                name='Password'
                                value={values.Password} />

                            {showSend.inputGroupB && (
                                <button
                                    type="submit"
                                    className={styleCard['btn-send']}>
                                    <i className="bi bi-send-fill"></i>
                                </button>
                            )}
                        </div>

                        {formErrors?.Password && (<p style={{ color: 'red', backgroundColor: 'red' }}>{formErrors.Password}</p>)}

                        {input.inputGroupB && (
                            <div className={`mb-2 ${styleCard['group']}`}>
                                <span className={styleCard['span']}>Confirmar</span>
                                <input type="password"
                                    className={styleCard['input']}
                                    disabled={disable.inputGroupB}
                                    onChange={handleChangue}
                                    name='ConfirmPassword'
                                    value={values.ConfirmPassword} />
                            </div>
                        )}
                    </div>
                </form>
            </div>

            <div className="card-footer">
                <span className="fs-6 text-secondary">Fecha de registro: {profile.Date}</span>
            </div>
        </div>
    );
}
 * @param {*} param0 
 * @returns 
 */

function ProfileCard({ profile }) {
    const [values, setValues] = useState({
        FirstName: profile.Name.FirstName || '',
        SecondName: profile.Name.SecondName || '',
        FatherLastName: profile.LastName.FatherLastName || '',
        MotherLastName: profile.LastName.MotherLastName || '',
        Email: profile.Email || '',
        Password: profile.Password.slice(0, 4) + '****' + profile.Password.slice(-4) || '',
        ConfirmPassword: ''
    });
    const [disable,setDisable] = useState({
        inputGroupA: true,
        inputGroupB: true
    })

    return (
        <div className={`card mx-auto ${styleCard['container-card']}`}>
            <div className={`card-header d-flex justify-content-between ${styleCard['header']}`}>
                <span className="ms-3 me-auto">Perfil</span>
                <span className="ms-auto me-3">{profile.UserName}</span>
            </div>

            <div className="card-body">
                <label className={`form-label ${styleCard['title']}`}>Datos Personales</label>
                <div className="input-group mb-3">
                    <span className={`input-group-text ${styleCard['item']}`}>Nombre(s)</span>
                    <input 
                        type="text"
                        className={`form-control ${styleCard['input']}`}
                        disabled={disable.inputGroupA}
                        value={`${values.FirstName} ${values.SecondName || ''}`} />
                </div>

                <div className="input-group mb-3">
                    <span className={`input-group-text ${styleCard['item']}`}>Apellidos</span>
                    <input 
                        type="text"
                        className={`form-control ${styleCard['input']}`}
                        disabled={disable.inputGroupA}
                        value={`${values.FatherLastName} ${values.MotherLastName}`} />
                </div>

                <label className={`form-label ${styleCard['title']}`}>Datos de Inicio</label>
                <div className="input-group mb-3">
                    <span className={`input-group-text ${styleCard['item']}`}>Correo</span>
                    <input 
                        type="text"
                        className={`form-control ${styleCard['input']}`}
                        disabled={disable.inputGroupB}
                        value={`${values.FirstName} ${values.SecondName || ''}`} />
                </div>

                <div className="input-group mb-3">
                    <span className={`input-group-text ${styleCard['item']}`}>Apellidos</span>
                    <input 
                        type="text"
                        className={`form-control ${styleCard['input']}`}
                        disabled={disable.inputGroupB}
                        value={`${values.FatherLastName} ${values.MotherLastName}`} />
                </div>
            </div>

            <div className="card-footer">
                <span className="text-secondary text-sm-end">Registro: {profile.Date}</span>
            </div>
        </div>
    );
}

export default ProfileCard;