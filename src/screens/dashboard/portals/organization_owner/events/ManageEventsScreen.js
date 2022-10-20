import React from 'react'
import View from '../../../components/View'
import Container from '@mui/material/Container'
import Header from '../../../components/Header'
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Description from '@mui/icons-material/Description';
import Festival from '@mui/icons-material/Festival';
import Typography from '@mui/material/Typography'
import PackageApiController from '../../../../../api/impl/PackageApiController';
import EmployeeApiController from '../../../../../api/impl/EmployeeApiController';
import EventApiController from '../../../../../api/impl/EventApiController'
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import EventScheduler from '../../../components/EventScheduler';
import useMediaQuery from '@mui/material/useMediaQuery'
import useTheme from '@mui/system/useTheme'

/**
 * Represents a screen that allows an organization admin to manage
 * and manipulate events accordingly. From here, the org owner can
 * add, update and delete events as well as assign employee(s) to events.
 * @author chrisrinaldi
 * @date 14 August, 2022
 * @returns {JSX.Element}
 */
const ManageEventsScreen = () => {

  /**
   * Represents an instance of the Packages API.
   */
  const PackagesApi = new PackageApiController()

  /**
   * Represents an instance of the Employees API.
   */
  const EmployeesApi = new EmployeeApiController()

  const EventsApi = new EventApiController()

  const navigate = useNavigate()

  /**
   * Represents the package fields to display.
   */
  const [additionalFields, setAdditionalFields] = React.useState([])

  /**
   * Enqueues a snackbar to the user's screen.
   */
  const { enqueueSnackbar } = useSnackbar();

  /**
   * Fetches data from the servers.
   */
  const fetchData = async () => {
    try {
      const packages = await PackagesApi.findAll()
      const employees = await EmployeesApi.findAll()
      if (packages && employees) {
        let newAdditionalFields = [
          {
            fieldName: 'package_id',
            title: 'Package',
            allowMultiple: false,
            instances: [
            ],
          },
          {
            fieldName: 'employee_id',
            title: 'Assigned Employee',
            allowMultiple: false,
            instances: [
            ],
          }]
        packages.map((pack) => {
          newAdditionalFields[0].instances.push({
            id: pack.id,
            text: pack.name
          })
        })
        employees.map((employee) => {
          newAdditionalFields[1].instances.push({
            id: employee.id,
            text: employee.first_name + ' ' + employee.last_name
          })
        })
        setAdditionalFields(newAdditionalFields)
      }
    } catch (error) {
      enqueueSnackbar(error.response && error.response.detail ? error.response.detail : "An unknown error has occurred!", {
        variant: 'error'
      })
    }
  }

  const fetchEvents = async (setEventsData, currentDate) => {
      let data;
      if (currentDate) {
        const date = new Date(currentDate)
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        data = await EventsApi.search(firstDay, lastDay)
      } else {
        const date = new Date()
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        data = await EventsApi.search(firstDay, lastDay)
      }
    if (data) {
      setEventsData(data)
    }
  }

  /**
   * Handles action taken on event add. Passes a callback
   * to the events fetching to be fired and trigger a
   * state refresh.
   * @param {*} event 
   * @param {*} setData 
   */
  const onEventAdd = async (event, setData) => {
    try {
      await EventsApi.add(event)
      enqueueSnackbar(`${event.name} has been scheduled for ${event.start_datetime}.`, {
        variant: 'info'
      })
    } catch (error) {
      enqueueSnackbar(error.response ? error.response.detail : 'An error occurred whilst attempting to commit your changes.', {
        variant: 'error'
      })
    }
    fetchEvents(setData)
  }

  /**
   * Accepts an array which is a mapping of event IDs to changes. Updates
   * each by submitting a PATCH request for each entry in the series.
   * @param {*} eventChanges 
   * @param {*} index 
   */
  const onEventUpdate = async (eventChanges, setData) => {
    try {
      const eventChangeIds = Object.keys(eventChanges)
      for (let i = 0; i < eventChangeIds.length; i++) {

        let patchDocumentList = []

        Object.keys(eventChanges[eventChangeIds[i]]).map(change => {
          patchDocumentList.push({
            op: 'add',
            path: `/${change}`,
            value: eventChanges[eventChangeIds[i]][change]
          })
        })
        await EventsApi.patch(eventChangeIds[i], patchDocumentList)
      }
      fetchEvents(setData)
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.response ? error.response.detail : 'An error occurred while attempting to commit your changes.', {
        variant: 'error'
      })
    }
  }

  /**
   * Handles action taken on event delete.
   * @param {*} eventId 
   * @param {*} setData 
   */
  const onEventDelete = async (eventId, setData) => {
    try {
      await EventsApi.delete(eventId)
    } catch (error) {
      enqueueSnackbar(error.response ? error.response.detail : 'An error occurred whilst attempting to commit your changes.', {
        variant: 'error'
      })
    }
    fetchEvents(setData)
  }

  React.useEffect(() => {
    fetchData()
  }, [])


  return (<View>
    <Container maxWidth='xl'>
      <Header breadcrumbs={[{
        title: 'Schedule',
        to: '/dashboard/events'
      }]}>Schedule</Header>
      <br />
      <Card variant='outlined' style={{ textAlign: 'left' }}>
        <CardContent>
          <Typography variant='h6'><strong>Schedule</strong></Typography>
        </CardContent>
        <CardActions>
          <Button onClick={() => { navigate('/dashboard/packages') }} size='small' startIcon={<Festival />} variant='contained'>Packages</Button>
          <Button startIcon={<Description />} size='small' color='inherit'>Export to CSV</Button>
        </CardActions>
      </Card>
      <br />
      <Paper variant='outlined'>
            <EventScheduler additionalFields={additionalFields} fetchData={fetchEvents} onAddEvent={onEventAdd} onUpdateEvents={onEventUpdate} onDeleteEvent={onEventDelete} />
          </Paper>
    </Container>
  </View>
  )
}

export default ManageEventsScreen