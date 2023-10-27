import React, { useState } from 'react';
import {
  TextField, MenuItem, Card, Button, List, ListItem,
  ListItemText, ListItemSecondaryAction, IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { RadioGroup, FormControlLabel, Radio, FormControl } from '@mui/material';

const units = [
  { id: '1', name: 'Unit 1' },
  { id: '2', name: 'Unit 2' },
  // ... other units
];

const staff = [
  { id: 'A', name: 'Staff A' },
  { id: 'B', name: 'Staff B' },
  // ... other staff members
];

const agents = [
  { id: 'X', name: 'Agent X' },
  { id: 'Y', name: 'Agent Y' },
  // ... other agents
];

const elections = [
  { id: 'NE22', name: 'Election 2022' },
  { id: 'NE23', name: 'Election 2023' },
  // ... other elections
];

function ManagePosting() {
  const [posting, setPosting] = useState({
    unit: '',
    staff: '',
    agent: '',
    election: '',
    date: ''
  });

  const [assignments, setAssignments] = useState([]);
  const [filterType, setFilterType] = useState('');  // 'unit', 'staff', 'agent', 'election'
  const [filterValue, setFilterValue] = useState('');  
  
  const filteredAssignments = assignments.filter(assignment => {
    if (filterType && filterValue) {
      return assignment[filterType] === filterValue;
    }
    return true;  // No filter set; show all assignments
  });
  
  const handleChange = (field) => (event) => {
    setPosting({
      ...posting,
      [field]: event.target.value
    });
  };

  const handleAddPosting = () => {
    if (assignments.find(p => p.unit === posting.unit)) {
      alert('This unit already has an assignment. Please update or delete the existing one.');
      return;
    }
    setAssignments([...assignments, posting]);
    setPosting({ unit: '', staff: '', agent: '', election: '', date: '' }); // Reset the form
  };

  // const handleUpdatePosting = (unitId) => {
  //   setAssignments(assignments.filter(p => p.unit !== unitId));
  //   handleAddPosting();
  // };

  const handleDeletePosting = (unitId) => {
    setAssignments(assignments.filter(p => p.unit !== unitId));
  };
  const getOptionsForFilter = () => {
    switch (filterType) {
      case 'unit':
        return units;
      case 'staff':
        return staff;
      case 'agent':
        return agents;
      case 'election':
        return elections;
      default:
        return [];
    }
  };
  
    
  return (
    <Card>
      <h3>Manage Postings</h3>
      <Card style={{ padding: '1rem' }}>
      <TextField
        select
        label={`Filter by ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`}  // Capitalize the first letter of filterType
        value={filterValue}
        onChange={(event) => setFilterValue(event.target.value)}
        fullWidth
        style={{ marginBottom: '1rem' }}
        disabled={!filterType}  // Disable dropdown if no filter type is selected
        >
        {getOptionsForFilter().map(item => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
        </TextField>
        <FormControl component="fieldset" style={{ marginBottom: '1rem' }}>
          <RadioGroup
            row
            aria-label="filterType"
            name="row-radio-buttons-group"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setFilterValue('');  // Reset the filter value when changing type
            }}
          >
            <FormControlLabel value="unit" control={<Radio />} label="Unit" />
            <FormControlLabel value="staff" control={<Radio />} label="Staff" />
            <FormControlLabel value="agent" control={<Radio />} label="Agent" />
            <FormControlLabel value="election" control={<Radio />} label="Election" />
          </RadioGroup>
        </FormControl>
        <TextField
          select
          label="Unit"
          value={posting.unit}
          onChange={handleChange('unit')}
          fullWidth
          style={{ marginBottom: '1rem' }}
        >
          {units.map(unit => (
            <MenuItem key={unit.id} value={unit.id}>
              {unit.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Staff"
          value={posting.staff}
          onChange={handleChange('staff')}
          fullWidth
          style={{ marginBottom: '1rem' }}
        >
          {staff.map(s => (
            <MenuItem key={s.id} value={s.id}>
              {s.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Agent"
          value={posting.agent}
          onChange={handleChange('agent')}
          fullWidth
          style={{ marginBottom: '1rem' }}
        >
          {agents.map(agent => (
            <MenuItem key={agent.id} value={agent.id}>
              {agent.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Election"
          value={posting.election}
          onChange={handleChange('election')}
          fullWidth
          style={{ marginBottom: '1rem' }}
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
          value={posting.date}
          onChange={handleChange('date')}
          fullWidth
          style={{ marginBottom: '1rem' }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button onClick={handleAddPosting} variant="contained" color="primary" style={{ marginTop: '1rem' }}>
          Assign
        </Button>

        <List>
        {filteredAssignments.map((post, index) => (
        <ListItem key={index}>
          <ListItemText primary={`Unit: ${post.unit}, Staff: ${post.staff}, Agent: ${post.agent}, Election: ${post.election}, Date: ${post.date}`} />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="delete" onClick={() => handleDeletePosting(post.unit)}>
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

export default ManagePosting;