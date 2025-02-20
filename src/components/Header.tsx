import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import {AccountBox} from "@mui/icons-material";

export default function Header() {

    return (
        <AppBar position="static" sx={{mb: 4}}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    TAAS Next-Gen
                </Typography>
                <div>
                    <IconButton color="inherit" aria-label="profile">
                        <AccountBox fontSize={"large"}/>
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
    );
}