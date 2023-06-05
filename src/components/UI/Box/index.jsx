import React from 'react'

import styles from './Box.module.scss';

const Box = ({ children }) => {
    return (
        <div className={styles.box}>
            {children}
        </div>
    )
}

export default Box