import React, { useState } from 'react'
import TeacherTableAssignment from './TeacherTableAssignment'
import EditStudentForm from './EditStudentForm'
import { FetchURL } from '../../env/url'
import { Dialog, Grid, IconButton, Typography } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { styled } from '@material-ui/core/styles';

const TeacherTableCell = styled(TableCell)({
    border: '1px solid gray',
    padding: 0,
})


function TeacherTableRow({ studentData, assignmentOrder, currentUser, setCurrentUser }) {
    const [openEditStudentForm, setOpenEditStudentForm] = useState(false)
    const { student, assignments } = studentData
    const revisedOrder = []

    for (let i = 0; i < assignmentOrder.length; i++) {
        let currentAssignment = assignments.find(a => a.id === assignmentOrder[i].id)
        revisedOrder.push(currentAssignment)
    }

    const handleDeleteStudent = () => {
        let response = window.confirm(
          `Permanently remove "${student.name}" from the database?`
        )
        return response ? 
        fetch(`${FetchURL}students/${student.id}`,{
                method: "DELETE",
                headers: {
                    "Authentication": localStorage.getItem('jwt')
                }
             })
             .then(resp => resp.json())
             .then((json) => {
                if(json.error){
                    alert(json.error)
                } else {
                    const newStudentData = currentUser.studentData.filter(s=>s.student.id!==student.id)
                    setCurrentUser({...currentUser, studentData: newStudentData})
                    alert(json.message)
                }   
             }) 
        :null;
      }   
    
    return (
        <TableRow>
            <Dialog
                open={openEditStudentForm}
                onClose={() => setOpenEditStudentForm(false)}
                aria-label="edit student"
            >
                <EditStudentForm setOpenEditStudentForm={setOpenEditStudentForm} student={student} currentUser={currentUser} setCurrentUser={setCurrentUser}/>
            </Dialog>
            <TeacherTableCell>
                <div className="student-col" >
                    <Grid container direction="column" style={{height: "100%"}}justify="space-between" >
                        <Grid item>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Typography variant="h6">Name: {student.name}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography>Grade: {student.grade}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography style={{fontWeight:"bold"}}>ID: {student.school_id}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <IconButton aria-label="edit assignment" color="secondary" onClick={()=> setOpenEditStudentForm(true)}>
                                        <EditIcon />
                                    </IconButton> 
                                </Grid>
                                <Grid item>
                                    <IconButton aria-label="delete assignment" color="secondary" onClick={()=> handleDeleteStudent(student)}>
                                        <DeleteIcon />
                                    </IconButton>  
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </TeacherTableCell>

            {revisedOrder.map((assignment, i) => {
                if (!assignment) {
                    return (
                        <TeacherTableCell key={i}><div className="not-assigned">Not Assigned</div></TeacherTableCell>
                    )
                } else {
                    return (
                        <TeacherTableCell key={i}>
                            <TeacherTableAssignment assignmentDetail={assignment} currentUser={currentUser} setCurrentUser={setCurrentUser} />
                        </TeacherTableCell>
                    )
                }
            }
            )}
        </TableRow>
    )
}

export default TeacherTableRow