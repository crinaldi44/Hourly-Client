import React, { useState, useEffect } from 'react'
import { Accordion, AccordionSummary, AccordionDetails } from "../../../components/AccordionView";
import { ExpandMore } from "@mui/icons-material";
import {
  Typography,
  Button,
  Stack,
  Select,
  MenuItem
} from '@mui/material'
import LoadingCircle from '../../../../../components/LoadingCircle';
import EmployeeService from '../../../../../services/EmployeeService'
import useConfirmationDialog from '../../../../../hooks/ui/Confirmation';
import EmployeeApiController from '../../../../../api/impl/EmployeeApiController';
import DepartmentApiController from '../../../../../api/impl/DepartmentApiController';
import {useSnackbar} from 'notistack'


/**
 * DepartmentDetails will allow us to render a department's details within the accordion while
 * also allowing us to submit changes to that department.
 * @param {*} props 
 */
const DepartmentDetails = (props) => {

  const [employees, setEmployees] = useState(null)

  const [selected, setSelected] = useState(props.department.manager_id || 0)

  const EmployeesApi = new EmployeeApiController();

  const fetchEmployees = async () => {
    try {
      let response = await EmployeesApi.findAll({
        department_id: props.department.id
      })
      setEmployees(response)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, [])

  const handleChange = (event) => {
    setSelected(event.target.value)
  }

  /**
   * Updates the manager of department to the selected.
   */
  const handleSubmit = async () => {

    let department = {
      ...props.department,
      manager_id: selected
    }
    const response = await EmployeeService.updateDepartment(department)
    // TODO: Queue snackbar.
  }


  return (
    !employees ? <LoadingCircle /> :
      <AccordionDetails>
        <Typography textAlign='left' marginBottom='20px'><b>Employees:</b> {employees.length}</Typography>
        <Stack direction='column'>
          <Typography textAlign='left'><b>Manager: </b></Typography>
          <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selected}
              label="Age"
              onChange={handleChange}
              sx={{height: '40px', maxWidth: '175px'}}
            >
              <MenuItem value={0}><i>None</i></MenuItem>
              {employees.map(employee => (
                <MenuItem key={employee.id} value={employee.id}>{employee.name}</MenuItem>
              ))}
            </Select>
        </Stack>
        <Stack direction='row' sx={{ mt: 5 }}>
          <Button variant="contained" color="error" onClick={() => {
            props.setConfirm(`Are you sure you wish to delete the ${props.department.department_name} department?`)
            props.setConfirmOpen(true);
          }}>Delete</Button>
          <Button sx={{ ml: 2 }} disabled={selected === props.department.manager_id} variant='contained' onClick={handleSubmit}>Submit</Button>
        </Stack>
      </AccordionDetails>
  )
}

/**
 * The Departments accordion is meant to display a listing of all active
 * departments.
 * @param props represents the props to accept
 **/
const Departments = () => {

  /**
   * Represents all currently stored departments.
   */
  const [departments, setDepartments] = useState([])

  /**
   * Represents a hook into the snackbar functionality.
   */
  const {enqueueSnackbar} = useSnackbar()

  /**
   * Represents the Departments API instance.
   */
  const DepartmentsApi = new DepartmentApiController();

  /**
   * Represents the currently opened department
   */
  const [currentDepartment, setCurrentDepartment] = useState(0)

  /**
* Deletes the specified department.
*/
  async function deleteDepartment() {
    try {
      await DepartmentsApi.delete(currentDepartment)
      enqueueSnackbar("Department successfully deleted.", {
        variant: 'success'
      })
    } catch (error) {
      enqueueSnackbar(error.response && error.response.detail || "The server encountered an error whilst processing your request.", {
        variant: 'error'
      })
    }
  }

  /**
   * Represents the Confirmation dialog for deletion.
   */
  const [setConfirmOpen, setConfirmAction, setConfirmMessage, Confirm] = useConfirmationDialog(deleteDepartment)


  /**
   * Fetches data from the server.
   */
  const fetchData = async () => {
    try {
      let departments = await DepartmentsApi.findAll()
      setDepartments(departments);
    } catch (error) {
      enqueueSnackbar(error.response && error.response.detail || "The server encountered an unexpected error whilst processing your request.", {
        variant: 'error'
      })
    }
  }

  /**
   * Represents action taken when the component renders.
   */
  useEffect(() => {
    fetchData();
  }, [])

  const renderDepartments = (
    departments.map(department => (
      <Accordion key={department.id} expanded={currentDepartment === department.id} onChange={() => {
        setCurrentDepartment(currentDepartment === department.id ? null : department.id)
      }}>
        <AccordionSummary
          expandIcon={<ExpandMore />}>
          <Typography>{department.department_name}</Typography>
        </AccordionSummary>
        <DepartmentDetails department={department} setConfirm={setConfirmMessage} setConfirmOpen={setConfirmOpen} />
      </Accordion>
    ))
  )


  return (
    <div>
      {departments.length > 0 ? renderDepartments : <LoadingCircle />}
      {Confirm}
    </div>
  )
}

/**
 * The Departments accordion is meant to display a listing of all active
 * departments.
 **/
export default Departments