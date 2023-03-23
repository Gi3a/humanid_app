import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Typography } from '@mui/material';

import { unsetUser } from '../store/slices/userSlice';
import { useAuth } from '../hooks/use-auth';
import { useTitle } from '../hooks/use-title';

import { Page } from '../components/UI/Page';
import { Submit } from '../components/UI/Submit';


const PanelPage = () => {

    useTitle('🪟 Panel');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { public_key } = useAuth();

    useEffect(() => {
        if (!public_key) {
            navigate('/settings');
        }
    }, [public_key, navigate]);

    return (
        <Page>
            <Typography component='h1' variant='5'>🪟 Panel</Typography>
            <Submit onClick={() => navigate('/settings')}>Settings</Submit>
            <Submit onClick={() => dispatch(unsetUser())}>Exit</Submit>
        </Page>
    )
}

export default PanelPage