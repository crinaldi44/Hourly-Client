import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'
import Typography from '@mui/material/Typography'
import AddBox from '@mui/icons-material/AddBox'
import IndeterminateCheckBox from '@mui/icons-material/IndeterminateCheckBox'
import Divider from '@mui/material/Divider'
import ErrorOutline from '@mui/icons-material/ErrorOutline'
import LoadingCircle from '../../../../components/LoadingCircle'
import ReportProblem from '@mui/icons-material/ReportProblem'

/**
 * Represents a panel that displays activities within the validation.
 * @returns {JSX.Element}
 */
const UserValidationErrorPanel = (props) => {

    const {
        loading=true,
        pidToValidation
    } = props;

  return ( <Card variant='outlined'>
    <CardContent>
        <Typography variant='body2' color='textSecondary'><strong>Errors</strong></Typography>
        </CardContent>
        <Divider/>
        <CardContent>
        {loading && <LoadingCircle/>}
        {pidToValidation && !loading && <TreeView
            aria-label="multi-select"
            defaultCollapseIcon={<IndeterminateCheckBox color='primary'/>}
            defaultExpandIcon={<AddBox color='primary'/>}
            sx={{ height: 216, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
            >
                {pidToValidation && Object.keys(pidToValidation).map((validationPid, index) => (
                    !pidToValidation[validationPid].is_employee_valid && <TreeItem nodeId={index + 1} label={<Typography variant='body2'><strong><ErrorOutline fontSize='inherit' color='error'/> Line {(index + 1)}</strong>: Invalid user specified</Typography>}>
                        {!pidToValidation[validationPid].is_company_valid && <TreeItem nodeId={'company' + index} label={<Typography variant='caption' color='textSecondary'>The company specified is not valid.</Typography>} />}
                        {!pidToValidation[validationPid].is_department_valid && <TreeItem nodeId={'dept' + index} label={<Typography variant='caption' color='textSecondary'>The department does not exist.</Typography>} />}
                        {!pidToValidation[validationPid].is_email_valid && <TreeItem nodeId={'email' + index} label={<Typography variant='caption' color='textSecondary'>The email is invalid or in use.</Typography>} />}
                    </TreeItem>
                ))}
        </TreeView>}
    </CardContent>
  </Card>
  )
}

export default UserValidationErrorPanel