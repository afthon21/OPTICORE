import { useEffect, useState } from 'react';

import ProfileCard from './Profile.card.jsx';
import { LoadFragment } from '../fragments/Load.fragment.jsx';
import ApiRequest from '../hooks/apiRequest.jsx'

function ProfileComponent() {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE)
    const [data, setData] = useState(null);

    const handleLoad = async () => {

        try {
            const res = await makeRequest('/profile/');
            setData(res);

            sessionStorage.setItem('userName', res.UserName);

        } catch (error) {
            console.log('Error en la solicitud', error)
        }
    }

    useEffect(() => {
        handleLoad();
    }, [makeRequest]);

    if (loading) return <LoadFragment />

    if(error) return <p>Error!</p>

    return (
        <>
            <div className="container-fluid d-flex justify-content-center mt-1">  
                <ProfileCard profile={data ? data : {}} />    
            </div>
        </>
    );
}

export default ProfileComponent;