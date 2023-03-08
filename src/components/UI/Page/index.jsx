import { Container } from '@mui/material';
import React from 'react';

import styles from './Page.module.scss';

export const Page = ({ children, ...props }) => {
    return (
        <Container
            className={styles.page}
            maxWidth='md'
            {...props}
        >
            {children}
        </Container>
    )
}
