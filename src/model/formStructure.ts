interface FormField {
    type: 'text' | 'number' | 'email' | 'password' | 'checkbox' | 'button' | 'select';
    label: string;
    name: string;
    defaultValue?: string | number | boolean;
    required?: boolean;
    hint?: string;
    options?: { label: string; value: string }[]; // For dropdowns or radio buttons
    validate?: (value: any) => string | undefined; // New validation function
}
interface FormStep {
    label: string;
    description?: string;
    fields: FormField[];
}

export interface FormStructure {
    steps: FormStep[];
}

// Updated example form structure with steps
export const executorForm: FormStructure = {
    steps: [
        {
            label: 'Personal Information',
            description: 'Enter your personal details',
            fields: [
                {
                    type: 'text',
                    label: 'Full Name',
                    name: 'fullName',
                    required: true,
                    hint: 'Enter your full name',
                },
                {
                    type: 'email',
                    label: 'Email',
                    name: 'email',
                    required: true,
                },
            ]
        },
        {
            label: 'Account Settings',
            description: 'Configure your account preferences',
            fields: [
                {
                    type: 'password',
                    label: 'Password',
                    name: 'password',
                    required: true,
                },
                {
                    type: 'select',
                    label: 'Gender',
                    name: 'gender',
                    options: [
                        { label: 'Male', value: 'male' },
                        { label: 'Female', value: 'female' },
                    ],
                },
            ]
        }
    ]
};

export const healthCheck: FormField[] = [
    {
        type: 'text',
        label: 'Cluster URL',
        name: 'clusterURL',
        defaultValue: '',
        required: true,
        hint: 'Enter Cluster URL',
    },
    {
        type: 'button',
        label: 'Submit',
        name: 'submit',
    },
];

export const autoForm: FormField[] = [
    { type: 'email', name: 'email', label: 'Email' }
];
