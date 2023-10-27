import {
  Box, Card, CardContent, Typography, TextField, Button,
  Grid, IconButton, Dialog, DialogActions, DialogContent,
  DialogTitle, DialogContentText, Pagination, Select, MenuItem,
  InputLabel, FormControl
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {  useSnackbar } from './customBar';
import { useState, useEffect } from 'react';

const unitConfig = {
    pollingUnit: [
        { label: "Polling Unit Name", name: "pollingUnitName" },
        { label: "Polling Unit ID", name: "pollingUnitId" },
    ],
    ward: [
        { label: "Ward Name", name: "wardName" },
        { label: "Ward ID", name: "wardId" },
    ],
    lga: [
      { label: "LGA Name", name: "lgaName" },
      { label: "LGA ID", name: "lgaId" },
    ],
    state: [
      { label: "State Name", name: "stateName" },
      { label: "State ID", name: "stateId" },
    ],
    country: [
      { label: "Country Name", name: "countryName" },
      { label: "Country ID", name: "countryId" },
    ],
};

function ManageUnit() {
  const [units, setUnits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterTerm, setFilterTerm] = useState('');
  const itemsPerPage = 10;
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUnit, setCurrentUnit] = useState(null);
  const { showAlert } = useSnackbar();

  const [newUnit, setNewUnit] = useState({ id: '', name: '', description: '', manager: '' });

  const addUnit = () => {
    setUnits(prev => [...prev, newUnit]);
    setNewUnit({ id: '', name: '', description: '', manager: '' });
    showAlert("Unit added successfully!");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUnit(prev => ({ ...prev, [name]: value }));
  };

  const startEditing = (id) => {
    const unitToEdit = units.find(unit => unit.id === id);
    setCurrentUnit(unitToEdit);
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentUnit(prev => ({ ...prev, [name]: value }));
  };

  const saveEdit = () => {
      setUnits(prev => prev.map(unit => unit.id === currentUnit.id ? currentUnit : unit));
      setIsEditing(false);
      setCurrentUnit(null);
      showAlert("Unit Update saved successfully!");
  };

  const promptDelete = (id) => {
      setUnitToDelete(id);
      setDeleteConfirmationOpen(true);
  };

  const deleteUnit = () => {
      setUnits(prev => prev.filter(unit => unit.id !== unitToDelete));
      setDeleteConfirmationOpen(false);
      setUnitToDelete(null);
      showAlert("Unit deleted successfully!");
  };

  const filteredUnits = units.filter(unit =>
    unit.name.toLowerCase().includes(filterTerm.toLowerCase()) ||
    unit.id.toLowerCase().includes(filterTerm.toLowerCase())
);

  return (
      <Grid>
        <Card>
          <CardContent>
            <Box> 
              <Typography variant="h5">Manage Unit</Typography>
              <TextField label="Filter Unit" variant="outlined" fullWidth style={{ marginBottom: '1rem' }} value={filterTerm} onChange={e => setFilterTerm(e.target.value)} /> 
              <AddUnitForm newUnit={newUnit} handleInputChange={handleInputChange} addUnit={addUnit} />
              <UnitList units={filteredUnits} startEditing={startEditing} promptDelete={promptDelete} />
              <Pagination count={Math.ceil(filteredUnits.length / itemsPerPage)} page={currentPage} onChange={(e, value) => setCurrentPage(value)} />
            </Box>
          </CardContent>
        </Card>
        <DeleteUnitModal open={deleteConfirmationOpen} handleClose={() => setDeleteConfirmationOpen(false)} confirmDelete={deleteUnit} />
        <EditUnitModal unit={currentUnit} open={isEditing} handleInputChange={handleEditChange} saveEdit={saveEdit} handleClose={() => setIsEditing(false)} /> 
      </Grid>
  )

  function AddUnitForm({ addUnit, showAlert }) {
    const [newUnit, setNewUnit] = useState({
      type: '', 
      parentId: '',
      parentName: '', 
      unitId: '',
      unitName: ''
    });

    const unitTypeMapping = {
        'pollingUnit': 'ward',
        'ward': 'lga',
        'lga': 'state',
        'state': 'country',
    };

    const handleInputChange = (event) => {
      const { name, value } = event.target;

      if (name === "type") {
          const parentType = unitTypeMapping[value];
          setNewUnit(prevState => ({ 
              ...prevState,
              type: value,
              parentId: '', 
              parentName: parentType || '',
              unitId: '',  
              unitName: ''
          }));
      } else {
          setNewUnit(prevState => ({ ...prevState, [name]: value }));
      }
    };

    const onSubmit = () => {
      if (newUnit.unitName && newUnit.unitId && newUnit.type && 
          (newUnit.type !== 'country' ? newUnit.parentId && newUnit.parentName : true)) {
          addUnit(newUnit);
      } else {
          showAlert("Please fill in all required fields before adding.");
      }
    };

    const getLabel = (base) => {
      if (!newUnit.type) {
          return base;
      }
      return `${newUnit.type} ${base}`;
    };

    const getParentLabel = (base) => {
      if (!newUnit.type || newUnit.type === 'country') {
          return base;
      }
      return `${unitTypeMapping[newUnit.type]} ${base}`;
    };

    return (
      <Card variant="outlined">
          <TextField
              select
              label="Select Type"
              value={newUnit.type}
              onChange={handleInputChange}
              name="type"
              fullWidth
              margin="normal"
          >
              {['pollingUnit', 'ward', 'lga', 'state', 'country'].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
              ))}
          </TextField>
          <TextField
              label={getLabel("Name")}
              value={newUnit.unitName}
              onChange={handleInputChange}
              name="unitName"
              fullWidth
              margin="normal"
          />
          <TextField
              label={getLabel("ID")}
              value={newUnit.unitId}
              onChange={handleInputChange}
              name="unitId"
              fullWidth
              margin="normal"
          />
          {newUnit.type && newUnit.type !== 'country' && (
            <>
              <TextField
                  label="Parent Unit Type"
                  value={unitTypeMapping[newUnit.type] || ''}
                  disabled
                  fullWidth
                  margin="normal"
              />
              <TextField
                  value={newUnit.parentName}
                  onChange={handleInputChange}
                  name="parentName"
                  fullWidth
                  margin="normal"
                  label={getParentLabel("Name")}
              />
              <TextField
                  value={newUnit.parentId}
                  onChange={handleInputChange}
                  name="parentId"
                  fullWidth
                  margin="normal"
                  label={getParentLabel("ID")}
              />
            </>
          )}
          <Button onClick={onSubmit} variant="contained" color="primary">
              {newUnit.id ? 'Update' : 'Add'}
          </Button>
      </Card>
    );
}

  function UnitList({ units, startEditing, promptDelete }) {
    return (
        <Box mt={2}>
            {units.map((unit, index) => (
                <Card key={index} variant="outlined" style={{ marginBottom: '16px' }}>
                    <CardContent>
                        <Typography variant="h6">{unit.name}</Typography>
                        <Typography variant="body1">{unit.description}</Typography>
                        <IconButton onClick={() => startEditing(unit.id)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => promptDelete(unit.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
  }

  function DeleteUnitModal({ open, handleClose, confirmDelete }) {
      return (
          <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>
                  <DialogContentText>
                      Are you sure you want to delete this unit? This action cannot be undone.
                  </DialogContentText>
              </DialogContent>
              <DialogActions>
                  <Button onClick={handleClose} color="primary">
                      Cancel
                  </Button>
                  <Button onClick={confirmDelete} color="secondary">
                      Confirm
                  </Button>
              </DialogActions>
          </Dialog>
      );
  }

  function EditUnitModal({ unit, open, handleInputChange, saveEdit, handleClose }) {
    const [unitOptions, setUnitOptions] = useState({});
    const unitType = unit && unit.type;

    useEffect(() => {
        async function fetchUnitOptions() {
            try {
                const response = await fetch('api/units');
                const data = await response.json();
                setUnitOptions(data);
            } catch (error) {
                console.error("Error fetching unit options:", error);
            }
        }

        fetchUnitOptions();
    }, []);  // empty dependency array means this useEffect runs once when the component mounts

    return (
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Edit {unitType}</DialogTitle>
        <DialogContent>
          {unit && unitConfig[unitType] && unitConfig[unitType].map((field, index) => (
            <FormControl fullWidth margin="normal" key={index}>
              <InputLabel>{field.label}</InputLabel>
              <Select
                name={field.name}
                value={unit[field.name] || ""}
                onChange={handleInputChange}
            >
              {unitOptions[field.name] && unitOptions[field.name].map((option, idx) => (
              <MenuItem key={idx} value={option.value}>
                {option.label}
              </MenuItem>
          ))}
              </Select>
            </FormControl>
          ))}
        </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={saveEdit} color="primary">
          Save Changes
        </Button>
      </DialogActions>
  </Dialog>
  );
}};

export default ManageUnit;
