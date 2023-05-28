import React from 'react';

import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Loader from '../UI/Loader';
import Header from '../UI/Header';

import styles from './Layout.module.scss'

const Layout = () => {

    const loadSelector = useSelector((state) => state.load.loadState);

    return (
        <>
            <Header />
            <main className={styles.main}>
                <Outlet />
            </main>
            {loadSelector && <Loader />}
        </>
    )
}

export default Layout