import React, { useState } from 'react';
import { Stepper, Step, StepLabel, StepConnector } from '@mui/material';

import Settings from '@mui/icons-material/Settings';

import Box from '../components/UI/Box';

import { PreviewForm } from '../components/UI/SettingsForms/PreviewForm';
import { PassportForm } from '../components/UI/SettingsForms/PassportForm';
import { PersonalForm } from '../components/UI/SettingsForms/PersonalForm';
import { AdditionalForm } from '../components/UI/SettingsForms/AdditionalForm';

import { useTitle } from '../hooks/use-title';

const steps = ['Personal Data', 'Passport Data', 'Additional Data'];

const SettingsPage = () => {

    useTitle('Settings');

    const [activeStep, setActiveStep] = useState(0);

    const handleStep = (step) => () => setActiveStep(step);

    const StepperRenderer = () => {
        return (
            <Stepper activeStep={activeStep} alternativeLabel connector={<StepConnector />}>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel
                            onClick={handleStep(index)}
                        >
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        )
    }

    const FormRenderer = () => {
        switch (activeStep) {
            case 0: return <PersonalForm handleNext={handleStep(1)} />;
            case 1: return <PassportForm handleNext={handleStep(2)} handleBack={handleStep(0)} />;
            case 2: return <AdditionalForm handleNext={handleStep(3)} handleBack={handleStep(1)} />;
            case 3: return <PreviewForm handleNext={handleStep(4)} handleBack={handleStep(2)} />;
            default: return null;
        }
    }

    return (
        <>
            <h1><Settings />Settings</h1>
            <Box>
                <div className='settings'>
                    <StepperRenderer />
                    <FormRenderer />
                </div>
            </Box>
        </>
    );
}

export default SettingsPage;
