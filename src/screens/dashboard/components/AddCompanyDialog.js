import React, {useState, useEffect} from 'react'
import List from '@mui/material/List'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import FullscreenDialog from '../../../components/FullscreenDialog'
import EmployeeApiController from '../../../api/impl/EmployeeApiController';
import DepartmentApiController from '../../../api/impl/DepartmentApiController';
import CompanyApiController from '../../../api/impl/CompanyApiController';
import { useSnackbar } from 'notistack'

/**
 * Adds a company to the database.
 * @property open represents the state variable containing the 'open' state
 * @property handleClose represents the functionality on regular close
 * @property onConfirm represents what to do on confirm
 * @returns {JSX.Element}
 */
const AddCompanyDialog = (props) => {

    let EmployeesApi = new EmployeeApiController();
    let DepartmentsApi = new DepartmentApiController();
    let CompaniesApi = new CompanyApiController();

    const {enqueueSnackbar} = useSnackbar()


    /**
     * Builds a response.
     */
    const [responseObject, setResponseObject] = useState({
        'name': '',
        'about': '',
        'address_street': '',
        'city': '',
        'state': "none",
        'zip_code': '',
        'phone': ''
      })

    const resetEmployee = () => {
        setResponseObject({
            'name': '',
            'about': '',
            'address_street': '',
            'city': '',
            'state': "none",
            'zip_code': '',
            'phone': ''
          })
    }


    /**
     * Adds the employee to the DB.
     */
    const addEmployee = async () => {
        try {
          await CompaniesApi.add(responseObject)
          enqueueSnackbar("Successfully registered company.", {
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
     * Retrieves the data from the employee service.
     */
    async function retrieveData() {

        try {
            const departments = await DepartmentsApi.findAll()
        } catch (error) {
            enqueueSnackbar(error.response && error.response.detail || "An unknown error has occurred!", {
                variant: 'error'
            })
        }
    }
    

  return (
        <FullscreenDialog open={props.open} title="Add Company" handleClose={props.handleClose} handleConfirm={addEmployee}>
        <List>
        <Box sx={{width: '90%', ml: 'auto', mr: 'auto', mt: '1%'}}>
          <br/>
          <Card square>
            <CardContent>
                <Typography variant='h6'>Details</Typography>
                <Typography variant='body2' color='textSecondary'>Provide an overview of the company, including the name and a brief about-us.</Typography>
                <br/>
                <Stack direction={'column'}>
                <TextField fullWidth variant='filled' onChange={e => {handleChange(e, 'name')}} label="Company Name"/>
                <br/>
                <TextField fullWidth multiline minRows={4} variant='filled' onChange={e => {handleChange(e, 'about')}} label="About Us"/>
                </Stack>
            </CardContent>
          </Card>
          <br/>
          <Card square>
            <CardContent>
                <Typography variant='h6'>Location Information</Typography>
                <Typography variant='body2' color='textSecondary'>Provide an overview of the company's location.</Typography>
                <br/>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField variant='filled' fullWidth label="Street Address" onChange={e => {handleChange(e, 'address_street')}}/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField variant='filled' fullWidth label="City" onChange={e => {handleChange(e, 'city')}}/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField variant='filled' fullWidth label="State" onChange={e => {handleChange(e, 'state')}}/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField variant='filled' fullWidth label="Zip" onChange={e => {handleChange(e, 'zip_code')}}/>
                    </Grid>
                </Grid>
            </CardContent>
          </Card>
        </Box>
        </List>
      </FullscreenDialog>
  )
}

/**
 * 
 * 
 * */
export default AddCompanyDialog