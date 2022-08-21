import React from 'react'
import HorizontalLinearStepper from '../../../components/Stepper'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'
import CalendarMonth from '@mui/icons-material/CalendarMonth'
import BugReport from '@mui/icons-material/BugReport'

/**
 * Represents a form on which a user may report a bug.
 * @returns {JSX.Element}
 */
const ReportBugForm = (props) => {


    const {

        /**
         * Represents whether the fomr is loading.
         */
        loading,

        /**
         * Passes the report object to a callback on submission for
         * processing.
         */
        onSubmit,

    } = props

    /**
     * Represents a state variable to store the report.
     */
    const [report, setReport] = React.useState({
        firstEncounter: '',
        bugType: 'none',
        description: '',
        files: null
    })

    /**
     * Handles action when a field changes within the form. This is to
     * ensure fields persist thru step changes.
     * @param {*} newField 
     * @param {*} newValue 
     */
    const handleFieldChanged = (newField, newValue) => {
        const newReport = {...report, [newField]: newValue}
        setReport(newReport)
    }

  return (
    <HorizontalLinearStepper
    loading={loading}
    onCompleteJsx={<div style={{textAlign: 'center', opacity: 0.6, padding: 50}}>
        <BugReport fontSize='large'/>
        <Typography variant='h6'><strong>Bug Report Received</strong></Typography>
        <Typography variant='body2' color='textSecondary'>Your report has been successfully received and is under review. <br/>Please allow 48 hours before a response is issued.</Typography>
    </div>}
    steps={[
        {
            title: 'Describe the Bug',
            jsx: <>
                <br/>
                <FormControlLabel size='small' label='Is the bug arbitrarily reproducible?' control={<Checkbox />}/>
                <br/>
                <br/>
                <TextField onChange={(e) => { handleFieldChanged('firstEncounter', e.target.value) }} defaultValue={report.firstEncounter} size='small' InputProps={{
                    endAdornment: <InputAdornment position='end'>
                        <CalendarMonth />
                    </InputAdornment>
                }} fullWidth variant='filled' label='When did you first encounter this bug?'/>
                <br/>
                <br/>
                <Select defaultValue={report.bugType} onChange={e => { handleFieldChanged('bugType', e.target.value) }} size='small' fullWidth label='Select the type of bug' title='Select the type of bug' variant='filled'>
                    <MenuItem key='none' value='none'>Select the type of bug encountered</MenuItem>
                    <MenuItem key='Visual/Graphical Issue' value='Visual/Graphical Issue'>Visual/Graphical Issue</MenuItem>
                    <MenuItem key='Functionality Issue' value='Functionality Issue'>Functionality Issue</MenuItem>
                    <MenuItem key='Server Issue' value='Server Issue'>Server Issue</MenuItem>
                </Select>
                <br/>
                <br/>
                <TextField defaultValue={report.description} onChange={e => { handleFieldChanged('description', e.target.value) }} multiline minRows={5} fullWidth variant='filled' label='Enter a brief description'/>
                <br/>
                <br/>
                <Typography variant='caption' color='textSecondary'>* Please be as descriptive as possible! Don't be afraid to include too much detail.</Typography>
            </>,
            isOptional: false
        },
        {
            title: 'Include Relevant Photos',
            jsx: <>
                <Typography variant='body2' color='textSecondary'>If possible, include a screenshot for us to better identify the bug.</Typography>
            </>,
            isOptional: true
        },
        {
            title: 'Confirm Information',
            jsx: <></>,
            isOptional: false
        }
    ]}/>
  )
}


export default ReportBugForm