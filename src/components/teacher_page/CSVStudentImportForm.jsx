import React, { useState } from 'react'
import { Button, DialogContent, Grid, Input, InputLabel, Typography } from '@material-ui/core'
import { FetchURL } from '../../env/url'

function CSVStudentImportForm ({ setOpenCSVStudentImportForm, currentUser, setCurrentUser }) {
    const [csv, setCsv] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('csv', csv)
        fetch(`${FetchURL}students/${currentUser.teacher.id}/classlist`, {
            method: "POST",
            body: formData,
            headers: {
                "Authentication": localStorage.getItem('jwt')
            }
          }).then(resp=>resp.json())
          .then(json => {
              if(json.error){
                  alert(json.message)
              }
              else{
                const newStudentData = [...currentUser.studentData, ...json.studentData]
                setCurrentUser({...currentUser, studentData: newStudentData})
                setOpenCSVStudentImportForm(false)
                alert(json.message)
              }
            })
    }

    return(
        <DialogContent>
            <Grid container direction="column" alignItems="center" style={{padding: "2em"}}> 
                <Grid item style={{marginBottom:"1em"}}>
                    <Typography align="center" variant="h4">Import Student Data</Typography>
                </Grid>
                <Grid item>
                <form onSubmit={handleSubmit}>
                    <Grid container direction="column" spacing={1}>
                        <Grid item>
                            <InputLabel htmlFor="student-data-csv">Upload CSV:</InputLabel>
                            <Input id="student-data-csv" type="file" accept=".csv" name="student-data-csv" onChange={(e) => setCsv(e.target.files[0])} />
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

export default CSVStudentImportForm