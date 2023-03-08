import React from 'react';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from "react-redux";
import { yupResolver } from '@hookform/resolvers/yup';


import { useAuth } from '../../hooks/use-auth';
import { setSecret } from "../../store/slices/userSlice";

import { Form } from '../UI/Form';
import { Input } from '../UI/Input';
import { Submit } from '../UI/Submit';
import { ButtonGroup } from '../UI/Group/ButtonGroup';


const schema = yup.object().shape({
    password: yup
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .required('Password is a required field'),
    secret1: yup
        .string()
        .required('Secret 1 is a required field'),
    secret2: yup
        .string()
        .required('Secret 2 is a required field'),
    secret3: yup
        .string()
        .required('Secret 3 is a required field'),
    secret4: yup
        .string()
        .required('Secret 4 is a required field'),
    secret5: yup
        .string()
        .required('Secret 5 is a required field'),
    secret6: yup
        .string()
        .required('Secret 6 is a required field'),
    secret7: yup
        .string()
        .required('Secret 7 is a required field'),
});

export const SecretForm = ({ handleNext, handleBack }) => {

    const { password, secrets } = useAuth();

    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            password: password,
            secret1: secrets[0],
            secret2: secrets[1],
            secret3: secrets[2],
            secret4: secrets[3],
            secret5: secrets[4],
            secret6: secrets[5],
            secret7: secrets[6],
        },
        mode: 'onBlur',
        resolver: yupResolver(schema)
    });

    const onSubmit = (data) => {
        var secrets = [].concat(data.secret1, data.secret2, data.secret3, data.secret4, data.secret5, data.secret6, data.secret7);
        console.log(data);
        dispatch(setSecret({
            password: data.password,
            secrets: secrets,
        }));
        handleNext();
    }

    return (
        <Form
            onSubmit={handleSubmit(onSubmit)}
        >
            <Input
                {...register('password', { required: true })}
                id='password'
                type='password'
                label='Password'
                name='password'
                error={!!errors.password}
                helperText={errors?.password?.message}
            />
            <Input
                {...register('secret1', { required: true })}
                id='secret1'
                type='text'
                label='Secret 1'
                name='secret1'
                error={!!errors.secret1}
                helperText={errors?.secret1?.message}
            />
            <Input
                {...register('secret2', { required: true })}
                id='secret2'
                type='text'
                label='Secret 2'
                name='secret2'
                error={!!errors.secret2}
                helperText={errors?.secret2?.message}
            />
            <Input
                {...register('secret3', { required: true })}
                id='secret3'
                type='text'
                label='Secret 3'
                name='secret3'
                error={!!errors.secret3}
                helperText={errors?.secret3?.message}
            />
            <Input
                {...register('secret4', { required: true })}
                id='secret4'
                type='text'
                label='Secret 4'
                name='secret4'
                error={!!errors.secret4}
                helperText={errors?.secret4?.message}
            />
            <Input
                {...register('secret5', { required: true })}
                id='secret5'
                type='text'
                label='Secret 5'
                name='secret5'
                error={!!errors.secret5}
                helperText={errors?.secret5?.message}
            />
            <Input
                {...register('secret6', { required: true })}
                id='secret6'
                type='text'
                label='Secret 6'
                name='secret6'
                error={!!errors.secret6}
                helperText={errors?.secret6?.message}
            />
            <Input
                {...register('secret7', { required: true })}
                id='secret7'
                type='text'
                label='Secret 7'
                name='secret7'
                error={!!errors.secret7}
                helperText={errors?.secret7?.message}
            />
            <ButtonGroup>
                <Submit onClick={handleBack}>⬅️ Back</Submit>
                <Submit onClick={handleSubmit(onSubmit)}>Next ➡️</Submit>
            </ButtonGroup>
        </Form>
    )
}