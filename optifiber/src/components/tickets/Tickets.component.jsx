import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { NavbarFragmentAll } from '../fragments/Navbar.fragment.jsx';
import TicketsCard from './Tickets.card.jsx';
import TicketInfo from './Tickets.info.jsx';
import { LoadFragment } from '../fragments/Load.fragment.jsx';

function TicketComponent() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [select, setSelect] = useState(null);

    const handleLoad = async () => {
        try {
            const token = localStorage.getItem('token');

            const res = await fetch('http://localhost:3200/api/ticket/all', {
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

            const result = await res.json();
            setData(result);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleLoad();
    }, []);

    return (
        <>
            <NavbarFragmentAll />
            <div className="container-fluid d-flex justify-content-center mt-1" style={{paddingLeft: '65px'}}>
                <TicketsCard tickets={data ? data : []} onSelected={setSelect} />

                {select ? (
                    select && <TicketInfo ticket={select} />
                ) : (
                    <div className="card justify-content-center mx-4 border-0" style={{width: '30rem'}}>
                        <LoadFragment />
                    </div>
                )}
            </div>
        </>
    );
}

export default TicketComponent;