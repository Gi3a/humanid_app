import React from 'react';

import { Typography } from '@mui/material';

import { useTitle } from '../hooks/use-title';

import { Page } from '../components/UI/Page';
import ShareID from '../components/ShareID';

import { FcParallelTasks } from "react-icons/fc";


const SharePage = () => {

    useTitle('Share');

    return (
        <Page>
            <Typography component='h1' variant='5'><FcParallelTasks /> Share</Typography>
            <ShareID />
        </Page>
    )
}

export default SharePage