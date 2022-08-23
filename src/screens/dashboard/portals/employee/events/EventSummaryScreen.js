import React from 'react'
import Header from '../../../components/Header'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FiberManualRecord from '@mui/icons-material/FiberManualRecord'
import Button from '@mui/material/Button'
import PictureAsPdf from '@mui/icons-material/PictureAsPdf'
import Typography from '@mui/material/Typography'
import View from '../../../components/View'
import EmployeeApiController from '../../../../../api/impl/EmployeeApiController'
import { useParams } from 'react-router-dom'
import EventApiController from '../../../../../api/impl/EventApiController'
import PackageApiController from '../../../../../api/impl/PackageApiController'
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
import TabView from '../../../components/TabView'
import Box from '@mui/material/Box'
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material'

/**
 * Represents a screen that presents the details and summary of a particular
 * event, as well as allowing the user to generate a PDF and/or invoice
 * of that event and change the agreed upon price.
 * @author chrisrinaldi
 * @date 22 August, 2022
 * @returns {JSX.Element}
 */
const EventSummaryScreen = () => {

  const [event, setEvent] = React.useState();

  const [employeeIdToEmployee, setEmployeeIdToEmployee] = React.useState({})

  const [packageIdToPackage, setPackageIdToPackage] = React.useState({})

  /**
   * Represents an instance of the Employee API controller.
   */
  const EmployeesApi = new EmployeeApiController();

  const EventsApi = new EventApiController();

  const PackagesApi = new PackageApiController()

  /**
   * Destructures the params to obtain the event ID.
   */
  const { eventId } = useParams();

  /**
   * Fetches the event data.
   */
  const fetchData = async () => {
    const newEvent = await EventsApi.findById(eventId)
    if (newEvent) {
      if (newEvent.employee_id) {

      }
      const packages = await PackagesApi.findAll()
      if (packages) {

        let newPackageIdToPackage = {}
        packages.map(pkg => {
          newPackageIdToPackage[pkg.id] = pkg
        })
        setPackageIdToPackage(newPackageIdToPackage)
        setEvent(newEvent)
      }
    }
  }

  React.useEffect(() => {
    fetchData();
  }, [])

  const cardStyle = {
    // padding: 30
  }

  /**
   * Renders the event questionnaire.
   * @param {*} packageQuestions 
   */
  const renderEventQuestionnaire = (packageQuestions) => {
    if (packageQuestions && packageQuestions.length > 0) {
      return packageQuestions.map((question, index) => (
        <>
          {question.data_type === 'textfield' && <>
            <CardContent style={cardStyle}>
              <Typography variant='body2'><strong>{index + 1}. {question.title}</strong></Typography>
              <FormHelperText style={{ marginLeft: 0 }}>Enter a short response to the prompt.</FormHelperText>
              <TextField variant='filled' fullWidth size='small' placeholder='Enter response...' />
            </CardContent>
            <Divider />
          </>}

          {question.data_type === 'multiselect' && <><CardContent style={cardStyle}><FormControl>
            <Typography variant='body2'><strong>{index + 1}. {question.title}</strong></Typography>
            <FormHelperText style={{ marginLeft: 0 }}>*Select all that apply</FormHelperText>
            {question.values.length > 0 && question.values.map(pQuestion => (
              <FormControlLabel control={<Checkbox />} label={pQuestion} />
            ))}
          </FormControl></CardContent><Divider /></>}

          {question.data_type === 'dropdown' && <><CardContent style={cardStyle}>
            <Typography variant='body2'><strong>{index + 1}. {question.title}</strong></Typography>
            <FormHelperText style={{ marginLeft: 0 }}>Select the option that best fits.</FormHelperText>
            <Select fullWidth variant='filled' defaultValue={'none'} size='small' key={question.title}>
              <MenuItem key='none' value='none'>Select an option...</MenuItem>
              {question.values.length > 0 && question.values.map(pQuestionValue => (
                <MenuItem key={pQuestionValue} value={pQuestionValue}>{pQuestionValue}</MenuItem>
              ))}</Select></CardContent><Divider /></>}

          {question.data_type === 'paragraph' && <><CardContent style={cardStyle}>
            <Typography variant='body2'><strong>{index + 1}. {question.title}</strong></Typography>
            <TextField fullWidth variant='filled' placeholder='Enter response...' multiline minRows={4} /></CardContent><Divider /></>}
        </>
      ))
    }
  }

  return (<View>
    <Container style={{ textAlign: 'left' }} maxWidth={'xl'}>
      <Header breadcrumbs={[
        {
          title: 'Events',
          to: '/dashboard/events'
        },
        {
          title: event ? event.name : '',
          to: `/dashboard/events/${eventId}/summary`
        }
      ]}>{!event ? '' : event.name}</Header>
      <br />
      {event && <TabView>
        <Box label='Summary'>
          <Grid alignItems={'center'} container justifyContent={'space-between'}>
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
              <Typography variant='body2' color='textSecondary'>{event.employee_id || 'Not assigned'}</Typography>
            </Grid>
          </Grid>
          <br />
          <Accordion variant='outlined' defaultExpanded={true}>
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
          </Accordion>
        </Box>
        <Box label="Questionnaire">
          <Card variant='outlined'>
            <CardContent>
              <Typography variant='body2' color={'textSecondary'}><strong>Questions</strong></Typography>
            </CardContent>
            {event.questions.length > 0 ? renderEventQuestionnaire(event.questions) : renderEventQuestionnaire(packageIdToPackage[event.package_id].questions)}
            <CardActions>
              <Button color='inherit' startIcon={<SaveAlt />}>Edit</Button>
              <Button color='inherit' startIcon={<SaveAlt />}>Save</Button>
            </CardActions>
          </Card>
        </Box>
      </TabView>}
    </Container>
  </View>
  )
}

export default EventSummaryScreen