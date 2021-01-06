import React from 'react'
import { TextField, Button, Input, InputLabel, DialogContent, Grid } from '@material-ui/core';
import { FetchURL } from '../../env/url'

function NewAssignmentForm({ assignments, setAssignments, formType, setOpenAssignmentForm }) {
  const [title, setTitle] = React.useState("");
  const [instructions, setInstructions] = React.useState("");
  const [pdf, setPdf] = React.useState("");
  const [accompanimentFile, setAccompanimentFile] = React.useState("")
  const [playingSampleFile, setPlayingSampleFile] = React.useState("")

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
      fetch(`${FetchURL}assignments`, {
          method: "POST",
          body: formData,
          headers: {
            "Authentication": localStorage.getItem('jwt')
          }
        }).then(resp=>resp.json())
        .then(json => {
          if(json.error){
            alert(json.error)
          }else{
            const newAssignmentList = [...assignments, json.assignment]
            setAssignments(newAssignmentList)
            setOpenAssignmentForm(false)
            alert('Successfully created assignment.')
          }
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
            <InputLabel htmlFor="assignment-pdf">Notation/Instructional PDF:</InputLabel>
            <Input id="assignment-pdf" type="file" accept="application/pdf" name="assignment-pdf" onChange={(e) => setPdf(e.target.files[0])} />
          </Grid>
          {formType==="response"?
          null
          :
          <>
            <Grid item>
              <InputLabel htmlFor="assignment-sample-audio">Playing Sample:</InputLabel>
              <Input id="assignment-sample-audio" type="file" accept="audio/mp3" name="assignment-playing-sample" onChange={(e) => setPlayingSampleFile(e.target.files[0])} />
            </Grid>
            <Grid item>
              <InputLabel htmlFor="assignment-accompaniment">Accompaniment Audio:</InputLabel>
              <Input id="assignment-accompaniment" type="file" accept="audio/mp3" name="assignment-accompaniment" onChange={(e) => setAccompanimentFile(e.target.files[0])} />
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

export default NewAssignmentForm