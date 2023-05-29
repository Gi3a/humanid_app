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
import { ButtonGroup } from '../UI/Group/ButtonGroup';

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

    const showContract = () => {
        linkRef.current.select();
        document.execCommand('copy');
        const url = `https://mumbai.polygonscan.com/address/0x114005863CBeb472B9F994829695A97386A8a7e7#readContract`;
        window.open(url, '_blank');
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
            <ButtonGroup>
                <Submit onClick={() => navigate('/panel')}>⬅️ Back</Submit>
                <Submit onClick={copyLink}>🪞 Copy</Submit>
                <Submit onClick={showContract}>💾 Contract</Submit>
            </ButtonGroup>
        </Div>
    )
}

export default CardID