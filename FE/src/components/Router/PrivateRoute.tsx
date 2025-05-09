import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const isValidToken = (token: string | null): boolean => {

    return !!token;
};

const PrivateRoute = ({ children }: { children: ReactNode }) => {
    const token = localStorage.getItem('token');
    return isValidToken(token) ? children : <Navigate to="/login" />;
};

export default PrivateRoute;