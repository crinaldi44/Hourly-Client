import React from 'react'
import View from '../../../components/View'
import Container from '@mui/material/Container'
import Header from '../../../components/Header'
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Description from '@mui/icons-material/Description';
import Festival from '@mui/icons-material/Festival';
import Typography from '@mui/material/Typography'
import DirectoryFilter from '../../../components/DirectoryFilter';
import PackageApiController from '../../../../../api/impl/PackageApiController';
import DepartmentApiController from '../../../../../api/impl/DepartmentApiController';
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

  /**
   * Represents an instance of the Departments API.
   */
  const DepartmentsApi = new DepartmentApiController()

  const [departments, setDepartments] = React.useState([])

  const [packages, setPackages] = React.useState([])

  const [employees, setEmployees] = React.useState([])

  const navigate = useNavigate()

  const theme = useTheme()

  /**
 * When the application becomes mobile, returns true. Else, returns false.
 * The breakpoint for md is 900px.
 */
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  /**
   * Represents whether data is being loaded or not.
   */
  const [loading, setLoading] = React.useState(false)

  /**
   * Enqueues a snackbar to the user's screen.
   */
  const { enqueueSnackbar } = useSnackbar();

  /**
   * Fetches data from the servers.
   */
  const fetchData = async () => {
    setLoading(true)
    try {
      const departments = await DepartmentsApi.findAll()
      const packages = await PackagesApi.findAll()
      const employees = await EmployeesApi.findAll()
      if (departments && packages && employees) {
        const depts = departments.map(department => {
          return department.department_name
        })
        const pkgs = packages.map(pack => {
          return pack.name
        })
        const empl = employees.map(employee => {
          return employee.first_name + ' ' + employee.last_name
        })
        setDepartments(depts)
        setPackages(pkgs)
        setEmployees(empl)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      enqueueSnackbar(error.response.detail || "An unknown error has occurred!", {
        variant: 'error'
      })
    }
  }

  const fetchEvents = async (setEventsData) => {
    let data = await EventsApi.findAll()
    if (data) {
      setEventsData(data)
    }
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
          <Button size='small' startIcon={<Festival />} variant='contained'>New Event</Button>
          <Button onClick={() => { navigate('/dashboard/packages') }} size='small' startIcon={<Festival />} variant='contained'>Packages</Button>
          <Button startIcon={<Description />} size='small' color='inherit'>Export to CSV</Button>
        </CardActions>
      </Card>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={isMobile ? 12 : 9}>
          <Paper variant='outlined'>
            <EventScheduler fetchData={fetchEvents} />
          </Paper>
        </Grid>
        <Grid item xs={isMobile ? 12 : 3} style={{ textAlign: 'left' }}>
          <DirectoryFilter
            style={{ height: isMobile ? 120 : 460 }}
            disabled={loading}
            filters={[
              {
                category: 'Package Type',
                fieldName: 'package_id',
                type: 'chip',
                options: packages
              },
              {
                category: 'Assigned to',
                fieldName: 'test',
                type: 'dropdown',
                options: employees
              }
            ]}
          />
        </Grid>
      </Grid>
    </Container>
  </View>
  )
}

export default ManageEventsScreen