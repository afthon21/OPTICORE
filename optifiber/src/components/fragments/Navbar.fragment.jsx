import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import styleNavbar from './css/navbar.module.css'

import { handleHome, handleLogout, handleProfile, handleTicket, handleCreateTicket } from './js/Handles.js';
import { handleClients, handleCreateClient, handlePayments, handleCreatePayment } from './js/Handles.js';

export function NavbarFragmentAll() {
    const navigate = useNavigate();
    const [name, setName] = useState(null);

    useEffect(() => {
        const name = localStorage.getItem('userName');
        setName(name);
    });

    return (
        <div className={`d-block${styleNavbar['container-nav']}`}>
            <nav className={`d-flex flex-column position-fixed top-0 left-0 vh-100 bg-light shadow px-2 py-3 ${styleNavbar['main-menu']}`}>
                <div className={`d-flex justify-content-between align-items-center mb-3 ${styleNavbar['header-content']}`}>
                    <i className="bi bi-list fs-3"></i>
                    <p
                        className={`mb-0 ms-2 ${styleNavbar['title']}`}
                        onClick={() => handleHome(navigate)}
                        role="button">
                        optifiber
                    </p>
                </div>

                <ul className="nav flex-column mb-auto">
                    <li className={`nav-item ${styleNavbar['item']}`}>
                        <a
                            className={`nav-link d-flex align-items-center ${styleNavbar['item-link']}`}
                            onClick={() => handleHome(navigate)}
                            role="button"
                        >
                            <i className="bi bi-house-door-fill me-2"></i>
                            <span className={styleNavbar['item-title']}>Inicio</span>
                        </a>
                    </li>
                    <li className={`nav-item ${styleNavbar['item']}`}>
                        <a
                            className={`nav-link d-flex align-items-center ${styleNavbar['item-link']}`}
                            role="button"
                        >
                            <i className="bi bi-people-fill me-2"></i>
                            <span className={styleNavbar['item-title']}>Clientes</span>
                        </a>
                        <ul className={`list-unstyled ps-3 ${styleNavbar['sub-menu']}`}>
                            <li className="ms-4">
                                <a
                                    className="nav-link"
                                    onClick={() => handleClients(navigate)}
                                    role="button"
                                >
                                    Ver
                                </a>
                            </li>
                            <li className="ms-4">
                                <a
                                    className="nav-link"
                                    onClick={() => handleCreateClient(navigate)}
                                    role="button"
                                >
                                    Crear
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li className={`nav-item ${styleNavbar['item']}`}>
                        <a
                            className={`nav-link d-flex align-items-center ${styleNavbar['item-link']}`}
                            role="button"
                        >
                            <i className="bi bi-wallet-fill me-2"></i>
                            <span className={styleNavbar['item-title']}>Pagos</span>
                        </a>
                        <ul className={`list-unstyled ps-3 ${styleNavbar['sub-menu']}`}>
                            <li className="ms-4">
                                <a
                                    className="nav-link"
                                    onClick={() => handlePayments(navigate)}
                                    role="button"
                                >
                                    Ver
                                </a>
                            </li>
                            <li className="ms-4">
                                <a
                                    className="nav-link"
                                    onClick={() => handleCreatePayment(navigate)}
                                    role="button"
                                >
                                    Crear
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li className={`nav-item ${styleNavbar['item']}`}>
                        <a
                            className={`nav-link d-flex align-items-center ${styleNavbar['item-link']}`}
                            role="button"
                        >
                            <i className="bi bi-clipboard-heart-fill me-2"></i>
                            <span className={styleNavbar['item-title']}>Tickets</span>
                        </a>
                        <ul className={`list-unstyled ps-3 ${styleNavbar['sub-menu']}`}>
                            <li className="ms-4">
                                <a
                                    className="nav-link"
                                    onClick={() => handleTicket(navigate)}
                                    role="button"
                                >
                                    Ver
                                </a>
                            </li>
                            <li className="ms-4">
                                <a
                                    className="nav-link"
                                    onClick={() => handleCreateTicket(navigate)}
                                    role="button"
                                >
                                    Crear
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li className={`nav-item ${styleNavbar['item']}`}>
                        <a 
                            className={`nav-link d-flex align-items-center ${styleNavbar['item-link']}`}
                            role="button">
                            <i className="bi bi-wifi me-2"></i>
                            <span className={styleNavbar['item-title']}>NetWork</span>
                        </a>
                    </li>
                </ul>

                <div className={`mt-auto ${styleNavbar['border']}`}>
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <a
                                className={`nav-link d-flex align-items-center ${styleNavbar['item-link']}`}
                                onClick={() => handleProfile(navigate)}
                                role="button"
                            >
                                <i className="bi bi-person-circle me-2"></i>
                                <span className={styleNavbar['item-title']}>{name}</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link d-flex align-items-center ${styleNavbar['item-link']}`}
                                onClick={() => handleLogout(navigate)}
                                role="button"
                            >
                                <i className="bi bi-door-closed-fill me-2"></i>
                                <span className={styleNavbar['item-title']}>Cerrar Sesión</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}
