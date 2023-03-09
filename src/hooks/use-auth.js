import { useSelector } from 'react-redux';

export function useAuth() {
    const {
        id,
        token,
        passport_address,
        face_encodings,
        id_number,
        email,
        password,
        firstname,
        lastname,
        nationality,
        date_of_birth,
        date_of_issue,
        date_of_expiry,
        public_key,
        private_key,
        phone,
        secrets
    } = useSelector(state => state.user);


    return {
        isAuth: !!token,
        id,
        token,
        passport_address,
        face_encodings,
        id_number,
        email,
        password,
        firstname,
        lastname,
        nationality,
        date_of_birth,
        date_of_issue,
        date_of_expiry,
        public_key,
        private_key,
        phone,
        secrets
    }
}