import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { Typography } from '@mui/material';

import { useAuth } from '../hooks/use-auth';

import { useTitle } from '../hooks/use-title';
import { Page } from '../components/UI/Page';

const PanelPage = () => {

    useTitle('🪟 Panel');

    const navigate = useNavigate();

    const { public_key } = useAuth();

    useEffect(() => {
        if (!public_key) {
            navigate('/settings');
        }
    }, [public_key, navigate]);

    return (
        <Page>
            <Typography component='h1' variant='5'>🪟 Panel</Typography>
        </Page>
    )
}

export default PanelPage