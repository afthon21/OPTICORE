import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiRequest from "../hooks/apiRequest";

export function CreateTechnician() {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        nombre: '',
        apellidoP: '',
        apellidoA: '',
        telefono: '', 
        email: '',    
        activo: false,
        numEmpleado: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        
        const technicianData = {
            nombre: formData.nombre,
            apellidoP: formData.apellidoP,
            apellidoA: formData.apellidoA,
            activo: formData.activo 
        };

        try {
           
           
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(technicianData),
            });

            if (response.ok) {
                alert(`✅ Técnico ${formData.nombre} registrado con éxito.`);
                setFormData({
                    nombre: '', apellidoP: '', apellidoA: '', telefono: '', email: '', 
                    activo: true, numEmpleado: '' 
                });
            } else {
                const errorResult = await response.json();
                alert(`❌ Error al registrar: ${errorResult.message}`);
            }

        } catch (error) {
            console.error('Error de red o servidor:', error);
            alert('❌ No se pudo conectar con el servidor. Verifica la URL de la API.');
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4 header-container">
                <h2 className="title-text">Nuevo Técnico</h2>
                <div className="date-display">
                    <i className="bi bi-person-fill"></i> 
                    <span>{new Date().toLocaleDateString('es-MX')}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 form-container shadow-sm">
                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
                            <label htmlFor="nombre">Nombre</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" name="apellidoP" placeholder="Apellido Paterno" value={formData.apellidoP} onChange={handleChange} required />
                            <label htmlFor="apellidoP">Apellido Paterno</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" name="apellidoA" placeholder="Apellido Materno" value={formData.apellidoA} onChange={handleChange} required />
                            <label htmlFor="apellidoA">Apellido Materno</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="tel" className="form-control" name="telefono" placeholder="Número de Teléfono" value={formData.telefono} onChange={handleChange} />
                            <label htmlFor="telefono">Teléfono</label>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-floating mb-3">
                            <input type="email" className="form-control" name="email" placeholder="Correo Electrónico" value={formData.email} onChange={handleChange} />
                            <label htmlFor="email">Correo Electrónico</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" name="numEmpleado" placeholder="Número de Empleado" value={formData.numEmpleado} onChange={handleChange} />
                            <label htmlFor="numEmpleado">Número de Empleado</label>
                        </div>
                        
                        <div className="form-check form-switch mt-4">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                role="switch" 
                                id="activoSwitch"
                                name="activo"
                                checked={formData.activo}
                                onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="activoSwitch">
                                Técnico Activo
                            </label>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                    <button type="submit" className="btn btn-success btn-lg">
                        Aceptar
                    </button>
                </div>
            </form>
        </div>
    );
}