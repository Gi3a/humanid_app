import React from 'react';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from "react-redux";
import { yupResolver } from '@hookform/resolvers/yup';

import { useAuth } from '../../hooks/use-auth';
import { setPassport } from "../../store/slices/userSlice";

import { Form } from '../UI/Form';
import { Input } from '../UI/Input';
import { Submit } from '../UI/Submit';
import { ButtonGroup } from '../UI/Group/ButtonGroup';
import { formatDate } from '../../utils/date';

import { FcUndo, FcAdvance } from "react-icons/fc";

const schema = yup.object().shape({
    id_number: yup
        .string()
        .required('Passport ID is a required field'),
    nationality: yup
        .string()
        .matches(/^([^0-9]*)$/, 'Nationality should not contain numbers')
        .required('Nationality is a required field'),
    date_of_issue: yup
        .date()
        .required('Issue Date is a required field'),
    date_of_expiry: yup
        .date()
        .required('Expiry Date is a required field'),
});

export const PassportForm = ({ handleNext, handleBack }) => {

    const { id_number, nationality, date_of_issue, date_of_expiry } = useAuth();

    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            id_number: id_number,
            nationality: nationality,
            date_of_issue: formatDate(new Date(date_of_issue)),
            date_of_expiry: formatDate(new Date(date_of_expiry)),
        },
        mode: 'onBlur',
        resolver: yupResolver(schema)
    });

    const onSubmit = (data) => {
        console.log(data);
        dispatch(setPassport({
            id_number: data.id_number,
            nationality: data.nationality,
            date_of_issue: Date.parse(data.date_of_issue),
            date_of_expiry: Date.parse(data.date_of_expiry),
        }));
        handleNext();
    }

    return (
        <Form
            onSubmit={handleSubmit(onSubmit)}
        >
            <Input
                {...register('id_number', { required: true })}
                id='id_number'
                type='text'
                label='Passport ID'
                name='id_number'
                error={!!errors.id_number}
                helperText={errors?.id_number?.message}
            />
            <Input
                {...register('nationality', { required: true })}
                id='nationality'
                type='text'
                label='Nationality'
                name='nationality'
                error={!!errors.nationality}
                helperText={errors?.nationality?.message}
            />
            <Input
                {...register('date_of_issue', { required: true })}
                id='date_of_issue'
                type='date'
                label='Issue Date'
                name='date_of_issue'
                error={!!errors.date_of_issue}
                helperText={errors?.date_of_issue?.message}
            />
            <Input
                {...register('date_of_expiry', { required: true })}
                id='date_of_expiry'
                type='date'
                label='Expiry Date'
                name='date_of_expiry'
                error={!!errors.date_of_expiry}
                helperText={errors?.date_of_expiry?.message}
            />
            <ButtonGroup>
                <Submit onClick={handleBack}><FcUndo /> Back</Submit>
                <Submit onClick={handleSubmit(onSubmit)}>Next <FcAdvance /></Submit>
            </ButtonGroup>
        </Form>
    )
}