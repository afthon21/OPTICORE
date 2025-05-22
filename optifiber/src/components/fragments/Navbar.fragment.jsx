import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { handleHome, handleLogout, handleProfile, handleTicket, handleCreateTicket } from './js/Routes.js';
import { handleClients, handleCreateClient, handlePayments, handleCreatePayment } from './js/Routes.js';
import { handlePackages, handleCreatePackages } from './js/Routes.js';

export function NavbarFragmentAll() {
    const navigate = useNavigate();
    const [name, setName] = useState(null);
    const adminId = sessionStorage.getItem('adminId')

    useEffect(() => {
        const name = sessionStorage.getItem('userName');
        setName(name);
    });

    return (

        <nav className="d-flex flex-column position-fixed shadow top-0 left-0 vh-100 px-2 py-3 main-menu">
            <div className="d-flex justify-content-between align-items-center mb-3 header-content">
                <i className="bi bi-list fs-3"></i>
                <p
                    className="mb-0 ms-2 title"
                    onClick={() => handleHome(navigate, adminId)}
                    role="button">
                    optifiber
                </p>
            </div>

            <ul className="nav flex-column mb-auto">
                <li className="nav-item item">
                    <a
                        className="nav-link d-flex align-items-center item-link"
                        onClick={() => handleHome(navigate, adminId)}
                        role="button"
                    >
                        <i className="bi bi-house-door-fill me-2"></i>
                        <span className="item-title">Inicio</span>
                    </a>
                </li>
                <li className="nav-item item">
                    <a
                        className="nav-link d-flex align-items-center item-link"
                        role="button"
                    >
                        <i className="bi bi-people-fill me-2"></i>
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
                        <i className="bi bi-wallet-fill me-2"></i>
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
                        <i className="bi bi-clipboard-heart-fill me-2"></i>
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
                        <i className="bi bi-box2-heart-fill me-2"></i>
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
                <li className="nav-item item">
                    <a
                        className="nav-link d-flex align-items-center item-link"
                        role="button">
                        <i className="bi bi-wifi me-2"></i>
                        <span className="item-title">NetWork</span>
                    </a>
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
