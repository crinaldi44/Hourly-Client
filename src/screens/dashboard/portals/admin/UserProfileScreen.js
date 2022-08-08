import Container from '@mui/material/Container'
import React from 'react'
import View from '../../components/View'
import Header from '../../components/Header'
import EmployeeApiController from '../../../../api/impl/EmployeeApiController'
import { useParams } from 'react-router-dom'
import UserProfile from '../../components/UserProfile'
import { useSnackbar } from 'notistack'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import ClockinApiController from '../../../../api/impl/ClockinApiController'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import PaginationTable from '../../../../components/Table'
import Chip from '@mui/material/Chip'
import WatchLater from '@mui/icons-material/WatchLater'
import Delete from '@mui/icons-material/Delete'
import Link from '@mui/material/Link'
import useMediaQuery from '@mui/material/useMediaQuery'
import useTheme from '@mui/material/styles/useTheme';
import Skeleton from '@mui/material/Skeleton'
import LoadingCircle from '../../../../components/LoadingCircle'



/**
 * Represents a screen that allows an administrator
 * or org owner to edit an existing employee, or even
 * themselves.
 * @returns {JSX.Element}
 */
const UserProfileScreen = () => {

  /**
   * Represents the API controller for the Employee
   * domain.
   */
  const EmployeesApi = new EmployeeApiController()

  /**
   * Represents the API controller for the Clockin
   * domain.
   */
  const ClockinApi = new ClockinApiController()

  /**
   * Represents the snackbar hook.
   */
  const { enqueueSnackbar } = useSnackbar()

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
   * Represents the employee.
   */
  const [employee, setEmployee] = React.useState()

  /**
   * Represents employees who are related to the primary employee,
   * i.e. those who are within the same company/department.
   */
  const [relatedEmployees, setRelatedEmployees] = React.useState([])

  /**
   * Represents the clockins to be displayed in the table.
   */
  const [clockins, setClockins] = React.useState()

  /**
   * Represents the total number of clockins for a particular
   * user.
   */
  const [totalClockins, setTotalClockins] = React.useState(0)

  /**
   * Represents the currently selected tab.
   */
  const [value, setValue] = React.useState('1');

  /**
   * Handles action to be taken when the tabs have changed.
   * @param {*} event 
   * @param {*} newValue 
   */
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  /**
   * Obtains the employee ID from the parameters.
   */
  let { employeeId } = useParams()

  const fetchUser = async () => {
    try {
      const employee = await EmployeesApi.getUsersProfile(employeeId)
      if (employee && employee[0]) {
        setEmployee(employee[0])
        const otherUsers = await EmployeesApi.findAll({
          company_id: employee[0].company.id,
          limit: 3
        })
        if (otherUsers && otherUsers.length > 0) {
          setRelatedEmployees(otherUsers)
        }
        try {
          let clockins = await ClockinApi.findAll({
            employee_id: employee[0].id,
            include_totals: true,
          })
          setClockins(clockins)
        } catch (error) {
          setClockins([])
        }
      }
    } catch (error) {
      enqueueSnackbar(error && error.response && error.response.detail ? error.response.detail : "The server encountered an unexpected error whilst processing your request.", {
        variant: 'error'
      })
    }
  }

  const handleDelete = async () => {
    try {
      await EmployeesApi.delete(employeeId) 
      enqueueSnackbar("Successfully deleted employee.", {
        variant: 'success'
      })
    } catch (error) {
      enqueueSnackbar(error && error.response && error.response.detail ? error.response.detail : "The server encountered an unexpected error whilst processing your request.", {
        variant: 'error'
      })
    }
  }


  React.useEffect(() => {
    fetchUser()
  }, [])


  return (
    <View>
      <Container maxWidth='xl' style={{ textAlign: 'left' }}>
        <Header breadcrumbs={[
          {
            title: 'Users',
            to: '/dashboard/developer/users',
          },
          {
            title: employee ? employee.first_name + ' ' + employee.last_name : 'Manage User',
            to: `/dashboard/developer/users/${employeeId}`
          }
        ]}>Users</Header>
        <br />
        <Button variant='contained' startIcon={<Delete />} color='error' onClick={handleDelete}>DELETE USER</Button>
        <br />
        <br />
        <UserProfile user={employee} />
        <br />
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Profile" value="1" />
              <Tab label="Analytics" value="2" />
            </TabList>
          </Box>
          <TabPanel style={{ paddingLeft: 0, paddingRight: 0 }} value="1">
            <Grid container spacing={3}>
              <Grid item xs={isMobile ? 12 : 3}>
                <Card square>
                  <CardContent>
                    <Typography variant="body1" color="textSecondary"><strong>Department</strong></Typography>
                    <Typography variant="body2" color="textSecondary">This user belongs to the following department:</Typography>
                    <br />
                    <Link underline='hover'>{employee ? employee.department.department_name : <Skeleton />}</Link>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={isMobile ? 12 : 6}>
                <PaginationTable
                  data={clockins}
                  count={totalClockins}
                  loading={!clockins}
                  // rowsPerPage={rowsPerPage}
                  // onPageChange={(newPg) => {
                  //     fetchPackages(newPg)
                  // }}
                  // onRowsPerPageChange={(newRowsPg) => {
                  //     setRowsPerPage(newRowsPg)
                  //     fetchPackages(0, newRowsPg)
                  // }}
                  renderEmpty={() => (
                    <Grid textAlign='center'>
                      <WatchLater opacity={0.1} style={{ fontSize: '80px' }} />
                      <Typography variant='h6' style={{ opacity: 0.3 }}><strong>No Clockins Found</strong></Typography>
                      <Typography variant='caption' color='textSecondary' style={{ opacity: 0.5 }}>No clockins were found for this employee.</Typography>
                    </Grid>
                  )}
                  columns={[
                    {
                      name: 'Clockin Time',
                      field: 'clockin_time',
                      width: 120,
                    },
                    {
                      name: 'Clockout Time',
                      field: 'clockout_time',
                      width: 120,
                    },
                  ]}
                />
              </Grid>
              <Grid item xs={isMobile ? 12 : 3}>
                <Card square>
                  <CardContent>
                    <Typography variant="body1" color="textSecondary"><strong>Events Served</strong></Typography>
                    <Typography variant="body2" color="textSecondary">This employee has serviced the following event types in the past:</Typography>
                    <br />
                    <Chip label='test' />
                  </CardContent>
                </Card>
                <br />
                <Typography marginBottom={1} variant="body1" color="textSecondary"><strong>Works With</strong></Typography>
                <Divider />
                <br />
                {relatedEmployees.length > 0 ? relatedEmployees.map(employee => (
                  <>
                    <Grid container spacing={1} alignItems='center'>
                      <Grid item>
                        <Avatar style={{ height: '50px', width: '50px' }} />
                      </Grid>
                      <Grid item style={{ textAlign: 'left' }}>
                        <Typography variant="body1" color="textSecondary"><strong>{employee.first_name + ' ' + employee.last_name}</strong></Typography>
                        <Typography variant="body2" color="textSecondary">{employee.title ? employee.title : 'Unknown'}</Typography>
                      </Grid>
                    </Grid>
                    <br />
                  </>
                )) : <LoadingCircle />}
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value="2">Coming soon</TabPanel>
        </TabContext>
      </Container>
    </View>
  )
}


export default UserProfileScreen