import React from 'react';

import { Outlet } from 'react-router-dom';

import Modal from './Modal';
import Loader from './Loader';

import Header from './UI/Header';
import Content from './UI/Content';

const Layout = () => {


    return (
        <>
            <Header />
            <Content>
                <Outlet />
            </Content>
            <Loader />
            <Modal />
        </>
    )
}

export default Layout;