import React from 'react';

import { Typography } from '@mui/material';

import { useTitle } from '../hooks/use-title';

import { Page } from '../components/UI/Page';
import PanelID from '../components/PanelID';
import ShareList from '../components/ShareList';
import AccessesList from '../components/AccessesList';


const PanelPage = () => {

    useTitle('Panel');

    return (
        <Page>
            <Typography component='h1' variant='5'>🪟 Panel</Typography>
            <PanelID />
            <ShareList />
            <AccessesList />
        </Page>
    )
}

export default PanelPage