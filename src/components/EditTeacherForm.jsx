import React, { useState } from 'react'
import { Button, DialogContent, Grid, TextField, Typography } from '@material-ui/core'
import { FetchURL } from '../env/url'

function EditTeacherForm({ teachers, setTeachers, setOpenEditTeacherForm, activeTeacher, currentUser, setCurrentUser }) {
    const [name, setName] = useState(activeTeacher.name)
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState(activeTeacher.email)

    const handleSubmit = (e) => {
        e.preventDefault()
        fetch(`${FetchURL}teachers/${activeTeacher.id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                "Authentication": localStorage.getItem('jwt')
              },
            body: JSON.stringify({ name, email, password })
          }).then(resp=>resp.json())
          .then(json => {
              if(json.error){
                  alert(json.message)
              }else{
                  if(teachers){
                    const newTeacherList = teachers.map(t =>{
                        if(t.id === json.teacher.id){
                            return json.teacher
                        }else{
                            return t
                        }
                    })
                    setTeachers(newTeacherList)
                    setOpenEditTeacherForm(false)
                  }else{
                    setCurrentUser({...currentUser, teacher: json.teacher})
                    setOpenEditTeacherForm(false)
                  }
                  alert(json.message)
              }
          })
    }

    return(
        <DialogContent>
            <Grid container direction="column" alignItems="center" style={{padding: "2em"}}> 
                <Grid item style={{marginBottom:"1em"}}>
                    {
                        teachers?
                        <Typography align="center" variant="h4">Edit Teacher</Typography>
                        :
                        <Typography align="center" variant="h4">Edit Account</Typography>
                    }
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
                            required
                            fullWidth
                            name="email"
                            label="Email"
                            type="email"
                            id="email"
                            value={email}
                            onChange = {(e) => setEmail(e.target.value)} 
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="password"
                            label="Change Password"
                            type="text"
                            id="password"
                            value={password}
                            onChange = {(e) => setPassword(e.target.value)} 
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

export default EditTeacherForm
