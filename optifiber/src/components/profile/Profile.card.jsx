import styleCard from './css/profileCard.module.css'

import { useState } from 'react';

import Swal from 'sweetalert2';


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
    const [disable, setDisable] = useState({
        inputGroupA: true,
        inputGroupB: true
    })
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

    const [messageError] = useState('');

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
            const token = sessionStorage.getItem('token');
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

                messageError(errorDetails.message);
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
                    messageError('');
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
        <div className={`card mx-auto ${styleCard['container-card']}`}>
            <div className={`d-flex justify-content-between mt-3 ${styleCard['header']}`}>
                <span className="ms-3 me-auto">Perfil</span>
                <span className="ms-auto me-3">{profile.UserName}</span>
            </div>

            <div className="card-body">
                <label className={`form-label ${styleCard['title']}`}>
                    <i class="bi bi-person-fill me-1"></i>
                    Datos Personales
                </label>
                
                <div className="input-group mb-3">
                    <span className={`input-group-text text-wrap d-flex ${styleCard['item']}`}>Nombre(s)</span>
                    <input
                        type="text"
                        className={`form-control ${styleCard['input']}`}
                        disabled={disable.inputGroupA}
                        value={`${values.FirstName} ${values.SecondName || ''}`} />
                </div>

                <div className="input-group mb-3">
                    <span className={`input-group-text text-wrap d-flex ${styleCard['item']}`}>Apellidos</span>
                    <input
                        type="text"
                        className={`form-control ${styleCard['input']}`}
                        disabled={disable.inputGroupA}
                        value={`${values.FatherLastName} ${values.MotherLastName}`} />
                </div>


                {/** Formulario para editar correo o contraseña */}
                <div className="d-flex justify-content-between mt-4">
                    <label className={`form-label ${styleCard['title']}`}>
                        <i class="bi bi-envelope-at-fill me-1"></i>
                        Datos de Inicio
                    </label>

                    <a role="button" onClick={() => toggleInput('inputGroupB')}
                        className={styleCard['btn-edit']}>
                        Editar
                        <i className="bi bi-pencil-square"></i>
                    </a>
                </div>

                <div className="input-group mb-3">
                    <span className={`input-group-text text-wrap d-flex ${styleCard['item']}`}>Correo</span>
                    <input
                        type="text"
                        className={`form-control ${styleCard['input']}`}
                        onChange={handleChangue}
                        disabled={disable.inputGroupB}
                        name='Email'
                        value={`${values.Email}`} />

                    {showSend.inputGroupB && (
                        <button
                            type="submit"
                            className={styleCard['btn-send']}>
                            <i className="bi bi-send-fill"></i>
                        </button>
                    )}
                </div>
                {formErrors?.Password && (<p style={{ color: 'red', backgroundColor: 'red' }}>{formErrors.Password}</p>)}


                <div className="input-group mb-3">
                    <span className={`input-group-text text-wrap d-flex ${styleCard['item']}`}>Contraseña</span>
                    <input
                        type="password"
                        className={`form-control ${styleCard['input']}`}
                        disabled={disable.inputGroupB}
                        onChange={handleChangue}
                        name='Password'
                        value={`${values.Password}`} />

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
                    <div className="input-group mb-3">
                        <span className={`input-group-text text-wrap d-flex ${styleCard['item']}`}>Confirmar</span>
                        <input type="password"
                            className={`form-control ${styleCard['input']}`}
                            disabled={disable.inputGroupB}
                            onChange={handleChangue}
                            name='ConfirmPassword'
                            value={values.ConfirmPassword} />
                    </div>
                )}
            </div>

            <div className="card-footer">
                <span className="text-secondary text-sm-end fs-6">Registro: {profile.Date}</span>
            </div>
        </div>
    );
}

export default ProfileCard;