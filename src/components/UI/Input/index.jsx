import React, { forwardRef } from 'react';

import { TextField } from '@mui/material';

import styles from './Input.module.scss';

export const Input = forwardRef((props, ref) => {
    return (
        <TextField
            className={styles.input}
            variant='outlined'
            margin='normal'
            inputRef={ref}
            fullWidth
            {...props}
        />
    )
})