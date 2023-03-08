import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: null,
    token: null,
    passport_address: null,
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
    password: null,
    secrets: []
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.id = action.payload.id;
            state.token = action.payload.token;
            state.passport_address = action.payload.passport_address;
            state.face_encodings = action.payload.face_encodings;
            state.id_number = action.payload.id_number;
            state.email = action.payload.email;
            state.password = action.payload.password;
            state.firstname = action.payload.firstname;
            state.lastname = action.payload.lastname;
            state.nationality = action.payload.nationality;
            state.date_of_birth = action.payload.date_of_birth;
            state.date_of_issue = action.payload.date_of_issue;
            state.date_of_expiry = action.payload.date_of_expiry;
            state.public_key = action.payload.public_key;
            state.private_key = action.payload.private_key;
            state.phone = action.payload.phone;
            state.secrets = action.payload.secrets;
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
        },
        setSecret(state, action) {
            state.password = action.payload.password;
            state.secrets = action.payload.secrets;
        },
        unsetSecret(state) {
            state.password = null;
            state.private_key = null;
            state.secrets = null;
        },
        unsetUser(state) {
            state.id = null;
            state.token = null;
            state.passport_address = null;
            state.face_encodings = null;
            state.id_number = null;
            state.email = null;
            state.password = null;
            state.firstname = null;
            state.lastname = null;
            state.nationality = null;
            state.date_of_birth = null;
            state.date_of_issue = null;
            state.date_of_expiry = null;
            state.public_key = null;
            state.private_key = null;
            state.phone = null;
            state.secrets = null;
        },
    },
});

export const { setUser, setSecret, setPersonal, setPassport, setAdditional, unsetSecret, unsetUser } = userSlice.actions;

export default userSlice.reducer;