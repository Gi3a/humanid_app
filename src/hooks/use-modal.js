import { useDispatch, useSelector } from 'react-redux';
import { setModal, unsetModal } from '../store/slices/modalSlice';

export const useModal = () => {
    const dispatch = useDispatch();
    const modal = useSelector(state => state.modal.open);
    const title = useSelector(state => state.modal.title);
    const data = useSelector(state => state.modal.data);
    const type = useSelector(state => state.modal.type);

    const openModal = (title, data, type) => {
        dispatch(setModal({ title, data, type }));
    };

    const closeModal = () => {
        dispatch(unsetModal());
    };

    return { modal, openModal, closeModal, title, data, type };
};