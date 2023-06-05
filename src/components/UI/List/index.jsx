import React, { useEffect, useState } from 'react';

import axios from 'axios';

import { useModal } from '../../../hooks/use-modal';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setLoad } from '../../../store/slices/loadSlice';

import styles from './List.module.scss';

import { useAuth } from '../../../hooks/use-auth';

import ListItem from '../ListItem';

const List = ({ type }) => {


    let { user_name, user_id } = useParams();
    const { openModal } = useModal();
    const [data, setData] = useState([]);



    const { token, public_key } = useAuth();
    const dispatch = useDispatch();

    const handleLoading = () => {
        dispatch(setLoad());
    }

    useEffect(() => {
        if (user_name && user_id) {
            openModal(user_name + '|' + user_id, 'wow', 'shares');
        }
    }, [user_name, user_id])

    useEffect(() => {
        handleLoading();
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/${type}/${public_key}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data) {
                    if (type === 'accesses')
                        setData(response.data.accesses);
                    else
                        setData(response.data.shares);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                handleLoading();
            }
        };

        fetchData();
    }, [type, public_key, token]);



    return (
        <>
            {data &&
                <div className={styles.list}>
                    {data.map((item) => (
                        <ListItem key={item[0]} item={item} type={type} />
                    ))}
                </div>
            }
        </>
    )
}

export default List