import React from 'react';

import { Routes, Route } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import OppositeRoute from './OppositeRoute';

import ErrorPage from '../../pages/ErrorPage';
import PanelPage from '../../pages/PanelPage';
import IdentityPage from '../../pages/IdentityPage';
import SettingsPage from '../../pages/SettingsPage';


export const AppRouter = () => {

    return (
        <Routes>
            {/* Free Route */}
            <Route path="*" element={<ErrorPage />} />
            {/* Authenticated Route */}
            <Route element={<OppositeRoute />}>
                <Route path="/" element={<IdentityPage />} />
            </Route>
            {/* Protected Route */}
            <Route element={<PrivateRoute />}>
                <Route exact path='/panel' element={<PanelPage />} />
                <Route exact path='/settings' element={<SettingsPage />} />
            </Route>
        </Routes>
    )
}
