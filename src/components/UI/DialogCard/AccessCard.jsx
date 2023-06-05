import React, { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import CloseIcon from '@mui/icons-material/Close';

import { generatePinnedFaceEncodings, decryptData, viewPublicKey } from '../../../utils/crypto';

import { useAuth } from '../../../hooks/use-auth';
import { useModal } from '../../../hooks/use-modal';

import styles from './DialogCard.module.scss';

import { viewDate } from '../../../utils/date';

const AccessCard = ({ data }) => {

    const { closeModal, title } = useModal();
    const handleCloseModal = () => { closeModal(); };
    const { face_encodings, pin, encrypted_private_key } = useAuth();
    const [decryptedData, setDecryptedData] = useState(null);

    useEffect(() => {
        const pinnedFaceEncodings = generatePinnedFaceEncodings(face_encodings, pin);
        decryptData(data, encrypted_private_key, pinnedFaceEncodings)
            .then(data => {
                const decryptedDataLocal = JSON.parse(data);
                setDecryptedData(decryptedDataLocal);
            })
            .catch(error => {
                console.log(error);
            });
    }, [data, face_encodings, pin, encrypted_private_key]);

    return (
        decryptedData &&
        <>
            <DialogTitle>
                {viewPublicKey(title)}
            </DialogTitle>
            <DialogContent>
                <div className={styles.card}>
                    {decryptedData.name &&
                        <div className={styles.carditem}>
                            <span>Name</span>
                            {decryptedData.name.firstname + ' ' + decryptedData.name.lastname}
                        </div>
                    }
                    {decryptedData.passport &&
                        <div className={styles.carditem}>
                            <span>Passport</span>
                            {decryptedData.passport.id_number}
                        </div>
                    }
                    {decryptedData.passport &&
                        <div className={styles.carditem}>
                            <span>Nationality</span>
                            {decryptedData.passport.nationality}
                        </div>
                    }
                    {decryptedData.passport &&
                        <div className={styles.carditem}>
                            <span>Birth Date</span>
                            {viewDate(new Date(decryptedData.passport.date_of_birth))}
                        </div>
                    }
                    {decryptedData.passport &&
                        <div className={styles.carditem}>
                            <span>Issue Date</span>
                            {viewDate(new Date(decryptedData.passport.date_of_issue))}
                        </div>
                    }
                    {decryptedData.passport &&
                        <div className={styles.carditem}>
                            <span>Expiry Date</span>
                            {viewDate(new Date(decryptedData.passport.date_of_expiry))}
                        </div>
                    }
                    {decryptedData.phone &&
                        <div className={styles.carditem}>
                            <span>Phone</span>
                            {decryptedData.phone.phone}
                        </div>
                    }
                    {decryptedData.email &&
                        <div className={styles.carditem}>
                            <span>Email</span>
                            {decryptedData.email.email}
                        </div>
                    }
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseModal}><CloseIcon sx={{ color: 'red' }} /> Close</Button>
            </DialogActions>
        </>
    )
}

export default AccessCard