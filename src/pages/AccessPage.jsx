import React from 'react';

import { Typography } from '@mui/material';

import { useTitle } from '../hooks/use-title';

import { Page } from '../components/UI/Page';
import AccessID from '../components/AccessID';

import { FcInspection } from "react-icons/fc";

const SharePage = () => {

    useTitle('Share');

    return (
        <Page>
            <Typography component='h1' variant='5'><FcInspection /> Access</Typography>
            <AccessID />
        </Page>
    )
}

export default SharePage