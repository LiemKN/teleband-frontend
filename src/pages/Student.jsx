import React from 'react'
import StudentAssignmentTable from '../components/student_page/StudentAssignmentTable'
import { Typography, Grid, Paper, Button } from '@material-ui/core/'
import { useHistory } from 'react-router-dom'

function StudentPage({ currentUser, studentAssignments }) {
    const history = useHistory()

    function handleLogin(evt) {
        evt.preventDefault()
        history.push('/login/student')
    }
    return (
        <div style={{width: "70%", margin:"auto"}}>
            {
                currentUser ?
                    currentUser.student_assignments ?
                        <div >
                            <Paper style={{width:"100%", marginLeft:"auto", marginBottom:"20px", marginTop: "20px"}}>
                                <Grid container direction = "row" justify="space-between" style={{padding: "10px"}}>
                                    <Grid item>
                                        <Typography variant="h5" display="inline">Name: {currentUser.name}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h5" display="inline" style={{margin:"40px"}}>Student ID: {currentUser.school_id}</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                            <StudentAssignmentTable currentUser={currentUser} studentAssignments={studentAssignments} />
                        </div > 
                        :<div>
                            <Paper style={{width:"100%", marginLeft:"auto", marginBottom:"20px", marginTop: "20px", padding:"20px"}}>
                                <Typography align="center" variant="h4">No Assignments Found</Typography>
                            </Paper>
                        </div> 
                    :<div>
                        <Paper style={{width:"100%", marginLeft:"auto", marginBottom:"20px", marginTop: "20px", padding:"20px"}}>
                            <Typography align="center" variant="h4">Please
                                <Button variant="contained" style={{ marginLeft: '1rem' }} color="primary" href="/login/student" onClick={(evt) => handleLogin(evt)} >
                                        Login
                                </Button>
                            </Typography>
                        </Paper>
                    </div>
                }
        </div>
    )
}

export default StudentPage
