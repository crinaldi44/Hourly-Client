import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import HorizontalLinearStepper from '../../../components/Stepper'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import CalendarMonth from '@mui/icons-material/CalendarMonth'
import BugReport from '@mui/icons-material/BugReport'
import useTheme from '@mui/system/useTheme'
import useMediaQuery from '@mui/material/useMediaQuery'
import FilePicker from './FilePicker'
import FormLabel from '@mui/material/FormLabel'

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
        files: []
    })

    /**
   * Represents the MUI v5 theme.
   */
    const theme = useTheme();

  /**
     * When the application becomes mobile, returns true. Else, returns false.
     * The breakpoint for md is 900px.
     */
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    /**
     * Handles action when a field changes within the form. This is to
     * ensure fields persist thru step changes.
     * @param {*} newField 
     * @param {*} newValue 
     */
    const handleFieldChanged = (newField, newValue) => {
        const newReport = {...report, [newField]: newValue}
        console.log(newReport)
        setReport(newReport)
    }

    /**
     * Represents whether the field contains errors.
     * @param {*} fieldName the field name to check
     * @returns {Boolean} whether the field specified contains errors
     */
    const fieldContainsErrors = (fieldName) => {
        if (fieldName === 'firstEncounter') {
            return report.firstEncounter === ''
        } else if (fieldName === 'bugType') {
            return report.bugType === 'none'
        } else if (fieldName === 'description') {
            return report.description === '' || report.description.length < 20
        }
    }

  return (
    <HorizontalLinearStepper
    submitText='Submit'
    loading={loading}
    onCompleted={() => {
        if (onSubmit) {
            onSubmit(report)
        }
    }}
    onCompleteJsx={<div style={{textAlign: 'center', opacity: 0.6, padding: 50}}>
        <BugReport fontSize='large'/>
        <Typography variant='h6'><strong>Bug Report Received</strong></Typography>
        <Typography variant='body2' color='textSecondary'>Your report has been successfully received and is under review. <br/>Please allow 48 hours before a response is issued.</Typography>
    </div>}
    steps={[
        {
            title: 'Describe the Bug',
            jsx: <>
                <Typography variant='body2' color='textSecondary'>Tell us a bit about what happened.</Typography>
                <br/>
                <TextField disabled={loading} required error={fieldContainsErrors('firstEncounter')} onChange={(e) => { handleFieldChanged('firstEncounter', e.target.value) }} defaultValue={report.firstEncounter} size='small' InputProps={{
                    endAdornment: <InputAdornment position='end'>
                        <CalendarMonth color={fieldContainsErrors('firstEncounter') ? 'error' : 'inherit'} />
                    </InputAdornment>
                }} fullWidth variant='filled' label='When did you first encounter this bug?'/>
                <br/>
                <br/>
                <Select disabled={loading} required error={fieldContainsErrors('bugType')} defaultValue={report.bugType} onChange={e => { handleFieldChanged('bugType', e.target.value) }} size='small' fullWidth label='Select the type of bug' variant='filled'>
                    <MenuItem key='none' value='none'><i>Select an issue type...</i></MenuItem>
                    <MenuItem key='Visual/Graphical Issue' value='Visual/Graphical Issue'>Visual/Graphical Issue</MenuItem>
                    <MenuItem key='Functionality Issue' value='Functionality Issue'>Functionality Issue</MenuItem>
                    <MenuItem key='Server Issue' value='Server Issue'>Server Issue</MenuItem>
                </Select>
                <br/>
                <br/>
                <TextField disabled={loading} required error={fieldContainsErrors('description')} defaultValue={report.description} onChange={e => { handleFieldChanged('description', e.target.value) }} multiline minRows={5} fullWidth variant='filled' label='Describe the issue you are experiencing'/>
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
                <br/>
                <FilePicker disabled={loading} uploadText='Upload Images' initialFiles={report.files} onFilesChanged={(newFiles) => { handleFieldChanged('files', newFiles) }}/>
            </>,
            isOptional: true
        },
        {
            title: 'Confirm Information',
            jsx: <Card variant='outlined' style={{marginTop: 15}}>
                <CardContent>
                    <Typography style={{marginBottom: 20}}><strong>Bug Report Summary</strong></Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={isMobile ? 12 : 6}>
                            <Typography style={{marginBottom: 5}} variant='body2' color='textSecondary'><strong>When did you first encounter this bug?</strong></Typography>
                            <Typography style={{marginBottom: 15}} variant='body2' color='textSecondary'>{report.firstEncounter !== '' ? report.firstEncounter : 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={isMobile ? 12 : 6}>
                            <Typography style={{marginBottom: 5}} variant='body2' color='textSecondary'><strong>Select the type of bug encountered.</strong></Typography>
                            <Typography style={{marginBottom: 15}} variant='body2' color='textSecondary'>{report.bugType !== 'none' ? report.bugType : 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={isMobile ? 12 : 6}>
                            <Typography style={{marginBottom: 5}} variant='body2' color='textSecondary'><strong>Describe the issue you are experiencing.</strong></Typography>
                            <Typography style={{marginBottom: 15}} variant='body2' color='textSecondary'>{report.description !== '' ? report.description : 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={isMobile ? 12 : 6}>
                            <Typography style={{marginBottom: 5}} variant='body2' color='textSecondary'><strong>Attached files</strong> ({report.files.length})</Typography>
                            {report.files.length === 0 ? <Typography style={{marginBottom: 15}} variant='body2' color='textSecondary'>You have not attached any files. Please note that including screenshots of your encounter will best help us in diagnosing the issue.</Typography>
                            : report.files.map((file, index) => (
                                <Typography style={{marginBottom: index === (report.files.length - 1) ? 15 : 0}} variant='body2' color='textSecondary'>{file.name}</Typography>
                            ))}
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider/>
                <CardContent>
                    <Typography style={{marginBottom: 15}} variant='caption' color='textSecondary'>When you are satisfied with your report, you may select the finish button below (bottom right).</Typography>
                </CardContent>
            </Card>,
            isOptional: false
        }
    ]}/>
  )
}


export default ReportBugForm