import React, { useEffect, useState } from 'react';

import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';

import { useAuth } from '../../hooks/use-auth';
import { setLoad } from '../../store/slices/loadSlice';

import styles from './ShareList.module.scss';

import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';


import { Div } from '../UI/Div';
import { Submit } from '../UI/Submit';
import { ButtonGroup } from '../UI/Group/ButtonGroup';

import { encryptData, generatePinnedFaceEncodings, decryptData } from '../../utils/crypto';


const ShareList = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [shareList, setShareList] = useState([]);

    const { user_id } = useParams();

    const {
        firstname,
        lastname,
        date_of_birth,
        id_number,
        nationality,
        date_of_issue,
        date_of_expiry,
        face_encodings,
        email,
        phone,
        pin,
        token,
        public_key,
        encrypted_public_key,
        encrypted_private_key
    } = useAuth();


    const handleLoading = () => {
        dispatch(setLoad());
    }

    useEffect(() => {
        handleLoading();
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/shares/${public_key}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data) {
                    setShareList(response.data.shares)
                    handleLoading();
                }
            } catch (error) {
                // Handle error here
                console.log(error);
            }
        };

        fetchData();
    }, [user_id, token]);

    return (
        <Div className={styles.shareid}>

            <h1>Shares (with whom I shared)</h1>
            {shareList.map((item) => {
                return (
                    <Link to={`${process.env.REACT_APP_APP_URL}/${item[3]}/${item[2]}`} key={item[0]}>
                        <p>id: {item[0]}</p>
                        <p>human_id: {item[1]}</p>
                        <p>shared_id: {item[2]}</p>
                        <p>receiver: {item[3]}</p>
                        <p>date_create: {item[5]}</p>
                        <p>date_update: {item[6]}</p>
                    </Link>
                );
            })}


        </Div>
    )
}

export default ShareList