import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { NavbarFragmentAll } from '../fragments/Navbar.fragment';
import { CardCreateTicket } from './Create.card';

import { useEffect, useState } from 'react';

function CreateTicket() {

    const [data,setData] = useState([])

    const handleLoadClients = async () => {
        try {
            const token = localStorage.getItem('token');

            const res = await fetch('http://localhost:3200/api/client/all',{
                method: 'GET',
                headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                }
            });

            if(!res.ok) {
                const errorDetails = await res.json(); // obtener el error
                console.log('Server response error:', errorDetails);

                return;
            }

            const result = await res.json();
            setData(result);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleLoadClients();
    },[]);

    return (
        <> 
            <NavbarFragmentAll />
            
            <div className="container-fluid d-flex justify-content-center mt-4">
                <CardCreateTicket clients={data ? data: []}/>    
            </div>
        </>
    );
}

export default CreateTicket
