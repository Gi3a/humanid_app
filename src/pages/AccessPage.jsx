import React from 'react';

import { Typography } from '@mui/material';

import { useTitle } from '../hooks/use-title';

import { Page } from '../components/UI/Page';
import AccessID from '../components/AccessID';


const SharePage = () => {

    useTitle('Share');

    return (
        <Page>
            <Typography component='h1' variant='5'>🔓 Access</Typography>
            <AccessID />
        </Page>
    )
}

export default SharePage