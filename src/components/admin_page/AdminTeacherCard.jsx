import React from 'react'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { FetchURL } from '../../env/url'

const AdminTeacherCard = ({ teacher, teachers, setTeachers, handleClickEditTeacher }) => {
   
    const handleDeleteTeacher = () => {
        let response = window.confirm(
          `Permanently remove "${teacher.name}" from the database?`
        )
        return response ? 
        fetch(`${FetchURL}teachers/${teacher.id}`, {
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
                    const newTeachers = teachers.filter(a => a.id !== teacher.id)
                    setTeachers(newTeachers)
                }   
             }) : 
        null;
      }   

    return(
        <Card style={{backgroundColor: "#eee2dc"}}>
            <Grid container alignItems="center" justify="space-between" style={{padding: "10px"}}>
                <Grid item>        
                    <Typography>{teacher.name}</Typography> 
                </Grid>
                <Grid item>
                    <IconButton aria-label="edit teacher" onClick={()=> handleClickEditTeacher(teacher)}>
                        <EditIcon />
                    </IconButton>  
                    <IconButton aria-label="delete teacher" onClick = {handleDeleteTeacher}>
                        <DeleteIcon />
                    </IconButton>  
                </Grid>
            </Grid>
        </Card> 
    )
}

export default AdminTeacherCard