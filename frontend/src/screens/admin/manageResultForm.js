import React, { useState } from 'react';
import {
  TextField, Card, Button, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton, MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const types = [
  { id: 'T01', name: 'presidential' },
  { id: 'T02', name: 'senate' },
  { id: 'T03', name: 'representatives' },
  { id: 'T05', name: 'governorship' },
  { id: 'T06', name: 'assembly' }
];

const elections = [
  { id: 'NE22', name: 'Election 2022' },
  { id: 'NE23', name: 'Election 2023' }
];

function ManageResultForm() {
  const [form, setForm] = useState({
    serialNo: '',
    electionName: '',
    electionId: '',
    type: '',
    typeId: '',
    unit: '',       
    unitName: '',   
    unitId: '',    
    date: ''
  });

  const units = [
    'polling unit',
    'ward',
    'lga',
    'state',
    'country',
  ];
  
  const [forms, setForms] = useState([]);
  const [unitFilter, setUnitFilter] = useState('');

  const handleChange = (prop) => (event) => {
    setForm({ ...form, [prop]: event.target.value });

    switch (prop) {
      case 'electionName':
        const election = elections.find(e => e.name === event.target.value);
        setForm(prev => ({ ...prev, electionId: election?.id || '' }));
        break;
      case 'type':
        const type = types.find(t => t.name === event.target.value);
        setForm(prev => ({ ...prev, typeId: type?.id || '' }));
        break;
      default:
        break;
    }
  };

  const handleAdd = () => {
    setForms(prevForms => [...prevForms, form]);
    // Reset form
    setForm({
      serialNo: '',
      electionName: '',
      electionId: '',
      type: '',
      typeId: '',
      unit: '',
      unitName: '',
      unitId: '',
      date: ''
    });
  };

  const handleDelete = (index) => {
    const updatedForms = [...forms];
    updatedForms.splice(index, 1);
    setForms(updatedForms);
  };

   const handleUnitFilterChange = (event) => {
    setUnitFilter(event.target.value);
  };
  
  // Logic to filter the forms based on unit
  const filteredForms = forms.filter(f => unitFilter === '' || f.unit === unitFilter);

  return (
    <Card>
      <h3>Manage Result Forms</h3>
      <Card style={{ padding: '1rem' }}>
        {/* New Filter for Unit */}
        <TextField
          select
          label="Filter by Unit"
          value={unitFilter}
          onChange={handleUnitFilterChange}
          fullWidth
          style={{ marginBottom: '1rem' }}
        >
          {units.map(unit => (
            <MenuItem key={unit} value={unit}>
              {unit}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Form Serial No"
          value={form.serialNo}
          onChange={handleChange('serialNo')}
          fullWidth
          style={{ marginBottom: '1rem' }}
        />
        
        <TextField
          select
          label="Election Name"
          value={form.electionName}
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
        value={form.electionId}
        InputProps={{
          readOnly: true, 
        }}
        fullWidth
        style={{ marginBottom: '1rem' }}
        />

        <TextField
          select
          label="Type"
          value={form.type}
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
        value={form.typeId}
        InputProps={{
          readOnly: true, 
        }}
        fullWidth
        style={{ marginBottom: '1rem' }}
      />

        <TextField
          select
          label="Unit"
          value={form.unit}
          onChange={handleChange('unit')}
          fullWidth
          style={{ marginBottom: '1rem' }}
        >
          {units.map(unit => (
            <MenuItem key={unit} value={unit}>
              {unit}
            </MenuItem>
          ))}
        </TextField>

        {/* Conditional rendering of the unit name and ID fields */}
        {form.unit && (
          <>
            <TextField
              label={`${form.unit} name`}
              value={form.unitName}
              onChange={handleChange('unitName')}
              fullWidth
              style={{ marginBottom: '1rem' }}
            />
            <TextField
              label={`${form.unit} ID`}
              value={form.unitId}
              onChange={handleChange('unitId')}
              fullWidth
              style={{ marginBottom: '1rem' }}
            />
          </>
        )}

        <TextField
          label="Date"
          type="date"
          value={form.date}
          onChange={handleChange('date')}
          fullWidth
          style={{ marginBottom: '1rem' }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button onClick={handleAdd} variant="contained" color="primary" style={{ marginTop: '1rem' }}>
          Add
        </Button>
        <List>
        {filteredForms.map((f, index) => (  // Use filteredForms instead of forms
            <ListItem key={f.serialNo}>
              <ListItemText primary={`Form: ${f.serialNo}, Election: ${f.electionName} (${f.electionId}), Type: ${f.type} (${f.typeId}), Unit: ${f.unitId}, Date: ${f.date}`} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="view">
                  <VisibilityIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(index)}>
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

export default ManageResultForm;
