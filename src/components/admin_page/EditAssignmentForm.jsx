import React from 'react'
import { TextField, Button, Input, InputLabel, DialogContent, Grid, Typography } from '@material-ui/core';
import { FetchURL } from '../../env/url'

function EditAssignmentForm({ activeAssignment, handleCloseEditAssignmentForm, assignments, setAssignments, formType }) {
  const [title, setTitle] = React.useState(activeAssignment.title);
  const [instructions, setInstructions] = React.useState(activeAssignment.instructions);
  const [pdf, setPdf] = React.useState(null);
  const [accompanimentFile, setAccompanimentFile] = React.useState(null)
  const [playingSampleFile, setPlayingSampleFile] = React.useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if(title === "" || instructions=== "" || pdf===""){
      alert("Please fill in all required fields.")
    } else if ((accompanimentFile==="" || playingSampleFile === "") && formType !== 'response'){
      alert("Please fill in all required fields.")
    } else {
      const formData=new FormData()
        formData.append('title', title)
        formData.append('instructions', instructions)
        formData.append('pdf', pdf)
        formData.append('formType', formType)
        if(formType!=='response'){
          formData.append('accompaniment', accompanimentFile)
          formData.append('playing_sample', playingSampleFile)
        }
      fetch(`${FetchURL}assignments/${activeAssignment.id}`, {
          method: "PATCH",
          body: formData,
          headers: {
            "Authentication": localStorage.getItem('jwt')
          }
        }).then(resp=>resp.json())
        .then(json => {
          const newAssignmentList = assignments.map(a=>{
            if(a.id===json.assignment.id){
              return json.assignment
            }else{
              return a
            }
          })
          setAssignments(newAssignmentList)
          handleCloseEditAssignmentForm()
        })
      }
  }

  return (
    <DialogContent>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container direction="column" spacing={1}>
          <Grid item>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="title"
              label="Title"
              type="text"
              id="title"
              value={title}
              onChange = {(e) => setTitle(e.target.value)} 
            />
          </Grid>
          <Grid item>
            <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            multiline
            rows={10}
            name="instructions"
            label="Instructions"
            type="text"
            id="instructions"
            value={instructions}
            onChange = {(e) => setInstructions(e.target.value)}
            />
          </Grid>
          <Grid item>
            <InputLabel htmlFor="assignment-pdf"><Typography style={{textDecoration:"underline", cursor:"pointer"}} onClick={()=>window.open(activeAssignment.pdf_url)}>View Current Pdf</Typography></InputLabel>
            <Input id="assignment-pdf" type="file" accept="application/pdf" name="assignment-pdf" onChange={(e) => setPdf(e.target.files[0])}></Input>
          </Grid>
          {formType==="response"?
          null
          :
          <>
            <Grid item>
              <InputLabel htmlFor="assignment-sample-audio"><Typography style={{textDecoration:"underline", cursor:"pointer"}} onClick={()=>window.open(activeAssignment.playing_sample_url)}>View Current Playing Sample</Typography></InputLabel>
              <Input id="assignment-sample-audio" type="file" accept="audio/mp3" name="assignment-playing-sample" onChange={(e) => setPlayingSampleFile(e.target.files[0])}></Input>
            </Grid>
            <Grid item>
              <InputLabel htmlFor="assignment-accompaniment"><Typography style={{textDecoration:"underline", cursor:"pointer"}} onClick={()=>window.open(activeAssignment.accompaniment_url)}>View Current Accompaniment</Typography></InputLabel>
              <Input id="assignment-accompaniment" type="file" accept="audio/mp3" name="assignment-accompaniment" onChange={(e) => setAccompanimentFile(e.target.files[0])}></Input>
            </Grid>
          </>
        }
          <Grid item>
            <Button fullWidth variant="contained" color="primary" type="submit">Submit</Button>  
          </Grid>
        </Grid>
      </form>
    </DialogContent>
  );
}

export default EditAssignmentForm