import React from 'react';

import styles from './Div.module.scss';

export const Div = ({ children, ...props }) => {
    return (
        <div
            className={styles.div}
            {...props}
        >
            {children}
        </div>
    )
}
