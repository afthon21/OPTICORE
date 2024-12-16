import { useState,useEffect } from 'react';

import { NavbarFragmentAll } from '../fragments/Navbar.fragment';
import ClientsCard from './Clients.card';
import { LoadFragment } from '../fragments/Load.fragment.jsx';
import ClientsInfo from './Clients.info';

function ClientsComponent() {
    const [data,setData] = useState([]);
    const [select, setSelect] = useState(null);

    const handleLoad = async () => {
        try {
            const token = sessionStorage.getItem('token');

            const res = await fetch('http://localhost:3200/api/client/all',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                const errorDetails = await res.json(); // obtener el error
                console.log('Server response error:', errorDetails);

                return;
            }

            const data = await res.json();
            setData(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleLoad();
    }, []);

    return(
        
        <>
            <div className="container-fluid d-flex justify-content-start mt-1 ms-4" style={{paddingLeft: '65px'}}>
                <ClientsCard clients = { data ? data: []} onSelected={setSelect}/>         
                
                <ClientsInfo client={select}/>
                
            </div>
        </>
    );
}

export default ClientsComponent;