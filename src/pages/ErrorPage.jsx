import React from 'react';
import { Link } from 'react-router-dom';

import { Typography } from '@mui/material';

import { useTitle } from '../hooks/use-title';
import { Page } from '../components/UI/Page';

const ErrorPage = () => {

    useTitle('🔥 Error');

    return (
        <Page>
            <Typography component='h1' variant='5'>🔥 Error</Typography>
            <Link to="/">Back to Home</Link>
        </Page>
    )
}

export default ErrorPage