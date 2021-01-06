import React, { useState, useEffect } from 'react'
import NewAssignmentContainer from '../components/admin_page/NewAssignmentContainer'
import EditAssignmentContainer from '../components/admin_page/EditAssignmentContainer'
import NewTeacherForm from '../components/admin_page/NewTeacherForm'
import EditTeacherForm from '../components/EditTeacherForm'
import AdminAssignmentCard from '../components/admin_page/AdminAssignmentCard'
import AdminTeacherCard from '../components/admin_page/AdminTeacherCard'
import { Paper, Typography, Grid, Dialog, Button } from '@material-ui/core'
import { FetchURL } from '../env/url'
import { CSVLink } from 'react-csv'

function Admin(){
const [assignments, setAssignments]=useState([])
const [teachers, setTeachers]=useState([])
const [openAssignmentForm, setOpenAssignmentForm]=useState(false) //new assignment modal
const [openTeacherForm, setOpenTeacherForm]=useState(false)
const [openAssignmentFormEdit, setOpenAssignmentFormEdit]=useState(false)
const [openEditTeacherForm, setOpenEditTeacherForm]=useState(false)
const [activeAssignment, setActiveAssignment]=useState(null) //choose and assignment for editing
const [activeTeacher, setActiveTeacher]=useState(null)

    useEffect(() => {
        fetch(`${FetchURL}assignments`, {
            headers: {
                "Authentication": localStorage.getItem('jwt')
            }})
        .then(resp => resp.json())
        .then(assignments => {
        setAssignments(assignments)
        })
        fetch(`${FetchURL}teachers`, {
            headers: {
                "Authentication": localStorage.getItem('jwt')
            }
        })
        .then(resp => resp.json())
        .then(teachers => {
        setTeachers(teachers)
        })
    }
    , [])
    
    const handleCloseEditAssignmentForm=()=>{
        setOpenAssignmentFormEdit(false)
    }

    const handleClickEditAssignment=(a)=>{
        setActiveAssignment(a)
        setOpenAssignmentFormEdit(true)
    }

    const handleClickEditTeacher=(t)=>{
        setActiveTeacher(t)
        setOpenEditTeacherForm(true)
    }
    
    function csvData(){
        // return sortFunction().map(lead => {
        //     return {
        //         "ID": lead.id_str,
        //         "Detected Location": lead.detected_location.name,
        //         "State": lead.state,
        //         "Population": (lead.population===0? "N/A" : lead.population),
        //         "Relevance": lead.relevance_score+"%",
        //         "Text": lead.text,
        //         "Keyword": lead.keyword,
        //         "URL": lead.url,
        //         "DataSource": lead.data_source, 
        //         "PublishedDate": lead.published_date,
        //         "ClosestClient": lead.nearest_client.name,
        //         "ClientMunicipality": lead.nearest_client.municipality.name,
        //         "ClientDistance": lead.distance_to_client_site+" mi",
        //         "LeadSource": "AIT",
        //         "Name": "Unknown",
        //         "UpdatedOn": lead.updated_on
        //     }
        // })
        // const assignmentOrder = currentUser.studentData[0].assignments.sort((a,b) => a.title.toLowerCase() > b.title.toLowerCase() ? 1: -1 )
        
        // currentUser.studentData.map(s=> {
        //     for (let i = 0; i < assignmentOrder.length; i++) {
        //         let currentAssignment = assignments.find(a => a.id === assignmentOrder[i].id)
        //         revisedOrder.push(currentAssignment)
        //     }
        //     return({
        //         "Name": s.student.name
        //     })
        // })

        return(
           [{"hi":"hi"}]
        )
    }

    return(
        <div style={{margin: "1em"}}>
            <Grid container direction="column" spacing={2} style={{marginTop: "1em"}}>
                <Dialog
                    open={openAssignmentForm}
                    onClose={() => setOpenAssignmentForm(false)}
                    aria-label="create a new assignment"
                >
                    <NewAssignmentContainer setOpenAssignmentForm={setOpenAssignmentForm} assignments={assignments} setAssignments={setAssignments} />
                </Dialog>
                <Dialog
                    open={openAssignmentFormEdit}
                    onClose={() => handleCloseEditAssignmentForm()}
                    aria-label="edit assignment"
                >
                    <EditAssignmentContainer activeAssignment={activeAssignment} handleCloseEditAssignmentForm={handleCloseEditAssignmentForm} assignments={assignments} setAssignments={setAssignments} />
                </Dialog>
                <Dialog
                    open={openTeacherForm}
                    onClose={() => setOpenTeacherForm(false)}
                    aria-label="add a new teacher"
                >
                    <NewTeacherForm setOpenTeacherForm={setOpenTeacherForm} teachers={teachers} setTeachers={setTeachers} />
                </Dialog>
                <Dialog
                    open={openEditTeacherForm}
                    onClose={() => setOpenEditTeacherForm(false)}
                    aria-label="edit teacher"
                >
                    <EditTeacherForm setOpenEditTeacherForm={setOpenEditTeacherForm} teachers={teachers} setTeachers={setTeachers} activeTeacher={activeTeacher} />
                </Dialog>
                <Grid item>
                    <Paper style={{padding:"20px"}}>
                        <Typography align="center"variant="h2">Admin Panel</Typography>
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper style={{padding:"20px"}}>
                        <Grid container justify="flex-start" spacing={2}>
                            <Grid item>
                                <Button variant="contained" color="secondary" onClick={()=>setOpenAssignmentForm(true)}>Create Assignment</Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="secondary" onClick={()=>setOpenTeacherForm(true)}>Add Teacher</Button>
                            </Grid>
                            <Grid item>
                                <CSVLink data={csvData()} filename={"teleband_student_data.csv"} style={{textDecoration:"none"}}>
                                    <Button variant="contained" color="secondary">
                                        Export Student Grades
                                    </Button>
                                </CSVLink>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper style={{padding:"20px"}}>
                        <Typography align="left" variant="h4" style={{marginBottom:".5em"}}>All Assignments</Typography>
                        <Grid container direction="row" justify = "flex-start" alignItems="flex-start" spacing= {2}>
                            {assignments.sort((a,b)=> a.title.toLowerCase()<b.title.toLowerCase()? -1 : 1).map(assignment=> <Grid item xs={6} md={4} xl={4} key={assignment.id}><AdminAssignmentCard key={assignment.id} assignment={assignment} assignments={assignments} setAssignments={setAssignments} handleClickEditAssignment={handleClickEditAssignment} /></Grid>)}
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper style={{padding:"20px"}}>
                        <Typography align="left" variant="h4" style={{marginBottom:".5em"}}>All Teachers</Typography>
                        <Grid container direction="row" justify = "flex-start" alignItems="flex-start" spacing= {2}>
                            {teachers.sort((a,b)=> a.name.toLowerCase()<b.name.toLowerCase()? -1 : 1).map(teacher=> <Grid item xs={6} md={4} xl={4} key={teacher.id}><AdminTeacherCard key={teacher.id} teacher={teacher} teachers={teachers} setTeachers={setTeachers} handleClickEditTeacher={handleClickEditTeacher} /></Grid>)}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default Admin