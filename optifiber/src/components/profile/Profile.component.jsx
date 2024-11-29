import { useEffect, useState } from 'react';

import ProfileCard from './Profile.card.jsx';
import { LoadFragment } from '../fragments/Load.fragment.jsx';

function ProfileComponent() {
    const [data, setData] = useState(null);

    const handleLoad = async () => {

        try {
            const token = sessionStorage.getItem('token');

            const res = await fetch('http://localhost:3200/api/profile/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!res.ok) {
                const errorDetails = await res.json(); // obtener el error
                console.log('Server response error:', errorDetails);

                return;
            }

            const result = await res.json();
            setData(result);

            sessionStorage.setItem('userName', result.UserName);

        } catch (error) {
            console.log('Error en la solicitud', error)
        }
    }

    useEffect(() => {
        handleLoad();
    }, []);

    return (
        <>
            <div className="container-fluid d-flex justify-content-center mt-1">
                {data ? (
                    <ProfileCard profile={data ? data : {}} />
                ) : (
                    <LoadFragment />
                )}
            </div>
        </>
    );
}

export default ProfileComponent;