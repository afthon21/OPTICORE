import { useState, useEffect } from 'react';
import ApiRequest from "../hooks/apiRequest";

export function ViewTechnicians() {
    const [allTechnicians, setAllTechnicians] = useState([]);
    const [selectedTechnician, setSelectedTechnician] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTechnicians = async () => {
            try {
                const response = await fetch(API_URL_ALL);
                if (response.ok) {
                    const data = await response.json();
                    setAllTechnicians(data);
                } else {
                    console.error('Error al obtener la lista de técnicos:', response.statusText);
                }
            } catch (error) {
                console.error('Error de conexión:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTechnicians();
        }, []);

    const filteredTechnicians = allTechnicians.filter(tech => {
        const fullName = `${tech.nombre} ${tech.apellidoP} ${tech.apellidoA}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

    if (isLoading) {
        return <div className="p-5 text-center">Cargando técnicos...</div>;
    }

    return (
        <div className="container-fluid py-4">
            <h2 className="title-text mb-4">Técnicos</h2>
            
            <div className="row">
                <div className="col-md-4">
                    <div className="p-3 bg-white shadow-sm rounded">
                        <div className="input-group mb-3">
                            <span className="input-group-text"><i className="bi bi-search"></i></span>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Buscar técnico..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="list-group list-group-flush technician-list">
                            {filteredTechnicians.map(tech => (
                                <button 
                                    key={tech._id}
                                    type="button" 
                                    className={`list-group-item list-group-item-action ${selectedTechnician && selectedTechnician._id === tech._id ? 'active' : ''}`}
                                    onClick={() => setSelectedTechnician(tech)}
                                >
                                    {tech.nombre} {tech.apellidoP} <br/> 
                                    <small className={`text-${tech.activo ? 'success' : 'danger'}`}>
                                        {tech.activo ? 'Activo' : 'Inactivo'}
                                    </small>
                                </button>
                            ))}
                            {filteredTechnicians.length === 0 && (
                                <p className="text-center text-muted mt-3">No se encontraron técnicos.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="p-4 bg-white shadow-sm rounded detail-panel">
                        <div className="d-flex mb-3 nav-tabs-style">
                            <button className="nav-link active">Datos personales</button>
                            <button className="nav-link">Activos Asignados</button>
                            <button className="nav-link">Tickets Abiertos</button>
                        </div>

                        <h3><i className="bi bi-person-workspace me-2"></i> Detalles del Técnico</h3>
                        
                        {selectedTechnician ? (
                            <div className="mt-4">
                                <h4>{selectedTechnician.nombre} {selectedTechnician.apellidoP} {selectedTechnician.apellidoA}</h4>
                                <hr/>
                                <p><strong>Nombre:</strong> {selectedTechnician.nombre}</p>
                                <p><strong>Apellido Paterno:</strong> {selectedTechnician.apellidoP}</p>
                                <p><strong>Apellido Materno:</strong> {selectedTechnician.apellidoA}</p>
                                <p><strong>Estado:</strong> 
                                    <span className={`badge bg-${selectedTechnician.activo ? 'success' : 'danger'} ms-2`}>
                                        {selectedTechnician.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </p>
                            </div>
                        ) : (
                            <p className="mt-4 text-muted">Seleccione un técnico de la lista izquierda para ver sus detalles.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}