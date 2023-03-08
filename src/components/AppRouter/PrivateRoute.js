import React, { useState, useEffect } from 'react';

import { Outlet, Navigate } from 'react-router-dom';

import { useAuth } from '../../hooks/use-auth';


const PrivateRoute = () => {
    const { id, public_key } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (id && public_key) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [id, public_key]);

    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;