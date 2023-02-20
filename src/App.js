import React from 'react';
import { Routes, Route } from 'react-router-dom';

import './assets/styles/general.scss';

import Layout from './components/Layout'

import ErrorPage from './pages/ErrorPage';
import IdentityPage from './pages/IdentityPage';
import PanelPage from './pages/PanelPage';
import SettingsPage from './pages/SettingsPage';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<IdentityPage />} />
        <Route path="/" element={<Layout />}>
          <Route path="/panel" element={<PanelPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
