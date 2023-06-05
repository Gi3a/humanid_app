import React from 'react';

import { useModal } from '../hooks/use-modal';

import Dialog from '@mui/material/Dialog';

import AccessCard from './UI/DialogCard/AccessCard';
import ShareCard from './UI/DialogCard/ShareCard';
import ConfirmCard from './UI/DialogCard/ConfirmCard';
import IDCard from './UI/DialogCard/IDCard';

const Modal = () => {

    const { modal, closeModal, title, data, type } = useModal();

    const handleCloseModal = () => {
        closeModal();
    };

    let receiver_name, receiver_id;

    if (type === 'shares') {
        [receiver_name, receiver_id] = title.split("|");
    }

    return (
        <Dialog
            open={modal}
            onClose={handleCloseModal}
            className='modal'
        >
            {type === 'accesses' &&
                <AccessCard title={title} data={data} />
            }
            {type === 'shares' &&
                <ShareCard receiver_name={receiver_name} receiver_id={receiver_id} data={data} />
            }
            {type === 'confirmation' &&
                <ConfirmCard title={title} />
            }
            {type === 'id' &&
                <IDCard title={title} />
            }
        </Dialog >
    )
}

export default Modal