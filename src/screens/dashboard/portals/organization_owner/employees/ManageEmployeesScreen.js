import React, {useState, useEffect } from 'react';
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import './ManageEmployeeScreen.css'
import EmployeeApiController from '../../../../../api/impl/EmployeeApiController';
import { useSnackbar } from 'notistack'
import Header from '../../../components/Header';
import View from '../../../components/View'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Autocomplete from '@mui/material/Autocomplete'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Delete from '@mui/icons-material/Delete'
import Description from '@mui/icons-material/Description'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Festival from '@mui/icons-material/Festival'
import History from '@mui/icons-material/History'
import HowToReg from '@mui/icons-material/HowToReg'
import Search from '@mui/icons-material/Search'
import Undo from '@mui/icons-material/Undo'
import PaginationTable from '../../../../../components/Table';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import DepartmentApiController from '../../../../../api/impl/DepartmentApiController';

/**
 * The ManageEmployesScreen is meant to display a table of all active employees
 * and allow to edit existing employees. It features an 'add employee' button which
 * presents a modal that allows the user to import a new employee.
 * 
 * @returns {JSX.Element}
 */
const ManageEmployeesScreen = () => {

  const EmployeesApi = new EmployeeApiController();
  const DepartmentsApi = new DepartmentApiController();

  const {enqueueSnackbar} = useSnackbar()

  /**
   * Fetches data from the database, sets the dataSet state
   * variable to the promisified data.
   */
  const fetchData = async (page=0, rowsPerPage=5) => {
    setLoading(true)
    try {
      const employees = await EmployeesApi.findAll({
        include_totals: true,
        sort: '^last_name',
        page: page,
        limit: rowsPerPage
      })
      const departments = await DepartmentsApi.findAll();
      let newDepartmentIdToDepartment = {}
      departments.map(department => {
        newDepartmentIdToDepartment[department.id] = department
      })
        setDepartmentIdToDepartment(newDepartmentIdToDepartment)
        setEmployees(employees.records)
        setTotalEmployees(employees.total_records)
        setLoading(false)
    } catch (error) {
      enqueueSnackbar(error.response && error.response.detail || "An unknown error has occurred!", {
        variant: 'error'
      })
    }
  }

  /**
   * Represents the data set for the employee's respective department.
   */
  const [employees, setEmployees] = useState({})

  const [totalEmployees, setTotalEmployees] = useState(0)

  /**
   * Represents the mapping of department IDs to their respective departments.
   */
  const [departmentIdToDepartment, setDepartmentIdToDepartment] = useState({})

  /**
   * Represents whether the data has been loaded into memory.
   */
  const [loading, setLoading] = useState(false)

  const [rowsPerPage, setRowsPerPage] = useState(5)

  const navigate = useNavigate();

  /**
   * Represents a listing of the currently selected employees,
   * obtained via onSelectionModelChanged.
   */
  const [selectedEmployees, setSelectedEmployees] = useState([])


  /**
   * Handles action taken when employees are selected and confirmed
   * for deletion.
   */
   const handleDeleteEmployees = (employeeIndex=0) => {
    if (employeeIndex >= selectedEmployees.length) {
      enqueueSnackbar('Successfully deleted ' + selectedEmployees.length + ' employees.',{
        variant: 'success'
      })
      setSelectedEmployees([])
      fetchData()
    }
      EmployeesApi.delete(selectedEmployees[employeeIndex]).then(next => {
        handleDeleteEmployees(++employeeIndex)
      }, (error) => {
        enqueueSnackbar(error.response && error.response.detail || "An unknown error has occurred!", {
          variant: 'error'
        })
      })
  }

  const handleSelectEmployee = (employeeId) => {
    if (selectedEmployees.includes(employeeId)) {
     let newSelectedEmployees = [...selectedEmployees]
     newSelectedEmployees = newSelectedEmployees.filter(id => id !== employeeId) 
     setSelectedEmployees(newSelectedEmployees)
    } else {
      let newSelectedEmployees = [...selectedEmployees, employeeId]
      setSelectedEmployees(newSelectedEmployees)
    }
  }

  const handleSelectAll = () => {
    let newSelectedEmployees = employees.map(employee => employee.id)
    setSelectedEmployees(newSelectedEmployees)
  }

  /**
   * Handles action taken when the modal opens.
   */
  const handleOpenAdd = () => {
    navigate('/dashboard/signup')
  }
  


  /**
   * On render, we will fetch information about the employees as well
   * as their respective department and payroll info.
   */
  useEffect(() => {
    fetchData()
  }, []);

  return (
    <View>
    <Container maxWidth={'xl'}>
      <Header breadcrumbs={[
        {
          title: 'Manage Employees',
          to: '/dashboard/manage'
        }
      ]}>Manage Employees</Header>
      <br/>
      <Card variant='outlined' style={{textAlign: 'left'}}>
        <CardContent>
          <Typography variant='h6'><strong>Employees</strong></Typography>
          <br/>
          <CardActions>
            <Button startIcon={<HowToReg/>} onClick={handleOpenAdd} variant='contained' size='small'>Register</Button>
            <Button startIcon={<Festival/>} onClick={handleOpenAdd} variant='contained' size='small'>Events</Button>
            <Button disabled={selectedEmployees == 0} onClick={() => {handleDeleteEmployees()}} color='error' startIcon={<Delete/>} variant='contained' size='small'>Delete</Button>
            <Button startIcon={<History/>} color='inherit' size='small'>Timesheets</Button>
            <Button startIcon={<Description/>} color='inherit' size='small'>Export to CSV</Button>
          </CardActions>
          <br/>
          <Accordion expanded variant='outlined'>
            <AccordionSummary expandIcon={<ExpandMore/>}>
              <Typography variant='body2' color='textSecondary'>Filters</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container rowGap={3} columnSpacing={2}>
                  <Grid item xs={6}>
                    <TextField disabled={loading} label='Email address' size='small' fullWidth variant='outlined'/>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField disabled={loading} label='Last name' size='small' fullWidth variant='outlined'/>
                  </Grid>
                  <Grid item xs={6}>
                  <Autocomplete
                        id="user-input"
                        options={['r']}
                        disabled={loading}
                        fullWidth
                        // onChange={(_, newValue) => {
                        //     handleFieldDidChange('company_id', newValue.id)
                        // }}
                        autoHighlight
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size={'small'}
                                fullWidth
                                label="Role"
                                variant={'outlined'}
                                InputProps={{
                                    ...params.InputProps,
                                    autoComplete: 'new-password',
                                    endAdornment: (
                                        <React.Fragment>
                                            {/* {companies.length === 0 ? <CircularProgress color="inherit" size={20} /> : null} */}
                                            <InputAdornment>
                                              <Divider orientation='vertical'/>
                                            </InputAdornment>
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                            />
                        )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                  <TextField disabled={loading} label='Title' size='small' fullWidth variant='outlined'/>
                  </Grid>
                </Grid>
                <CardActions style={{float: 'right', marginTop: '15px', marginBottom: '10px'}}>
                  <LoadingButton loading={loading} startIcon={<Search/>} variant='contained' size='small'>Search</LoadingButton>
                  <Button startIcon={<Undo/>} color='inherit' size='small'>Reset</Button>
                </CardActions>
            </AccordionDetails>
          </Accordion>
          <br/>
          <PaginationTable
            variant='outlined'
            data={employees}
            count={totalEmployees}
            loading={loading}
            rowsPerPage={rowsPerPage}
            onPageChange={(newPg) => {
                fetchData(newPg, rowsPerPage)
            }}
            onRowsPerPageChange={(newRowsPg) => {
                setRowsPerPage(newRowsPg)
                fetchData(0, newRowsPg)
            }}
            renderEmpty={() => (
                <Grid textAlign='center'>
                    {/* <AdminPanelSettings opacity={0.1} style={{ fontSize: '80px' }} /> */}
                    <Typography variant='h6' style={{ opacity: 0.3 }}><strong>No Users Found</strong></Typography>
                    <Typography variant='caption' color='textSecondary' style={{ opacity: 0.5 }}>No users were found. To get started, please add a user.</Typography>
                </Grid>
            )}
            columns={[
                {
                  name: <Checkbox onClick={handleSelectAll} />,
                  field: 'first_name',
                  width: 15,
                  renderCell: (row) => (
                    <Checkbox checked={selectedEmployees.includes(row.id)} size='small' onClick={() => { handleSelectEmployee(row.id) }}/>
                  )
                },
                {
                  name: 'Avatar',
                  renderCell: (row) => (
                    <Avatar src={row.img_url}/>
                  )
                },
                {
                  name: 'First Name',
                  field: 'first_name',
                  renderCell: (row) => (
                      <div style={{ maxWidth: '250px', maxHeight: '75px', overflow: 'hidden' }}>
                          <Typography variant='caption'>
                              {row.first_name ? row.first_name : 'None provided.'}
                          </Typography>
                      </div>
                  )
              },
              {
                  name: 'Last Name',
                  field: 'last_name',
                  renderCell: (row) => (
                      <div style={{ maxWidth: '250px', maxHeight: '75px', overflow: 'hidden' }}>
                          <Typography variant='caption'>
                              {row.last_name ? row.last_name : 'None provided.'}
                          </Typography>
                      </div>
                  )
              },
                {
                    name: 'Email',
                    field: 'email'
                },
                {
                    name: 'Pay Rate',
                    field: 'pay_rate',
                    renderCell: (row) => (
                        <>
                            {row.pay_rate}<Typography variant='caption' color='textSecondary'> /hr</Typography>
                        </>
                    )
                },
                {
                  name: "Department",
                  field: "department.department_id",
                    renderCell: (row) => (
                        <Chip color='info' label={departmentIdToDepartment[row.department_id].department_name}/>
                    )
                },
                // {
                //     name: '',
                //     width: 20,
                //     renderCell: (row) => (
                //         <IconButton>
                //             <MoreVert/>
                //         </IconButton>
                //     )
                // }
            ]}
          />
        </CardContent>
      </Card>
        </Container>
    </View>
  )
};

export default ManageEmployeesScreen;
