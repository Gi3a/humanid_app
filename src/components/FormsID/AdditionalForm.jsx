import React from 'react';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from "react-redux";
import { yupResolver } from '@hookform/resolvers/yup';
import parsePhoneNumberFromString from 'libphonenumber-js';

import { useAuth } from '../../hooks/use-auth';
import { setAdditional } from "../../store/slices/userSlice";

import { Form } from '../UI/Form';
import { Input } from '../UI/Input';
import { Submit } from '../UI/Submit';
import { ButtonGroup } from '../UI/Group/ButtonGroup';

const schema = yup.object().shape({
    email: yup
        .string()
        .email('Email should have correct format')
        .required('Email is a required field')
        .lowercase(),
    phone: yup
        .string()
        // .matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 'Phone number is not valid')
        .required('Phone number is a required field')
        .lowercase(),
});

const normalizePhoneNumber = (value) => {
    const phone = parsePhoneNumberFromString(value)
    if (!phone) {
        return value
    }
    return (phone.formatInternational())
}

export const AdditionalForm = ({ handleNext, handleBack }) => {

    const { email, phone, password } = useAuth();

    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: email,
            phone: phone,
            password: password
        },
        mode: 'onBlur',
        resolver: yupResolver(schema)
    });

    const onSubmit = (data) => {
        console.log(data);
        dispatch(setAdditional({
            email: data.email,
            phone: data.phone,
        }));
        handleNext();
    }

    return (
        <Form
            onSubmit={handleSubmit(onSubmit)}
        >
            <Input
                {...register('email', { required: true })}
                id='email'
                type='text'
                label='Email'
                name='email'
                error={!!errors.email}
                helperText={errors?.email?.message}
            />
            <Input
                {...register('phone', { required: true })}
                id='phone'
                type='tel'
                label='Phone Number'
                name='phone'
                onChange={(event) => {
                    event.target.value = normalizePhoneNumber(event.target.value)
                }}
                error={!!errors.phone}
                helperText={errors?.phone?.message}
            />
            <ButtonGroup>
                <Submit onClick={handleBack}>?????? Back</Submit>
                <Submit onClick={handleSubmit(onSubmit)}>Next ??????</Submit>
            </ButtonGroup>
        </Form>
    )
}
