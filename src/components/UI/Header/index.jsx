import { Typography } from '@mui/material';
import React from 'react';

import styles from './Header.module.scss'

export const Header = () => {
    return (
        <header
            className={styles.header}
        >
            <Typography>
                HumanID
            </Typography>
        </header>
    )
}