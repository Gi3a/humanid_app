import React from 'react';

import styles from './Form.module.scss';

export const Form = ({ children, ...props }) => {
    return (
        <form
            className={styles.form}
            noValidate
            {...props}
        >
            {children}
        </form>
    )
}
