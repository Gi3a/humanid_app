import React from 'react';

import Quiz from '@mui/icons-material/Quiz';

import { useTitle } from '../hooks/use-title';
import { Button, ButtonGroup } from '@mui/material';


import WebIcon from '@mui/icons-material/Web';
import TaskIcon from '@mui/icons-material/Task';
import GitHubIcon from '@mui/icons-material/GitHub';
import DashboardIcon from '@mui/icons-material/Dashboard';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';

const AboutPage = () => {

    useTitle('About');

    const redirectTo = (url) => {
        window.open(url, '_blank'); // This will open the url in a new tab
    }

    return (
        <>
            <h1><Quiz />About</h1>
            <div className='about'>
                <ButtonGroup>
                    <Button
                        onClick={() => redirectTo('https://github.com/Gi3a/humanid_api')}>
                        <IntegrationInstructionsIcon />
                        FastAPI Code
                    </Button>
                    <Button
                        onClick={() => redirectTo('https://github.com/Gi3a')}>
                        <GitHubIcon />
                        GitHub
                    </Button>
                    <Button
                        onClick={() => redirectTo('https://github.com/Gi3a/humanid_app')}>
                        <WebIcon />
                        React Code
                    </Button>

                </ButtonGroup>
                <ButtonGroup>

                    <Button
                        onClick={() => redirectTo('https://humanid.ru/docs')}>
                        <DashboardIcon />
                        Rest API
                    </Button>
                    <Button
                        onClick={() => redirectTo('https://mumbai.polygonscan.com/address/0x114005863CBeb472B9F994829695A97386A8a7e7#code')}>
                        <TaskIcon />
                        SmartContract
                    </Button>
                </ButtonGroup>
            </div>
        </>
    )
}

export default AboutPage