import React, { useEffect, useState } from 'react';

import { Typography, Stepper, Step, StepLabel, StepConnector } from '@mui/material';

import { useAuth } from '../hooks/use-auth';
import { useTitle } from '../hooks/use-title';
import { Page } from '../components/UI/Page';

import { useNavigate } from 'react-router-dom';

import { PersonalForm } from '../components/FormsID/PersonalForm';
import { PassportForm } from '../components/FormsID/PassportForm';
import { AdditionalForm } from '../components/FormsID/AdditionalForm';
import { PreviewForm } from '../components/FormsID/PreviewForm';


const steps = ['Personal Data', 'Passport Data', 'Additional Data', 'Preview Data'];

const NonLinearStepper = (props) => {
    const { activeStep, handleStep, isFormError } = props;


    return (
        <Stepper activeStep={activeStep} alternativeLabel connector={<StepConnector />}>
            {steps.map((label, index) => (
                <Step key={label}>
                    <StepLabel onClick={handleStep(index)}>{label}</StepLabel>
                </Step>
            ))}
        </Stepper>
    );
};

const SettingsPage = () => {

    useTitle('⚙️ Settings');

    const [activeStep, setActiveStep] = useState(0);
    const [isFormError, setIsFormError] = useState(false);

    const { token, face_encodings } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (token)
            navigate('/panel');
        else if (face_encodings && !token)
            navigate('/settings');
        else
            navigate('/');

    }, [token, face_encodings, navigate]);

    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    const handleNext = () => {
        if (activeStep === steps.length - 2) {
            setIsFormError(true);
            return;
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setIsFormError(false);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        setIsFormError(false);
    };

    return (
        <Page>
            <Typography component='h1' variant='5'>⚙️ Settings</Typography>

            <NonLinearStepper activeStep={activeStep} handleStep={handleStep} />
            {activeStep === 0 && <PersonalForm handleNext={handleStep(1)} />}
            {activeStep === 1 && <PassportForm handleNext={handleStep(2)} handleBack={handleStep(0)} />}
            {activeStep === 2 && <AdditionalForm handleNext={handleStep(3)} handleBack={handleStep(1)} />}
            {activeStep === 3 && <PreviewForm handleNext={handleStep(4)} handleBack={handleStep(2)} />}
            {activeStep === 4 && (
                <div>
                    <Typography variant='subtitle1' gutterBottom>Error: Please complete all required fields before submitting</Typography>
                    <button onClick={handleBack}>Back</button>
                </div>
            )}
            {isFormError && setActiveStep(steps.length - 1)}
        </Page>
    )
}

export default SettingsPage