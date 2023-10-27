import React, { useState } from 'react';
import {
    Box, Card, CardContent, Typography, TextField, Button,
    Grid, IconButton, Dialog, DialogActions, DialogContent,
    DialogTitle, DialogContentText, Pagination
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSnackbar } from './customBar';

function ManageStaff() {
    const [staffMembers, setStaffMembers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterTerm, setFilterTerm] = useState('');
    const itemsPerPage = 10;  // Adjust as needed
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [staffToDelete, setStaffToDelete] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentStaff, setCurrentStaff] = useState(null);
    const { showAlert } = useSnackbar();

    const [newStaff, setNewStaff] = useState({ id: '', firstName: '', lastName: '', roleID: '', phoneNumber: '', email: '', password: '' });

    const addStaff = () => {
        setStaffMembers(prev => [...prev, newStaff]);
        setNewStaff({ id: '', firstName: '', lastName: '', roleID: '', phoneNumber: '', email: '', password: '' });
        showAlert("Staff added successfully!");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewStaff(prev => ({ ...prev, [name]: value }));
    };

    const startEditing = (id) => {
        const staffToEdit = staffMembers.find(staff => staff.id === id);
        setCurrentStaff(staffToEdit);
        setIsEditing(true);
    };
    
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setCurrentStaff(prev => ({ ...prev, [name]: value }));
    };
    
    const saveEdit = () => {
        setStaffMembers(prev => prev.map(staff => staff.id === currentStaff.id ? currentStaff : staff));
        setIsEditing(false);
        setCurrentStaff(null);
        showAlert("Staff Update saved successfully!");

    };

    const promptDelete = (id) => {
        setStaffToDelete(id);
        setDeleteConfirmationOpen(true);
    };

    const deleteStaff = () => {
        setStaffMembers(prev => prev.filter(staff => staff.id !== staffToDelete));
        setDeleteConfirmationOpen(false);
        setStaffToDelete(null);
        showAlert("Staff deleted successfully!");

    };

    const filteredStaff = staffMembers.filter(staff =>
        staff.firstName.toLowerCase().includes(filterTerm.toLowerCase()) ||
        staff.lastName.toLowerCase().includes(filterTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(filterTerm.toLowerCase())
    );

    return (
        <Grid>
            <Card>
                <CardContent>
                    <Typography variant="h5">Manage Staff</Typography>
                    <TextField label="Filter Staff" variant="outlined" fullWidth style={{ marginBottom: '1rem' }} value={filterTerm} onChange={e => setFilterTerm(e.target.value)} />    
                    <AddStaffForm {...{ newStaff, handleInputChange, addStaff }} />
                    <StaffList staff={filteredStaff} promptDelete={promptDelete} startEditing={startEditing} currentPage={currentPage} itemsPerPage={itemsPerPage} />                        
                    <Pagination count={Math.ceil(filteredStaff.length / itemsPerPage)} page={currentPage} onChange={(_, page) => setCurrentPage(page)} style={{ marginTop: '1rem' }} />
                </CardContent>
            </Card>
            <DeleteConfirmationModal open={deleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)} onDelete={deleteStaff} />
            <EditStaffModal open={isEditing} onClose={() => setIsEditing(false)} currentStaff={currentStaff} handleEditChange={handleEditChange} onSave={saveEdit} />
        </Grid>
        );
    }
    
    function AddStaffForm({ newStaff, handleInputChange, addStaff }) {
    return (
        <>
            {Object.entries(newStaff).map(([key, value]) => (
                <TextField
                    key={key}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    name={key}
                    type={key === "password" ? "password" : "text"}
                    fullWidth
                    variant="outlined"
                    value={value}
                    onChange={handleInputChange}
                    style={{ marginTop: '1rem' }}
                />
            ))}
            <Button variant="contained" color="primary" onClick={addStaff} style={{ marginTop: '1rem' }}>
                Add Staff
            </Button>
        </>
    );
}

function StaffList({ staff, promptDelete, startEditing, currentPage, itemsPerPage }) {
    const paginatedStaff = staff.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return (
        <Grid container spacing={3}>
            {paginatedStaff.map(member => (
                <Grid item xs={12} sm={6} key={member.id}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body1">
                            {member.firstName} {member.lastName} ({member.id}) - {member.email}
                        </Typography>
                        <Box>
                            <IconButton onClick={() => startEditing(member.id)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => promptDelete(member.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
}

function DeleteConfirmationModal({ open, onClose, onDelete }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this staff member?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={onDelete} color="primary">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function EditStaffModal({ open, onClose, currentStaff, handleEditChange, onSave }) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogContent>
                {currentStaff && Object.entries(currentStaff).map(([key, value]) => (
                    <TextField
                        key={key}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        name={key}
                        type={key === "password" ? "password" : "text"}
                        fullWidth
                        variant="outlined"
                        value={value}
                        onChange={handleEditChange}
                        style={{ marginTop: '1rem' }}
                    />
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={onSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ManageStaff;
