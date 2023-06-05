import React from 'react';

import { useModal } from '../../../hooks/use-modal';

import Tag from '@mui/icons-material/Tag';
import EventBusy from '@mui/icons-material/EventBusy';
import LockPerson from '@mui/icons-material/LockPerson';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import BroadcastOnPersonal from '@mui/icons-material/BroadcastOnPersonal';

import styles from './ListItem.module.scss';

import { viewDate, modifyDate } from '../../../utils/date';
import { viewPublicKey } from '../../../utils/crypto';


const ListItem = ({ item, type }) => {

    const { openModal } = useModal();

    const handleOpenModal = () => {
        if (type === 'shares')
            openModal(item[3] + '|' + item[2], item[4], type);
        else
            openModal(item[1], item[4], type);
    };

    return (
        <>
            <div
                key={item[0]}
                className={styles.item}
                onClick={handleOpenModal}
            >
                <span>
                    <b><Tag />ID</b>
                    {item[0]}
                </span>
                {type === 'accesses' &&
                    <span>
                        <b><BroadcastOnPersonal /> Owner</b>
                        {viewPublicKey(item[1])}
                    </span>
                }
                {type === 'shares' &&
                    <>
                        <span>
                            <b><LockPerson /> Receiver</b>
                            {item[3]} <br />
                            {viewPublicKey(item[2])}
                        </span>
                    </>
                }
                <span>
                    <b><CalendarMonth /> Start Date </b>
                    {viewDate(new Date(item[5]))}
                </span>
                <span>
                    <b> <EventBusy /> End Date </b>
                    {modifyDate(new Date(item[6]), 12)}
                </span>
            </div>

        </>
    )
}

export default ListItem