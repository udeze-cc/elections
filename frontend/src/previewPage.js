import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { unitData, ballotData, voteData, staffData } = location.state;
  
  const handleEditClick = () => {
    // Navigate back to the form page for editing
    navigate('/form-page-route');  // Replace '/form-page-route' with the correct route to your form page.
  };

  const handleSubmit = async () => {
    // Retrieve the actual form data accordingly
    const formData = {
        unitData,
        ballotData,
        voteData,
        staffData
    };

    const endpointUrl = "https://your-api-endpoint.com/submit"; 

    try {
        const response = await fetch(endpointUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Any other headers like authentication headers
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        console.log('Data stored successfully:', responseData);
        // Handle successful submission: maybe navigate to a success page or show a success message

    } catch (error) {
        console.error('Error submitting data:', error);
        // Handle the error: maybe show an error message to the user
    };
  };

  return (
      // <Box m={5}>
      //   <Typography variant="h4" gutterBottom>
      //     Preview Page
      //   </Typography>
        
      //   <Typography variant="h6" gutterBottom>
      //     Unit Details
      //   </Typography>
      //   <Box>Unit Name: {unitData.unitName}</Box>
      //   <Box>Unit ID: {unitData.unitID}</Box>

      //   <Typography variant="h6" gutterBottom>
      //     Ballot Details
      //   </Typography>
      //   {Object.keys(ballotData).map(key => (
      //     <div key={key}>
      //       {key}: Word - {ballotData[key].word}, Figure - {ballotData[key].figure}
      //     </div>
      //   ))}

      //   <Typography variant="h6" gutterBottom>
      //     Vote Details
      //   </Typography>
      //   {voteData.map(vote => (
      //     <div key={vote.key}>
      //       {vote.key}: Votes (Fig) - {vote.votesFig}, Votes (Words) - {vote.votesWords}
      //     </div>
      //   ))}

      //   <Typography variant="h6" gutterBottom>
      //     Staff Details
      //   </Typography>
      //     <Box>Staff Name: {staffData.staffName}</Box>
      //     <Box>Staff ID: {staffData.staffID}</Box>
      //     <Box>Role: {staffData.role}</Box>
      //   <Box mt={2} marginBottom={3}>
      //       <Button variant="contained" color="secondary" onClick={handleEditClick}>
      //           Edit
      //       </Button>
      //       <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginLeft: '10px' }}>
      //           Submit
      //       </Button>
      //   </Box>
      // </Box>
      <>
    <Box className="box">
      <Box className='resultform-header'>
        <Typography variant="h4" gutterBottom className='result-header-typo'>
          Unit Result Submission Form
        </Typography>
      </Box>

      <Box className='component-margin '>
        <UnitComponent
          unitLabel={unitDetail.unitLabel} 
          nameLabel={unitDetail.nameLabel}
          idLabel={unitDetail.idLabel}
          nameData={unitData.unitName}
          idData={unitData.unitID}
          onChangeName={value => handleInputChange("unitData", "unitName", null, value)}
          onChangeId={value => handleInputChange("unitData", "unitID", null, value)}
        />
      </Box>

      <Box className='component-margin'>
        <ElectionComponent
          electionLabel={electionDetail.electionLabel} 
          nameLabel={electionDetail.nameLabel}
          idLabel={electionDetail.idLabel}
          nameData={electionData.electionName}
          idData={electionData.electionID}
          onChangeName={value => handleInputChange("electionData", "electionName", null, value)}
          onChangeId={value => handleInputChange("electionData", "electionID", null, value)}
        />
      </Box>

      <Accordion className='accordion-margin'>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" className='result-header-typo'>Ballot Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
        {ballotDetail.map(detail => (
          <BallotComponent
            key={detail.key}
            description={detail.description}
            wordLabel={detail.wordLabel}
            figureLabel={detail.figureLabel}
            wordData={ballotData[detail.key].word}
            figureData={ballotData[detail.key].figure}
            onWordChange={(value) => handleInputChange("ballotData", detail.key, "word", value)}
            onFigureChange={(value) => handleInputChange("ballotData", detail.key, "figure", value)}
          />
        ))}
        </AccordionDetails>
      </Accordion>

      <Accordion className='accordion-margin'>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" className='result-header-typo'>Votes Summary</Typography>
        </AccordionSummary>
        <AccordionDetails>
        {voteDetail.map((detail, index) => (
          <VoteComponent 
            key={detail.key} 
            partyName={detail.partyName}
            partyID={detail.key}
            votesFig={voteData[index].votesFig}
            votesWords={voteData[index].votesWords}
            onInputChange={(field, value) => handleInputChange("voteData", detail.key, field, value)}
          />
        ))}
        </AccordionDetails>
      </Accordion>

      <Box className='result-component'>
        <Box >
          <Typography variant="h6" className='component-typography'>Declaration</Typography>
        </Box>

        <Box className='declaration'>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={1}>
              <Box>I</Box>
            </Grid>

            <Grid item xs={12} sm={3}>
              <Box mx={1}>
                <TextField 
                  variant="outlined"
                  name="staffName" 
                  id="staffName" 
                  label="Polling Officer's Name" 
                  required />
              </Box>
            </Grid>

            <Grid item xs={12} sm={1}>
              <Box>with staff ID</Box>
            </Grid>

            <Grid item xs={12} sm={3}>
              <Box mx={1}>
                <TextField 
                  variant="outlined"
                  name="staffID" 
                  id="staffID" 
                  label="Staff ID" 
                  required />
              </Box>
            </Grid>

            <Grid item xs={12} sm={1}>
              <Box>today,</Box>
            </Grid>

            <Grid item xs={12} sm={3}>
              <Box mx={1}>
                <TextField 
                  variant="outlined"
                  type="datetime-local" 
                  name="electionDate" 
                  id="electionDate" 
                  label="Election Date" 
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box>hereby certify that the information contained in this form is a true and accurate account of votes cast in this polling unit. The election was CONTESTED/NOT CONTESTED.</Box>
            </Grid>
          </Grid>

          <Button className='view-result-button' style={previewButton} onClick={handlePreviewClick}>
            Preview
          </Button>
        </Box>
      </Box>
    </Box>
  </>
  );
}

export default PreviewPage;
