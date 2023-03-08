import React from 'react';

import styles from './ButtonGroup.module.scss'

export const ButtonGroup = ({ children }) => {
    return (
        <div className={styles.button_group}>
            {children}
        </div>
    )
}