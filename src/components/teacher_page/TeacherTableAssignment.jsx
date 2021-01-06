import React, { useState } from 'react'
import { Grid, IconButton, Button, Typography, TextField } from '@material-ui/core/'
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import '../../style/CustomAudioPlayer.css';
import green from '@material-ui/core/colors/green';
import { FetchURL } from '../../env/url'


function TeacherTableAssignment({ assignmentDetail, currentUser, setCurrentUser }) {
    const { student_assignment, category } = assignmentDetail
    const { student_audio, submitted, student_notation_url, student_response } = student_assignment
    const [tone, setTone] = useState(student_assignment.tone)
    const [rhythm, setRhythm] = useState(student_assignment.rhythm)
    const [expression, setExpression] = useState(student_assignment.expression)
    const [locked, setLocked] = useState(student_assignment.graded)

    const handleGraded = () => {
        setLocked(true)
        const payload = {expression, rhythm, tone}
        fetch(`${FetchURL}student_assignments/${student_assignment.id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                "Authentication": localStorage.getItem('jwt')
              },
            body: JSON.stringify(payload)
        })
        .then(resp => resp.json())
        .then(json => {
            if(json.error){
                alert(json.message)
            } else {
                // const updatedAssignments = currentUser.studentData.map(data => {
                //     return data.assignments.map(a => {
                //         if(a.student_assignment.id===json.student_assignment.id){
                //             return {...a, student_assignment: json.student_assignment}
                //         }else{
                //             return a
                //         }
                //     } )
                // })
                // setCurrentUser({...currentUser, assignments: updatedAssignments})
                const updatedStudentData = currentUser.studentData.map(studentData => {
                        const updatedAssignments = studentData.assignments.map(a=>{
                            if(a.student_assignment.id===json.student_assignment.id){
                                console.log("yay!", {...a, student_assignment: json.student_assignment})
                                return {...a, student_assignment: json.student_assignment}
                            }else{
                                return a
                            }
                        })
                        return {...studentData, assignments: updatedAssignments}
                })
                setCurrentUser({...currentUser, studentData: updatedStudentData})
            }
        })
    }

    const adjustRatingforRange = (num) => {
        let score = parseInt(num);
        if (score < 0) {
            score = 0
        } else if (score > 5) {
            score = 5
        }
        return score
    }

    const assignmentView = () => {
        switch(category){
            case 'audio':
                if(student_audio!==""){
                    return (
                        <AudioPlayer
                            autoPlay={false}
                            autoPlayAfterSrcChange={false}
                            layout="horizontal-reverse"
                            customAdditionalControls={[]}
                            showJumpControls={false}
                            customVolumeControls={[]}
                            src={student_audio}
                        />
                    )
                } else {
                    return (
                        <Grid item>
                                <Typography align="center" style={{backgroundColor:"#edc7b7"}}>NO AUDIO SUBMITTED</Typography>
                        </Grid>
                    )
                }
            case 'response':
                if(student_response!==""){
                    return(
                        <TextField
                            id="outlined-multiline-static"
                            aria-label="student response"
                            multiline
                            rows={4}
                            defaultValue={student_response}
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    )
                }else{
                    return (
                        <Grid item>
                            <Typography align="center" style={{backgroundColor:"#edc7b7"}}>NO RESPONSE SUBMITTED</Typography>
                        </Grid>
                    )
                }
            case 'creative':
                if(student_audio!=="" && student_notation_url!==""){
                    return (
                        <>
                            <Grid item>
                                <AudioPlayer
                                    autoPlay={false}
                                    autoPlayAfterSrcChange={false}
                                    layout="horizontal-reverse"
                                    customAdditionalControls={[]}
                                    showJumpControls={false}
                                    customVolumeControls={[]}
                                    src={student_audio}
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="secondary" onClick={()=>window.open(student_notation_url)}>Notation Pdf</Button>
                            </Grid>
                        </>
                    )
                } else if(student_audio!==""){
                    return(
                        <>
                            <Grid item>
                                <AudioPlayer
                                    autoPlay={false}
                                    autoPlayAfterSrcChange={false}
                                    layout="horizontal-reverse"
                                    customAdditionalControls={[]}
                                    showJumpControls={false}
                                    customVolumeControls={[]}
                                    src={student_audio}
                                />
                            </Grid>
                            <Grid item>
                                <Typography align="center" style={{backgroundColor:"#edc7b7"}}>NO NOTATION SUBMITTED</Typography>
                            </Grid>
                        </>
                    )
                } else {
                    return (
                        <Grid item>
                                <Typography align="center" style={{backgroundColor:"#edc7b7"}}>NO AUDIO SUBMITTED</Typography>
                        </Grid>
                    )
                }
            default: return "No assignment available"
        }   
    }

    return (
        <div id="teacher-table-assignment">
            {submitted?
                <Grid container direction="column">
                    <Grid item>
                    <Grid container justify="flex-end">
                        <Grid item>
                            {category==="response"?
                                <IconButton disabled>
                                    <LockIcon style={{ color: green[200] }}/>
                                </IconButton>
                            :
                                locked?
                                <IconButton onClick={()=>setLocked(false)}>
                                    <LockIcon style={{ color: green[500] }}/>
                                </IconButton>
                                :<IconButton onClick={handleGraded}>
                                    <LockOpenIcon style={{ color: "#bab2b5" }}/>
                                </IconButton>
                            }
                        </Grid>
                    </Grid>
                </Grid>
                {assignmentView()}
                    <Grid item>
                        <Grid container justify="space-around" style={{padding:"5px"}}>
                            <Grid item>
                                <TextField
                                    disabled={locked}
                                    variant="outlined"
                                    margin="normal"
                                    id="assignment-rhythm"
                                    label="R"
                                    name="assignment-rhythm"
                                    autoComplete="assignment-rhythm"
                                    size="small"
                                    InputProps={{ inputProps: { min: 1, max: 5, step:1 } }}
                                    type = "number" 
                                    onChange = {(e)=>setRhythm(adjustRatingforRange(e.target.value))} 
                                    value = {rhythm}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    disabled={locked}
                                    variant="outlined"
                                    margin="normal"
                                    id="assignment-tone"
                                    label="T"
                                    name="assignment-tone"
                                    autoComplete="assignment-tone"
                                    size="small"
                                    InputProps={{ inputProps: { min: 1, max: 5, step:1 } }}
                                    type = "number" 
                                    onChange = {(e)=>setTone(adjustRatingforRange(e.target.value))} 
                                    value = {tone}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    disabled={locked}
                                    variant="outlined"
                                    margin="normal"
                                    id="assignment-expression"
                                    label="E"
                                    name="assignment-expression"
                                    autoComplete="assignment-expression"
                                    size="small"
                                    InputProps={{ inputProps: { min: 1, max: 5, step:1 } }}
                                    type = "number" 
                                    onChange = {(e)=>setExpression(adjustRatingforRange(e.target.value))} 
                                    value = {expression}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            :
                <Typography align="center" style={{backgroundColor:"#ac3b61", color:"#fffafa"}}>NOT SUBMITTED</Typography>
            }
        </div>
    )
}

export default TeacherTableAssignment