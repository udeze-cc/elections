import {
  AppBar, Toolbar, Typography, MenuItem, FormControl, FormControlLabel,
  FormLabel, RadioGroup, Radio, Select, Box, Grid, Table, TableBody,
  TableCell, TableRow, TableHead
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';
import {
  ComposedChart, ReferenceLine, Bar, LabelList, Legend, XAxis, YAxis, CartesianGrid
} from 'recharts';
import './App.css';
import { BASE_URL } from './constants';
import QRCode from "react-qr-code";
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';


const headerVisibility = {
  electionPollingCentre: ['electionLga', 'electionState', 'electionFederal'],
  electionWard: ['electionPollingCentre', 'electionState', 'electionFederal'],
  electionLGA: ['electionPollingCentre', 'electionWard', 'electionFederal'],
  electionState: ['electionWard', 'electionPollingCentre', 'electionFederal'],
  electionFederal: ['electionWard', 'electionLga', 'electionPollingCentre', 'electionFederal'],
  all: []
};

function getValueFromResult(attribute, result) {
  const keys = attribute.split('.');
  let value = result;
  for (const key of keys) {
    value = value[key];
    if (value === undefined) break;
  }
  return value;
}

class DetailedResultView extends React.Component {
  render() {
      const { results, renderTableHeader, renderTableRow, page, rowsPerPage, handlePageChange, totalResults } = this.props;
      const paginatedResults = results.slice((page - 1) * rowsPerPage, page * rowsPerPage);
      const totalPages = Math.ceil(totalResults / rowsPerPage);

      return (
          <Box>
              <Table>
                  {renderTableHeader()}
                  <TableBody>
                      {Array.isArray(paginatedResults) && paginatedResults.map(result => renderTableRow(result))}
                  </TableBody>
              </Table>
              <Box mt={3}>
                  <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      renderItem={(item) => <PaginationItem {...item} />}
                  />
              </Box>
          </Box>
      );
  }
}

const attributeToLabelMapping = {
  "electionResultKey": "Result ID",
  "electionId": "Election ID",
  "electionPollingCentre": "Polling Unit",
  "electionOfficerId": "Officer ID",
  "electionDate": "Election Date",
  "electionWard": "Ward",
  "electionLga": "LGA",
  "electionState": "State",
  "electionFederal": "Country",
  "electionVotes.voteTotal": "Total Votes",
};

class AllResultsTable extends React.Component {
  render() {
    if (!this.props.data || Object.keys(this.props.data).length === 0) {
      return null;
    }

    const qrValue = `${BASE_URL}/${this.props.data.electionResultKey}`;
    const parties = this.props.data.electionVotes && this.props.data.electionVotes.votesParties
      ? this.props.data.electionVotes.votesParties.map(party => {
        attributeToLabelMapping[`electionVotes.votesParties.${party.name}`] = party.name;
        return `electionVotes.votesParties.${party.name}`;
      })
      : [];

    const totalVotes = this.props.data.electionVotes?.votesParties?.reduce((sum, party) => sum + parseInt(party.voteCount, 10), 0) || 1;

    const rows = [
      "electionResultKey",
      "electionId",
      "electionPollingCentre",
      "electionOfficerId",
      "electionDate",
      "electionWard",
      "electionLga",
      "electionState",
      "electionFederal",
      "electionVotes.voteTotal",
      ...parties
    ];

    return (
      <Box className='box container-relative'>
        <QRCode className="qrcode-top-right" value={qrValue} size={100} level={"Q"} />
        <Box className='resultform-header'>
          <Typography variant="h5" align='center' gutterBottom className="result-header-typo">
            Result Page
          </Typography>
        </Box>

        <Grid container>
          <Grid item xs={12} md={8}>
            <Table>
              <TableBody>
                {rows.map(attribute => (
                  <TableRow key={attribute}>
                    <TableCell style={{ fontWeight: 'bold' }}>
                      {attributeToLabelMapping[attribute] || attribute}
                    </TableCell>
                    <TableCell style={{ fontWeight: 'bold', }}>
                      {
                        attribute.includes('votesParties')
                          ? parseInt((this.props.data.electionVotes.votesParties.find(p => p.name === attribute.split('.').pop()) || {}).voteCount || '0', 10) || 'N/A'
                          : attribute.includes('electionVotes.voteTotal')
                            ? this.props.data.electionVotes.votesParties.reduce((sum, party) => sum + parseInt(party.voteCount, 10), 0)
                            : attribute.includes('.')
                              ? attribute.split('.').reduce((o, i) => (o || {})[i], this.props.data)
                              : this.props.data[attribute] || 'N/A'
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>

          <Grid item xs={12} md={4}>
            <ComposedChart
              layout="vertical"
              width={600}
              height={400}
              data={this.props.data.electionVotes?.votesParties}
              margin={{
                top: 20, right: 20, bottom: 20, left: 50,
              }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis type="number" tick={{ fontWeight: 'bold' }} />
              <YAxis dataKey="name" type="category" tick={{ fontWeight: 'bold' }} />
              <Legend fontWeight={900} />
              <Bar
                dataKey="voteCount"
                barSize={40}
                fill="#107c41"
                name="Party Votes"
              >
                <LabelList dataKey="voteCount" position="insideLeft" fill="#ffffff" fontSize={14} fontWeight={900} formatter={(value) => `${((value / totalVotes) * 100).toFixed(2)}%`} />
              </Bar>
              <ReferenceLine x={totalVotes * 0.25} stroke="red" label={`${(0.25 * 100).toFixed(2)}% Average`} />
            </ComposedChart>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

const getPollingCentres = async () => {
  const response = await fetch(`${BASE_URL}/ElectionResults`);
  const data = await response.json();
  return data._resultList;
};

const getWards = async () => {
  const response = await fetch(`${BASE_URL}/Ward`);
  const data = await response.json();
  return data._resultList;
};

const getLGAs = async () => {
  const response = await fetch(`${BASE_URL}/LGA`);
  const data = await response.json();
  return data._resultList;
};

const getStates = async () => {
  const response = await fetch(`${BASE_URL}/State`);
  const data = await response.json();
  return data._resultList;
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      showSearchOptions: true,
      generalAttributes: [],
      availableUnits: [],
      activeCategory: 'electionPollingCentre', // Default category
      selectedUnit: 'Secretariat', // Default unit
      data: {},
      page: 1,
      rowsPerPage: 10,
    };

    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.setActiveCategory = this.setActiveCategory.bind(this);
    this.renderDropdownForCategory = this.renderDropdownForCategory.bind(this);
    this.toggleSearchOptions = this.toggleSearchOptions.bind(this); // Binding the toggle function
    this.handlePageChange = this.handlePageChange.bind(this);

    // Binding the table render methods in the constructor
    this.renderTableHeader = this.renderTableHeader.bind(this);
    this.renderTableRow = this.renderTableRow.bind(this);
  }

  toggleSearchOptions() {
    this.setState(prevState => ({
      showSearchOptions: !prevState.showSearchOptions
    }));
  }

  renderDropdownOptions() {
    if (!this.state.activeCategory) return null;

    const uniqueUnits = [...new Set(this.state.results.map(result => result[this.state.activeCategory]))];
    return uniqueUnits.map(unit => <option key={unit} value={unit}>{unit}</option>);
  }

  renderTableHeader() {
    const visibleHeaders = headerVisibility[this.state.activeCategory] || [];
  
    // Extract only the general headers, excluding the dynamic party headers
    const generalHeaders = Object.entries(attributeToLabelMapping)
      .filter(([attribute]) => !attribute.includes('votesParties') && !visibleHeaders.includes(attribute));
  
    return (
      <TableHead>
        <TableRow>
          {/* Render general headers */}
          {generalHeaders.map(([attribute, label]) => (
            <TableCell key={attribute} style={{ fontWeight: 'bold' }}>{label}</TableCell>
          ))}
  
          {/* Render party headers */}
          {Array.isArray(this.state.multipleResults?.[0]?.electionVotes?.votesParties) && this.state.multipleResults[0].electionVotes.votesParties.map((party) => (
            <TableCell key={party.name} style={{ fontWeight: 'bold' }}>{party.name}</TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  renderTableRow(result) {
    const visibleHeaders = headerVisibility[this.state.activeCategory] || [];
  
    // Extract only the general attributes, excluding the dynamic party attributes
    const generalAttributes = Object.keys(attributeToLabelMapping).filter(attribute => !attribute.includes('votesParties') && !visibleHeaders.includes(attribute));
  
    return (
      <TableRow key={result.electionResultKey}>
        {/* Render general attribute cells */}
        {Array.isArray(generalAttributes) && generalAttributes.map((attribute) => (
          <TableCell key={attribute}>{getValueFromResult(attribute, result)}</TableCell>
        ))}
        
        {/* Render party vote count cells */}
        {Array.isArray(result.electionVotes?.votesParties) && result.electionVotes.votesParties.map((party) => (
          <TableCell key={party.name}>{party.voteCount}</TableCell>
        ))}
      </TableRow>
    );
  }

  fetchDataForUnit(unit) {
    const relatedData = this.state.results.find(result => result[this.state.activeCategory] === unit);

    if (relatedData) {
      this.setState({ data: relatedData });
    } else {
      this.setState({ data: {} });
    }
  }

  componentDidMount() {
    getPollingCentres()
        .then(results => {
          const filteredResults = results.filter(result => {
            return result.electionId !== 'e1' &&
                   result.electionPollingCentre !== 'Bush Market' &&
                   result.electionWard !== 'Bush Market' &&
                   result.electionLga !== 'Bush Market' &&
                   result.electionState !== 'Bush Market';
                });            
                this.setState({ results: filteredResults }, () => {
                this.fetchDataForUnit(this.state.selectedUnit);
            });
        });

    getWards().then(data => this.setState({ availableWards: data }));
    getLGAs().then(data => this.setState({ availableLGAs: data }));
    getStates().then(data => this.setState({ availableStates: data }));
  }

  handleDropdownChange(event) {
    const selectedValue = event.target.value;
    const relatedData = this.state.results.filter(result => result[this.state.activeCategory] === selectedValue);

    if (relatedData.length === 1) {
      this.setState({ data: relatedData[0], multipleResults: null });
    } else if (relatedData.length > 1) {
      this.setState({ data: {}, multipleResults: relatedData });
    } else {
      this.setState({ data: {}, multipleResults: null });
    }
  }

  setActiveCategory(category) {
    this.setState({ activeCategory: category });
  }

  renderDropdownForCategory(category) {
    const excludedOptions = ['e1', 'Bush Market'];
    const options = [...new Set(this.state.results.map(r => r[category]))].filter(option => !excludedOptions.includes(option));
        return (
      <Select value={this.state.data[category] || ''} onChange={this.handleDropdownChange} MenuProps={menuProps} >   <MenuItem value="">
              <em>Select</em>
          </MenuItem>
          {options.map(option => (
              <MenuItem key={option} value={option}>
                  {option}
              </MenuItem>
          ))}
      </Select>
    );
  }

  handlePageChange(event, newPage) {
    this.setState({ page: newPage });
}

  render() {
    const categories = ['electionOfficerId', 'electionPollingCentre', 'electionWard', 'electionLGA', 'electionState', 'electionFederal', 'electionId'];

    return (
      <>
        <AppBar position="static" sx={{ backgroundColor: 'green' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              e-lections
            </Typography>
            <SearchIcon
              onClick={this.toggleSearchOptions}
              aria-label="Toggle search options"
              className="search-icon"
            />
            <a className="account-button" href={`/dashboard`}>Account</a>
          </Toolbar>
        </AppBar>
        <Box>
          {this.state.showSearchOptions && (
            <Box className="box">
              <FormControl className="form-control">
                <FormLabel component="legend">Select Unit</FormLabel>
                <RadioGroup row name="unit" value={this.state.activeCategory} onChange={(e) => this.setActiveCategory(e.target.value)}>
                  {categories.map(category => (
                    <FormControlLabel
                      key={category}
                      value={category}
                      control={<Radio />}
                      label={attributeToLabelMapping[category] || category.replace('election', '').replace(/([A-Z])/g, ' $1')}
                      />
                  ))}
                </RadioGroup>

                {this.state.activeCategory && (
                  <Box mt={2}>
                    <FormControl variant="outlined" fullWidth>
                      {this.renderDropdownForCategory(this.state.activeCategory)}
                    </FormControl>
                  </Box>
                )}
              </FormControl>
            </Box>
          )}
        </Box>

        <Grid container>
          {this.state.multipleResults ? (
            <DetailedResultView
            results={this.state.multipleResults}
            renderTableHeader={this.renderTableHeader}
            renderTableRow={this.renderTableRow}
            page={this.state.page}
            rowsPerPage={this.state.rowsPerPage}
            totalResults={this.state.multipleResults.length}
            handlePageChange={this.handlePageChange}
        />        
          ) : (
            <AllResultsTable data={this.state.data} />
          )}
        </Grid>
      </>
    );
  }
}

export default Home;

const menuProps = {
  PaperProps: {
    style: {
      maxHeight: '50vh',  // 50% of the viewport height
      width: '250px',     // You can adjust this if needed
    },
  },
};
