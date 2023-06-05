import React from 'react';

import CameraFront from '@mui/icons-material/CameraFront';

import { useTitle } from '../hooks/use-title';

import FaceID from '../components/UI/FaceID';
import Box from '../components/UI/Box';

const IdentificationPage = () => {

    useTitle('Identification');

    return (
        <>
            <h1><CameraFront />Identification</h1>
            <Box>
                <FaceID />
            </Box>
        </>
    )
}

export default IdentificationPage