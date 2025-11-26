import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiRequest from "../hooks/apiRequest";
import Swal from 'sweetalert2';

export function CreateTechnician() {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        nombre: '',
        apellidoP: '',
        apellidoA: '',
        email: '',
        mercado: 'Estado de México',
        zona: '',
        telefono: '',
        activo: true
    });

    const { makeRequest } = ApiRequest(import.meta.env.VITE_API_BASE);

    // Zonas disponibles por mercado
    const zonesByMercado = {
        'Estado de México': [
            'Zona de los Volcanes',
            'Zona Metropolitana del Valle de México',
            'Zona Norte',
            'Zona Oriente',
            'Zona Sur',
            'Zona de Tierra Caliente',
            'Zona de las Sierras'
        ],
        'Puebla': [
            'Centro',
            'Angelópolis',
            'Mixteca',
            'Sierra Norte',
            'Sierra Nororiental',
            'Sierra Negra',
            'Valle de Tehuacán',
            'Valle de Serdán',
            'Valle de Atlixco y Matamoros',
            'Mixteca Baja'
        ]
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => {
            const next = { ...prevData, [name]: type === 'checkbox' ? checked : value };
            // Si cambia el mercado, resetear la zona seleccionada
            if (name === 'mercado') {
                next.zona = '';
            }
            return next;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        
        const technicianData = {
            nombre: formData.nombre,
            apellidoP: formData.apellidoP,
            apellidoA: formData.apellidoA,
            email: formData.email,
            telefono: formData.telefono,
            mercado: formData.mercado,
            zona: formData.zona,
            activo: formData.activo
        };

        try {
            // Use makeRequest from ApiRequest hook so it includes auth header and base URL
            const res = await makeRequest('/tecnicos/new', 'POST', technicianData);

            if (res) {
                await Swal.fire({
                    icon: 'success',
                    title: `Técnico ${formData.nombre} registrado con éxito.`,
                    timer: 2200,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top',
                    timerProgressBar: true,
                });
                setFormData({ nombre: '', apellidoP: '', apellidoA: '', email: '', mercado: '', zona: '', telefono: '', activo: true });
                // Redirect to technicians list
                navigate(`/tecnicos/${sessionStorage.getItem('adminId') || ''}`);
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error al registrar el técnico',
                    text: 'Revisa la consola para más detalles.',
                    timer: 3500,
                    showConfirmButton: true,
                    toast: false,
                    position: 'center',
                    timerProgressBar: true,
                });
            }

        } catch (error) {
            console.error('Error de red o servidor:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor. Verifica la URL de la API.',
                timer: 3500,
                showConfirmButton: true,
                toast: false,
                position: 'center',
                timerProgressBar: true,
            });
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
                            <input type="email" className="form-control" name="email" placeholder="Correo Electrónico" value={formData.email} onChange={handleChange} required />
                            <label htmlFor="email">Correo Electrónico</label>
                        </div>

                        <div className="form-floating mb-3">
                            <select className="form-select" name="mercado" value={formData.mercado} onChange={handleChange} required>
                                <option value="Estado de México">Estado de México</option>
                                <option value="Puebla">Puebla</option>
                            </select>
                            <label htmlFor="mercado">Mercado</label>
                        </div>

                        <div className="form-floating mb-3">
                            <select className="form-select" name="zona" value={formData.zona} onChange={handleChange} required>
                                <option value="">Seleccione una zona</option>
                                {(zonesByMercado[formData.mercado] || []).map((z) => (
                                    <option key={z} value={z}>{z}</option>
                                ))}
                            </select>
                            <label htmlFor="zona">Zona</label>
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