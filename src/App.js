import React from 'react';
import { Routes, Route } from 'react-router-dom';

import './assets/styles/general.scss';

import ErrorPage from './pages/ErrorPage';
import IdentityPage from './pages/IdentityPage';
import PanelPage from './pages/PanelPage';
import SettingsPage from './pages/SettingsPage';


function App() {
  return (
    <>
      <Routes>
        {/* Free Route */}
        <Route path="*" element={<ErrorPage />} />
        <Route path="/" element={<IdentityPage />} />
        {/* Protected Route */}
        <Route path="/panel" element={<PanelPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </>
  );
}

export default App;
