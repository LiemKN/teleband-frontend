import React from 'react'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { FetchURL } from '../../env/url'

const AdminAssignmentCard = ({ assignment, assignments, setAssignments, handleClickEditAssignment }) => {
    const handleDelete = () => {
    
        let response = window.confirm(
          `Permanently remove "${assignment.title}" from the database?`
        )
        return response ? 
        fetch(`${FetchURL}assignments/${assignment.id}`,{
                method: "DELETE",
                headers: {
                    "Authentication": localStorage.getItem('jwt')
                }
             })
             .then(resp => resp.json())
             .then((json) => {
                 if(json.error){
                     alert(json.error)
                 }else{
                const newAssignments = assignments.filter(a => a.id !== assignment.id)
                setAssignments(newAssignments)
                 }
             }) : 
        null;
      }   

    return(
        <Card style={{backgroundColor: "#eee2dc"}}>
            <Grid container alignItems="center" justify="space-between" style={{padding: "10px"}}>
                <Grid item>        
                    <Typography>{assignment.title}</Typography> 
                </Grid>
                <Grid item>
                    <IconButton aria-label="edit assignment" onClick={()=> handleClickEditAssignment(assignment)}>
                        <EditIcon />
                    </IconButton>  
                    <IconButton aria-label="delete assignment" onClick = {handleDelete}>
                        <DeleteIcon />
                    </IconButton>  
                </Grid>
            </Grid>
        </Card> 
    )
}

export default AdminAssignmentCard