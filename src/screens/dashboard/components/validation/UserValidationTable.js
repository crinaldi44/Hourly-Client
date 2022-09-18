import React from 'react'
import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableFooter from '@mui/material/TableFooter'
import CheckCircle from '@mui/icons-material/CheckCircle'
import ErrorOutline from '@mui/icons-material/ErrorOutline'
import ReportProblem from '@mui/icons-material/ReportProblem'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import UserValidationEditCell from './UserValidationEditCell'
import Divider from '@mui/material/Divider'

const UserValidationTable = (props) => {

    const {
        loading,
        onValidationChanged,
        pidToValidation,
        success,
    } = props;

    const validationPids = Object.keys(pidToValidation);

    const handleValidationChange = (pid, newValidation) => {
        if (onValidationChanged) onValidationChanged(pid, newValidation)
    }

  return (
    <TableContainer variant='outlined' component={Paper} style={{maxWidth: '100%', overflowX: 'auto', whiteSpace: 'nowrap'}}>
        <div style={{maxHeight: 400, overflow: 'scroll'}}>
        <Table stickyHeader>
            <TableHead>
                <TableRow>
                    <TableCell align='center'></TableCell>
                    <TableCell align='center'><strong>ID</strong></TableCell>
                    <TableCell align='center'><strong>Email</strong></TableCell>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Department</strong></TableCell>
                    <TableCell><strong>Company</strong></TableCell>
                    <TableCell><strong>Pay Rate</strong></TableCell>
                </TableRow>
                {loading && <TableRow>
                    <TableCell colSpan={7} style={{padding: 0}}>
                        <LinearProgress/>
                    </TableCell>
                </TableRow>}
            </TableHead>
            <TableBody style={{height: 300, overflow: 'scroll'}}>
                {(!pidToValidation || (pidToValidation && validationPids.length === 0)) ? <TableRow>
                    <TableCell style={{height: 300}} colSpan={7} align='center'>
                        <div style={{opacity: 0.4}}>
                            <ReportProblem fontSize='large'/>
                            <Typography variant='body2'><strong>No Data</strong></Typography>
                            <Typography variant='caption'>Upload a CSV to continue.</Typography>
                        </div>
                    </TableCell>
                </TableRow> :
                    validationPids.map((pid, index) => (
                        <TableRow>
                            <TableCell align='center'>{pidToValidation[pid].is_employee_valid ? <CheckCircle fontSize='small' color='success'/> : <ErrorOutline fontSize='small' color='error'/>}</TableCell>
                            <TableCell align='center'>{index + 1}</TableCell>
                            <UserValidationEditCell onValidationChange={(newValidation) => {handleValidationChange(pid, newValidation)}} validation={pidToValidation[pid]} fieldName={'email'} align='center'>{pidToValidation[pid].email}</UserValidationEditCell>
                            <TableCell>{pidToValidation[pid].first_name + ' ' + pidToValidation[pid].last_name}</TableCell>
                            <UserValidationEditCell onValidationChange={(newValidation) => {handleValidationChange(pid, newValidation)}} validation={pidToValidation[pid]} fieldName={'department_name'}>{pidToValidation[pid].department_name}</UserValidationEditCell>
                            <UserValidationEditCell onValidationChange={(newValidation) => {handleValidationChange(pid, newValidation)}} validation={pidToValidation[pid]} fieldName={'company_name'}>{pidToValidation[pid].company_name}</UserValidationEditCell>
                            <UserValidationEditCell onValidationChange={(newValidation) => {handleValidationChange(pid, newValidation)}} validation={pidToValidation[pid]} fieldName={'pay_rate'}>{pidToValidation[pid].pay_rate}</UserValidationEditCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
        </div>
        <Divider/>
        <TableFooter>
                <TableCell colSpan={7} style={{borderBottom: 0}}>Rows Identified: {pidToValidation ? validationPids.length : 0}</TableCell>
            </TableFooter>
    </TableContainer>
  )
}

export default UserValidationTable