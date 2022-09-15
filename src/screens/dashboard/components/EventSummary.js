import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import PictureAsPdf from '@mui/icons-material/PictureAsPdf'
import Typography from '@mui/material/Typography'
import LoadingCircle from '../../../components/LoadingCircle'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import SaveAlt from '@mui/icons-material/SaveAlt'
import Divider from '@mui/material/Divider'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMore from '@mui/icons-material/ExpandMore'
import TabView from '../components/TabView'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import EventSummaryQuestionnaire from './EventSummaryQuestionnaire'

/**
 * This is a component designed to provide interactive data to the user
 * regarding an event.
 * @date 27 August, 2022
 * @author chrisrinaldi
 * @returns {JSX.Element}
 */
const EventSummary = (props) => {

    const {
        loading,
        employeeIdToEmployee,
        packageIdToPackage,
        onSave,
        event,
    } = props

  const numEmployees = Object.keys(employeeIdToEmployee).length

  return (<TabView>
    <Box label='Summary'>
      {(loading || !event) ? <LoadingCircle/> : <><Grid alignItems={'center'} container justifyContent={'space-between'}>
        <Grid item>
          <Typography><strong>Event Summary</strong></Typography>
        </Grid>
        <Grid item><Button startIcon={<PictureAsPdf />} color='error' size='small' variant='contained'>Print PDF</Button></Grid>
      </Grid>
      <br />
      <Grid container rowSpacing={5}>
        <Grid item xs={6}>
          <Typography variant='body2' color='textSecondary'><strong>Name of Event</strong></Typography>
          <Typography variant='body2' color='textSecondary'>Test</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant='body2' color='textSecondary'><strong>Event Type</strong></Typography>
          <Typography variant='body2' color='textSecondary'>{packageIdToPackage[event.package_id].name}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant='body2' color='textSecondary'><strong>Event Date</strong></Typography>
          <Typography variant='body2' color='textSecondary'>{event.start_datetime}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant='body2' color='textSecondary'><strong>Service Employee</strong></Typography>
          <Typography variant='body2' color='textSecondary'>{employeeIdToEmployee && numEmployees > 0 && employeeIdToEmployee[event.employee_id] ? (employeeIdToEmployee[event.employee_id].first_name + ' ' + employeeIdToEmployee[event.employee_id].last_name) : 'Not assigned'}</Typography>
        </Grid>
      </Grid>
      <br />
      <Accordion variant='outlined' defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMore />}><Typography variant='caption'>Invoice</Typography></AccordionSummary>
        <AccordionDetails>
          <Grid container alignItems={'center'} justifyContent={'space-between'}>
            <Grid item>
              <Typography><strong>From this Moment Photography</strong></Typography>
              <Typography variant='caption' color='textSecondary'>123 Test Street</Typography>
              <br />
              <Typography variant='caption' color='textSecondary'>Testville, NJ 08081</Typography>
            </Grid>
            <Grid item>
              <Typography variant='body2'>Event Date: {event.start_datetime}</Typography>
              <Typography variant='body2'>Invoice No.: {event.id}</Typography>
              <Typography variant='body2'>Invoice Date:</Typography>
            </Grid>
          </Grid>
          <br />
          <br />
          <Typography><strong>Client</strong></Typography>
          <Typography variant='caption' color='textSecondary'>ATTN:</Typography>
          <br/>
          <Typography variant='caption' color='textSecondary'>Address:</Typography>
          <br/>
          <Typography variant='caption' color='textSecondary'>Phone Number:</Typography>
          <br/>
          <Typography variant='caption' color='textSecondary'>Email:</Typography>
          <br/>
          <br/>
          <TableContainer variant='outlined' component={Paper}>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Description of work</strong></TableCell>
                  <TableCell><strong>Hours</strong></TableCell>
                  <TableCell><strong>Rate</strong></TableCell>
                  <TableCell align='right'><strong>Amount</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>1 x {packageIdToPackage[event.package_id].name}</TableCell>
                  <TableCell>5</TableCell>
                  <TableCell>45/hr</TableCell>
                  <TableCell align='right'>495.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='right' colSpan={3}><strong>Subtotal:</strong></TableCell>
                  <TableCell align='right'>495.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='right' colSpan={3}><strong>Discounts Applied:</strong></TableCell>
                  <TableCell align='right'></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='right' colSpan={3}><strong>Total:</strong></TableCell>
                  <TableCell align='right'></TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow><TableCell>*Please note that all sales are before taxes.</TableCell></TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
          <br />
          <strong>Terms & Remarks</strong>
          <TextField fullWidth value={event.description} disabled variant='filled' multiline minRows={4} contentEditable={false} />
        </AccordionDetails>
      </Accordion></>}
    </Box>
    <Box label="Questionnaire">
      <EventSummaryQuestionnaire
        onSave={onSave}
        initialEvent={event}
        loading={loading}
        packageIdToPackage={packageIdToPackage}
      />
    </Box>
  </TabView>)
}


export default EventSummary