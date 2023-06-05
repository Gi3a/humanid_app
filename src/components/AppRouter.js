import React, { useEffect } from 'react';

import { useAuth } from '../hooks/use-auth';
import { useNavigate, Routes, Route } from 'react-router-dom';

import Layout from './Layout';

import ErrorPage from '../pages/ErrorPage';
import PanelPage from '../pages/PanelPage';
import AboutPage from '../pages/AboutPage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import IdentificationPage from '../pages/IdentificationPage';


export const AppRouter = () => {

    const navigate = useNavigate();
    const { token, face_encodings, public_key } = useAuth();

    const url = window.location.pathname;

    useEffect(() => {
        if (!face_encodings)
            navigate("/");
        else if (!token && face_encodings)
            navigate("/settings");
        else if (url === '/' && (token && face_encodings))
            navigate("/panel");
    }, [url, token, face_encodings, public_key, navigate]);


    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="*" element={<ErrorPage />} />
                <Route path="/" element={<IdentificationPage />} />
                <Route path='/panel' element={<PanelPage />} />
                <Route path='/:user_name/:user_id' element={<PanelPage />} />
                <Route path='/profile' element={<ProfilePage />} />
                <Route path='/settings' element={<SettingsPage />} />
                <Route path='/about' element={<AboutPage />} />
            </Route>
        </Routes>
    )
}
