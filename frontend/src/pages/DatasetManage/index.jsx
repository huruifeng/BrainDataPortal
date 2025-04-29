import {useState, useRef} from 'react';
import {Box, Stepper, Step, StepLabel, Button, Paper, Typography, Divider,} from '@mui/material';

import ExtractInfo from './ExtractInfo';
import MetaPrepare from './MetaPrepare';
import useDatasetManageStore from "../../store/DatasetManageStore.js";

const steps = ['Setup dataset', 'Prepare metadata'];

const DatasetManage = () => {
    const [activeStep, setActiveStep] = useState(0);
    const extractInfoRef = useRef();
    const {processDataset} = useDatasetManageStore();

    const handleNext = async () => {
        if (activeStep === 0) {
            // Validate and collect form data from ExtractInfo step
            if (extractInfoRef.current && extractInfoRef.current.validateFields()) {
                const payload = extractInfoRef.current.collectData();
                try {
                    const response = processDataset(payload);
                    setActiveStep((prev) => prev + 1);
                } catch (error) {
                    console.error('Submission failed:', error);
                    alert('Failed to submit dataset info.');
                }
            } else {
                alert('Please fill all required fields.');
            }
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <ExtractInfo ref={extractInfoRef}/>;
            case 1:
                return <MetaPrepare/>;
            default:
                return 'Unknown step';
        }
    };

    return (
        <div className="dataset-manage-container" style={{display: 'flex', flexDirection: 'column', flex: 1}}>
            {/* Title Row */}
            <Box className="title-row">
                <Typography variant="h6">Dataset Management</Typography>
            </Box>
            <Divider/>
            <Box sx={{display: 'flex', pb: 2, pl: 4, mb: 4}}>
                {/* Sidebar */}
                <Box sx={{width: '15%', minWidth: '200px', maxWidth: '400px', py: 2, pl: 2}}>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {steps.map((label) => (
                            <Step key={label}><StepLabel>{label}</StepLabel></Step>
                        ))}
                    </Stepper>
                </Box>

                {/* Main Content */}
                <Paper sx={{flex: 1, p: 4}}>
                    {getStepContent(activeStep)}
                    <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2}}>
                        <Button disabled={activeStep === 0} onClick={handleBack}>
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={activeStep >= steps.length}
                        >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </div>
    );
};

export default DatasetManage;
