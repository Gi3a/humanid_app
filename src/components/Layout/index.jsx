import React from 'react';

import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Loader from '../UI/Loader';

const Layout = () => {

    const loadSelector = useSelector((state) => state.load.loadState);

    return (
        <>
            <main>
                <Outlet />
            </main>
            {loadSelector && <Loader />}
        </>
    )
}

export default Layout