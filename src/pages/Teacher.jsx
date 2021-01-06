import React, { useState } from 'react'
import { Button, Dialog, Grid, Paper, Typography } from '@material-ui/core'
import { CSVLink } from 'react-csv'
import EditIcon from '@material-ui/icons/Edit';
import PublishIcon from '@material-ui/icons/Publish';
import GetAppIcon from '@material-ui/icons/GetApp';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EditTeacherForm from '../components/EditTeacherForm'
import NewStudentForm from '../components/teacher_page/NewStudentForm'
import CSVStudentImportForm from '../components/teacher_page/CSVStudentImportForm'
import TeacherTable from '../components/teacher_page/TeacherTable'
import '../style/TeacherPage.css'
import { useHistory } from 'react-router-dom'


function TeacherPage({ currentUser, setCurrentUser }) {
    //const [updateAssignment, updateAssignmentSet] = useState({})
    const [openEditTeacherForm, setOpenEditTeacherForm] = useState(false)
    const [openNewStudentForm, setOpenNewStudentForm] = useState(false)
    const [openCSVStudentImportForm, setOpenCSVStudentImportForm] = useState(false)
    let assignmentOrder=[]
    let titles=[]
    
    const history = useHistory()

    function handleLogin(evt) {
        evt.preventDefault()
        history.push('/login/teacher')
    }

    if(currentUser && currentUser.studentData.length>0){
        assignmentOrder = currentUser.studentData[0].assignments.sort((a,b) => a.title.toLowerCase() > b.title.toLowerCase() ? 1: -1)
        titles = assignmentOrder.map(a =>a.title)
    }
    

    // const addAssignment = (data, student_assignment_ID) => {
    //     updateAssignment[student_assignment_ID] = data
    //     updateAssignmentSet(updateAssignment)
    // }

    // Update call made here
    // const updateGrades = () => {
    //     console.log(updateAssignment)
    //     fetch(`${FetchURL}teacher/updategrades`, {
    //         method: "PATCH",
    //         headers: {
    //             "Authentication": localStorage.getItem('jwt'),
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ updateAssignment: updateAssignment })
    //     }).then(resp => resp.json())
    //         .then(teacher => {
    //             setCurrentUser(teacher)
    //         })
    // }

    const row = (singleStudentData) => {
        const assignmentObject = {}
        titles.forEach(t =>{
            const found_assignment=singleStudentData.assignments.find(sa => 
                sa.title===t
            )
            let value
            if(found_assignment.student_assignment.graded){
              value = `R:${found_assignment.student_assignment.rhythm} T:${found_assignment.student_assignment.tone} E:${found_assignment.student_assignment.expression}`
            } else if(!found_assignment.student_assignment.submitted) {
              value = "Not submitted"
            } else {
              value = "Not graded"
            }
            assignmentObject[t]= value
        })
        const nameObj = {"Name": singleStudentData.student.name}
        return{...nameObj, ...assignmentObject}
      }
    function csvData(){
        return(currentUser.studentData.map(s => row(s)))
    }

    return (
        <div style={{margin: "1em"}}>
            {
                currentUser ?
                    currentUser.teacher ?
                        <>
                            <Dialog
                                open={openEditTeacherForm}
                                onClose={() => setOpenEditTeacherForm(false)}
                                aria-label="edit teacher"
                            >
                            <EditTeacherForm setOpenEditTeacherForm={setOpenEditTeacherForm} activeTeacher={currentUser.teacher} currentUser={currentUser} setCurrentUser={setCurrentUser}/>
                            </Dialog>
                            <Dialog
                                open={openNewStudentForm}
                                onClose={() => setOpenNewStudentForm(false)}
                                aria-label="add student"
                            >
                            <NewStudentForm setOpenNewStudentForm={setOpenNewStudentForm} currentUser={currentUser} setCurrentUser={setCurrentUser}/>
                            </Dialog>
                            <Dialog
                                open={openCSVStudentImportForm}
                                onClose={() => setOpenCSVStudentImportForm(false)}
                                aria-label="import student data"
                            >
                            <CSVStudentImportForm setOpenCSVStudentImportForm={setOpenCSVStudentImportForm} currentUser={currentUser} setCurrentUser={setCurrentUser}/>
                            </Dialog>
                            <Paper style={{width:"100%", marginLeft:"auto", marginBottom:"20px", marginTop: "20px"}}>
                                <Grid container direction = "row" justify="space-between" style={{padding: "10px"}}>
                                    <Grid item xs={12} sm={4}>
                                        <Grid container direction="column" spacing={1}>
                                            <Grid item>
                                                <Typography variant="h5" display="inline">Name: {currentUser.teacher.name}</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="h5" display="inline">Email: {currentUser.teacher.email}</Typography>
                                            </Grid>  
                                            <Grid item>
                                                <Button variant="contained" color="secondary" size="small" onClick={()=>setOpenEditTeacherForm(true)} endIcon={<EditIcon />}>Edit Account</Button>
                                            </Grid>    
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} sm={8}>
                                        <Grid container justify="flex-end" spacing={1}>
                                            <Grid item>
                                                <Button variant="contained" color="secondary" size="small" onClick={()=>setOpenNewStudentForm(true)} endIcon={<PersonAddIcon />}>Add Single Student</Button>
                                            </Grid>
                                            <Grid item>
                                                <Button variant="contained" color="secondary" size="small" onClick={()=>setOpenCSVStudentImportForm(true)} endIcon={<PublishIcon />}>Upload Students</Button>
                                            </Grid>
                                            <Grid item>
                                                <CSVLink data={csvData()} filename={"teleband_grades.csv"} style={{textDecoration:"none"}}>
                                                    <Button variant="contained" color="secondary" size="small" endIcon={<GetAppIcon />}>
                                                        Download Grades
                                                    </Button>
                                                </CSVLink>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                            {currentUser.studentData.length>0?
                                <TeacherTable studentData={currentUser.studentData} currentUser={currentUser} setCurrentUser={setCurrentUser} />
                            :
                                null
                            }
                            
                        </>
                    :  
                    <Paper style={{width:"100%", marginLeft:"auto", marginBottom:"20px", marginTop: "20px", padding:"20px"}}>
                        <Typography align="center" variant="h4">Please
                            <Button variant="contained" style={{marginLeft: '1rem'}} color="primary" href="/login/teacher" onClick={(evt) => handleLogin(evt)} >
                                Login
                            </Button>
                        </Typography>
                    </Paper>
                :
                <Paper style={{width:"100%", marginLeft:"auto", marginBottom:"20px", marginTop: "20px", padding:"20px"}}>
                        <Typography align="center" variant="h4">Please
                            <Button variant="contained" style={{marginLeft: '1rem'}} color="primary" href="/login/teacher" onClick={(evt) => handleLogin(evt)} >
                                Login
                            </Button>
                        </Typography>
                </Paper>
            }
        </div>
    )
}

export default TeacherPage