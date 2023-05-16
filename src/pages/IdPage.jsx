import React from 'react';

import { Typography } from '@mui/material';

import { useTitle } from '../hooks/use-title';

import { Page } from '../components/UI/Page';
import CardID from '../components/CardID';


const IdPage = () => {

    useTitle('🪪 ID');

    return (
        <Page>
            <Typography component='h1' variant='5'>🪪 ID</Typography>
            <CardID />
        </Page>
    )
}

export default IdPage