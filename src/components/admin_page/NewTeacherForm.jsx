import React, { useState } from 'react'
import { Button, DialogContent, Grid, TextField, Typography } from '@material-ui/core'
import { FetchURL } from '../../env/url'

function NewTeacherForm({ teachers, setTeachers, setOpenTeacherForm }) {
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('fetchurl', FetchURL)
        fetch(`${FetchURL}teachers`, {
            method: "POST",
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
                const newTeacherList = [...teachers, json.teacher]
                setTeachers(newTeacherList)
                setOpenTeacherForm(false)
                alert(json.message)
              }
          })
    }

    return(
        <DialogContent>
            <Grid container direction="column" alignItems="center" style={{padding: "2em"}}> 
                <Grid item style={{marginBottom:"1em"}}>
                    <Typography align="center" variant="h4">Add a Teacher</Typography>
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
                            required
                            fullWidth
                            name="password"
                            label="Password"
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

export default NewTeacherForm
