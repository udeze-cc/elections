import { Table, Box, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import QRCode from "react-qr-code";
import { BASE_URL } from './constants';

function ResultTable(props) {
    const { electionResultKey, electionPollingCentre, electionOfficerId, electionId, electionDate, electionWard, electionLga,
        electionState, electionFederal, partyVotes1, partyName1, partyVotes2, partyName2,
        partyVotes3, partyName3, partyVotes4, partyName4
    } = props.results ? props.results : {};

    const qrValue = `${BASE_URL}/${electionResultKey}`;

    return (
        <>
            <Box className='box container-relative'>
                <QRCode className="qrcode-top-right" value={qrValue} size={100} level={"Q"}/>
                <Box className='resultform-header'>
                    <Typography variant="h5" align='center' gutterBottom className="result-header-typo">
                        Unit Result
                    </Typography>
                </Box>

            <Table size="small">
                <TableBody>
                    <TableRow>
                    <TableCell colSpan={1}><Typography variant="h6" className="parties-cell">Election ID:</Typography></TableCell>
                    <TableCell colSpan={2} className="preview-cell">{electionId}</TableCell>                  
                    </TableRow>

                    <TableRow>
                        <TableCell colSpan={1}><Typography variant="h6" className="parties-cell">Polling Centre:</Typography></TableCell>
                        <TableCell colSpan={2} className="preview-cell">{electionPollingCentre}</TableCell>                  
                    </TableRow>

                    <TableRow>
                        <TableCell colSpan={1}><Typography variant="h6" className="parties-cell">Election Ward:</Typography></TableCell>
                        <TableCell colSpan={2} className="preview-cell">{electionWard}</TableCell>                  
                    </TableRow>

                    <TableRow>
                        <TableCell colSpan={1}><Typography variant="h6" className="parties-cell">Election LGA:</Typography></TableCell>
                        <TableCell colSpan={2} className="preview-cell">{electionLga}</TableCell>                  
                    </TableRow>

                    <TableRow>
                        <TableCell colSpan={1}><Typography variant="h6" className="parties-cell">State:</Typography></TableCell>
                        <TableCell colSpan={2} className="preview-cell">{electionState}</TableCell>                  
                    </TableRow>

                    <TableRow>
                        <TableCell colSpan={1}><Typography variant="h6" className="parties-cell">Country:</Typography></TableCell>
                        <TableCell colSpan={2} className="preview-cell">{electionFederal}</TableCell>                  
                    </TableRow>

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
                </Box>
            </>
            );
            }
          

export default ResultTable;
