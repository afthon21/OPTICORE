import { useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { NavbarFragmentAll } from '../fragments/Navbar.fragment.jsx';
import CardClients from './Card.clients.jsx';
import CardTickets from './Card.tickets.jsx';

import Swal from 'sweetalert2';

function HomeComponent() {
    //Mostrar mensaje de inicio
    useEffect(() => {
        const loginSuccess = localStorage.getItem('loginSuccess');

        if(loginSuccess) {
            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Has iniciado sesión correctamente.',
                position: 'top',
                timer: 1200,
                showConfirmButton: false,
                toast: true,
                timerProgressBar: true,
            });

            localStorage.removeItem('loginSuccess')
        }
    })

    return (
        <>
            <NavbarFragmentAll />
        </>
    );
}

export default HomeComponent;