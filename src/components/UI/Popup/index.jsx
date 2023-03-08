import React from 'react';

import Modal from '@mui/material/Modal';

import styles from './Modal.module.scss';
import { Typography } from '@mui/material';

export const Popup = ({ title, children, ...props }) => {
    return (
        <Modal
            className={styles.modal}
            {...props}
        >
            <div className={styles.modal_content}>
                <Typography component='h2' variant='5'>{title}</Typography>
                {children}
            </div>
        </Modal>
    )
}
