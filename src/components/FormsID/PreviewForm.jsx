import React, { useState } from 'react';

import axios from 'axios';
import Swal from 'sweetalert2';
import Confetti from 'react-confetti';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

import { useAuth } from '../../hooks/use-auth';

import { Div } from '../UI/Div';
import { Popup } from '../UI/Popup';
import { Submit } from '../UI/Submit';
import { ButtonGroup } from '../UI/Group/ButtonGroup';

import { generateKeyPair, restoreKeyPair, encrypt, decrypt } from '../../utils/crypto';

export const PreviewForm = ({ handleNext, handleBack }) => {

    const [showModal, setShowModal] = useState(false);

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
        pin
    } = useAuth();


    const handleSubmit = () => {
        setShowModal(true);
    };


    // const generationKeys = async () => {
    //     const keyPair = await generateKeyPair();
    //     const privateKeyBuffer = await exportPrivateKey(keyPair);
    //     const publicKey = keyPair.publicKey;
    //     const combinedKey = password + face_encodings;
    //     const encryptedData = await encryptPrivateKey(privateKeyBuffer, combinedKey);
    //     return { publicKey, encryptedData }
    // }



    const handleConfirm = async () => {


        const { publicKey, privateKey, saltedFaceEncodings } = generateKeyPair(face_encodings, pin);
        console.log('Generated key pair:', { publicKey, privateKey });

        const restoredKeyPair = restoreKeyPair(saltedFaceEncodings, pin);
        console.log('Restored key pair:', restoredKeyPair);

        const text = 'Hello, world!';
        const encryptedData = encrypt(text, publicKey, privateKey);
        console.log('Encrypted data:', encryptedData);

        const decryptedText = decrypt(encryptedData, restoredKeyPair.publicKey, restoredKeyPair.privateKey);
        console.log('Decrypted text:', decryptedText);


        // const form = {
        //     // L1
        //     firstname: firstname,
        //     lastname: lastname,
        //     date_of_birth: date_of_birth,
        //     // L2
        //     email: email,
        //     phone: phone,
        //     // L3
        //     id_number: id_number,
        //     nationality: nationality,
        //     date_of_issue: date_of_issue,
        //     date_of_expiry: date_of_expiry,
        //     // L4
        //     public_key: publicKey,
        //     private_key: encryptedPrivateKey,
        //     face_encodings: face_encodings,
        // };


        // await axios({
        //     method: "post",
        //     url: `http://127.0.0.1:8000/join`,
        //     // headers: {
        //     //     "Content-Type": "application/json",
        //     //     "Authorization": `Bearer ${token}`
        //     // },
        //     data: form
        // })
        //     .then((response) => {
        //         console.log(response);
        //         setShowModal(false);
        //         Swal.fire('Great job!', response.message, 'success');
        //         // get info from smartcontract
        //         // if (response.data.face_encodings) {
        //         //     console.log('isnt identified')
        //         //     dispatch(setFace({
        //         //         face_encodings: response.data.face_encodings,
        //         //     }));
        //         // }
        //         return <Confetti />
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //         Swal.fire('Error', error.message, 'error');
        //         setShowModal(false);
        //     });
    };

    const handleCancel = () => {
        setShowModal(false);
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
                            <TableCell>{new Date(date_of_birth).toISOString().substr(0, 10)}</TableCell>
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
                            <TableCell>{new Date(date_of_issue).toISOString().substr(0, 10)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Date of Expiry:</TableCell>
                            <TableCell>{new Date(date_of_expiry).toISOString().substr(0, 10)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Email:</TableCell>
                            <TableCell>{email}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Phone:</TableCell>
                            <TableCell>{phone}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>PIN:</TableCell>
                            <TableCell>{pin}</TableCell>
                        </TableRow>
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
