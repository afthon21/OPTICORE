import { Route, Navigate } from 'react-router-dom';

const isUserAuth = () => {
    return localStorage.getItem('token') !== null;
}

const ProtectedRoute = ({children}) => {
    if(!isUserAuth()) {
        return (<Navigate to={'/'}/>);
    }

    return children;
}

export default ProtectedRoute;