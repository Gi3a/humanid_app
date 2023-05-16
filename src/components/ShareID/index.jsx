import React, { useEffect } from 'react';

import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/use-auth';
import { setLoad } from '../../store/slices/loadSlice';

import styles from './ShareID.module.scss';

import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import { viewDate } from '../../utils/date';

import { Div } from '../UI/Div';
import { Submit } from '../UI/Submit';
import { ButtonGroup } from '../UI/Group/ButtonGroup';

const CardID = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user_id } = useParams();

    const {
        face,
        firstname,
        lastname,
        date_of_birth,
        id_number,
        nationality,
        face_encodings,
        date_of_issue,
        date_of_expiry,
        email,
        phone,
        pin,
        token,
        public_key,
        encrypted_public_key,
        encrypted_private_key,
    } = useAuth();

    const handleSubmit = () => {
        Swal.fire('Click', '...', 'info');

    };

    const handleLoading = () => {
        dispatch(setLoad());
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                handleLoading();
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/id/${user_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                handleLoading();
            } catch (error) {
                // Handle error here
                console.log(error);
            }
        };

        fetchData();
    }, [user_id, token]);

    return (
        <Div className={styles.shareid}>
            <FormGroup>
                <FormControlLabel required control={<Checkbox defaultChecked />} label={`First/Last name: ${firstname} ${lastname}`} />
                <FormControlLabel required control={<Checkbox />} label={`Birth Date: ${viewDate(new Date(date_of_birth))}`} />
                <FormControlLabel required control={<Checkbox />} label={`Passport: ${id_number} ${nationality}`} />
                <FormControlLabel disabled control={<Checkbox defaultChecked />} label={`Email: ${email}`} />
                <FormControlLabel required control={<Checkbox />} label={`Phone: ${phone}`} />
            </FormGroup>
            <ButtonGroup>
                <Submit onClick={() => navigate('/panel')}>⬅️ Back</Submit>
                <Submit onClick={handleSubmit}>✅ Save</Submit>
                <Submit onClick={handleSubmit}>⛔ Ban</Submit>
            </ButtonGroup>
        </Div>
    )
}

export default CardID