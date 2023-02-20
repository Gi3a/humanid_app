import React from 'react'
import { Link } from 'react-router-dom'

import styles from './Menu.module.scss';

const Menu = () => {

    return (
        <div className={styles.menu}>
            <Link to="/panel">Panel</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/">Exit</Link>
        </div>
    )
}

export default Menu