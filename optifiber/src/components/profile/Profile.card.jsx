import styleCard from './css/profileCard.module.css'

import { useState } from 'react';

import Swal from 'sweetalert2';


function ProfileCard({ profile }) {
    const [values, setValues] = useState({
        FirstName: profile?.Name?.FirstName || '',
        SecondName: profile?.Name?.SecondName || '',
        FatherLastName: profile?.LastName?.FatherLastName || '',
        MotherLastName: profile?.LastName?.MotherLastName || '',
        Email: profile?.Email || '',
        Password: profile?.Password
        ? profile.Password.slice(0, 4) + '****' + profile.Password.slice(-4)
        : '',
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

    const handleSubmit = async (e, fieldGroup) => {
    e.preventDefault();
    if (fieldGroup === 'inputGroupA') {
        const updatedData = {
            FirstName: values.FirstName,
            SecondName: values.SecondName,
            FatherLastName: values.FatherLastName,
            MotherLastName: values.MotherLastName
        };

        // Se llama al back para hacer la actualizacion
        Swal.fire('Datos personales actualizados', '', 'success');
    } else if (fieldGroup === 'inputGroupB') {
        if (values.Email || (!values.Password && !values.ConfirmPassword)) {
            Swal.fire('Correo actualizado', '', 'success');
        }

        if (values.Password || values.ConfirmPassword) {
            const isValid = validators('Password');
            if (!isValid) {
                return; 
            }

            Swal.fire('Contraseña actualizada', '', 'success');
        }
    }

    setDisable((prevState) => ({
        ...prevState,
        [fieldGroup]: true
    }));
    setShowSend((prevShowButton) => ({
        ...prevShowButton,
        [fieldGroup]: false
    }));
    setInput((prevInput) => ({
        ...prevInput,
        [fieldGroup]: false
    }));
};

    return (
        <div className={`card mx-auto ${styleCard['container-card']}`}>
            <div className={`d-flex justify-content-between mt-3 ${styleCard['header']}`}>
                <span className="ms-3 me-auto">Perfil</span>
                <span className="ms-auto me-3">{profile.UserName}</span>
            </div>
        
        <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center">
            <label className={`form-label m-0 ${styleCard['title']}`}>
                <i className="bi bi-person-fill me-1"></i>
                Datos Personales
            </label>
        <a role="button" onClick={() => toggleInput('inputGroupA')}
            className={styleCard['btn-edit']}>
            Editar <i className="bi bi-pencil-square ms-1"></i>
        </a>
        </div>

            
                <div className="input-group mb-3">
                    <span className={`input-group-text text-wrap d-flex ${styleCard['item']}`}>Nombre(s):</span>
                    <input
                        type="text"
                        className={`form-control ${styleCard['input']}`}
                        onChange={handleChangue}
                        disabled={disable.inputGroupA}
                        name='FirstName'
                        value={`${values.FirstName}`} />
                    <input
                        type="text"
                        className={`form-control ${styleCard['input']}`}
                        onChange={handleChangue}
                        disabled={disable.inputGroupA}
                        name='SecondName'
                        value={`${values.SecondName}`} />

                            {showSend.inputGroupA && (
                            <button
                            type="submit"
                            className={styleCard['btn-send']}
                            onClick={(e)=>handleSubmit(e,'inputGroupA')}>
                            <i className="bi bi-send-fill"></i>
                            </button>
                        )}
                </div>

                <div className="input-group mb-3">
                    <span className={`input-group-text text-wrap d-flex ${styleCard['item']}`}>Apellidos:</span>
                    <input
                        type="text"
                        className={`form-control ${styleCard['input']}`}
                        onChange={handleChangue}
                        disabled={disable.inputGroupA}
                        name='FatherLastName'
                        value={`${values.FatherLastName}`} />
                        <input 
                        type="text"
                        className={`form-control ${styleCard['input']}`}
                        onChange={handleChangue}
                        disabled={disable.inputGroupA}
                        name='MotherLastName'
                        value={`${values.MotherLastName}`} />
                            {showSend.inputGroupA && (
                            <button
                            type="submit"
                            className={styleCard['btn-send']}
                            onClick={(e)=>handleSubmit(e,'inputGroupA')}>
                            <i className="bi bi-send-fill"></i>
                            </button>
                    )}
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
                    <span className={`input-group-text text-wrap d-flex ${styleCard['item']}`}>Correo:</span>
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
                            className={styleCard['btn-send']}
                            onClick={(e)=>handleSubmit(e,'inputGroupB')}>
                            <i className="bi bi-send-fill"></i>
                        </button>
                    )}
                </div>
                {formErrors?.Password && (<p style={{ color: 'red', backgroundColor: 'red' }}>{formErrors.Password}</p>)}


                <div className="input-group mb-3">
                    <span className={`input-group-text text-wrap d-flex ${styleCard['item']}`}>Contraseña:</span>
                    <input
                        type="password"
                        className={`form-control ${styleCard['input']}`}
                        disabled={disable.inputGroupB}
                        onChange={handleChangue}
                        name='Password'
                        value={`${values.Password}`} />
                        
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
                        {showSend.inputGroupB && (
                            <button
                            type="submit"
                            className={styleCard['btn-send']}
                            onClick={(e)=>handleSubmit(e,'inputGroupB')}>
                            <i className="bi bi-send-fill"></i>
                            </button>
                         )}
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