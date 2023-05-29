import React from 'react';

import { Typography } from '@mui/material';

import { useTitle } from '../hooks/use-title';

import { Page } from '../components/UI/Page';
import PanelID from '../components/PanelID';

import { FcTemplate } from "react-icons/fc";


const PanelPage = () => {

    useTitle('Panel');

    return (
        <Page>
            <Typography component='h1' variant='5'><FcTemplate /> Panel</Typography>
            <PanelID />
        </Page>
    )
}

export default PanelPage