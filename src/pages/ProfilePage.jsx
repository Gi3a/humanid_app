import React from 'react';

import Person from '@mui/icons-material/Person';

import Box from '../components/UI/Box';

import { useTitle } from '../hooks/use-title';
import ProfileCard from '../components/UI/ProfileCard';

const ProfilePage = () => {

    useTitle('Profile');

    return (
        <>
            <h1><Person />Profile</h1>
            <Box>
                <ProfileCard />
            </Box>
        </>
    )
}

export default ProfilePage