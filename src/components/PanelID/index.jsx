import React, { useState } from 'react';

import axios from 'axios';
import Swal from 'sweetalert2';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { viewDate } from '../../utils/date';
import { useAuth } from '../../hooks/use-auth';
import { setLoad } from '../../store/slices/loadSlice';
import { unsetUser } from '../../store/slices/userSlice';

import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

import styles from './PanelID.module.scss'

import { Div } from '../UI/Div';
import { Popup } from '../UI/Popup';
import { Submit } from '../UI/Submit';
import { ButtonGroup } from '../UI/Group/ButtonGroup';


const PanelID = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLoading = () => {
        dispatch(setLoad());
    }

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
        face_encodings,
        phone,
        face,
        token,
        public_key,
        encrypted_public_key,
        encrypted_private_key,
    } = useAuth();

    const handleSubmit = () => {
        setShowModal(true);
    };

    const handleConfirm = async () => {
        console.log('delete process')
        handleLoading();

        // Data forming
        const form = {
            public_key: public_key,
            personal_data: "erase",
            face_encodings: face_encodings,
            encrypted_public_key: "1",
            encrypted_private_key: "2",
        };
        // Data sendting
        await axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}/delete`,
            data: form,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log(response.data);
                if (response.data) {
                    if (response.status === 200) {
                        console.log('delete')
                        dispatch(unsetUser())
                        Swal.fire('Success!', response.message, 'success');
                        navigate('/');
                    }
                    else {
                        Swal.fire(response.message, 'Try again', 'info');
                    }
                }
                else {
                    Swal.fire(response.message, 'Try again', 'info');
                    navigate('/panel');
                }
            })
            .catch((error) => {
                console.log(error);
                Swal.fire('Error', error.message, 'error');
                setShowModal(false);
            });

    }

    const handleCancel = () => {
        setShowModal(false);
    };

    return (
        <Div className={styles.panelid}>
            <img src={face} alt="Face" />
            <TableContainer>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Name:</TableCell>
                            <TableCell>{firstname + ' ' + lastname}</TableCell>
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
                    </TableBody>
                </Table>
            </TableContainer>
            <ButtonGroup>
                <Submit onClick={() => dispatch(unsetUser())}>🚪 Exit</Submit>
                <Submit onClick={() => navigate('/settings')}>⚙️ Settings</Submit>
                <Submit onClick={() => navigate('/id')}>🪪 ID</Submit>
                <Submit onClick={handleSubmit}>💀 Kill</Submit>
            </ButtonGroup>

            <Popup
                title='Are you sure you want to delete all information?'
                open={showModal}
                onClose={handleCancel}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <ButtonGroup>
                    <Submit onClick={handleCancel}>❌ Cancel</Submit>
                    <Submit onClick={handleConfirm}>✅ Confirm</Submit>
                </ButtonGroup>
            </Popup>
        </Div>
    )
}

export default PanelID