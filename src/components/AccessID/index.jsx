import React, { useEffect, useState } from 'react';

import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';


import { useAuth } from '../../hooks/use-auth';
import { setLoad } from '../../store/slices/loadSlice';

import styles from './AccessID.module.scss';

import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';


import { Div } from '../UI/Div';
import { Submit } from '../UI/Submit';

import { generatePinnedFaceEncodings, decryptData } from '../../utils/crypto';



const AccessID = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user_id } = useParams();

    const [sharedData, setSharedData] = useState();

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
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/access/${user_id}/${public_key}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (Object.keys(response.data.data).length !== 0) {

                    const pinnedFaceEncodings = generatePinnedFaceEncodings(face_encodings, pin);
                    try {
                        const decryptedData = JSON.parse(await decryptData(response.data.data[0][4], encrypted_private_key, pinnedFaceEncodings));
                        setSharedData(decryptedData);

                        handleLoading();



                    } catch (error) {
                        navigate('/error');
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
            {sharedData &&
                <TableContainer>
                    <Table>
                        <TableBody>
                            {sharedData.name &&
                                <TableRow>
                                    <TableCell>Name:</TableCell>
                                    <TableCell>{sharedData.name.firstname} {sharedData.name.lastname}</TableCell>
                                </TableRow>
                            }
                            {sharedData.passport &&
                                <>
                                    <TableRow>
                                        <TableCell>Passport ID:</TableCell>
                                        <TableCell>{sharedData.passport.id_number} </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Nationality:</TableCell>
                                        <TableCell>{sharedData.passport.nationality} </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Birth Date:</TableCell>
                                        <TableCell>{sharedData.passport.date_of_birth} </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Issue Date:</TableCell>
                                        <TableCell>{sharedData.passport.date_of_issue} </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Expiry Date:</TableCell>
                                        <TableCell>{sharedData.passport.date_of_expiry} </TableCell>
                                    </TableRow>
                                </>
                            }
                            {sharedData.phone &&
                                <TableRow>
                                    <TableCell>Phone:</TableCell>
                                    <TableCell>{sharedData.phone.phone}</TableCell>
                                </TableRow>
                            }
                            {sharedData.email &&
                                <TableRow>
                                    <TableCell>Email:</TableCell>
                                    <TableCell>{sharedData.email.email} </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                    <Submit onClick={() => navigate('/panel')}>⬅️ Back</Submit>
                </TableContainer>
            }
        </Div >
    )
}

export default AccessID