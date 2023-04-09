import React from 'react';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Typography } from '@mui/material';

import { unsetUser } from '../store/slices/userSlice';
import { useTitle } from '../hooks/use-title';

import { Page } from '../components/UI/Page';
import { Submit } from '../components/UI/Submit';


const PanelPage = () => {

    useTitle('🪟 Panel');

    const navigate = useNavigate();
    const dispatch = useDispatch();


    return (
        <Page>
            <Typography component='h1' variant='5'>🪟 Panel</Typography>
            <Submit onClick={() => navigate('/settings')}>Settings</Submit>
            <Submit onClick={() => dispatch(unsetUser())}>Exit</Submit>
        </Page>
    )
}

export default PanelPage