import React from 'react';

import { Typography } from '@mui/material';

import { useTitle } from '../hooks/use-title';

import { Page } from '../components/UI/Page';
import PanelID from '../components/PanelID';


const PanelPage = () => {

    useTitle('Panel');

    return (
        <Page>
            <Typography component='h1' variant='5'>🪟 Panel</Typography>
            <PanelID />
        </Page>
    )
}

export default PanelPage