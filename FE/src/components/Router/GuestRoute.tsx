
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const GuestRoute = ({ children }: { children: ReactNode }) => {
    const token = localStorage.getItem('token');
    return token ? <Navigate to="/admin" /> : children;
};

export default GuestRoute;
