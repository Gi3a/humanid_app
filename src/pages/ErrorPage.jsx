import React from 'react';

import ErrorOutline from '@mui/icons-material/ErrorOutline';

import { useTitle } from '../hooks/use-title';

const ErrorPage = () => {

    useTitle('Error');

    return (
        <h1><ErrorOutline sx={{ color: 'red' }} />Error 404 | Not Found</h1>
    )
}

export default ErrorPage