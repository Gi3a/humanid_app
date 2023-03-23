import React, { useEffect } from 'react';

import { Typography } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/use-auth';
import { useTitle } from '../hooks/use-title';

import FaceID from '../components/FaceID'
import { Page } from '../components/UI/Page';

const IdentyPage = () => {

    useTitle('🌐 Identification');

    const { token, face_encodings } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate('/panel');
        }
        if (face_encodings && !token) {
            navigate('/settings');
        }
    }, [token, face_encodings, navigate]);

    return (
        <Page>
            <Typography component='h1' variant='5'>🌐 HumanID</Typography>
            <FaceID />
        </Page>
    )
}

export default IdentyPage