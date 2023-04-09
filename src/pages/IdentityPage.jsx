import React from 'react';

import { Typography } from '@mui/material';
import { useTitle } from '../hooks/use-title';

import FaceID from '../components/FaceID'
import { Page } from '../components/UI/Page';

const IdentyPage = () => {

    useTitle('🌐 Identification');

    return (
        <Page>
            <Typography component='h1' variant='5'>🌐 HumanID</Typography>
            <FaceID />
        </Page>
    )
}

export default IdentyPage