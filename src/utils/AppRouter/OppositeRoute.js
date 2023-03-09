import React from 'react';

import { Outlet, Navigate } from 'react-router-dom';

import { useAuth } from '../../hooks/use-auth';


const OppositeRoute = () => {
    const { isAuth } = useAuth();


    return isAuth ? <Navigate to="/panel" /> : <Outlet />;
};

export default OppositeRoute;