// import {Box, Typography} from "@mui/material";
// import Header from "./components/Header.tsx";
// import DynamicForm from "./utils/DynamicForm.tsx";
// import {executorForm} from "./model/formStructure.ts";
//
// function App() {
//
//     const handleSubmit = (formData: Record<string, any>) => {
//         console.log('Form Data Submitted:', formData);
//     };
//
//   return (
//     <>
//         <Header />
//         <main>
//             <Box padding={5}>
//                 <Typography>TAAS</Typography>
//                 <DynamicForm formStructure = {executorForm} onSubmit={handleSubmit} />
//             </Box>
//         </main>
//     </>
//   )
// }
//
// export default App

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import {History, Info, LiveHelp} from "@mui/icons-material";
import {executorForm} from "./model/formStructure.ts";
import DynamicForm from "./utils/DynamicForm.tsx";
import {useState} from "react";
import {triggerJenkinsJob} from "./services/jenkinsApi.ts";

const NAVIGATION: Navigation = [
    {
        kind: 'header',
        title: 'Main items',
    },
    {
        segment: 'dashboard',
        title: 'Dashboard',
        icon: <DashboardIcon />,
    },
    {
        segment: 'history',
        title: 'History',
        icon: <History />,
    },
    {
        kind: 'divider',
    },
    {
        kind: 'header',
        title: 'Analytics',
    },
    {
        segment: 'faq',
        title: 'FAQ',
        icon: <LiveHelp />,
    },
    {
        segment: 'info',
        title: 'Info',
        icon: <Info />,
    },
];

const theme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

function DemoPageContent({ pathname }: { pathname: string }) {
    return (
        <Box
            sx={{
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
            }}
        >
            <Typography>Dashboard content for {pathname}</Typography>
        </Box>
    );
}

interface DemoProps {
    /**
     * Injected by the documentation to work in an iframe.
     * Remove this when copying and pasting into your project.
     */
    window?: () => Window;
}

export default function DashboardLayoutBasic(props: DemoProps) {
    const { window } = props;

    const router = useDemoRouter('/dashboard');

    // Remove this const when copying and pasting into your project.
    const demoWindow = window !== undefined ? window() : undefined;

    const [status, setStatus] = useState<string>('');

    const handleSubmit = async (formData: Record<string, any>) => {
        console.log('Form Data Submitted:', formData);
        setStatus('Submitting...');

        try {
            const response = await triggerJenkinsJob(formData);
            setStatus(`Jenkins job triggered successfully (Status: ${response.status})`);
        } catch (error) {
            setStatus('Failed to trigger Jenkins job');
        }
    };

    return (
        <AppProvider
            navigation={NAVIGATION}
            router={router}
            theme={theme}
            window={demoWindow}
        >
            <DashboardLayout>
                <DemoPageContent pathname={router.pathname} />
                <Box padding={5}>
                    <Typography>TAAS</Typography>
                    <DynamicForm formStructure={executorForm} onSubmit={handleSubmit} />
                    {status && <Typography sx={{ mt: 2 }}>{status}</Typography>}
                </Box>
            </DashboardLayout>
        </AppProvider>
    );
}
