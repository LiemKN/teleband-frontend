import React from 'react'
import TeacherTableRow from './TeacherTableRow'
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { styled } from '@material-ui/core/styles';

const TeacherTableComponent = styled(Paper)({
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    overflowY: 'scroll',
})

const FlexTableContainer = styled(TableContainer)({
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    overflowX: 'unset',
})

const TeacherCell = styled(TableCell)({
    padding: 0,
})

function TeacherTable({ studentData, currentUser, setCurrentUser }) {
    const assignmentOrder = studentData[0].assignments.sort((a,b) => a.title.toLowerCase() > b.title.toLowerCase() ? 1: -1 ) //gets assignments of first student. All students will have same assignments

    return (
        <TeacherTableComponent>
            <FlexTableContainer>
                {/* <p>some para</p> */}
                <Table stickyHeader aria-label="sticky table" id="teacher-table">
                    <TableHead>
                        <TableRow>
                            <TeacherCell align="center">Student</TeacherCell>
                            {
                                assignmentOrder.map((assignment, i) => {
                                    return <TeacherCell align="center" key={i} className="assignment-col">{assignment.title}</TeacherCell>
                                })
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            // FIXME: rather do this in the query/backend?
                            studentData
                                .sort((a, b) => a.student.name > b.student.name ? 1 : -1)
                                .map((student) => {
                                    return <TeacherTableRow key={student.student.school_id} currentUser={currentUser} setCurrentUser={setCurrentUser} studentData={student} assignmentOrder={assignmentOrder} />
                                })
                        }
                    </TableBody>
                </Table>
            </FlexTableContainer>
        </TeacherTableComponent>
    )
}

export default TeacherTable