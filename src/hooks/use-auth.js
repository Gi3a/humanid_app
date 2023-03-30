import { useSelector } from 'react-redux';

export function useAuth() {
    const {
        id,
        token,
        face_encodings,
        id_number,
        email,
        firstname,
        lastname,
        nationality,
        date_of_birth,
        date_of_issue,
        date_of_expiry,
        public_key,
        encrypted_public_key,
        encrypted_private_key,
        phone,
        pin
    } = useSelector(state => state.user);


    return {
        isAuth: !!token,
        id,
        token,
        face_encodings,
        id_number,
        email,
        firstname,
        lastname,
        nationality,
        date_of_birth,
        date_of_issue,
        date_of_expiry,
        public_key,
        encrypted_public_key,
        encrypted_private_key,
        phone,
        pin
    }
}