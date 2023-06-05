import React from 'react';

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import { useNavigate } from 'react-router-dom';

import Settings from '@mui/icons-material/Settings';
import AutoFixHigh from '@mui/icons-material/AutoFixHigh';
import QrCode2 from '@mui/icons-material/QrCode2';


import { viewDate } from '../../../utils/date';

import { useAuth } from '../../../hooks/use-auth';
import { useModal } from '../../../hooks/use-modal';

import styles from './ProfileCard.module.scss';

const ProfileCard = () => {

    const { openModal } = useModal();
    const navigate = useNavigate();

    const {
        firstname,
        lastname,
        date_of_birth,
        id_number,
        nationality,
        date_of_issue,
        date_of_expiry,
        email,
        phone,
        face
    } = useAuth();

    const handleOpenModal = () => {
        openModal('Delete account', 'item[4]', 'confirmation');
    };

    const handleShareModal = () => {
        openModal('Share ID', 'item[4]', 'id');
    };

    return (
        <div className={styles.profilecard}>
            <Avatar alt="Face ID" src={face} sx={{ width: 250, height: 250 }} />
            <div className={styles.profileinfo}>
                <div className={styles.profilebox}>
                    <div>
                        <span>Name</span>
                        {firstname + ' ' + lastname}
                    </div>
                </div>
                <div className={styles.profilebox}>
                    <div>
                        <span>Email</span>
                        {email}
                    </div>
                    <div>
                        <span>Phone</span>
                        {phone}
                    </div>
                    <div>
                        <span>Date of Birth</span>
                        {viewDate(new Date(date_of_birth))}
                    </div>
                </div>
                <div className={styles.profilebox}>
                    <div>
                        <span>ID Number</span>
                        {id_number}
                    </div>
                    <div>
                        <span>Nationality</span>
                        {nationality}
                    </div>
                    <div>
                        <span>Date of Issue</span>
                        {viewDate(new Date(date_of_issue))}
                    </div>
                    <div>
                        <span>Date of Expiry</span>
                        {viewDate(new Date(date_of_expiry))}
                    </div>
                </div>
                <div className={styles.profilebox}>
                    <Button onClick={handleShareModal}>
                        <QrCode2 /> Share ID
                    </Button>
                    <Button onClick={() => navigate('/settings')}>
                        <Settings /> Settings
                    </Button>
                    <Button onClick={handleOpenModal}>
                        <AutoFixHigh /> Delete Account
                    </Button>
                </div>
            </div >
        </div>
    )
}

export default ProfileCard