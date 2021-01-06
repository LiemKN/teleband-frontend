import React, { useEffect, useState } from 'react';
import './App.css';
import Landing from './pages/Landing'
import StudentAssignment from './pages/StudentAssignment'
import StudentPage from './pages/Student'
import TeacherPage from './pages/Teacher'
// import Admin from './pages/Admin'
import Login from './pages/Login'
import { BrowserRouter, Redirect, Switch, Route } from 'react-router-dom'
import { FetchURL } from './env/url'
import Navbar from './components/Navbar'

function App() {
  const [currentUser, setCurrentUser] = useState(undefined)
  const [currentUserType, setCurrentUserType] = useState(undefined)
  const [studentAssignments, setStudentAssignments] = useState([])

  useEffect(() => {

    if (localStorage.getItem('jwt') && localStorage.getItem("type") === "teacher") {
      fetch(`${FetchURL}teacher/profile`, {
        headers: {
          "Authentication": localStorage.getItem('jwt')
        }
      }).then(resp => resp.json())
        .then(teacher => {
          setCurrentUser(teacher)
          setCurrentUserType("teacher")
        })
    } else if (localStorage.getItem('jwt') && localStorage.getItem("type") === "student") {
      fetch(`${FetchURL}student/profile`, {
        headers: {
          "Authentication": localStorage.getItem('jwt')
        }
      }).then(resp => resp.json())
        .then(student => {
          setCurrentUser(student)
          setCurrentUserType("student")
          setStudentAssignments(student.student_assignments)
        })
    }
  }
    , [])

  function clearUserStates() {
    window.localStorage.clear()
    setCurrentUser(undefined);
    setCurrentUserType(undefined)
  }

  return (
    <BrowserRouter>
      <Navbar currentUserType={currentUserType} currentUser={currentUser} clearUserStates={clearUserStates} />
      <Switch>
        <Route exact path="/" render={() => {
          if (currentUser && currentUserType === "teacher") {
            return <Redirect to="/teacher" />
          } else if (currentUser && currentUserType === "student") {
            return <Redirect to="/student" />
          } else {
            return <Landing />
          }
        }} />
        <Route exact path="/login" render={() => {
          return < Login setCurrentUser={setCurrentUser} setCurrentUserType={setCurrentUserType} setStudentAssignments={setStudentAssignments}/>
        }} />
        <Route exact path="/student" render={() => {
          return < StudentPage currentUser={currentUser} studentAssignments={studentAssignments} />
        }} />
        <Route exact path="/teacher" render={() => {
          return < TeacherPage currentUser={currentUser} setCurrentUser={setCurrentUser} />
        }} />
        <Route path="/assignments/:id" render={(props) => {
          const assignmentId = props.match.params.id
          return <StudentAssignment assignmentId={assignmentId} currentUser={currentUser} currentUserType={currentUserType} studentAssignments={studentAssignments} setStudentAssignments={setStudentAssignments}/>
          }}  />
        {/* <Route exact path="/admin" component={Admin} /> */}
        <Route>
          <Landing />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;