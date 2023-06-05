import React, { useRef } from 'react';

import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import CloseIcon from '@mui/icons-material/Close';
import ContentCopy from '@mui/icons-material/ContentCopy';

import { QRCodeSVG } from 'qrcode.react';

import { useAuth } from '../../../hooks/use-auth';
import { useModal } from '../../../hooks/use-modal';

import { Input } from '../Input';


import styles from './DialogCard.module.scss';


const IDCard = () => {

    const { closeModal, title } = useModal();
    const handleCloseModal = () => { closeModal(); };
    const { public_key, firstname } = useAuth();

    const linkRef = useRef(null);
    const inputRef = useRef(null);

    const copyLink = () => {
        linkRef.current.select();
        document.execCommand('copy');
    };

    const handleClick = () => {
        if (linkRef.current) {
            linkRef.current.select();
        }
    };

    const share_id = `${process.env.REACT_APP_APP_URL}/${firstname}/${public_key}`;

    return (
        <>
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent>
                <div className={`${styles.card} ${styles.cardqr}`}>
                    <QRCodeSVG value={share_id} />
                    <Input
                        ref={linkRef}
                        onClick={handleClick}
                        type="text"
                        value={share_id}
                        readOnly
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseModal}><CloseIcon sx={{ color: 'red' }} /> Close</Button>
                <Button onClick={copyLink}><ContentCopy sx={{ color: '#29abe2' }} /> Copy</Button>
            </DialogActions>
        </>
    )
}

export default IDCard;