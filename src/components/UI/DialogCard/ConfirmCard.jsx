import React from 'react';

import axios from 'axios';
import Swal from 'sweetalert2';

import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';

import { useAuth } from '../../../hooks/use-auth';
import { useModal } from '../../../hooks/use-modal';

import { unsetUser } from '../../../store/slices/userSlice';

import styles from './DialogCard.module.scss';

import { ButtonGroup } from '@mui/material';

const ConfirmCard = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { closeModal, title } = useModal();
    const handleCloseModal = () => { closeModal(); };
    const { face_encodings, token, public_key } = useAuth();

    const handleConfirm = async () => {
        try {
            const response = await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}/delete`,
                data: {
                    public_key,
                    personal_data: "erase",
                    face_encodings,
                    encrypted_public_key: "1",
                    encrypted_private_key: "2",
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data && response.status === 200) {
                dispatch(unsetUser());
                Swal.fire('Data has been deleted!', response.message, 'success')
                    .then(() => {
                        navigate('/');
                    });
            }
        } catch (error) {
            Swal.fire('Error!', error, 'error')
                .then(() => {
                    navigate('/profile');
                });
        }
    }


    return (
        <>
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent>
                <div className={styles.card}>
                    Do you confirm the deletion of the account?
                </div>
            </DialogContent>
            <DialogActions>
                <ButtonGroup>
                    <Button onClick={handleCloseModal}><CloseIcon sx={{ color: 'red' }} /> Cancel</Button>
                    <Button onClick={handleConfirm}><DoneIcon sx={{ color: 'green' }} /> Confirm</Button>
                </ButtonGroup>
            </DialogActions>
        </>
    )
}

export default ConfirmCard