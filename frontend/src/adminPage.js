import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ManageElection from './screens/admin/manageElection';
// import ManageStaff from './screens/admin/manageStaff'
// import ManageParty from './screens/admin/manageParty'
// import ManageUnit from './screens/admin/manageUnit';
import StaffPage from './staffPage';
// import ManageResultForm from './screens/admin/manageResultForm';
import { SnackbarProvider } from './customBar';
// import ManageBallot from './screens/admin/manageBallot';
// import ManageResult from './screens/admin/manageResult';
// import ManageVote from './screens/admin/manageVote';

const drawerWidth = 260;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -drawerWidth,
        ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
        }),
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
    })(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: drawerWidth,
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

function AdminPage() {   
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
    setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const [selectedComponent, setSelectedComponent] = useState(null);

    const handleMenuClick = (componentName) => {
        setSelectedComponent(componentName);
    };

    const renderSelectedComponent = () => {
        switch (selectedComponent) {
            case 'ManageElection':
                return (
                    <SnackbarProvider>
                        <ManageElection />
                    </SnackbarProvider>
                );
            // case 'ManageParty':
            //     return (
            //         <SnackbarProvider>
            //             <ManageParty />
            //         </SnackbarProvider>
            //     );
            // case 'ManageStaff':
            //     return (
            //         <SnackbarProvider>
            //             <ManageStaff />
            //         </SnackbarProvider>
            //     );
            // case 'ManageAgent':
            //     return (
            //         <SnackbarProvider>
            //             <ManageAgent />
            //         </SnackbarProvider>
            //     );
            // case 'ManageUnit':
            //     return (
            //         <SnackbarProvider>
            //             <ManageUnit />
            //         </SnackbarProvider>
            //     );
            case 'StaffPage':
                    return (
                        <SnackbarProvider>
                            <StaffPage />
                        </SnackbarProvider>
                    );
            // case 'ManageBallot':
            //     return (
            //         <SnackbarProvider>
            //             <ManageBallot />
            //         </SnackbarProvider>
            //     );
            // case 'ManageResultForm':
            //         return (
            //             <SnackbarProvider>
            //                 <ManageResultForm />
            //             </SnackbarProvider>
            //         );
            // case 'ManageResult':
            //         return (
            //             <SnackbarProvider>
            //                 <ManageResult />
            //             </SnackbarProvider>
            //         );
            // case 'ManageVote':
            //         return (
            //             <SnackbarProvider>
            //                 <ManageVote />
            //             </SnackbarProvider>
            //         );
            default:
                return null;  
        }
    };

    function ActiveButton() {
        const [isActive, setIsActive] = useState(false);

        // Toggle the active state
        const handleButtonClick = () => {
            setIsActive(!isActive);
        };

    }
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open} sx={{ bgcolor: 'green' }}>
                <Toolbar>
                <a style={{textDecoration: "none", color: "white", marginRight: "20px"}} href="/"><Typography variant="h6">Home</Typography></a>
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
                         AdminPage
                    </Typography>
                    <IconButton
                        color="inherit" // changed to inherit so it takes color from parent AppBar
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerOpen}
                        sx={{ ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Main open={open}>
                <DrawerHeader />
                {renderSelectedComponent()}
            </Main>
                <Box
                    component="nav"
                    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                    aria-label="mailbox folders"
                >
                
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                          width: drawerWidth,
                        },
                      }}
                      variant="persistent"
                      anchor="right"
                      open={open}
                >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                {[
                    // { name: 'Manage Election', component: 'ManageElection' },
                    // { name: 'Manage Party', component: 'ManageParty' },
                    // { name: 'Manage Staff', component: 'ManageStaff' },
                    // { name: 'Manage Agent', component: 'ManageAgent' },
                    // { name: 'Manage Unit', component: 'ManageUnit' },
                    { name: 'Staff Page', component: 'StaffPage' },
                    // { name: 'Manage Ballot', component: 'ManageBallot' },
                    // { name: 'Manage Result Form', component: 'ManageResultForm' },
                    // { name: 'Manage Result', component: 'ManageResult' },
                    // { name: 'Manage Vote', component: 'ManageVote' },
                ].map((item, index) => (
                    <ListItem key={item.name} disablePadding>
                        <ListItemButton 
                            onClick={() => handleMenuClick(item.component)}
                            style={{
                                backgroundColor: selectedComponent === item.component ? '#e0e0e0' : 'transparent',
                                fontWeight: selectedComponent === item.component ? 'bold' : 'normal'
                            }}  // This will style the active button with a gray background and bold font
                        >
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    </Box>
    </Box>
);
}

export default AdminPage;