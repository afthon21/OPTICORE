import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { NavbarFragmentAll } from '../fragments/Navbar.fragment';
import { LoadFragment } from '../fragments/Load.fragment';

import { useState,useEffect } from 'react';
import PaymentCard from './Payment.card';
import PaymentInfo from './Payment.info';

function PaymentComponent() {
    const [data,setData] = useState([]);
    const [select,setSelect] = useState(null)

    const handleLoad = async () => {
        try {
            const token = localStorage.getItem('token');

            const res = await fetch('http://localhost:3200/api/pay/all', {
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
            
        }
    }

    useEffect(() => {
        handleLoad()
    },[]);

    return(
        <>
            <NavbarFragmentAll />

            <div className="container-fluid d-flex justify-content-center mt-1" style={{paddingLeft: '65px'}}>
                <PaymentCard payments={data ? data : []} onSelected={setSelect} />

                {select ? (
                    select && <PaymentInfo payment={select} />
                ) : (
                    <div className="card justify-content-center mx-4 border-0" style={{width: '30rem'}}>
                        <LoadFragment />
                    </div>
                )}
            </div>
        </>
    );
}

export default PaymentComponent;