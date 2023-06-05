import React from 'react';

import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import styles from './SettingsForms.module.scss'

import Swal from 'sweetalert2';

import { setLoad } from '../../../store/slices/loadSlice';
import Button from '@mui/material/Button';
import { ButtonGroup } from '@mui/material';

import { useAuth } from '../../../hooks/use-auth';
import { setAuth } from '../../../store/slices/userSlice';
import { viewDate } from '../../../utils/date';
import {
    generatePinnedFaceEncodings,
    generateKeyPair,
    generatePublicKey,
    encryptData
} from '../../../utils/crypto';


import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SaveIcon from '@mui/icons-material/Save';

export const PreviewForm = ({ handleNext, handleBack }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLoading = () => {
        dispatch(setLoad());
    }

    const {
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
        if (!token && !pin) {
            console.log('error');
        } else if (!email) {
            console.log('error');
        } else if (!phone) {
            console.log('error');
        }
        handleConfirm()
    };

    const handleConfirm = async () => {
        handleLoading();

        var url_method = `registration`;
        var publicKey;
        let publicKeyArmored;
        let privateKeyArmored;

        if (token)
            url_method = 'update';


        console.log(url_method)


        // SALT Generation
        const pinnedFaceEncodings = generatePinnedFaceEncodings(face_encodings, pin);

        // Keys Generation
        if (token) {
            publicKey = public_key;
            privateKeyArmored = encrypted_private_key;
            publicKeyArmored = encrypted_public_key;
        } else {
            const { privateKeyArmored: generatedPrivateKeyArmored, publicKeyArmored: generatedPublicKeyArmored } =
                await generateKeyPair(pinnedFaceEncodings, firstname + ' ' + lastname, email);
            privateKeyArmored = generatedPrivateKeyArmored;
            publicKeyArmored = generatedPublicKeyArmored;
            publicKey = generatePublicKey(email, phone);
        }

        // Personal Data
        const personal_data = {
            // L1
            firstname: firstname,
            lastname: lastname,
            date_of_birth: date_of_birth,
            // L2
            email: email,
            phone: phone,
            // L3
            id_number: id_number,
            nationality: nationality,
            date_of_issue: date_of_issue,
            date_of_expiry: date_of_expiry,
            public_key: publicKey
        }
        // Data encryption
        const encryptedData = await encryptData(JSON.stringify(personal_data), [publicKeyArmored]);
        // Data forming
        const form = {
            old_public_key: '???',
            public_key: publicKey,
            personal_data: encryptedData,
            encrypted_public_key: publicKeyArmored,
            encrypted_private_key: privateKeyArmored,
            face_encodings: face_encodings,
        };
        // Data sendting
        await axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}/${url_method}`,
            data: form,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (response.data) {
                    if (response.data.access_token) {
                        console.log('registered')
                        const access_token = response.data.access_token;
                        const person = response.data.person;
                        dispatch(setAuth({
                            public_key: person.public_key,
                            token: access_token,
                            face_encodings: person.face_encodings,
                            encrypted_public_key: publicKeyArmored,
                            encrypted_private_key: privateKeyArmored,
                            pin: pin,
                        }));
                        Swal.fire('Data have been updated!', response.message, 'success')
                            .then(() => {
                                navigate('/profile');
                            });
                    }
                    else {
                        Swal.fire('Error', response.message, 'error')
                            .then(() => {
                                navigate('/settings');
                            });
                    }
                }
                else {
                    Swal.fire('Error', response.message, 'error')
                        .then(() => {
                            navigate('/settings');
                        });
                }
            })
            .catch((error) => {
                Swal.fire('Error', error.message, 'error')
                    .then(() => {
                        navigate('/settings');
                    });
            });

    };


    return (
        <>
            <div className={styles.preview}>
                <div className={styles.previewbox}>
                    <div>
                        <span>First Name</span>
                        {firstname}
                    </div>
                    <div>
                        <span>Last Name</span>
                        {lastname}
                    </div>
                    <div>
                        <span>Date of Birth</span>
                        {viewDate(new Date(date_of_birth))}
                    </div>
                </div>
                <div className={styles.previewbox}>
                    <div>
                        <span>ID Number</span>
                        {id_number}
                    </div>
                    <div>
                        <span>Nationality</span>
                        {nationality}
                    </div>
                    <div>
                        <span>Date of Issue:</span>
                        {viewDate(new Date(date_of_issue))}
                    </div>
                    <div>
                        <span>Date of Expiry:</span>
                        {viewDate(new Date(date_of_expiry))}
                    </div>
                </div>
                <div className={styles.previewbox}>
                    <div>
                        <span>Email</span>
                        {email}
                    </div>
                    <div>
                        <span>Phone</span>
                        {phone}
                    </div>
                    {!token &&
                        <div>
                            <span>PIN</span>
                            {pin}
                        </div>
                    }
                </div>
            </div>
            <ButtonGroup>
                <Button onClick={handleBack}>
                    <ArrowBackIosIcon /> Back
                </Button>
                <Button onClick={handleSubmit}>
                    <SaveIcon />Save
                </Button>
            </ButtonGroup>
        </>
    )
}
