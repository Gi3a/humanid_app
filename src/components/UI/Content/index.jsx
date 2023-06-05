import React from 'react';

import styles from './Content.module.scss'

const Content = ({ children }) => {
    return (
        <main className={styles.content}>
            <div className={styles.page}>
                {children}
            </div>
        </main>
    )
}

export default Content