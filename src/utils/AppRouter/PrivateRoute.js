import React from 'react';

import { Outlet, Navigate } from 'react-router-dom';

import { useAuth } from '../../hooks/use-auth';


const PrivateRoute = () => {
    const { isAuth } = useAuth();


    return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;