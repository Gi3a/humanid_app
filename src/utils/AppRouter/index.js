import React from 'react';

import { Routes, Route } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import OppositeRoute from './OppositeRoute';

import DevPage from '../../pages/DevPage';
import ErrorPage from '../../pages/ErrorPage';
import PanelPage from '../../pages/PanelPage';
import IdentityPage from '../../pages/IdentityPage';
import SettingsPage from '../../pages/SettingsPage';


export const AppRouter = () => {

    return (
        <Routes>
            {/* Free Route */}
            <Route path="*" element={<ErrorPage />} />
            <Route path="/dev" element={<DevPage />} />
            {/* Authenticated Route */}
            <Route element={<OppositeRoute />}>
                <Route path="/" element={<IdentityPage />} />
                <Route path='/settings' element={<SettingsPage />} />
            </Route>
            {/* Protected Route */}
            <Route element={<PrivateRoute />}>
                <Route path='/panel' element={<PanelPage />} />
            </Route>
        </Routes>
    )
}
