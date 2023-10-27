import React, { useState } from 'react'; 
import {Grid, Button, Typography, TextField, Box, Table, TableBody, TableRow, TableCell }  from '@mui/material';
import './App.css';
import ResultTable from './table';
import QRCode from "react-qr-code";

const saveResult = async (body = {}, admin) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const myRequest = new Request(`https://9656mgkl5a.execute-api.eu-west-2.amazonaws.com/dev/create/document/ElectionResults`, {
    body: JSON.stringify(body),
    method: "POST",
    headers: myHeaders,
    mode: "cors",
    cache: "default",
  });
  return await fetch(myRequest);
} 

function ResultForm() {
  const [electionPollingCentre, setPollingCentre] = useState('');
  const [electionOfficerId, setOfficerID] = useState('');
  const [electionId, setElectionID] = useState('');
  const [electionDate, setElectionDate] = useState('');
  const [electionWard, setElectionWard] = useState('');
  const [electionLga, setElectionLga] = useState('');
  const [electionState, setElectionState] = useState('');
  const [electionFederal, setElectionFederal] = useState('');

  const [partyVotes1, setPartyVotes1] = useState('');
  const [partyName1, setPartyName1] = useState('');
  const [partyVotes2, setPartyVotes2] = useState('');
  const [partyName2, setPartyName2] = useState('');
  const [partyVotes3, setPartyVotes3] = useState('');
  const [partyName3, setPartyName3] = useState('');
  const [partyVotes4, setPartyVotes4] = useState('');
  const [partyName4, setPartyName4] = useState('');
  
  const [isPreview, setIsPreview] = useState(false);
  const [isTableView, setIsTableView] = useState(false);
  const [results, setResults] = useState({});
  const [qrValue, setQrValue] = useState('');
  const [showQR, setShowQR] = useState(false);
  
  const handlePreviewClick = () => {
    setIsPreview(true);
  }

  const handleBackClick = () => {
    setIsPreview(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!electionPollingCentre) return;
    if (!electionOfficerId) return;
    if (!electionId) return;
    if (!electionDate) return;
    if (!electionWard) return;
    if (!electionLga) return;
    if (!electionState) return;
    if (!electionFederal) return;

    let electionVotes = {voteTotal: 0, votesParties: []};
    if (partyVotes1 && partyName1) {
      electionVotes.voteTotal = parseInt(electionVotes.voteTotal) + parseInt(partyVotes2);
      electionVotes.votesParties.push({"name": partyName1, "voteCount": partyVotes1});
    } else {
      alert("Invalid Form: A minimum of partyVote1 must be entered");
      return;
    }

    if (partyVotes2 && partyName2) {
      electionVotes.voteTotal = parseInt(electionVotes.voteTotal) + parseInt(partyVotes2);
      electionVotes.votesParties.push({"name": partyName2, "voteCount": partyVotes2});
    }

    if (partyVotes3 && partyName3) {
      electionVotes.voteTotal = parseInt(electionVotes.voteTotal) + parseInt(partyVotes2);
      electionVotes.votesParties.push({"name": partyName3, "voteCount": partyVotes3});
    }

    if (partyVotes4 && partyName4) {
      electionVotes.voteTotal = parseInt(electionVotes.voteTotal) + parseInt(partyVotes2);
      electionVotes.votesParties.push({"name": partyName4, "voteCount": partyVotes4});
    }

    alert('You are about to submit these results');
    // const {partyName, numberOfVotes, pollingLocation, officialId}
    const body = {electionPollingCentre, electionOfficerId, electionId, electionDate, electionWard, electionLga, electionState, electionFederal, electionVotes};
    saveResult(body, 'udeze.cc@gmail.com')
    .then(async res => {
      const response = await res.json();
      alert(`Form submission is successfully with the following response: ${JSON.stringify(response)}`);
      setResults(response);

      const apiUrl = `https://9656mgkl5a.execute-api.eu-west-2.amazonaws.com/dev/fetch/document/ElectionResults/${response.electionResultKey}`;
      setQrValue(apiUrl);

      setShowQR(true);

      setIsTableView(true);
    })
    .catch(error => console.error(error));
  }

  if (isPreview && !isTableView) {
    return (
  <>
    <Box className='box'>
      <Box className='resultform-header'>
        <Typography variant="h5" gutterBottom className='result-header-typo'>
          Unit Result Preview
          {showQR && <QRCode className="qrcode-top-right" value={qrValue} size={80} level={"Q"}/>}
        </Typography>
      </Box>

      <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell colSpan={1}><Typography variant="h6" className="parties-cell">Election ID:</Typography></TableCell>
              <TableCell colSpan={2} className="preview-cell">{electionId}</TableCell>                  
            </TableRow>

              {/* Row for Polling Centre */}
              <TableRow>
                <TableCell colSpan={1}><Typography variant="h6" className="parties-cell">Polling Centre:</Typography></TableCell>
                <TableCell colSpan={2} className="preview-cell">{electionPollingCentre}</TableCell>                  
              </TableRow>

              {/* Row for Election Ward */}
              <TableRow>
                  <TableCell colSpan={1}><Typography variant="h6" className="parties-cell">Election Ward:</Typography></TableCell>
                  <TableCell colSpan={2} className="preview-cell">{electionWard}</TableCell>                  
              </TableRow>

              {/* Row for Election LGA */}
              <TableRow>
                  <TableCell colSpan={1}><Typography variant="h6" className="parties-cell">Election LGA:</Typography></TableCell>
                  <TableCell colSpan={2} className="preview-cell">{electionLga}</TableCell>                  
              </TableRow>

              {/* Row for State */}
              <TableRow>
                  <TableCell colSpan={1}><Typography variant="h6" className="parties-cell">State:</Typography></TableCell>
                  <TableCell colSpan={2} className="preview-cell">{electionState}</TableCell>                  
              </TableRow>

              {/* Row for Country */}
              <TableRow>
                  <TableCell colSpan={1}><Typography variant="h6" className="parties-cell">Country:</Typography></TableCell>
                  <TableCell colSpan={2} className="preview-cell">{electionFederal}</TableCell>                  
              </TableRow>

              {/* Row for OfficerID */}
              <TableRow>
                  <TableCell colSpan={1}><Typography variant="h6" className="parties-cell">OfficerID:</Typography></TableCell>
                  <TableCell colSpan={2} className="preview-cell">{electionOfficerId}</TableCell>                  
              </TableRow>

              {/* Row for Election Date */}
              <TableRow>
                  <TableCell colSpan={1}><Typography variant="h6" className="parties-cell">Election Date:</Typography></TableCell>
                  <TableCell colSpan={2} className="preview-cell">{electionDate}</TableCell>                  
              </TableRow>

              <TableRow>
                <TableCell colSpan={3}><Typography variant="h6" className="parties-cell">Election Parties :</Typography></TableCell>
              </TableRow>
              {/* Rows for Election Parties */}
              <TableRow>
                <TableCell colSpan={1}><Typography variant="h6" className="election-parties">Party 1:</Typography></TableCell>
                <TableCell colSpan={1} className="preview-cell">{partyName1}</TableCell>
                <TableCell colSpan={1} className="preview-cell">{partyVotes1}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={1}><Typography variant="h6" className="election-parties">Party 2:</Typography></TableCell>
                <TableCell colSpan={1} className="preview-cell">{partyName2}</TableCell>
                <TableCell colSpan={1} className="preview-cell">{partyVotes2}</TableCell> 
              </TableRow>

              <TableRow>
                <TableCell colSpan={1}><Typography variant="h6" className="election-parties">Party 3:</Typography></TableCell>
                <TableCell colSpan={1} className="preview-cell">{partyName3}</TableCell>
                <TableCell colSpan={1} className="preview-cell">{partyVotes3}</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell colSpan={1}><Typography variant="h6" className="election-parties">Party 4:</Typography></TableCell>
                <TableCell colSpan={1} className="preview-cell">{partyName4}</TableCell>
                <TableCell colSpan={1} className="preview-cell">{partyVotes4}</TableCell>
              </TableRow>

          </TableBody>
      </Table>

      <Grid>
        <Button className="view-result-button" variant="contained" style={previewButton} onClick={handleBackClick}>
          Back
        </Button>

        <Button className="view-result-button" variant="contained" style={previewButton} onClick={handleSubmit}>
          Submit
        </Button>
      </Grid>
    </Box>
</>
  );
  } else if (!isTableView) {
  return (
    <Box className='box'>
      <Box className='resultform-header'>
        <Typography variant="h4" gutterBottom className='result-header-typo'>
          Unit Result Form
           {showQR && <QRCode className="qrcode-top-right" value={qrValue} size={80} level={"Q"}/>}
        </Typography>
      </Box>

      <Grid container>
          <Grid item xs={6} md={6}>
              <Typography variant="h6" className="result-input">Election ID :</Typography>
            </Grid>
            <Grid item xs={6} md={6}>
              <TextField id="ElectionID" fullWidth label="ElectionID" className="result-input" variant="outlined" value={electionId} onChange={e => setElectionID(e.target.value)} />
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6} md={6}>
            <Typography variant="h6" className="result-input">Polling Centre :</Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField id="pollingCentre" fullWidth className="result-input" label="Polling Centre" variant="outlined" value={electionPollingCentre} onChange={e => setPollingCentre(e.target.value)} />
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6} md={6}>
            <Typography variant="h6" className="result-input">Election Ward :</Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField id="ward" fullWidth className="result-input" label="Ward" variant="outlined" value={electionWard} onChange={e => setElectionWard(e.target.value)}/>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6} md={6}>
            <Typography variant="h6" className="result-input">Election LGA :</Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField id="lga" fullWidth className="result-input" label="LGA" variant="outlined" value={electionLga} onChange={e => setElectionLga(e.target.value)}/>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6} md={6}>
            <Typography variant="h6" className="result-input">State :</Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField id="state" fullWidth className="result-input" label="State" variant="outlined" value={electionState} onChange={e => setElectionState(e.target.value)}/>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6} md={6}>
            <Typography variant="h6" className="result-input">Country :</Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField id="country" fullWidth className="result-input" label="Country" variant="outlined" value={electionFederal} onChange={e => setElectionFederal(e.target.value)}/>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6} md={6}>
            <Typography variant="h6" className="result-input">OfficerID :</Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField id="OfficerID" fullWidth className="result-input" label="OfficerID" variant="outlined" value={electionOfficerId} onChange={e => setOfficerID(e.target.value)}/>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6} md={6}>
            <Typography variant="h6" className="result-input">Election Date :</Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField id="ElectionDate" type="datetime-local" fullWidth className="result-input" variant="outlined" value={electionDate} onChange={e => setElectionDate(e.target.value)}/>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6} md={6}>
            <Typography variant="h6" className="result-input">Election Parties :</Typography>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={4} md={3} sm={3}>                
              <Typography variant="h6" className="election-parties">Party 1 :</Typography>
            </Grid>
            <Grid item xs={4} md={5} sm={5} mb={2}>
              <TextField id="partyName" fullWidth className="party-input" label="Party 1 Name" variant="outlined" value={partyName1} onChange={e => setPartyName1(e.target.value)} />
            </Grid>
            <Grid item xs={4} md={4} sm={4} mb={2}>
              <TextField id="partyVotes" fullWidth className="party-input" label="Party 1 Votes" variant="outlined" value={partyVotes1} onChange={e => setPartyVotes1(e.target.value)} />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={4} md={3} sm={3} >                
              <Typography variant="h6" className="election-parties">Party 2:</Typography>
            </Grid>
            <Grid item xs={4} md={5} sm={5}mb={2}>
              <TextField id="partyName" fullWidth className="party-input" label="Party 2 Name" variant="outlined" value={partyName2} onChange={e => setPartyName2(e.target.value)} />
            </Grid>
            <Grid item xs={4} md={4} sm={4}mb={2}>
              <TextField id="partyVotes" fullWidth className="party-input" label="Party 2 Votes" variant="outlined" value={partyVotes2} onChange={e => setPartyVotes2(e.target.value)} />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={4} md={3} sm={3}>                
              <Typography variant="h6" className="election-parties">Party 3 :</Typography>
            </Grid>
            <Grid item xs={4} md={5} sm={5} mb={2}>
              <TextField id="partyName" fullWidth className="party-input" label="Party 3 Name" variant="outlined" value={partyName3} onChange={e => setPartyName3(e.target.value)} />
            </Grid>
            <Grid item xs={4} md={4} sm={4} mb={2}>
              <TextField id="partyVotes" fullWidth className="party-input" label="Party 3 Votes" variant="outlined" value={partyVotes3} onChange={e => setPartyVotes3(e.target.value)} />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={4} md={3} sm={3} >                
              <Typography variant="h6" className="election-parties">Party 4 :</Typography>
            </Grid>
            <Grid item xs={4} md={5} sm={5} mb={2}>
                <TextField id="partyName" fullWidth className="party-input" label="Party 4 Name" variant="outlined" value={partyName4} onChange={e => setPartyName4(e.target.value)} />
            </Grid>
            <Grid item xs={4} md={4} sm={4} mb={2}>
                <TextField id="partyVotes" fullWidth className="party-input" label="Party 4 Votes" variant="outlined" value={partyVotes4} onChange={e => setPartyVotes4(e.target.value)} />
            </Grid>
          </Grid>
        </Grid>

        <Button style={previewButton} onClick={handlePreviewClick}>
          Preview
        </Button>
    </Box>
  );
} else if (isTableView) {
  return (
    <ResultTable results = {results}/>
  )
}

}

export default ResultForm;

const previewButton = {
  backgroundColor: "green",
  color: "white",
  textAlign: "center",
  textDecoration: "none",
  display: "inline-block",
  fontSize: "16px",
  borderRadius: "5px",
  border: "1px solid green",
  margin: "1.0em",
  width: "200px",
}