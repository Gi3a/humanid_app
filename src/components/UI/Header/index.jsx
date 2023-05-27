import React from 'react';
import { Link } from "react-router-dom";

import { Img } from 'react-image';

import styles from './Header.module.scss'

import iconImage from '../../../assets/images/icon.png';

const Header = () => {
    return (
        <header
            className={styles.header}
        >
            <Link to="/">
                <Img src={iconImage} alt="HumanID" />
            </Link>
        </header>
    )
}

export default Header