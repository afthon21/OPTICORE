import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useRegion } from '../../hooks/RegionContext';

import { handleHome, handleLogout, handleProfile, handleTicket, handleCreateTicket } from './js/Routes.js';
import { handleClients, handleCreateClient, handlePayments, handleCreatePayment } from './js/Routes.js';
import { handlePackages, handleCreatePackages } from './js/Routes.js';

export function NavbarFragmentAll() {
    const navigate = useNavigate();
    const [name, setName] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const adminId = sessionStorage.getItem('adminId');
    const { region, setRegion, isAdmin, canChangeRegion, userRole } = useRegion();

    // Debug para el navbar
    console.log('🎭 Navbar - Rol de usuario:', userRole);
    console.log('🎭 Navbar - ¿Es admin?:', isAdmin);
    console.log('🎭 Navbar - ¿Puede cambiar región?:', canChangeRegion);
    console.log('🎭 Navbar - Región actual:', region);

    // Función de debug para verificar sessionStorage
    const debugSessionStorage = () => {
        console.log('🔍 DEBUG SESSION STORAGE:');
        console.log('adminRole:', sessionStorage.getItem('adminRole'));
        console.log('adminRegion:', sessionStorage.getItem('adminRegion'));
        console.log('adminId:', sessionStorage.getItem('adminId'));
        console.log('userName:', sessionStorage.getItem('userName'));
    };

    // Función para forzar actualización del nombre
    const refreshUserName = () => {
        const currentName = sessionStorage.getItem('userName');
        console.log('🔄 Forzando actualización de nombre:', currentName);
        setName(currentName);
        setRefreshTrigger(prev => prev + 1);
    };

    // Efecto principal para cargar el nombre inicial y cuando cambia el rol
    useEffect(() => {
        const name = sessionStorage.getItem('userName');
        console.log('👤 Cargando nombre de usuario inicial:', name);
        setName(name);
    }, [userRole, refreshTrigger]); // Se actualiza cuando cambia el rol o el trigger

    // Efecto para detectar cambios en sessionStorage con polling más inteligente
    useEffect(() => {
        let lastKnownName = name;
        
        const checkForChanges = () => {
            const currentName = sessionStorage.getItem('userName');
            if (currentName !== lastKnownName) {
                console.log('👤 Cambio detectado - Anterior:', lastKnownName, '| Nuevo:', currentName);
                setName(currentName);
                lastKnownName = currentName;
            }
        };

        // Verificar cambios cada 500ms (más responsivo)
        const interval = setInterval(checkForChanges, 500);

        return () => clearInterval(interval);
    }, []); // Solo se ejecuta una vez

    return (
        <nav className="d-flex flex-column position-fixed shadow top-0 left-0 vh-100 px-2 py-3 main-menu" >
            <div className="d-flex align-items-center mb-3 header-content">
                <i className="bi bi-list fs-3" ></i>
                <p className="mb-0 ms-2 title">
                    OPTICORE
                </p>
            </div>


            {/* Selector de Estado - Solo para administradores */}
            <div className="mb-3">
                <label className="form-label fw-bold">Región:</label>
                {canChangeRegion ? (
                    <select
                        className="form-select"
                        value={region}
                        onChange={e => {
                            console.log('🎯 Intentando cambiar región desde navbar:', e.target.value);
                            setRegion(e.target.value);
                        }}
                    >
                        <option value="Estado de México">Estado de México</option>
                        <option value="Puebla">Puebla</option>
                    </select>
                ) : (
                    <div>
                        <div className="form-control text-muted" style={{backgroundColor: '#f8f9fa'}}>
                            {region}
                        </div>
                    </div>
                )}
            </div>

            <ul className="nav flex-column mb-auto">
                
                <li className="nav-item item">
                    <a
                        className="nav-link d-flex align-items-center item-link"
                        onClick={() => handleHome(navigate, adminId)}
                        role="button"
                    >
                        <i className="bi bi-house-door me-2"></i>
                        <span className="item-title">Inicio</span>
                    </a>
                </li>
                
                <li className="nav-item item">
                    <a
                        className="nav-link d-flex align-items-center item-link"
                        role="button"
                    >
                        <i className="bi bi-people me-2"></i>
                        <span className="item-title">Clientes</span>
                    </a>
                    <ul className="list-unstyled ps-3 sub-menu">
                        <li className="ms-4">
                            <a
                                className="nav-link"
                                onClick={() => handleClients(navigate, adminId)}
                                role="button"
                            >
                                Ver
                            </a>
                        </li>
                        <li className="ms-4">
                            <a
                                className="nav-link"
                                onClick={() => handleCreateClient(navigate, adminId)}
                                role="button"
                            >
                                Crear
                            </a>
                        </li>
                    </ul>
                </li>
                <li className="nav-item item">
                    <a
                        className="nav-link d-flex align-items-center item-link"
                        role="button"
                    >
                        <i className="bi bi-wallet2 me-2"></i>
                        <span className="item-title">Pagos</span>
                    </a>
                    <ul className="list-unstyled ps-3 sub-menu">
                        <li className="ms-4">
                            <a
                                className="nav-link"
                                onClick={() => handlePayments(navigate, adminId)}
                                role="button"
                            >
                                Ver
                            </a>
                        </li>
                        <li className="ms-4">
                            <a
                                className="nav-link"
                                onClick={() => handleCreatePayment(navigate, adminId)}
                                role="button"
                            >
                                Crear
                            </a>
                        </li>
                    </ul>
                </li>
                <li className="nav-item item">
                    <a
                        className="nav-link d-flex align-items-center item-link"
                        role="button"
                    >
                        <i className="bi bi-clipboard2-plus me-2"></i>
                        <span className="item-title">Tickets</span>
                    </a>
                    <ul className="list-unstyled ps-3 sub-menu">
                        <li className="ms-4">
                            <a
                                className="nav-link"
                                onClick={() => handleTicket(navigate, adminId)}
                                role="button"
                            >
                                Ver
                            </a>
                        </li>
                        <li className="ms-4">
                            <a
                                className="nav-link"
                                onClick={() => handleCreateTicket(navigate, adminId)}
                                role="button"
                            >
                                Crear
                            </a>
                        </li>
                    </ul>
                </li>
                <li className="nav-item item">
                    <a className="nav-link d-flex align-items-center item-link"
                        role="button">
                        <i className="bi bi-box-seam me-2"></i>
                        <span className="item-title">Paquetes</span>
                    </a>

                    <ul className="list-unstyled ps-3 sub-menu">
                        <li className="ms-4">
                            <a className="nav-link"
                                onClick={() => handlePackages(navigate, adminId)}
                                role="button">Ver</a>
                        </li>
                        <li className="ms-4">
                            <a className="nav-link"
                                onClick={() => handleCreatePackages(navigate, adminId)}
                                role="button">Crear</a>
                        </li>
                    </ul>
                </li>
                {/* NetWork con submenú */}
                <li className="nav-item item">
                    <a
                        className="nav-link d-flex align-items-center item-link"
                        role="button">
                        <i className="bi bi-wifi me-2"></i>
                        <span className="item-title">Network</span>
                    </a>
                    <ul className="list-unstyled ps-3 sub-menu">
                        <li className="ms-4">
                            <a
                                className="nav-link"
                                onClick={() => navigate(`/network/radiofrecuencia/${adminId}`)}
                                role="button"
                            >
                                Radiofrecuencia
                            </a>
                        </li>
                        <li className="ms-4">
                            <a
                                className="nav-link"
                                onClick={() => navigate(`/network/fibra-optica/${adminId}`)}
                                role="button"
                            >
                                Fibra Óptica
                            </a>
                            <ul className="list-unstyled ps-3 sub-menu">
                                <li className="ms-4">
                                    <a className="nav-link" onClick={() => navigate(`/network/fibra-optica/mapa/${adminId}`)} role="button">
                                        Mapa
                                    </a>
                                </li>
                                <li className="ms-4">
                                    <a className="nav-link" onClick={() => navigate(`/network/fibra-optica/topologia/${adminId}`)} role="button">
                                        Topología
                                    </a>
                                </li>
                                <li className="ms-4">
                                    <a className="nav-link" onClick={() => navigate(`/network/fibra-optica/onus/${adminId}`)} role="button">
                                        Onus
                                    </a>
                                </li>
                                <li className="ms-4">
                                    <a className="nav-link" onClick={() => navigate(`/network/fibra-optica/logs/${adminId}`)} role="button">
                                        Logs
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
                
            </ul>

            <div className="mt-auto border-div">
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <a
                            className="nav-link d-flex align-items-center item-link"
                            onClick={() => handleProfile(navigate, adminId)}
                            role="button"
                        >
                            <i className="bi bi-person-circle me-2"></i>
                            <span className="item-title">{name || 'Iniciar Sesión'}</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className="nav-link d-flex align-items-center item-link"
                            onClick={() => handleLogout(navigate, adminId)}
                            role="button"
                        >
                            <i className="bi bi-door-closed-fill me-2"></i>
                            <span className="item-title">Cerrar Sesión</span>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
