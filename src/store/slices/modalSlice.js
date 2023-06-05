import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    open: false,
    title: null,
    data: null,
    type: null
};

export const modalReducer = createSlice({
    name: 'modal',
    initialState: initialState,
    reducers: {
        setModal: (state, action) => {
            state.open = true;
            state.title = action.payload.title;
            state.data = action.payload.data;
            state.type = action.payload.type;
        },
        unsetModal(state) {
            state.open = false;
            state.title = null;
            state.data = null;
            state.type = null;
        },
    }
})

export default modalReducer.reducer;

export const { setModal, unsetModal } = modalReducer.actions;