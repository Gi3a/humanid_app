import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    loadState: true
}

export const loadReducer = createSlice({
    name: 'load',
    initialState: initialState,
    reducers: {
        setLoad: (state) => {
            state.loadState = !state.loadState
        },
    }
})

export default loadReducer.reducer;

export const { setLoad } = loadReducer.actions;