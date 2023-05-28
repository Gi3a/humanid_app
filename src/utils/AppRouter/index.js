import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/use-auth';

import { Routes, Route } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import Layout from '../../components/Layout';

import IdPage from '../../pages/IdPage';
import DevPage from '../../pages/DevPage';
import ListPage from '../../pages/ListPage';
import ErrorPage from '../../pages/ErrorPage';
import PanelPage from '../../pages/PanelPage';
import AccessPage from '../../pages/AccessPage';
import SharePage from '../../pages/SharePage';
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
                    <Route path='/id' element={<IdPage />} />
                    <Route path='/panel' element={<PanelPage />} />
                    <Route path='/:user_name/:user_id' element={<SharePage />} />
                    <Route path='/access/:user_id' element={<AccessPage />} />
                    <Route path='/list/:category' element={<ListPage />} />
                </Route>
            </Route>
        </Routes>
    )
}
