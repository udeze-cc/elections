// src/App.js

import React, { useState } from 'react';
import './App.css';
import { Paper, Table, TableBody, TableCell, TextField, TableContainer, TableHead, TableRow, Typography, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

// const apiKey = '6YJ1IDez4I3hpEsdqCAWI8fzF6CbtCINx3fRTxEf';
let myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
// myHeaders.append("x-api-key", apiKey);

const adminEmail = 'udeze.cc@gmail.com';

const updateUser = async (user, admin) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const myRequest = new Request(`https://9656mgkl5a.execute-api.eu-west-2.amazonaws.com/dev/account/update/${admin}`, {
      body: JSON.stringify(user),
      method: "PUT",
      headers: myHeaders,
      mode: "cors",
      cache: "default",
    });
    await fetch(myRequest);
} 

const getUsers = async () => {
  const myHeaders = new Headers();
  const myRequest = new Request(`https://9656mgkl5a.execute-api.eu-west-2.amazonaws.com/dev/accounts`, {
    method: "GET",
    headers: myHeaders,
    mode: "cors",
    cache: "default",
  });
  const response = await fetch(myRequest);
  return response.json();
} 

function DataTable(props) {
    const [users, setUsers] = useState([]);
    if (users.length < 1) {
        getUsers().then(res => {
            setUsers(res);
        });
    }

    const [unitInputs, setUnitInputs] = useState({});

    // const handleUpdateRole = (user, admin) => {
    //     let activated = user.activated && user.activated == 1 ? true : false;
    //     if (activated) {
    //         // Di-activate user
    //         updateUser({email: user.email, activated: 0}, admin)
    //         .then(res => {
    //             console.log('User updated: ', res);
    //             getUsers().then(res => {
    //                 setUsers(res);
    //             });
    //         });
    //     } else {
    //         // Activate user
    //         updateUser({email: user.email, activated: 1}, admin)
    //         .then(res => {
    //             console.log('User updated: ', res);
    //             getUsers().then(res => {
    //                 setUsers(res);
    //             });
    //         });
    //     }
    // }
    
    const handleUpdateRole = (user, admin) => {
        let activated = user.activated && user.activated == 1 ? true : false;
        let updatedUser = { email: user.email };

        if (activated) {
            // Di-activate user and clear unit assignment
            updatedUser.activated = 0;
            updatedUser.unitID = '';
        } else {
            // Activate user and assign unit from input field
            updatedUser.activated = 1;
            updatedUser.unitID = unitInputs[user.id] || '';
            // Clear input field after assigning
            setUnitInputs({
                ...unitInputs,
                [user.id]: ''
            });
        }
        
        updateUser(updatedUser, admin)
        .then(res => {
            console.log('User updated: ', res);
            getUsers().then(res => {
                setUsers(res);
            });
        });
    }

    const handleAssignUnit = (userId) => {
        console.log("Assign Unit to user with ID:", userId);
        // Add logic to assign unit
    }

    return (
         <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Registered</TableCell>
                        <TableCell>Actions</TableCell>
                        <TableCell>Unit Input</TableCell>
                        <TableCell>Assigned Unit</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.created_at}</TableCell>
                            <TableCell>
                                <Button
                                    size="small"
                                    variant="contained"
                                    style={{ 
                                        backgroundColor: 
                                        user.email === adminEmail ? "grey" :
                                        user.activated == 1 ? "green" : "red", 
                                        color: "white" 
                                    }}
                                    startIcon={<EditIcon />}
                                    disabled={user.email == adminEmail}
                                    onClick={() => handleUpdateRole(user, adminEmail)}
                                >
                                    {user.activated == 1 ? 'Revoke Access' : 'Grant Access'}
                                </Button>
                            </TableCell>
                            <TableCell>
                                <TextField
                                    value={unitInputs[user.id] || ''}
                                    onChange={(e) => {
                                        setUnitInputs({
                                            ...unitInputs,
                                            [user.id]: e.target.value
                                        });
                                    }}
                                    disabled={user.email === adminEmail}
                                    placeholder="Unit ID"
                                />
                            </TableCell>
                            <TableCell>{user.unitID}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}


function StaffPage() {

  return (
    <div style={{ padding: '40px' }}>
        <Typography variant="h4" gutterBottom>
            Admin Page
        </Typography>
        <DataTable/>
    </div>
  );
}

export default StaffPage;
