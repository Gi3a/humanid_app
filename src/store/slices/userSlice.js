import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: null,
    token: null,
    face_encodings: null,
    id_number: null,
    email: null,
    firstname: null,
    lastname: null,
    nationality: null,
    date_of_birth: null,
    date_of_issue: null,
    date_of_expiry: null,
    public_key: null,
    private_key: null,
    phone: null,
    pin: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.id = action.payload.id;
            state.token = action.payload.token;
            state.face_encodings = action.payload.face_encodings;
            state.id_number = action.payload.id_number;
            state.email = action.payload.email;
            state.pin = action.payload.pin;
            state.firstname = action.payload.firstname;
            state.lastname = action.payload.lastname;
            state.nationality = action.payload.nationality;
            state.date_of_birth = action.payload.date_of_birth;
            state.date_of_issue = action.payload.date_of_issue;
            state.date_of_expiry = action.payload.date_of_expiry;
            state.public_key = action.payload.public_key;
            state.private_key = action.payload.private_key;
            state.phone = action.payload.phone;
        },
        setAuth(state, action) {
            state.id = action.payload.id;
            state.token = action.payload.token;
            state.public_key = action.payload.public_key;
        },
        setFace(state, action) {
            state.face_encodings = action.payload.face_encodings;
        },
        setPersonal(state, action) {
            state.firstname = action.payload.firstname;
            state.lastname = action.payload.lastname;
            state.date_of_birth = action.payload.date_of_birth;
        },
        setPassport(state, action) {
            state.id_number = action.payload.id_number;
            state.nationality = action.payload.nationality;
            state.date_of_issue = action.payload.date_of_issue;
            state.date_of_expiry = action.payload.date_of_expiry;
        },
        setAdditional(state, action) {
            state.email = action.payload.email;
            state.phone = action.payload.phone;
            state.pin = action.payload.pin;
        },
        setSecret(state, action) {
            state.pin = action.payload.pin;
            state.private_key = action.payload.private_key;
        },
        unsetSecret(state) {
            state.pin = null;
            state.private_key = null;
        },
        unsetUser(state) {
            state.id = null;
            state.token = null;
            state.face_encodings = null;
            state.id_number = null;
            state.email = null;
            state.pin = null;
            state.firstname = null;
            state.lastname = null;
            state.nationality = null;
            state.date_of_birth = null;
            state.date_of_issue = null;
            state.date_of_expiry = null;
            state.public_key = null;
            state.private_key = null;
            state.phone = null;
        },
    },
});

export const { setUser, setSecret, setPersonal, setAuth, setFace, setPassport, setAdditional, unsetSecret, unsetUser } = userSlice.actions;

export default userSlice.reducer;