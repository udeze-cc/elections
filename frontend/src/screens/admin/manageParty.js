import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Grid, IconButton, Box, Pagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { useSnackbar } from './customBar';

function ManageParty() {
    const [parties, setParties] = useState([]);
    const [filteredParties, setFilteredParties] = useState([]);
    const [newParty, setNewParty] = useState({ name: '' });
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [partyToDelete, setPartyToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [filter, setFilter] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [partyToEdit, setPartyToEdit] = useState(null);
    const { showAlert } = useSnackbar();



    const addParty = () => {
        if (newParty.name) {
            const newEntry = { id: parties.length + 1, ...newParty };
            setParties(prev => [...prev, newEntry]);
            setNewParty({ name: '' });
            showAlert("Party added successfully!");
        }
    };

    const handleFilterChange = (value) => {
        setFilter(value);
        if (value) {
            setFilteredParties(parties.filter(party => party.name.includes(value)));
        } else {
            setFilteredParties(parties);
        }
        setCurrentPage(1);
    };

    React.useEffect(() => {
        setFilteredParties(parties);
    }, [parties]);

    const promptDelete = (id) => {
        setPartyToDelete(id);
        setDeleteConfirmationOpen(true);
    };

    const deleteParty = (id) => {
        setParties(prev => prev.filter(party => party.id !== id));
        showAlert("Party deleted successfully!");
        setDeleteConfirmationOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewParty(prev => ({ ...prev, [name]: value }));
    };

    const startEditing = (id) => {
      const party = parties.find(p => p.id === id);
      setPartyToEdit(party);
      setIsEditing(true);
    };

    const saveEdit = () => {
        if (partyToEdit.name) {
            setParties(prev => prev.map(party => party.id === partyToEdit.id ? partyToEdit : party));
            showAlert("Party updated successfully!");
            setIsEditing(false);
            setPartyToEdit(null);
        }
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setPartyToEdit(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Grid container>
            <Grid item>
            <Card>
                <CardContent>
                    <Typography variant="h5">Manage Parties</Typography>
                    <FilterField onChange={e => handleFilterChange(e.target.value)} value={filter} />
                    {isEditing ? (
                        <EditPartyForm party={partyToEdit} handleInputChange={handleEditInputChange} saveEdit={saveEdit} />
                    ) : (
                        <AddPartyForm {...{ newParty, handleInputChange, addParty }} />
                    )}
                    <PartyList
                    parties={filteredParties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
                    promptDelete={promptDelete}
                    startEditing={startEditing}
                    />
                    
                    <Pagination count={Math.ceil(filteredParties.length / itemsPerPage)} page={currentPage} onChange={(e, value) => setCurrentPage(value)} />
                </CardContent>
            </Card>
            </Grid>

            <DeleteConfirmationModal
                open={deleteConfirmationOpen}
                handleClose={() => setDeleteConfirmationOpen(false)}
                handleConfirm={() => deleteParty(partyToDelete)}
            />
        </Grid>
    );
}

function FilterField({ onChange, value }) {
    return (
        <TextField
            label="Filter Parties"
            fullWidth
            variant="outlined"
            value={value}
            onChange={onChange}
            style={{ marginTop: '1rem' }}
        />
    );
}

function DeleteConfirmationModal({ open, handleClose, handleConfirm }) {
  return (
      <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
      >
          <DialogTitle id="alert-dialog-title">{"Delete Party"}</DialogTitle>
          <DialogContent>
              <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this party? This action cannot be undone.
              </DialogContentText>
          </DialogContent>
          <DialogActions>
              <Button onClick={handleClose} color="primary">
                  Cancel
              </Button>
              <Button onClick={handleConfirm} color="primary" autoFocus>
                  Confirm
              </Button>
          </DialogActions>
      </Dialog>
  );
}

function AddPartyForm({ newParty, handleInputChange, addParty }) {
    return (
        <>
            <TextField
                label="Party Name"
                name="name"
                fullWidth
                variant="outlined"
                value={newParty.name}
                onChange={handleInputChange}
                style={{ marginTop: '1rem' }}
            />
            <Button variant="contained" color="primary" onClick={addParty} style={{ marginTop: '1rem' }}>
                Add Party
            </Button>
        </>
    );
}

function EditPartyForm({ party, handleInputChange, saveEdit }) {
  return (
      <>
          <TextField
              label="Party Name"
              name="name"
              fullWidth
              variant="outlined"
              value={party.name}
              onChange={handleInputChange}
              style={{ marginTop: '1rem' }}
          />
          <Button variant="contained" color="primary" onClick={saveEdit} style={{ marginTop: '1rem' }}>
              Save Changes
          </Button>
      </>
  );
}

function PartyList({ parties, promptDelete, startEditing }) {
    return (
        <Box>
            {parties.map(party => (
                <Box key={party.id} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1">
                        {party.name}  ({party.id})
                    </Typography>
                    <Box>
                        <IconButton onClick={() => startEditing(party.id)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => promptDelete(party.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}

export default ManageParty;