import React, { useEffect } from 'react';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';

import { setLoad } from '../store/slices/loadSlice';


export default function SimpleBackdrop() {

    const dispatch = useDispatch();
    const loadSelector = useSelector((state) => state.load.loadState);

    useEffect(() => {
        if (loadSelector) {
            const timer = setTimeout(() => {
                dispatch(setLoad());
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [loadSelector, dispatch]);


    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loadSelector}>
            <CircularProgress color="inherit" />
        </Backdrop >
    );
}