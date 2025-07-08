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


  const validators = (fieldGroup) => {
  const errors = {};
  if (fieldGroup === 'inputGroupA') {
    if (!values.FirstName || values.FirstName.trim() === '') {
      errors.FirstName = 'El nombre es obligatorio';
    }
    if (!values.SecondName || values.SecondName.trim() === '') {
      errors.SecondName = 'El segundo nombre es obligatorio';
    }
    if (!values.FatherLastName || values.FatherLastName.trim() === '') {
      errors.FatherLastName = 'El apellido paterno es obligatorio';
    }
    if (!values.MotherLastName || values.MotherLastName.trim() === '') {
      errors.MotherLastName = 'El apellido materno es obligatorio';
    }
    if (!values.Email || values.Email.trim() === '') {
      errors.Email = 'El correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(values.Email)) {
      errors.Email = 'El correo no es válido';
    }
  }
  if (fieldGroup === 'inputGroupB') {
    if (!values.Password || values.Password.trim() === '') {
      errors.Password = 'La contraseña es obligatoria';
    } else if (values.Password.length < 6) {
      errors.Password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (!values.ConfirmPassword || values.ConfirmPassword.trim() === '') {
      errors.ConfirmPassword = 'Confirma tu contraseña';
    } else if (values.Password !== values.ConfirmPassword) {
      errors.ConfirmPassword = 'Las contraseñas no coinciden';
    }
  }
  return errors;
};



    const handleChangue = (e) => {
        const { name, value } = e.target;

        setValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    }

   const handleSubmit = async (e, fieldGroup) => {
        e.preventDefault();
        const errors = validators(fieldGroup);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor revisa los campos marcados.',
            });
            return;
        }
        const token = sessionStorage.getItem('token');
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'No autorizado',
                text: 'No se encontró el token. Por favor inicia sesión nuevamente.',
            });
            return;
        }

        try {
            const updatedData =
                fieldGroup === 'inputGroupA'
                    ? {
                        FirstName: values.FirstName,
                        SecondName: values.SecondName,
                        FatherLastName: values.FatherLastName,
                        MotherLastName: values.MotherLastName,
                        Email: values.Email,
                    }
                    : {
                        Password: values.Password,
                        ConfirmPassword: values.ConfirmPassword,
                    };

            const res = await fetch(`http://localhost:3000/api/profile/edit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData),
            });

            console.log('Fetch status:', res.status);

            if (res.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'No autorizado',
                    text: 'Token inválido o expirado. Por favor inicia sesión nuevamente.',
                });
                return;
            }
            if (!res.ok) {
                const errorText = await res.text();
                console.error('Error response:', errorText);
                throw new Error('Error en la actualización');
            }

            Swal.fire({
                icon: 'success',
                title: 'Actualizado',
                text: 'Tus datos se han guardado correctamente.',
            });

            toggleInput(fieldGroup);
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error al guardar',
                text: 'Hubo un problema al actualizar los datos.',
            });
        }
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
                        <i className="bi bi-envelope-at-fill me-1"></i>
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