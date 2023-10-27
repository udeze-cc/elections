import React, { useState } from 'react';
import { TextField, Card, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MenuItem from '@mui/material/MenuItem';

const units = [
    { id: '1', name: 'Unit 1' },
    // ... other units
];

const elections = [
    { id: 'E1', name: 'Election 2022' },
    // ... other elections
];

function ManageBallot() {
    const [ballot, setBallot] = useState({
        totalIssued: '',
        serialStart: '',
        serialEnd: '',
        unitId: '',
        unitName: '',
        election: '',
        date: ''
    });

    const [ballots, setBallots] = useState([]);

    const handleChange = (field) => (event) => {
        setBallot({ ...ballot, [field]: event.target.value });
    };

    const handleAddBallot = () => {
        setBallots([...ballots, ballot]);
        setBallot({ totalIssued: '', serialStart: '', serialEnd: '', unitId: '', unitName: '', election: '', date: '' }); // reset
    };

    const handleDeleteBallot = (index) => {
        const newBallots = [...ballots];
        newBallots.splice(index, 1);
        setBallots(newBallots);
    };

    const handleViewBallot = (index) => {
        const selectedBallot = ballots[index];
        setBallot(selectedBallot);
    };

    return (
        <Card>
          <h3>Manage Ballots</h3>
          <Card style={{ padding: '1rem' }}>
          <TextField
            select
            label="Unit"
            value={ballot.unitId}
            onChange={handleChange('unitId')}
            fullWidth
            margin="normal"
        >
            {units.map(unit => (
              <MenuItem key={unit.id} value={unit.id}>
                {unit.name}
              </MenuItem>
            ))}
            </TextField>
            <TextField
              select
              label="Election"
              value={ballot.election}
              onChange={handleChange('election')}
              fullWidth
              margin="normal"
          >
              {elections.map(election => (
                <MenuItem key={election.id} value={election.id}>
                  {election.name}
                </MenuItem>
              ))}
          </TextField>
          <TextField
              label="Date"
              type="date"
              value={ballot.date}
              onChange={handleChange('date')}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
          />
          <TextField
              label="Total Issued Ballot Papers"
              value={ballot.totalIssued}
              onChange={handleChange('totalIssued')}
              fullWidth
              margin="normal"
          />
          <TextField
              label="Ballot Serial Number Start"
              value={ballot.serialStart}
              onChange={handleChange('serialStart')}
              fullWidth
              margin="normal"
          />
          <TextField
              label="Ballot Serial Number End"
              value={ballot.serialEnd}
              onChange={handleChange('serialEnd')}
              fullWidth
              margin="normal"
          />
          <Button onClick={handleAddBallot} variant="contained" color="primary" style={{ marginTop: '1rem' }}>
            Add/Update Ballot
          </Button>
            </Card>
            <List>
              {ballots.map((b, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`Unit: ${b.unitName}, Election: ${b.election}, Date: ${b.date}`} />
                  <IconButton edge="end" aria-label="view" onClick={() => handleViewBallot(index)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteBallot(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
        </Card>
    );
}

export default ManageBallot;
