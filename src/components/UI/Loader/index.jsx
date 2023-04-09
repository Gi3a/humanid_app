import React, { useEffect } from 'react'
import styles from "./Loader.module.scss";
import { useDispatch } from "react-redux";
import { Dna } from "react-loader-spinner";

import { setLoad } from '../../../store/slices/loadSlice';

const delay = 5;

const Loader = () => {

    const dispatch = useDispatch();

    const handleLoading = () => {
        dispatch(setLoad());
    }

    useEffect(
        () => {
            let timer1 = setTimeout(() => handleLoading(), delay * 1000);
            return () => {
                clearTimeout(timer1);
            };
        },

        []
    );

    return (
        <div className={styles.loader}>
            <Dna
                visible={true}
                height="120"
                width="120"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
            />
        </div>
    )
}

export default Loader