import React, { useState, useEffect } from 'react';

import axios from 'axios';
import Swal from 'sweetalert2';

import { useAuth } from '../../../hooks/use-auth';
import { useModal } from '../../../hooks/use-modal';

import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';

import DoDisturb from '@mui/icons-material/DoDisturb';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';

import { Form } from '../Form';
import { Input } from '../Input';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { encryptData, generatePinnedFaceEncodings, decryptData } from '../../../utils/crypto';

import styles from './DialogCard.module.scss';

const schema = yup.object().shape({
    receiver: yup
        .string()
        .matches(/^([^0-9]*)$/, 'Receiver should not contain numbers')
        .required('Receiver is a required field'),
});


const ShareCard = ({ receiver_name, receiver_id, data }) => {

    const navigate = useNavigate();

    const { closeModal } = useModal();

    const handleCloseModal = () => {
        closeModal();
    };

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            receiver: receiver_name,
        },
        mode: 'onBlur',
        resolver: yupResolver(schema)
    });

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

    const [initialData, setInitialData] = useState({
        name: { firstname, lastname },
        passport: { id_number, nationality, date_of_birth, date_of_issue, date_of_expiry },
        email: { email },
        phone: { phone }
    });

    const [checkedData, setCheckedData] = useState({});
    const [userKey, setUserKey] = useState('');
    const [getData, setGetData] = useState();

    const handleCheckboxChange = (event) => {
        console.log(checkedData)
        if (event.target.checked) {
            setCheckedData({
                ...checkedData,
                [event.target.name]: initialData[event.target.name],
            });
        } else {
            const newCheckedData = { ...checkedData };
            delete newCheckedData[event.target.name];
            setCheckedData(newCheckedData);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosCall(`id/${public_key}/${receiver_id}`, 'get');
                if (response.data.encrypted_public_key) {
                    setUserKey(response.data.encrypted_public_key);
                }
                if (Object.keys(response.data.data).length !== 0) {
                    setValue('receiver', response.data.data[0][1]);
                    const pinnedFaceEncodings = generatePinnedFaceEncodings(face_encodings, pin);
                    try {
                        const decryptedData = JSON.parse(await decryptData(response.data.data[0][0], encrypted_private_key, pinnedFaceEncodings));
                        setGetData(decryptedData);
                        setCheckedData(decryptedData);
                    } catch (error) {
                        console.log(error);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [token, pin, public_key, receiver_id, encrypted_private_key, face_encodings]);

    const axiosCall = async (url, method, data = {}) => {
        try {
            const response = await axios({
                method,
                url: `${process.env.REACT_APP_API_URL}/${url}`,
                data,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.access_token) {
                console.log('success')
                if (url === 'ban') navigate('/panel');
            } else {
                console.log('???');
            }

            return response;
        } catch (error) {
            console.log(error);
        }
    };

    const handleBan = async () => {
        if (userKey) {
            const response = await axiosCall('ban', 'post', {
                human_id: public_key,
                shared_id: receiver_id
            });
            if (response.status === 200) {
                Swal.fire('Banned!', response.message, 'success')
                    .then(() => {
                        navigate('/panel');
                    });
            } else {
                Swal.fire(response.message, 'Try again', 'info')
                    .then(() => {
                        navigate('/panel');
                    });
            }
        }
    };

    const handleUpdate = async () => {
        sendForm('renew');
    };

    const handleSave = async (data) => {
        sendForm(!getData ? 'share' : 'renew', data.receiver);
    };

    const sendForm = async (method, receiver) => {
        if (userKey) {
            try {
                const encryptedData = await encryptData(JSON.stringify(checkedData), [encrypted_public_key, userKey]);
                const response = await axiosCall(method, 'post', {
                    receiver,
                    human_id: public_key,
                    shared_id: receiver_id,
                    data: encryptedData,
                });
                Swal.fire('Saved!', response.message, 'success')
                    .then(() => {
                        navigate('/panel');
                    });
            } catch (error) {
                Swal.fire('Error', error.message, 'error')
                    .then(() => {
                        navigate('/panel');
                    });
            }
        }
    };



    return (
        <>
            <Form onSubmit={handleSubmit(handleSave)}>
                <DialogContent>
                    <div className={styles.card}>
                        <FormGroup>
                            <Input
                                {...register('receiver', { required: true })}
                                id='receiver'
                                type='text'
                                label='Receiver Name'
                                name='receiver'
                                error={!!errors.receiver}
                                helperText={errors?.receiver?.message}

                            />
                            <div className={styles.carditem}>
                                <span>Name</span>
                                <FormControlLabel required
                                    control={<Checkbox checked={checkedData.name ? true : false} onChange={handleCheckboxChange} name="name" />}
                                    label={`${firstname} ${lastname}`}
                                />
                            </div>
                            <div className={styles.carditem}>
                                <span>Passport</span>
                                <FormControlLabel required
                                    control={<Checkbox checked={checkedData.passport ? true : false} onChange={handleCheckboxChange} name="passport" />}
                                    label={` ${id_number} ${nationality} `}
                                />
                            </div>
                            <div className={styles.carditem}>
                                <span>Email</span>
                                <FormControlLabel required
                                    control={<Checkbox checked={checkedData.email ? true : false} onChange={handleCheckboxChange} name="email" />}
                                    label={` ${email}`}
                                />
                            </div>
                            <div className={styles.carditem}>
                                <span>Phone</span>
                                <FormControlLabel required
                                    control={<Checkbox checked={checkedData.phone ? true : false} onChange={handleCheckboxChange} name="phone" />}
                                    label={`${phone}`}
                                />
                            </div>
                        </FormGroup>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}><CloseIcon sx={{ color: 'red' }} /> Close</Button>
                    <Button type="submit"><DoneIcon sx={{ color: 'green' }} />Save</Button>
                    {getData &&
                        <Button onClick={handleBan}><DoDisturb sx={{ color: 'red' }} />Ban</Button>
                    }

                </DialogActions>
            </Form>
        </>
    )
}

export default ShareCard