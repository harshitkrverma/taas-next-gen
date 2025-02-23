"use client";

import React, { useState, useEffect } from 'react';
import {
    TextField, Checkbox, Button, FormControlLabel,
    FormHelperText, Box, Select, SelectChangeEvent,
    Stepper, Step, StepLabel, StepContent, Typography, Paper,
    Autocomplete
} from '@mui/material';
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

// Updated type definitions
interface FormField {
    type: 'text' | 'number' | 'email' | 'password' | 'checkbox' | 'button' | 'select' | 'autocomplete' | 'id';
    label: string;
    name: string;
    defaultValue?: string | number | boolean;
    required?: boolean;
    hint?: string;
    options?: { label: string; value: string }[];
    enabledBy?: string; // Name of the checkbox field that controls visibility
}

interface FormStep {
    label: string;
    description?: string;
    fields: FormField[];
}

interface FormStructure {
    steps: FormStep[];
}

type FormInput = FormStructure | FormField[];

interface DynamicFormProps {
    formStructure?: FormInput;
    onSubmit: (formData: Record<string, any>) => void;
    disabled?: boolean;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ formStructure, onSubmit, disabled }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [isStepValid, setIsStepValid] = useState(false);

    // Normalize form structure
    const normalizedSteps = (() => {
        if (!formStructure) return [];
        if (Array.isArray(formStructure)) {
            return [{ label: 'Form', fields: formStructure }];
        }
        return formStructure.steps || [];
    })();

    const isStepper = normalizedSteps.length > 1;
    const isLastStep = activeStep === normalizedSteps.length - 1;
    const currentFields = normalizedSteps[activeStep]?.fields || [];

    // Validate the current step whenever formData or activeStep changes
    useEffect(() => {
        const validateStep = () => {
            const isValid = currentFields.every(field => {
                if (!field.required) return true;
                const value = formData[field.name] ?? field.defaultValue;
                switch (field.type) {
                    case 'text':
                    case 'email':
                    case 'password':
                    case 'number':
                    case 'id':
                        return !!value?.toString().trim();
                    case 'checkbox':
                        return !!value;
                    case 'select':
                    case 'autocomplete':
                        return value !== '' && value !== undefined && value !== null;
                    default:
                        return true;
                }
            });
            setIsStepValid(isValid);
        };

        validateStep();
    }, [formData, activeStep, currentFields]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNext = () => setActiveStep(prev => prev + 1);
    const handleBack = () => setActiveStep(prev => prev - 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const renderField = (field: FormField) => {
        // Check if the field should be displayed based on the checkbox state
        if (field.enabledBy && !formData[field.enabledBy]) {
            return null; // Skip rendering if the checkbox is not checked
        }

        switch (field.type) {
            case 'text':
            case 'email':
            case 'password':
            case 'number':
                return (
                    <TextField
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        type={field.type}
                        value={formData[field.name] ?? field.defaultValue ?? ''}
                        onChange={handleChange}
                        required={field.required}
                        fullWidth
                        helperText={field.hint}
                        disabled={disabled}
                        error={field.required && !formData[field.name]?.toString().trim()}
                    />
                );
            case 'checkbox':
                return (
                    <FormControlLabel
                        key={field.name}
                        control={
                            <Checkbox
                                name={field.name}
                                checked={formData[field.name] ?? field.defaultValue ?? false}
                                onChange={handleChange}
                                disabled={disabled}
                            />
                        }
                        label={field.label}
                        required={field.required}
                    />
                );
            case 'button':
                if (isStepper) return null;
                return (
                    <Button
                        key={field.name}
                        type="submit"
                        variant="contained"
                        disabled={disabled}
                    >
                        {field.label}
                    </Button>
                );
            case 'select':
                return (
                    <FormControl key={field.name} fullWidth>
                        <InputLabel>{field.label}</InputLabel>
                        <Select
                            name={field.name}
                            value={formData[field.name] ?? field.defaultValue ?? ''}
                            label={field.label}
                            required={field.required}
                            onChange={handleSelectChange}
                            disabled={disabled}
                            error={field.required && !formData[field.name]}
                        >
                            {field.options?.map((option, index) => (
                                <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </Select>
                        {field.hint && <FormHelperText>{field.hint}</FormHelperText>}
                    </FormControl>
                );
            case 'autocomplete':
                return (
                    <Autocomplete
                        key={field.name}
                        options={field.options || []}
                        getOptionLabel={(option) => option.label}
                        value={field.options?.find(option =>
                            option.value === (formData[field.name] ?? field.defaultValue)
                        ) || null}
                        onChange={(event, newValue) => {
                            const newVal = newValue ? newValue.value : '';
                            setFormData(prev => ({
                                ...prev,
                                [field.name]: newVal,
                            }));
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={field.label}
                                required={field.required}
                                helperText={field.hint}
                                fullWidth
                                error={field.required && !formData[field.name]}
                            />
                        )}
                        disabled={disabled}
                        isOptionEqualToValue={(option, value) => option.value === value?.value}
                    />
                );
            case 'id':
                return (
                    <TextField
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        type="text"
                        value={formData[field.name] ?? field.defaultValue ?? ''}
                        onChange={handleChange}
                        required={field.required}
                        fullWidth
                        helperText={field.hint}
                        disabled={disabled}
                        error={field.required && !formData[field.name]?.toString().trim()}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {isStepper ? (
                <Stepper activeStep={activeStep} orientation="vertical">
                    {normalizedSteps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel>{step.label}</StepLabel>
                            <StepContent>
                                <Typography variant="body2" gutterBottom>
                                    {step.description}
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
                                    {step.fields.map(renderField)}
                                </Box>

                                <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                                    <Button
                                        disabled={activeStep === 0 || disabled}
                                        onClick={handleBack}
                                        variant="outlined"
                                    >
                                        Back
                                    </Button>

                                    {!isLastStep ? (
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            disabled={!isStepValid || disabled}
                                        >
                                            Next
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={disabled}
                                        >
                                            Submit
                                        </Button>
                                    )}
                                </Box>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {normalizedSteps.flatMap(step => step.fields).map(renderField)}
                    {!normalizedSteps.some(step => step.fields.some(f => f.type === 'button')) && (
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={disabled}
                            sx={{ mt: 2 }}
                        >
                            Submit
                        </Button>
                    )}
                </Box>
            )}

            {isStepper && activeStep === normalizedSteps.length && (
                <Paper square elevation={0} sx={{ p: 3, mt: 2 }}>
                    <Typography>All steps completed!</Typography>
                    <Button onClick={() => setActiveStep(0)} sx={{ mt: 1 }}>
                        Reset
                    </Button>
                </Paper>
            )}
        </form>
    );
};

export default DynamicForm;