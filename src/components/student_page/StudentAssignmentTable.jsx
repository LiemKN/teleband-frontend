import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core/';
import { useHistory } from 'react-router-dom'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

const useStyles = makeStyles({
  table: {
    width: "100%"
  },
});

function createData(assignment, submitted) {
  return { assignment, submitted};
}

function StudentAssignmentTable({currentUser, studentAssignments}) {

  console.log('StudentAssignmentTable({currentUser, studentAssignments})', currentUser, studentAssignments)
  const classes = useStyles();
  const history = useHistory();

  const handleClickAssignment = (assignmentId) => {
      history.push(`/assignments/${assignmentId}`)
    }
    
  const rows = studentAssignments !== undefined ? studentAssignments.map(a => {
    return createData(a.assignment, a.submitted)
  }) : []

  return (
    <div>
      {currentUser?
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="assignment-table">
          <TableHead>
            <TableRow>
              <TableCell style={{fontWeight: "bold"}} >ASSIGNMENTS</TableCell>
              <TableCell style={{fontWeight: "bold"}} align="center">SUBMITTED</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.sort((a,b)=> a.assignment.title.toLowerCase()<b.assignment.title.toLowerCase()? -1 : 1).map((row) => (
              <TableRow key={row.assignment.id} style = {{cursor: "pointer"}} onClick={() => handleClickAssignment(row.assignment.id)}>
                <TableCell component="th" scope="row">{row.assignment.title}</TableCell>
                <TableCell align="center">{row.submitted?<CheckCircleIcon style={{color: "#4caf50"}}/>:<RadioButtonUncheckedIcon />}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      :null}
      </div>
  );
}

export default StudentAssignmentTable