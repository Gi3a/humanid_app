import React from 'react';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from "react-redux";
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/use-auth';
import { setPersonal } from '../../store/slices/userSlice';

import { Form } from '../UI/Form';
import { Input } from '../UI/Input';
import { Submit } from '../UI/Submit';
import { formatDate } from '../../utils/date';
import { ButtonGroup } from '../UI/Group/ButtonGroup';

import { FcUndo, FcAdvance } from "react-icons/fc";

const schema = yup.object().shape({
    firstname: yup
        .string()
        .matches(/^([^0-9]*)$/, 'First Name should not contain numbers')
        .required('First name is a required field'),
    lastname: yup
        .string()
        .matches(/^([^0-9]*)$/, 'Last Name should not contain numbers')
        .required('Last name is a required field'),
    date_of_birth: yup
        .date()
        .required('Birth Date is a required field')
});

export const PersonalForm = ({ handleNext }) => {

    const navigate = useNavigate();

    const { firstname, lastname, date_of_birth, token } = useAuth();

    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            firstname: firstname,
            lastname: lastname,
            date_of_birth: formatDate(new Date(date_of_birth)),
        },
        mode: 'onBlur',
        resolver: yupResolver(schema)
    });

    const onSubmit = (data) => {
        console.log(data);
        dispatch(setPersonal({
            firstname: data.firstname,
            lastname: data.lastname,
            date_of_birth: new Date(Date.parse(data.date_of_birth)).getTime(),
        }));
        handleNext();
    }

    return (
        <Form
            onSubmit={handleSubmit(onSubmit)}
        >
            <Input
                {...register('firstname', { required: true })}
                id='firstname'
                type='text'
                label='First Name'
                name='firstname'
                error={!!errors.firstname}
                helperText={errors?.firstname?.message}
            />
            <Input
                {...register('lastname', { required: true })}
                id='lastname'
                type='text'
                label='Last Name'
                name='lastname'
                error={!!errors.lastname}
                helperText={errors?.lastname?.message}
            />
            <Input
                {...register('date_of_birth', { required: true })}
                id='date_of_birth'
                type='date'
                label='Birth Date'
                name='date_of_birth'
                error={!!errors.date_of_birth}
                helperText={errors?.date_of_birth?.message}
            />
            <ButtonGroup>
                {token &&
                    <Submit onClick={() => navigate('/panel')}><FcUndo /> Back</Submit>
                }
                <Submit>Next <FcAdvance /></Submit>
            </ButtonGroup>
        </Form>
    )
}

