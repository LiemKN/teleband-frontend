import React, { useEffect, useState } from 'react'
import {
  Button,
  Box,
  IconButton,
  Grid,
  Input,
  InputLabel,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core/'
import MicIcon from '@material-ui/icons/Mic'
import StopIcon from '@material-ui/icons/Stop'
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic'
import CloseIcon from '@material-ui/icons/Close'
import { FetchURL } from '../env/url'
import StarIcon from '@material-ui/icons/Star'
import AudioPlayer from 'react-h5-audio-player'
import Embed from 'flat-embed'
import 'react-h5-audio-player/lib/styles.css'
import '../style/CustomAudioPlayer.css'

function StudentAssignment({
  assignmentId,
  currentUser,
  currentUserType,
  studentAssignments,
  setStudentAssignments,
}) {
  const [assignment, setAssignment] = useState({})
  const [active, activeSet] = useState(false)
  const [mediaRecorder, mediaRecorderSet] = useState(null)
  const [audioBlob, audioBlobSet] = useState(null)
  const [audioUrl, audioUrlSet] = useState(null)
  const [sampleAudio, setSampleAudio] = useState(null)
  const [accompanimentAudio, setAccompanimentAudio] = useState(null)
  const [accompanimentRecordingAudio, setAccompanimentRecordingAudio] =
    useState(null)
  const [studentNotationPdf, setStudentNotationPdf] = useState(null)
  const [responseText, setResponseText] = useState('')
  const [rhythm, setRhythm] = useState(1)
  const [tone, setTone] = useState(1)
  const [expression, setExpression] = useState(1)
  const [showEditorButton, setShowEditorButton] = useState(true)
  const [showDisplayButton, setShowDisplayButton] = useState(true)

  useEffect(() => {
    fetch(`${FetchURL}assignments/${assignmentId}`, {
      headers: {
        Authentication: localStorage.getItem('jwt'),
      },
    })
      .then((resp) => resp.json())
      .then((assign) => {
        setAssignment(assign)
        setSampleAudio(assign.playing_sample_url)
        setAccompanimentAudio(assign.accompaniment_url)
        setAccompanimentRecordingAudio(new Audio(assign.accompaniment_url))
      })
  }, [assignmentId])

  const prepareRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorderSet(new MediaRecorder(stream, { mimeType: 'audio/webm' }))
    })
  }

  const startRecording = () => {
    mediaRecorder.start()
    accompanimentRecordingAudio.play()
    activeSet(true)
    mediaRecorder.addEventListener('dataavailable', (e) => {
      let tempBlob = new Blob([e.data], { mimeType: 'audio/webm' })
      audioUrlSet(URL.createObjectURL(tempBlob))
      audioBlobSet(tempBlob)
    })
  }

  const stopRecording = () => {
    mediaRecorder.stop()
    accompanimentRecordingAudio.pause()
    accompanimentRecordingAudio.currentTime = 0
    mediaRecorder.addEventListener('stop', () => {
      // console.log("stopping recording") //what does the rest of this function/event listener do
    })
    activeSet(false)
  }

  const createFileFromBlob = () => {
    let file = new File([audioBlob], 'audio1.mp3', { mimeType: 'audio/webm' })
    return file
  }

  const postRecording = () => {
    let formData = new FormData()
    formData.append('school_id', currentUser.school_id)
    formData.append('student_recording', createFileFromBlob())
    // console.log(createFileFromBlob())

    fetch(`${FetchURL}student_assignments/${assignmentId}/submit_recording`, {
      method: 'PATCH',
      body: formData,
      headers: {
        Authentication: localStorage.getItem('jwt'),
      },
    })
      .then((resp) => resp.json())
      .then((json) => {
        if (json.error) {
          alert(json.message)
        } else {
          const updatedAssignments = studentAssignments.map((a) => {
            if (a.id === json.student_assignment.id) {
              return { ...json.student_assignment, assignment: a.assignment }
            } else {
              return a
            }
          })
          setStudentAssignments(updatedAssignments)
          alert('Successfully submitted recording.')
        }
      })
  }

  const handleSubmitResponseForm = (e) => {
    e.preventDefault()
    let formData = new FormData()
    formData.append('school_id', currentUser.school_id)
    formData.append('student_response', responseText)
    formData.append('rhythm', rhythm)
    formData.append('tone', tone)
    formData.append('expression', expression)

    fetch(`${FetchURL}student_assignments/${assignmentId}/submit_response`, {
      method: 'PATCH',
      body: formData,
      headers: {
        Authentication: localStorage.getItem('jwt'),
      },
    })
      .then((resp) => resp.json())
      .then((json) => {
        if (json.error) {
          alert(json.message)
        } else {
          const updatedAssignments = studentAssignments.map((a) => {
            if (a.id === json.student_assignment.id) {
              return { ...json.student_assignment, assignment: a.assignment }
            } else {
              return a
            }
          })
          setStudentAssignments(updatedAssignments)
          alert('Successfully submitted response form.')
        }
      })
  }

  const handleSubmitStudentNotation = (e) => {
    e.preventDefault()
    if (!studentNotationPdf) {
      alert('Please select a file to upload.')
    } else {
      let formData = new FormData()
      formData.append('school_id', currentUser.school_id)
      formData.append('student_notation', studentNotationPdf)
      fetch(`${FetchURL}student_assignments/${assignmentId}/submit_notation`, {
        method: 'PATCH',
        body: formData,
        headers: {
          Authentication: localStorage.getItem('jwt'),
        },
      })
        .then((resp) => resp.json())
        .then((json) => {
          if (json.error) {
            alert(json.message)
          } else {
            const updatedAssignments = studentAssignments.map((a) => {
              if (a.id === json.student_assignment.id) {
                return { ...json.student_assignment, assignment: a.assignment }
              } else {
                return a
              }
            })
            setStudentAssignments(updatedAssignments)
            alert('Successfully uploaded notation')
          }
        })
    }
  }

  const adjustRatingforRange = (num) => {
    let score = parseInt(num)
    if (score < 0) {
      score = 0
    } else if (score > 5) {
      score = 5
    }
    return score
  }

  function displayReadOnlyEmbed() {
    new Embed('read-only-score-container', {
      width: '100%',
      height: '450',
      score: '60a51bf21c50d81fb20e3527',
      embedParams: {
        appId: '60a51a1da9e2b548d5ffe23b',
        sharingKey:
          'd1ec638f0eade5a3a2ad3bcadce9b7664273a7b2352844458385fe7d8d20238620f61a668ee3055d2d3177bd9282fcc88c692ea81e6668ae1610b37cde6aae93',
      },
    })
    setShowDisplayButton(false)
  }

  const closeReadOnlyEmbed = () => {
    setShowDisplayButton(true)
    document.getElementById('read-only-score-container').innerHTML = ''
  }

  function displayEditEmbed() {
    new Embed('edit-embed-container', {
      width: '100%',
      height: '450',
      score: '60af017bc476464839e77b63',
      embedParams: {
        mode: 'edit',
        appId: '60a51a1da9e2b548d5ffe23b',
        sharingKey:
          '372732f148c57c9d2b85103a37c395b5b4a8a7c5608f50b76ae3f1e4a3f4622d5689f67be1766cf7cb6ae01a8662768d9964f0bfd14596f9ae54382cf53afa2e',
      },
    })
    setShowEditorButton(false)
  }

  const closeEditEmbed = () => {
    setShowEditorButton(true)
    document.getElementById('edit-embed-container').innerHTML = ''
  }

  return (
    <div style={{ margin: '1em' }}>
      {currentUser && currentUserType === 'student' ? (
        <Grid
          container
          direction='column'
          spacing={1}
          style={{ width: '100%' }}
        >
          <Grid item>
            <Paper style={{ padding: '1em' }}>
              <Typography align='center' variant='h2'>
                {assignment.title}
              </Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Paper style={{ padding: '1em' }}>
              <Grid container direction='column' spacing={1}>
                <Grid item>
                  <Typography
                    variant='h5'
                    display='inline'
                    style={{ fontWeight: 'bold' }}
                  >
                    INSTRUCTIONS:{' '}
                  </Typography>
                  <Typography align='justify' variant='h5' display='inline'>
                    {assignment.instructions}
                  </Typography>
                </Grid>
                {assignment.pdf_url !== '' &&
                assignment.category !== 'response' ? (
                  <Grid item>
                    {showDisplayButton ? (
                      <Button
                        variant='contained'
                        color='secondary'
                        endIcon={<LibraryMusicIcon />}
                        onClick={displayReadOnlyEmbed}
                      >
                        Display Notation
                      </Button>
                    ) : (
                      <Button
                        style={{
                          marginBottom: '5px',
                        }}
                        variant='contained'
                        color='secondary'
                        endIcon={<CloseIcon />}
                        onClick={closeReadOnlyEmbed}
                      >
                        Close Notation
                      </Button>
                    )}
                    {/* removes need for display button. if src link is provided dynamically, we can display any assignment's score to write a counter melody for
                    <iframe
                      src='https://flat.io/embed/60af017bc476464839e77b63?appId=60a51a1da9e2b548d5ffe23b&sharingKey=372732f148c57c9d2b85103a37c395b5b4a8a7c5608f50b76ae3f1e4a3f4622d5689f67be1766cf7cb6ae01a8662768d9964f0bfd14596f9ae54382cf53afa2e'
                      height='450'
                      width='100%'
                      frameBorder='0'
                      allowfullscreen
                      allow='midi'
                    ></iframe> */}
                    <Box
                      component='div'
                      display='block'
                      id='read-only-score-container'
                    ></Box>
                  </Grid>
                ) : null}
              </Grid>
            </Paper>
          </Grid>
          {assignment.category === 'response' ? (
            <Grid item>
              <Paper style={{ padding: '1em' }}>
                <Button
                  variant='contained'
                  color='secondary'
                  endIcon={<StarIcon />}
                  onClick={() => window.open(assignment.pdf_url)}
                >
                  Rating Scale
                </Button>
                <form onSubmit={handleSubmitResponseForm}>
                  <Grid container direction='column' spacing={1}>
                    <Grid item>
                      <TextField
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        multiline
                        rows={6}
                        name='response-text'
                        label='Response'
                        type='text'
                        id='response-text'
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                      />
                    </Grid>
                    <Grid item>
                      <Grid
                        container
                        justify='space-around'
                        style={{ padding: '5px' }}
                      >
                        <Grid item>
                          <TextField
                            variant='outlined'
                            margin='normal'
                            id='response-rhythm'
                            label='Rhythm'
                            name='response-rhythm'
                            autoComplete='response-rhythm'
                            InputProps={{
                              inputProps: { min: 1, max: 5, step: 1 },
                            }}
                            type='number'
                            onChange={(e) =>
                              setRhythm(adjustRatingforRange(e.target.value))
                            }
                            value={rhythm}
                          />
                        </Grid>
                        <Grid item>
                          <TextField
                            variant='outlined'
                            margin='normal'
                            id='response-tone'
                            label='Tone'
                            name='response-tone'
                            autoComplete='response-tone'
                            InputProps={{
                              inputProps: { min: 1, max: 5, step: 1 },
                            }}
                            type='number'
                            onChange={(e) =>
                              setTone(adjustRatingforRange(e.target.value))
                            }
                            value={tone}
                          />
                        </Grid>
                        <Grid item>
                          <TextField
                            variant='outlined'
                            margin='normal'
                            id='response-expression'
                            label='Expression'
                            name='response-expression'
                            autoComplete='response-expression'
                            InputProps={{
                              inputProps: { min: 1, max: 5, step: 1 },
                            }}
                            type='number'
                            onChange={(e) =>
                              setExpression(
                                adjustRatingforRange(e.target.value)
                              )
                            }
                            value={expression}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item style={{ marginLeft: 'auto' }}>
                      <Button variant='contained' color='primary' type='submit'>
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Grid>
          ) : null}
          {assignment.category === 'audio' ||
          assignment.category === 'creative' ? (
            <Grid item>
              <Grid container spacing={1} alignItems='stretch'>
                <Grid item xs={6} md={4}>
                  <Paper style={{ padding: '1em', height: '100%' }}>
                    <Typography align='center' variant='h6'>
                      Sample Audio
                    </Typography>
                    <AudioPlayer
                      layout='horizontal-reverse'
                      autoPlay={false}
                      autoPlayAfterSrcChange={false}
                      customAdditionalControls={[]}
                      showJumpControls={false}
                      customVolumeControls={[]}
                      src={sampleAudio}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Paper style={{ padding: '1em', height: '100%' }}>
                    <Typography align='center' variant='h6'>
                      Accompaniment
                    </Typography>
                    <AudioPlayer
                      layout='horizontal-reverse'
                      autoPlay={false}
                      autoPlayAfterSrcChange={false}
                      customAdditionalControls={[]}
                      showJumpControls={false}
                      customVolumeControls={[]}
                      src={accompanimentAudio}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper
                    style={{
                      padding: '1em',
                      height: '100%',
                      textAlign: 'center',
                    }}
                  >
                    {mediaRecorder ? (
                      active ? (
                        <IconButton onClick={stopRecording}>
                          <StopIcon></StopIcon>
                        </IconButton>
                      ) : (
                        <IconButton onClick={startRecording}>
                          <MicIcon></MicIcon>
                        </IconButton>
                      )
                    ) : (
                      <Button
                        variant='contained'
                        color='secondary'
                        onClick={prepareRecording}
                      >
                        Open Recorder
                      </Button>
                    )}
                    {audioUrl ? (
                      <AudioPlayer
                        autoPlay={false}
                        autoPlayAfterSrcChange={false}
                        layout='horizontal-reverse'
                        customAdditionalControls={[]}
                        showJumpControls={false}
                        customVolumeControls={[]}
                        src={audioUrl}
                      />
                    ) : null}
                    {audioBlob ? (
                      <Button
                        variant='contained'
                        color='secondary'
                        onClick={postRecording}
                      >
                        Submit Recording
                      </Button>
                    ) : null}
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          ) : null}
          {assignment.category === 'creative' ? (
            <Grid item>
              <form
                noValidate
                autoComplete='off'
                onSubmit={handleSubmitStudentNotation}
              >
                <Paper style={{ padding: '1em' }}>
                  <Box style={{ position: 'relative' }}>
                    <InputLabel
                      style={{ padding: '5px 0' }}
                      htmlFor='assignment-student-pdf'
                    >
                      Create your Counter-melody:
                    </InputLabel>
                    <Button
                      style={{ position: 'absolute', right: 0 }}
                      variant='contained'
                      color='primary'
                      type='submit'
                    >
                      Submit Notation
                    </Button>
                  </Box>
                  {showEditorButton ? (
                    <Button
                      variant='contained'
                      disableElevation
                      onClick={displayEditEmbed}
                    >
                      Open Score Editor
                    </Button>
                  ) : (
                    <Button
                      variant='contained'
                      endIcon={<CloseIcon />}
                      onClick={closeEditEmbed}
                    >
                      Close Editor
                    </Button>
                  )}
                  <Box component='div' id='edit-embed-container' />
                </Paper>
              </form>
            </Grid>
          ) : null}
        </Grid>
      ) : (
        <Paper style={{ padding: '1em' }}>
          <Typography align='center' variant='h4'>
            Please sign in to view this assignment!
          </Typography>
        </Paper>
      )}
    </div>
  )
}

export default StudentAssignment
