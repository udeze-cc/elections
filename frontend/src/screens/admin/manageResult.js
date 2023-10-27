import React, { useState, useEffect } from 'react';
import {
  List, ListItem, Card, TextField, ListItemText, MenuItem, Button,
  ListItemSecondaryAction, IconButton, 
} from '@mui/material'; 
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

const types = [
  { id: 'T01', name: 'presidential' },
  { id: 'T02', name: 'senate' },
  { id: 'T03', name: 'representatives' },
  { id: 'T05', name: 'governorship' },
  { id: 'T06', name: 'assembly' }
];

const units = [
  'polling unit',
  'ward',
  'lga',
  'state',
  'country',
];

const elections = [
  { id: 'NE22', name: 'Election 2022' },
  { id: 'NE23', name: 'Election 2023' }
];

function ManageResult() {
  const [result, setResult] = useState({
    serialNo: '',
    electionName: '',
    electionId: '',
    type: '',
    typeId: '',
    unitID: '',       
    unitName: '',   
    unitSubId: '',    
    date: ''
  });

  const handleEdit = (selectedResult) => {
    setResult(selectedResult); 
    setIsEditing(true); 
  };

  const [results, setResults] = useState([]); 
  const [isEditing, setIsEditing] = useState(false);
  const fetchResultsByUnit = async (unit) => {
    try {
        const response = await fetch(`/api/results?unit=${unit}`);
        const data = await response.json();
        setResults(data);
    } catch (error) {
        console.error('Error fetching results:', error);
    }
  };

  useEffect(() => {
      if (result.unitID) {
          fetchResultsByUnit(result.unitID);
      }
  }, [result.unitID]);

  const [filterSerialNo, setFilterSerialNo] = useState('');

  const filteredResults = results.filter(res => {
    if (!filterSerialNo) return true; // if no filter is set, show all results
    return res.serialNo.includes(filterSerialNo);
  });

  const handleChange = (prop) => (event) => {
    setResult({ ...result, [prop]: event.target.value });

    switch (prop) {
      case 'electionName':
        const election = elections.find(e => e.name === event.target.value);
        setResult(prev => ({ ...prev, electionId: election?.id || '' }));
        break;
      case 'type':
        const type = types.find(t => t.name === event.target.value);
        setResult(prev => ({ ...prev, typeId: type?.id || '' }));
        break;
      default:
        break;
    }
  };

  const handleUpdate = () => {
    // Logic to handle updating a result goes here
    // You can call an API to update the result in your backend
  };

  const handleSaveChanges = async () => {
    try {
        const response = await fetch(`/api/results/${result.serialNo}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(result)
        });

        if (response.ok) {
            const updatedResult = await response.json();
            // Update the result in your UI, e.g., update the 'results' array with the modified result
            const updatedResults = results.map(res => res.serialNo === updatedResult.serialNo ? updatedResult : res);
            setResults(updatedResults);
            setIsEditing(false);
        } else {
            // handle any error messages or status codes
            console.error("Error updating the result:", response.statusText);
        }
    } catch (error) {
        console.error("There was an error updating the result:", error);
    }
  }

  return (
  <Card>
    <h3>Manage Result</h3>
    <Card style={{ padding: '1rem' }}>
      {/* Filter section */}
      <TextField
        label="Filter Results"
        value={filterSerialNo}
        onChange={(e) => setFilterSerialNo(e.target.value)}
        fullWidth
        style={{ marginBottom: '1rem' }}
      />
      <TextField
        label="Result Serial No"
        value={result.serialNo}
        onChange={handleChange('serialNo')}
        fullWidth
        style={{ marginBottom: '1rem' }}
      />

      <TextField
         select
         label="Election Name"
         value={result.electionName}
         onChange={handleChange('electionName')}
         fullWidth
         style={{ marginBottom: '1rem' }}
       >
         {elections.map(election => (
           <MenuItem key={election.id} value={election.name}>
             {election.name}
           </MenuItem>
         ))}
      </TextField>

      <TextField
        label="Election ID"
        value={result.electionId}
        InputProps={{
          readOnly: true, 
        }}
        fullWidth
        style={{ marginBottom: '1rem' }}
        />

      <TextField
        select
        label="Type"
        value={result.type}
        onChange={handleChange('type')}
        fullWidth
        style={{ marginBottom: '1rem' }}
      >
        {types.map(type => (
          <MenuItem key={type.id} value={type.name}>
            {type.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Type ID"
        value={result.typeId}
        InputProps={{
          readOnly: true, 
        }}
        fullWidth
        style={{ marginBottom: '1rem' }}
      />

    <TextField
      select
      label="Unit"
      value={result.unitID}
      onChange={handleChange('unitID')}
      fullWidth
      style={{ marginBottom: '1rem' }}
    >
      {units.map(unit => (
        <MenuItem key={unit} value={unit}>
          {unit}
        </MenuItem>
      ))}
    </TextField>

    {/* Conditional rendering based on unitID */}
    {result.unitID && (
      <>
        <TextField
          label={`${result.unitID} name`}
          value={result.unitName}
          onChange={handleChange('unitName')}
          fullWidth
          style={{ marginBottom: '1rem' }}
        />
        <TextField
          label={`${result.unitID} ID`}
          value={result.unitSubId}
          onChange={handleChange('unitSubId')}
          fullWidth
          style={{ marginBottom: '1rem' }}
        />
      </>
    )}
        {/* Result list */}
        <List>
        {filteredResults.map((f) => (
          <ListItem key={f.serialNo}>
            <ListItemText primary={`Result: ${f.serialNo}, Election: ${f.electionName} (${f.electionId}), Type: ${f.type} (${f.typeId}), Unit: ${f.unitId}, Date: ${f.date}`} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="view">
                <VisibilityIcon />
              </IconButton>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(f)}>
                <EditIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        </List>

        {isEditing ? (
        <Button onClick={handleSaveChanges} variant="contained" color="primary" style={{ marginTop: '1rem' }}>
          Save Changes
        </Button>
        ) : (
        <Button onClick={handleUpdate} variant="contained" color="primary" style={{ marginTop: '1rem' }}>
          Update
        </Button>
      )}
      </Card>
    </Card>
  );
}

export default ManageResult;
