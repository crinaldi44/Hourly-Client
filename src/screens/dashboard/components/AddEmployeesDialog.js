import React, {useState, useEffect} from 'react'
import ListItem from '@mui/material/ListItem'
import List from '@mui/material/List'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import Box from '@mui/material/Box'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FullscreenDialog from '../../../components/FullscreenDialog'
import EmployeeApiController from '../../../api/impl/EmployeeApiController';
import DepartmentApiController from '../../../api/impl/DepartmentApiController';
import { useSnackbar } from 'notistack'
import Authentication from '../../../api/util/Authentication'

/**
 * Adds an employee to the database.
 * @property open represents the state variable containing the 'open' state
 * @property handleClose represents the functionality on regular close
 * @property onConfirm represents what to do on confirm
 * @returns {JSX.Element}
 */
const AddEmployeesDialog = (props) => {

    let EmployeesApi = new EmployeeApiController();
    let DepartmentsApi = new DepartmentApiController();

    const {enqueueSnackbar} = useSnackbar()


    /**
     * Builds a response.
     */
    const [responseObject, setResponseObject] = useState({
        'name': '',
        'email': '',
        'password': '',
        'title': '',
        'department_id': "none",
        'pay_rate': 0.0,
        'company_id': Authentication.getUsersCompany(),
      })

    const resetEmployee = () => {
        setResponseObject({
            'name': '',
            'email': '',
            'password': '',
            'title': '',
            'department_id': "none",
            'pay_rate': 0.0,
            'company_id': Authentication.getUsersCompany(),
          })
    }

    /**
     * Represents all departments.
     */
    const [departments, setDepartments] = useState([])


    /**
     * Adds the employee to the DB.
     */
    const addEmployee = async () => {
        try {
          await EmployeesApi.add(responseObject)
          enqueueSnackbar("Successfully added employee!", {
            variant: 'success'
          })
          props.onSuccess();
        } catch (error) {
            enqueueSnackbar(error.response.detail || "An unknown error has occurred!", {
                variant: 'error'
            })
        }
        resetEmployee()
    }

    /**
     * Handles logic that takes place when a field changes.
     * @param e represents the default event
     * @param {String} property represents the property to change.
     */
    const handleChange = (e, property) => {
      setResponseObject({
          ...responseObject,
          [property]: e.target.value
      })
    }

    /**
     * On render, fetch all departments from the listing.
     */
    useEffect(() => {
        if (props.open)
            retrieveData()
    }, [props.open])


    /**
     * Retrieves the data from the employee service.
     */
    async function retrieveData() {

        try {
            const departments = await DepartmentsApi.findAll()
            setDepartments(departments)
        } catch (error) {
            enqueueSnackbar(error.response && error.response.detail || "An unknown error has occurred!", {
                variant: 'error'
            })
        }
    }

    /**
     * Represents a mapping of department objects to a corresponding MenuItem
     * component.
     */
    const departmentMenuItems = (
        departments.map(department => (
            <MenuItem value={department.id}>{department.department_name}</MenuItem>
        ))
    )
    

  return (
        <FullscreenDialog open={props.open} title="Add Employee" handleClose={props.handleClose} handleConfirm={addEmployee}>
        <List>
        <Box sx={{width: '90%', ml: 'auto', mr: 'auto', mt: '1%'}}>
          <ListItem>
            <Typography>Employee information:</Typography>
          </ListItem>
          <Stack direction={'row'}>
            <ListItem sx={{width: '1fr'}}>
                <TextField  onChange={e => {handleChange(e, 'name')}} sx={{width: '100%'}} placeholder="Full name"/>
            </ListItem>
            <ListItem sx={{width: '1fr'}}>
                <TextField onChange={e => {handleChange(e, 'email')}} sx={{width: '100%'}} placeholder="Email address"/>
            </ListItem>
          </Stack>
            <Stack direction='row'>
                <ListItem>
                    <TextField sx={{width: '100%'}} placeholder="Title" onChange={e => {handleChange(e, 'title')}}/>
                </ListItem>
                <ListItem>
                    <TextField sx={{width: '100%'}} placeholder="Password" type='password' onChange={e => {handleChange(e, 'password')}}/>
                </ListItem>
            </Stack>
            <Stack direction='row'>
                <ListItem sx={{width: '1fr'}}>
                    <FormControl sx={{minWidth: '100%'}}>
                        <InputLabel>Department</InputLabel>
                        <Select
                        label="Department"
                        onChange={e => {handleChange(e, 'department_id')}}
                        value={responseObject.department_id}
                        >
                            <MenuItem key={`none`} value="none"><i>Select a department...</i></MenuItem>
                        {departmentMenuItems}
                        </Select>
                    </FormControl>
                </ListItem>
            <ListItem sx={{width: '1fr'}}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="outlined-adornment-amount">Pay Rate</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-amount"
                        onChange={e => {handleChange(e, 'pay_rate')}}
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        label="Amount"
                        placeholder='0.00'
                        type="number"
                        step="0.01"
                    />
                </FormControl>
            </ListItem>
          </Stack>
        </Box>
        </List>
      </FullscreenDialog>
  )
}

/**
 * 
 * 
 * */
export default AddEmployeesDialog