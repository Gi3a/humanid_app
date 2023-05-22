import React, { useEffect, useState } from 'react';

import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useAuth } from '../../hooks/use-auth';
import { setLoad } from '../../store/slices/loadSlice';

import styles from './ShareID.module.scss';

import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';



import { Div } from '../UI/Div';
import { Form } from '../UI/Form';
import { Input } from '../UI/Input';
import { Submit } from '../UI/Submit';
import { ButtonGroup } from '../UI/Group/ButtonGroup';

import { encryptData, generatePinnedFaceEncodings, decryptData } from '../../utils/crypto';


const schema = yup.object().shape({
    receiver: yup
        .string()
        .matches(/^([^0-9]*)$/, 'Receiver should not contain numbers')
        .required('Receiver is a required field'),
});

const ShareID = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user_name, user_id } = useParams();



    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            receiver: user_name,
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


    const handleLoading = () => {
        dispatch(setLoad());
    }

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
            // Add data back into checkedData
            setCheckedData({
                ...checkedData,
                [event.target.name]: initialData[event.target.name],
            });
        } else {
            // Remove data from checkedData
            const newCheckedData = { ...checkedData };
            delete newCheckedData[event.target.name];
            setCheckedData(newCheckedData);
        }
    };

    const handleBan = async () => {
        const publicKey = public_key;
        if (userKey) {
            await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}/ban`,
                data: {
                    human_id: publicKey,
                    shared_id: user_id
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    console.log(response.data);
                    if (response.data.access_token) {
                        Swal.fire('Banned!', response.message, 'success');
                        navigate('/panel');
                    }
                    else {
                        Swal.fire(response.message, 'Try again', 'info');
                        window.location.reload();
                    }
                })
                .catch((error) => {
                    console.log(error);
                    Swal.fire('Error', error.message, 'error');
                });
        }
        else {
            window.location.reload();
        }
    }

    const handleUpdate = async () => {
        const method = "renew";
        sendForm(method);
    }

    const handleSave = async (data) => {
        handleLoading();
        var method;
        if (!getData)
            method = "share";
        else
            method = "renew";

        sendForm(method, data.receiver);
    };

    const sendForm = async (method, receiver) => {
        const publicKey = public_key;
        const publicKeyArmored = encrypted_public_key;

        if (userKey) {
            const encryptedData = await encryptData(JSON.stringify(checkedData), [publicKeyArmored, userKey]);
            await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}/${method}`,
                data: {
                    receiver: receiver,
                    human_id: publicKey,
                    shared_id: user_id,
                    data: encryptedData,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    handleLoading();
                    console.log(response.data);
                    if (response.data.access_token) {
                        Swal.fire('Saved!', response.message, 'success');
                    }
                    else {
                        Swal.fire(response.message, 'Try again', 'info');
                    }
                })
                .catch((error) => {
                    console.log(error);
                    Swal.fire('Error', error.message, 'error');
                });
        }
        else {
            window.location.reload();
        }
    }



    useEffect(() => {
        handleLoading();
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/id/${public_key}/${user_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.encrypted_public_key) {
                    setUserKey(response.data.encrypted_public_key);
                    handleLoading();
                }
                if (Object.keys(response.data.data).length !== 0) {

                    setValue('receiver', response.data.data[0][1]);

                    const pinnedFaceEncodings = generatePinnedFaceEncodings(face_encodings, pin);
                    try {

                        const decryptedData = JSON.parse(await decryptData(response.data.data[0][0], encrypted_private_key, pinnedFaceEncodings));
                        setGetData(decryptedData);
                        setCheckedData(decryptedData);
                        handleLoading();


                    } catch (error) {
                        Swal.fire('Incorrect PIN', 'Try again!', 'error').then((result) => {
                            if (result.isConfirmed)
                                window.location.reload();
                        })
                    }
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
            {userKey &&
                <Form
                    onSubmit={handleSubmit(handleSave)}
                >
                    <FormGroup>
                        <Input
                            {...register('receiver', { required: true })}
                            id='receiver'
                            type='text'
                            label='Receiver (Marker)'
                            name='receiver'
                            error={!!errors.receiver}
                            helperText={errors?.receiver?.message}

                        />
                        <FormControlLabel required
                            control={<Checkbox checked={checkedData.name ? true : false} onChange={handleCheckboxChange} name="name" />}
                            label={`First/Last name: ${firstname} ${lastname}`}
                        />
                        <FormControlLabel required
                            control={<Checkbox checked={checkedData.passport ? true : false} onChange={handleCheckboxChange} name="passport" />}
                            label={`Passport: ${id_number} ${nationality} `}
                        />
                        <FormControlLabel required
                            control={<Checkbox checked={checkedData.email ? true : false} onChange={handleCheckboxChange} name="email" />}
                            label={`Email: ${email}`}
                        />
                        <FormControlLabel required
                            control={<Checkbox checked={checkedData.phone ? true : false} onChange={handleCheckboxChange} name="phone" />}
                            label={`Phone: ${phone}`}
                        />
                    </FormGroup>
                    <ButtonGroup>
                        <Submit onClick={() => navigate('/panel')}>⬅️ Back</Submit>
                        {!getData ?
                            <>
                                <Submit>✅ Save</Submit>
                            </>
                            :
                            <>
                                <Submit>✅ Update</Submit>
                                <Submit onClick={handleBan}>⛔ Ban</Submit>
                            </>
                        }
                    </ButtonGroup>

                </Form>
            }
        </Div>
    )
}

export default ShareID