import React from 'react';

import { Typography } from '@mui/material';

import { useTitle } from '../hooks/use-title';
import { Page } from '../components/UI/Page';

const PanelPage = () => {

    useTitle('🪟 Panel');

    return (
        <Page>
            <Typography component='h1' variant='5'>🪟 Panel</Typography>
        </Page>
    )
}

export default PanelPage