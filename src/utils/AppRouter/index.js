import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/use-auth';

import { Routes, Route } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import Layout from '../../components/Layout';

import DevPage from '../../pages/DevPage';
import ErrorPage from '../../pages/ErrorPage';
import PanelPage from '../../pages/PanelPage';
import IdentityPage from '../../pages/IdentityPage';
import SettingsPage from '../../pages/SettingsPage';


export const AppRouter = () => {

    const navigate = useNavigate();
    const { token, face_encodings, public_key } = useAuth();

    const url = window.location.pathname;

    useEffect(() => {
        if (!face_encodings)
            navigate('/');
        if (!token && face_encodings)
            navigate('/settings');
        if (url === '/' && (token && face_encodings))
            navigate('/panel')
        // if (token && url ==)
        // if (public_key && token && face_encodings)
        //     navigate('/settings');
        // if (!public_key)
        //     navigate('/settings');
        // if (token)
        //     navigate('/panel');
        // if (face_encodings)
        //     navigate('/settings');
        // else
        //     navigate('/');
    }, [url, token, face_encodings, public_key, navigate]);

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* Free Route */}
                <Route path="*" element={<ErrorPage />} />
                <Route path="/dev" element={<DevPage />} />
                {/* Authenticated Route */}
                <Route path="/" element={<IdentityPage />} />
                <Route path='/settings' element={<SettingsPage />} />
                {/* Protected Route */}
                <Route element={<PrivateRoute />}>
                    <Route path='/panel' element={<PanelPage />} />
                </Route>
            </Route>
        </Routes>
    )
}
