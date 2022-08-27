import React from 'react'
import Header from '../../../components/Header'
import Container from '@mui/material/Container'
import View from '../../../components/View'
import EmployeeApiController from '../../../../../api/impl/EmployeeApiController'
import { useParams } from 'react-router-dom'
import EventApiController from '../../../../../api/impl/EventApiController'
import PackageApiController from '../../../../../api/impl/PackageApiController'
import EventSummary from '../../../components/EventSummary'

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

  const [loading, setLoading] = React.useState(true)

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

        const employees = await EmployeesApi.findAll()

        if (employees && employees.length > 0) {
          let newEmployeeIdToEmployee = {}
          employees.map(employee => {
            newEmployeeIdToEmployee[employee.id] = employee
          })
          setEmployeeIdToEmployee(newEmployeeIdToEmployee)

          let newPackageIdToPackage = {}
          packages.map(pkg => {
            newPackageIdToPackage[pkg.id] = pkg
          })
          setPackageIdToPackage(newPackageIdToPackage)
          setEvent(newEvent)
          setLoading(false)
        }
      }
    }
  }

  React.useEffect(() => {
    fetchData();
  }, [])

  return (<View>
    <Container style={{ textAlign: 'left' }} maxWidth={'xl'}>
      <Header breadcrumbs={[
        {
          title: 'Schedule',
          to: '/dashboard/events'
        },
        {
          title: event ? event.name : '',
          to: `/dashboard/events/${eventId}/summary`
        }
      ]}>{!event ? '' : event.name}</Header>
      <br/>
      <EventSummary loading={loading} event={event} packageIdToPackage={packageIdToPackage} employeeIdToEmployee={employeeIdToEmployee}/>
    </Container>
  </View>
  )
}

export default EventSummaryScreen