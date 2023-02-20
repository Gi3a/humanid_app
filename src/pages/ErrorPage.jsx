import React from 'react'
import { Link } from 'react-router-dom'

const ErrorPage = () => {
    return (
        <div className='page'>
            <h1>Error</h1>
            <Link to="/">Back to Home</Link>
        </div>
    )
}

export default ErrorPage