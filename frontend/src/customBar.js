import React, { createContext, useContext, useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Box, Snackbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAlert from '@mui/material/Alert';

const SnackbarContext = createContext();

export const useSnackbar = () => {
    return useContext(SnackbarContext);
};


export const SnackbarProvider = ({ children }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleCloseSnackbar = () => setSnackbarOpen(false);

    const showAlert = (message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    return (
        <SnackbarContext.Provider value={{ snackbarOpen, snackbarMessage, snackbarSeverity, handleCloseSnackbar, showAlert }}>
            {children}
        </SnackbarContext.Provider>
    );
};

function CustomAppBar() {
    const { showAlert } = useSnackbar();

    const handleLoginClick = () => {
        showAlert("Login clicked!", "info");  // This will show the snackbar
    };

    return (
        <Box>
            <AppBar position="static" sx={{ backgroundColor: 'green' }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="box" sx={{ flexGrow: 1 }}>
                        E-lections
                    </Typography>
                    <Button color="inherit" onClick={handleLoginClick}>Login</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export function CustomSnackbar({ snackbarOpen, snackbarMessage, snackbarSeverity, handleCloseSnackbar }) {
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
        >
            <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                {snackbarMessage}
            </MuiAlert>
        </Snackbar>
    );
}

export default CustomAppBar;