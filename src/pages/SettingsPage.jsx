import React, { useState } from 'react';

import { useDispatch } from "react-redux";

import { Typography, Stepper, Step, StepLabel, StepConnector } from '@mui/material';

import { useTitle } from '../hooks/use-title';
import { Page } from '../components/UI/Page';

import { PersonalForm } from '../components/FormsID/PersonalForm';
import { PassportForm } from '../components/FormsID/PassportForm';
import { AdditionalForm } from '../components/FormsID/AdditionalForm';
import { SecretForm } from '../components/FormsID/SecretForm';
import { PreviewForm } from '../components/FormsID/PreviewForm';


const steps = ['Personal Data', 'Passport Data', 'Additional Data', 'Secret Data', 'Preview Data'];

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
            {activeStep === 3 && <SecretForm handleNext={handleStep(4)} handleBack={handleStep(2)} />}
            {activeStep === 4 && <PreviewForm handleNext={handleStep(5)} handleBack={handleStep(3)} />}
            {activeStep === 5 && (
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