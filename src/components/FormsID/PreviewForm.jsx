import React, { useState } from 'react';

import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setLoad } from '../../store/slices/loadSlice';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

import { useAuth } from '../../hooks/use-auth';
import { setAuth, setKeys } from '../../store/slices/userSlice';


import { Div } from '../UI/Div';
import { Popup } from '../UI/Popup';
import { Submit } from '../UI/Submit';
import { ButtonGroup } from '../UI/Group/ButtonGroup';

import { viewDate } from '../../utils/date';
import {
    generatePinnedFaceEncodings,
    generateKeyPair,
    generatePublicKey,
    encryptData
} from '../../utils/crypto';


export const PreviewForm = ({ handleNext, handleBack }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showModal, setShowModal] = useState(false);

    const handleLoading = () => {
        dispatch(setLoad());
    }

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
        if (!token && !pin) {
            Swal.fire('Missing PIN', 'Please fill in the PIN field in Additional Data', 'info');
        } else if (!email) {
            Swal.fire('Missing Email', 'Please fill in the Email field in Additional Data', 'info');
        } else if (!phone) {
            Swal.fire('Missing Phone', 'Please fill in the Phone field in Additional Data', 'info');
        } else {
            setShowModal(true);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
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
                console.log(response.data);
                handleCancel();
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
                        Swal.fire('Great job!', response.message, 'success');
                        navigate('/panel');
                    }
                    else {
                        Swal.fire(response.message, 'Try again', 'info');
                    }
                }
                else {
                    Swal.fire(response.message, 'Try again', 'info');
                    navigate('/settings');
                }
            })
            .catch((error) => {
                console.log(error);
                Swal.fire('Error', error.message, 'error');
                setShowModal(false);
            });

    };


    return (
        <Div>
            <TableContainer>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>First Name:</TableCell>
                            <TableCell>{firstname}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Last Name:</TableCell>
                            <TableCell>{lastname}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Date of Birth:</TableCell>
                            <TableCell>{viewDate(new Date(date_of_birth))}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>ID Number:</TableCell>
                            <TableCell>{id_number}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Nationality:</TableCell>
                            <TableCell>{nationality}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Date of Issue:</TableCell>
                            <TableCell>{viewDate(new Date(date_of_issue))}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Date of Expiry:</TableCell>
                            <TableCell>{viewDate(new Date(date_of_expiry))}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Email:</TableCell>
                            <TableCell>{email}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Phone:</TableCell>
                            <TableCell>{phone}</TableCell>
                        </TableRow>
                        {!token &&
                            <TableRow>
                                <TableCell>PIN:</TableCell>
                                <TableCell>{pin}</TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <ButtonGroup>
                <Submit onClick={handleBack}>⬅️ Back</Submit>
                <Submit onClick={handleSubmit}>✅ Save</Submit>
            </ButtonGroup>

            <Popup
                title='Are you sure you want to save the form?'
                open={showModal}
                onClose={handleCancel}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <ButtonGroup>
                    <Submit onClick={handleCancel}>❌ Cancel</Submit>
                    <Submit onClick={handleConfirm}>✅ Save</Submit>
                </ButtonGroup>
            </Popup>
        </Div>
    )
}
