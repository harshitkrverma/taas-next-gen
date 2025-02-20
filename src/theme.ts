import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // primary color
        },
        secondary: {
            main: '#ff0505', // secondary color
        },
    },
    typography: {
        fontFamily: 'Arial, sans-serif', // font
    },
});

export default theme;