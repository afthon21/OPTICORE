import { useEffect } from 'react';

import CardClients from './Card.clients.jsx';
import CardTickets from './Card.tickets.jsx';

import Swal from 'sweetalert2';

function HomeComponent() {
    //Mostrar mensaje de inicio
    useEffect(() => {
        const loginSuccess = sessionStorage.getItem('loginSuccess');

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

            sessionStorage.removeItem('loginSuccess')
        }
    })

    return (
        <>
            
        </>
    );
}

export default HomeComponent;