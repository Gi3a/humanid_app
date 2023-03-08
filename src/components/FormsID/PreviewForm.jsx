import React, { useState } from 'react';

import axios from 'axios';
import Swal from 'sweetalert2';
import Confetti from 'react-confetti';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { useAuth } from '../../hooks/use-auth';

import { Div } from '../UI/Div';
import { Popup } from '../UI/Popup';
import { Submit } from '../UI/Submit';
import { ButtonGroup } from '../UI/Group/ButtonGroup';

export const PreviewForm = ({ handleNext, handleBack }) => {

    const [showModal, setShowModal] = useState(false);

    const {
        firstname,
        lastname,
        date_of_birth,
        id_number,
        nationality,
        date_of_issue,
        date_of_expiry,
        email,
        phone,
        password,
        secrets,
    } = useAuth();


    const handleSubmit = () => {
        setShowModal(true);
    };

    const handleConfirm = () => {
        axios
            .post('/api/form', {
                firstname,
                lastname,
                date_of_birth,
                id_number,
                nationality,
                date_of_issue,
                date_of_expiry,
                email,
                phone,
                password,
                secrets,
            })
            .then((response) => {
                console.log(response);
                setShowModal(false);
                Swal.fire('Great job!', response.message, 'success');
                return <Confetti />
            })
            .catch((error) => {
                console.log(error);
                Swal.fire('Error', error.message, 'error');
                setShowModal(false);
            });
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
                            <TableCell>Password:</TableCell>
                            <TableCell>{password}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Secrets:</TableCell>
                            <TableCell>{secrets.join(', ')}</TableCell>
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
