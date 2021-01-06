import React, { useState } from 'react'
import { Button, DialogContent, Grid, TextField, Typography } from '@material-ui/core'
import { FetchURL } from '../../env/url'

function EditStudentForm({ currentUser, setCurrentUser, setOpenEditStudentForm, student }) {
    const [name, setName] = useState(student.name)
    const [grade, setGrade] = useState(student.grade)
    // const [classes, setClasses] = useState("") for future use when adding classes

    const handleSubmit = (e) => {
        e.preventDefault()
        fetch(`${FetchURL}students/${student.id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                "Authentication": localStorage.getItem('jwt')
            },
            body: JSON.stringify({ name, grade })
        }).then(resp=>resp.json())
        .then(json => {
            if(json.error){
                alert(json.message)
            }else{
            const newStudentData = currentUser.studentData.map(s => {
                if(s.student.id === json.studentData.student.id){
                    return json.studentData
                }else{
                    return s
                }
            })
            setCurrentUser({...currentUser, studentData: newStudentData})
            setOpenEditStudentForm(false)
            alert(json.message)
            }
        })
    }

    return(
        <DialogContent>
            <Grid container direction="column" alignItems="center" style={{padding: "2em"}}> 
                <Grid item style={{marginBottom:"1em"}}>
                    <Typography align="center" variant="h4">Edit Student</Typography>
                </Grid>
                <Grid item>
                <form onSubmit={handleSubmit}>
                    <Grid container direction="column" spacing={1}>
                        <Grid item>
                            <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="name"
                            label="Name"
                            type="text"
                            id="name"
                            value={name}
                            onChange = {(e) => setName(e.target.value)} 
                            />
                        </Grid>
                        <Grid item>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required
                            id="grade"
                            label="Grade level"
                            name="grade"
                            autoComplete="grade"
                            InputProps={{ inputProps: { min: 1, max: 12, step: 1 } }}
                            type = "number" 
                            onChange = {(e)=>setGrade(e.target.value)} 
                            value = {grade}
                        />
                        </Grid>
                        <Grid item>
                            <Button fullWidth variant="contained" color="primary" type="submit">Submit</Button>  
                        </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
         </DialogContent>
    )
}

export default EditStudentForm
