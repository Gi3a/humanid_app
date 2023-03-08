import React from 'react';

import { Button } from '@mui/material';

import styles from './Submit.module.scss';


export const Submit = ({ children, ...props }) => {
    return (
        <Button
            className={styles.submit}
            type='submit'
            fullWidth
            variant='contained'
            color='info'
            {...props}
        >
            {children}
        </Button>
    )
}