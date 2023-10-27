import React, { useState } from 'react';
import { Typography, Button, Grid, Card, CardContent,TextField, IconButton, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSnackbar } from '../../customBar';

const electionTypeMap = {
    "Presidential": "T01",
    "Senate": "T02",
    "House of Reps": "T03",
    "Governorship": "T05",
    "House of Assembly": "T06"
  };
  
  function ManageElection() {
    const [elections, setElections] = useState([]);
    const [newElectionName, setNewElectionName] = useState('');
    const [newElectionID, setNewElectionID] = useState('');
    const [newElectionDate, setNewElectionDate] = useState('');
    const [newElectionType, setNewElectionType] = useState('');
    const [newElectionTypeID, setNewElectionTypeID] = useState('');
    const [newElectionState, setNewElectionState] = useState('');
    const [editElectionModalOpen, setEditElectionModalOpen] = useState(false);
    const [currentEditingElection, setCurrentEditingElection] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [electionToDelete, setElectionToDelete] = useState(null);
    const { showAlert } = useSnackbar();

    const isElectionIdUnique = (id) => {
        return !elections.find(election => election.id === id);
    };

    const addElection = () => {
        if (!isElectionIdUnique(newElectionID)) {
            showAlert("The provided Election ID already exists!");
            return;
        } 
    
        if (newElectionName && newElectionID && newElectionDate && newElectionType) {
            if (newElectionType.toLowerCase() === 'governorship' && !newElectionState) {
                showAlert("State is required for Governorship elections!");
                return;
            }
    
            const newElection = {
                id: newElectionID,
                name: newElectionName,
                date: newElectionDate,
                type: newElectionType,
                typeID: newElectionTypeID,
                state: newElectionType.toLowerCase() === 'governorship' ? newElectionState : undefined
            };
    
            setElections(prev => [...prev, newElection]);
            setNewElectionName('');
            setNewElectionID('');
            setNewElectionDate('');
            setNewElectionType('');
            setNewElectionTypeID('');
            setNewElectionState(''); // Clear the state value even if it wasn't used
            showAlert("Election added successfully!");
        }
    };

    const deleteElection = (id) => {
        setElections(prev => prev.filter(election => election.id !== id));
        showAlert("Election deleted successfully!");

    };
    
    const openDeleteConfirmation = (id) => {
        setElectionToDelete(id);
        setDeleteModalOpen(true);
    };

    // Enhanced Edit Function
    const openEditElectionModal = (election) => {
      setCurrentEditingElection(election);
      setEditElectionModalOpen(true);
    };
  
    const saveElectionChanges = (updatedElection) => {
        setElections(prevElections => {
            return prevElections.map(election => 
                election.id === updatedElection.id ? updatedElection : election
            );
        });
    };

    return (
        <Grid container>
            <Grid >
                <Card>
                    <CardContent>
                        <Typography variant="h5">Manage Elections</Typography>

                        <TextField label="Election ID" fullWidth variant="outlined" value={newElectionID} onChange={e => setNewElectionID(e.target.value)} style={{ marginTop: '1rem' }}/>
                        <TextField label="Election Name" fullWidth variant="outlined" value={newElectionName} onChange={e => setNewElectionName(e.target.value)} style={{ marginTop: '1rem' }}/>

                        <TextField
                            type="date"
                            fullWidth
                            variant="outlined"
                            value={newElectionDate}
                            onChange={e => setNewElectionDate(e.target.value)}
                            style={{ marginTop: '1rem' }}
                        />
                        
                        <TextField
                            select
                            label="Election Type"
                            fullWidth
                            variant="outlined"
                            value={newElectionType}
                            onChange={e => {
                            const type = e.target.value;
                            setNewElectionType(type);
                            setNewElectionTypeID(electionTypeMap[type]);
                            }}
                            style={{ marginTop: '1rem' }}
                        >
                            {Object.keys(electionTypeMap).map(type => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Election Type ID"
                            fullWidth
                            variant="outlined"
                            value={newElectionTypeID}
                            onChange={e => {
                            const typeID = e.target.value;
                            setNewElectionTypeID(typeID);
                            setNewElectionType(Object.keys(electionTypeMap).find(type => electionTypeMap[type] === typeID));
                            }}
                            style={{ marginTop: '1rem' }}
                        >
                            {Object.values(electionTypeMap).map(typeID => (
                                <MenuItem key={typeID} value={typeID}>
                                    {typeID}
                                </MenuItem>
                            ))}
                            </TextField>

                        {/* Conditionally rendered State field */}
                        {newElectionType === 'Governorship' && (
                            <TextField
                                label="State"
                                fullWidth
                                variant="outlined"
                                value={newElectionState}
                                onChange={e => setNewElectionState(e.target.value)}
                                style={{ marginTop: '1rem' }}
                            />
                        )}

                            
                        <Button variant="contained" color="primary" onClick={addElection} style={{ marginTop: '1rem' }}>
                            Add Election
                        </Button>

                        {/* Display the list of added elections similar to the parties table */}
                        {elections.map(election => (
                            <Box key={election.id}>
                                <Typography variant="body1">{election.name} ({election.id}) - {election.date} - {election.type} - {election.typeID} {election.type.toLowerCase() === 'governorship' ? `- ${election.state}` : ''}</Typography>
                                <IconButton onClick={() => openEditElectionModal(election)}><EditIcon /></IconButton>
                                <IconButton onClick={() => openDeleteConfirmation(election.id)}><DeleteIcon /></IconButton>
                            </Box>
                        ))}
                    </CardContent>
                </Card>
                    
                <Dialog 
                    open={deleteModalOpen} 
                    onClose={() => setDeleteModalOpen(false)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete this election?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteModalOpen(false)} color="secondary">
                            Cancel
                        </Button>
                        <Button 
                            onClick={() => {
                                deleteElection(electionToDelete);
                                setDeleteModalOpen(false);
                            }} 
                            color="primary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog> 

                {/* Edit Election Modal */}
                {editElectionModalOpen && currentEditingElection && (
                    <Dialog open={editElectionModalOpen} onClose={() => {
                        setEditElectionModalOpen(false);
                        setCurrentEditingElection(null);
                        }}>
                        
                        <DialogTitle>Edit Election</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Election ID"
                                fullWidth
                                variant="outlined"
                                value={currentEditingElection.id}
                                // Disable editing of the ID as it's typically fixed, or provide logic to handle ID changes if necessary.
                                disabled
                                style={{ marginTop: '1rem' }}
                            />

                            <TextField
                                label="Election Name"
                                fullWidth
                                variant="outlined"
                                value={currentEditingElection.name}
                                onChange={e => setCurrentEditingElection(prev => ({ ...prev, name: e.target.value }))}
                                style={{ marginTop: '1rem' }}
                            />

                            {/* ... add other fields similar to the above, as required ... */}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setEditElectionModalOpen(false)} color="secondary">
                                Cancel
                            </Button>
                            <Button 
                                onClick={() => {
                                    saveElectionChanges(currentEditingElection);
                                    setEditElectionModalOpen(false);
                                }} 
                                color="primary">
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Grid>
        </Grid>

        
    );
}
export default ManageElection;