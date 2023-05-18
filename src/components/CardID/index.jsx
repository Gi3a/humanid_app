import React, { useRef } from 'react';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/use-auth';
import { setLoad } from '../../store/slices/loadSlice';

import styles from './CardID.module.scss';

import { QRCodeSVG } from 'qrcode.react';


import { Div } from '../UI/Div';
import { Input } from '../UI/Input';
import { Submit } from '../UI/Submit';

const CardID = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const linkRef = useRef(null);
    const inputRef = useRef(null);

    const copyLink = () => {
        linkRef.current.select();
        document.execCommand('copy');
    };

    const handleClick = () => {
        if (linkRef.current) {
            linkRef.current.select();
        }
    };


    const handleLoading = () => {
        dispatch(setLoad());
    }

    const {
        public_key,
        firstname
    } = useAuth();

    const share_id = `${process.env.REACT_APP_APP_URL}/${firstname}/${public_key}`;

    return (
        <Div className={styles.cardid}>
            <QRCodeSVG value={share_id} />
            <Input
                ref={linkRef}
                onClick={handleClick}
                type="text"
                value={share_id}
                readOnly
            />
            <Submit onClick={copyLink}>🪞 Copy</Submit>
            <Submit onClick={() => navigate('/panel')}>⬅️ Back</Submit>
        </Div>
    )
}

export default CardID