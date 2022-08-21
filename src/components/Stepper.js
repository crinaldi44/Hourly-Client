import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import TaskAlt from '@mui/icons-material/TaskAlt'
import LinearProgress from '@mui/material/LinearProgress'
import CircularProgress from '@mui/material/CircularProgress'
import LoadingButton from '@mui/lab/LoadingButton'

export default function HorizontalLinearStepper(props) {

    const {
        /**
         * Assumes the form: 
         * {
         *  title: '',
         *  jsx: '',
         *  onStepCompleted: '',
         * optional: false,
         * }
         */
        steps,

        /**
         * Represents whether the stepper should be loading.
         */
        loading,

        /**
         * Handles action to be taken once the step is completed.
         */
        onCompleted,

        /**
         * Represents the JSX to display once the stepper has been completed.
         */
        onCompleteJsx,

    } = props;

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const isStepOptional = (step) => {
    return steps[step].isOptional || false;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep + 1 === steps.length) {
        if (onCompleted) onCompleted()
    }
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Card variant='outlined'>
        <CardContent>
      <Stepper activeStep={activeStep}>
        {steps.map((step, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          } else {
            labelProps.optional = (
                <Typography variant="caption">*Required</Typography>
              );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={step.title} {...stepProps}>
              <StepLabel {...labelProps}>{step.title}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      </CardContent>
      <Divider/>
      {loading && <LinearProgress/>}
      {activeStep === steps.length ? (
        <React.Fragment>
            <CardContent>
                {onCompleteJsx ? onCompleteJsx : <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>}
            </CardContent>
          <Divider/>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'row',}}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
          </CardContent>
        </React.Fragment>
      ) : (
        <React.Fragment>
            <CardContent>
          <Typography sx={{ mt: 2, mb: 1 }}><strong>Step {activeStep + 1}: {steps[activeStep].title}</strong></Typography>
          {steps[activeStep].jsx}
          </CardContent>
          <Divider/>
          <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'row',}}>
            <Button
              color="inherit"
              disabled={loading || activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
              size='small'
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button disabled={loading} size='small' color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}

            <LoadingButton loading={loading} disabled={loading} endIcon={activeStep === steps.length - 1 ? <TaskAlt/> : null} onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </LoadingButton>
          </Box>
          </CardContent>
        </React.Fragment>
      )}
    </Card>
  );
}