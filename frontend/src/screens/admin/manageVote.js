import React, { useState, useEffect } from 'react';
import {
  TextField, MenuItem, Card, Button, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton, RadioGroup, FormControlLabel, Radio, FormControl
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ManageVote = () => {
  const [vote, setVote] = useState({
    votesId: '',
    unit: '',  
    unitName: '',
    unitId: '',
    election: '',
    type: '',
    party: '',
    winner: '',
    category: ''
  });

  const units = [
    { id: 'U01', name: 'Unit 1' },
    { id: 'U02', name: 'Unit 2' },
    // ... other units ...
  ];

  const [votes, setVotes] = useState([]);

  const [filteredVotes, setFilteredVotes] = useState([]);
  
  const [filterBy, setFilterBy] = useState('votesId');
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    const filtered = votes.filter(v => String(v[filterBy]).includes(filterValue));
    setFilteredVotes(filtered);
  }, [votes, filterBy, filterValue]);

  const handleFilterChange = (event) => {
    setFilterBy(event.target.value);
    setFilterValue(''); // Reset filter value when filter criteria changes
  };

  const handleAddVote = () => {
    if(vote.votesId) {
      setVotes(prevVotes => [...prevVotes, vote]);
      setVote({
        votesId: '',
        unit: '',
        unitName: '',
        unitId: '',
        election: '',
        type: '',
        party: '',
        winner: '',
        category: ''
      });
    }
  };

  const handleDeleteVote = (index) => {
    const newVotes = [...votes];
    newVotes.splice(index, 1);
    setVotes(newVotes);
  };

  const handleVoteChange = (prop) => (event) => {
    setVote({ ...vote, [prop]: event.target.value });

    if (prop === 'unitName') {
        const selectedUnit = units.find(u => u.name === event.target.value);
        setVote(prev => ({ ...prev, unitId: selectedUnit?.id || '' }));
    }
  };

  return (
    <Card>
      <h3>Manage Votes</h3>
      <Card style={{ padding: '1rem' }}>
        <h3>Filter By</h3>
        <FormControl component="fieldset">
          <RadioGroup row value={filterBy} onChange={handleFilterChange}>
            <FormControlLabel value="votesId" control={<Radio />} label="Votes ID" />
            <FormControlLabel value="unit" control={<Radio />} label="Unit" />
            <FormControlLabel value="election" control={<Radio />} label="Election" />
            <FormControlLabel value="type" control={<Radio />} label="Type" />
            <FormControlLabel value="party" control={<Radio />} label="Party" />
            <FormControlLabel value="winner" control={<Radio />} label="Winner" />
            <FormControlLabel value="category" control={<Radio />} label="Category" />
          </RadioGroup>
        </FormControl>

        {/* ... other input fields for votes management ... */}
        <TextField
          label="Votes ID"
          value={vote.votesId}
          onChange={handleVoteChange('votesId')}
          fullWidth
          style={{ marginBottom: '1rem' }}
        />

        <TextField
            select
            label="Unit Name"
            value={vote.unitName}
            onChange={handleVoteChange('unitName')}
            fullWidth
            style={{ marginBottom: '1rem' }}
        >
            {units.map(unit => (
                <MenuItem key={unit.id} value={unit.name}>
                    {unit.name}
                </MenuItem>
            ))}
        </TextField>

        <TextField
            label="Unit ID"
            value={vote.unitId}
            InputProps={{
                readOnly: true,
            }}
            fullWidth
            style={{ marginBottom: '1rem' }}
        />

        <TextField
            label="Election"
            value={vote.election}
            onChange={handleVoteChange('election')}
            fullWidth
            style={{ marginBottom: '1rem' }}
        />

        <TextField
            label="Type"
            value={vote.type}
            onChange={handleVoteChange('type')}
            fullWidth
            style={{ marginBottom: '1rem' }}
        />

        <TextField
            label="Category"
            value={vote.category}
            onChange={handleVoteChange('category')}
            fullWidth
            style={{ marginBottom: '1rem' }}
        />

        <TextField
            label="Date"
            type="date"
            value={vote.date}
            onChange={handleVoteChange('date')}
            fullWidth
            style={{ marginBottom: '1rem' }}
            InputLabelProps={{
                shrink: true,
            }}
        />

        <Button onClick={handleAddVote} variant="contained" color="primary" style={{ marginTop: '1rem' }}>
          View Votes
        </Button>

        <List>
          {filteredVotes.map((vote, index) => (
            <ListItem key={vote.votesId}>
              <ListItemText primary={`Vote ID: ${vote.votesId}, Unit: ${vote.unit}, Election: ${vote.election}, Type: ${vote.type}, Party: ${vote.party}, Winner: ${vote.winner}, Category: ${vote.category}`} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="view">
                  <VisibilityIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteVote(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Card>
    </Card>
  );
}

export default ManageVote;
