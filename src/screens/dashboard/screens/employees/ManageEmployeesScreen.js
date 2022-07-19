import React, {useState, useEffect } from 'react';
import axios from 'axios';
import { Button, IconButton, Chip, Container, Paper } from '@mui/material';
import { DataGrid, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
import './ManageEmployeeScreen.css'
import AddEmployeesDialog from '../../components/AddEmployeesDialog';
import useConfirmationDialog from '../../../../hooks/ui/Confirmation';
import DeleteIcon from '@mui/icons-material/Delete';
import { AddCircle } from '@mui/icons-material';
import EmployeeApiController from '../../../../api/impl/EmployeeApiController';
import { useSnackbar } from 'notistack'
import Header from '../../components/Header';
import View from '../../components/View'

/**
 * The ManageEmployesScreen is meant to display a table of all active employees
 * and allow to edit existing employees. It features an 'add employee' button which
 * presents a modal that allows the user to import a new employee.
 * 
 * @returns {JSX.Element}
 */
const ManageEmployeesScreen = () => {

  const EmployeesApi = new EmployeeApiController();

  const {enqueueSnackbar} = useSnackbar()

  /**
   * Fetches data from the database, sets the dataSet state
   * variable to the promisified data.
   */
  const fetchData = async () => {
    try {
      const employees = await EmployeesApi.findAll()
      let employeeIdToEmployee = {}
        employees.map(employee => {
          employeeIdToEmployee[employee.id] = employee
        })
        setEmployeeIdToEmployee(employeeIdToEmployee)
        setLoaded(true)
    } catch (error) {
      enqueueSnackbar(error.response && error.response.detail || "An unknown error has occurred!", {
        variant: 'error'
      })
    }
  }

  /**
   * Represents the data set for the employee's respective department.
   */
  const [employeeIdToEmployee, setEmployeeIdToEmployee] = useState({})

  /**
   * Represents whether the data has been loaded into memory.
   */
  const [loaded, setLoaded] = useState(false)

  /**
   * Represents whether the add dialog is open.
   */
  const [addOpen, setAddOpen] = useState(false)

  /**
   * Represents a listing of the currently selected employees,
   * obtained via onSelectionModelChanged.
   */
  const [selectedEmployees, setSelectedEmployees] = useState([])


  /**
   * Handles action taken when employees are selected and confirmed
   * for deletion.
   */
   const handleDeleteEmployees = async () => {
    let response = await Promise.all(selectedEmployees.map(employee => {
      // return EmployeeService.deleteEmployee(employee)
    })).finally(() => {
        setSelectedEmployees([])
        setTimeout(() => {
          fetchData()
        }, 1500) // Refresh after 1500ms
      }
    )
  }

  /**
   * Represents the confirmation dialog.
   */
  const [setDialogOpen, setDialogTitle, setDialogMessage, ConfirmDialog] = useConfirmationDialog(handleDeleteEmployees)

  /**
   * Handles action taken when the add modal closes.
   */
  const handleCloseAdd = () => {
    setAddOpen(false);
  }

  /**
   * Handles action taken when the modal opens.
   */
  const handleOpenAdd = () => {
    setAddOpen(true)
  }

  /**
   * Handles action taken when an employee is added.
   * @param response represents the response returned from building an employee
   */
  const handleAddEmployee = async (employee) => {
    try {
      let result = await EmployeesApi.add(employee) 
      enqueueSnackbar("Successfully added employee to database!", {
        variant: 'success'
      })
    } catch (error) {
      enqueueSnackbar(error.response.detail || 'An unknown error has occurred. Please try your request later.', {
        variant: 'error'
      })
    }
  }
  


  /**
   * On render, we will fetch information about the employees as well
   * as their respective department and payroll info.
   */
  useEffect(() => {
    fetchData()
  }, []);

  const columns = [
    { field: 'id', headerName: 'Id', width: 90 },
    {
        field: 'name',
        headerName: 'Name',
        width: 150,
        editable: true,
    },
    {
        field: 'title',
        headerName: 'Title',
        width: 300,
        editable: true,
    },
    {
      field: "department",
      headerName: 'Department',
      width: 150,
      editable: false,
      valueGetter: (params) =>
        `${params.row.department.department_name}`,
    },
    {
      field: 'reportsTo',
      headerName: 'Reports To',
      width: 150,
      editable: false,
      valueGetter: (params) =>
        `${employeeIdToEmployee[params.row.department.manager_id].name}`
    },
    {
      field: 'pay_rate',
      headerName: 'Pay Rate',
      width: 150,
      editable: false,
    },
    {
      field: 'covid_status',
      headerName: 'COVID-19 Status',
      width: 150,
      editable: false,
      renderCell: (params) => {
        const chipColor = params.value === 'Healthy' ? '#64e064' : '#ff5c33'
        return <Chip variant='outlined' sx={{height: '25px', minWidth: '90px', borderColor: chipColor, color: chipColor}} label={params.value}/>
      }
    }
  ]

  const toolbar = () => {
    return ( <GridToolbarContainer>
        <GridToolbar/>
        { selectedEmployees.length > 0 ? <Button onClick={() => {
          setDialogMessage(`Are you sure you want to delete ${selectedEmployees.length} employees?`)
          setDialogOpen(true)
        }} startIcon={<DeleteIcon/>} variant="outlined" color='error'>
          Delete
        </Button> : null}
      </GridToolbarContainer>
    )
  } 

  return (
    <View>
    <Container maxWidth={'xl'}>
      <Header action={<Button style={{height: '50px'}} onClick={(handleOpenAdd)} startIcon={<AddCircle/>} variant="contained">Add Employee</Button>}>Manage Employees</Header>
      <br/>
      <Paper style={{height: '500px'}}>
        <DataGrid rows={Object.values(employeeIdToEmployee)}
                loading={!loaded}
                columns={columns}
                pageSize={15}
                rowsPerPageOptions={[15]}
                checkboxSelection
                disableSelectionOnClick
                density='compact'
                onSelectionModelChange={sel => {setSelectedEmployees(sel)}}
                components={{Toolbar: toolbar}} />
      </Paper>
      <AddEmployeesDialog open={addOpen} handleClose={handleCloseAdd} onSuccess={() => {
          setAddOpen(false)
          fetchData()
        }} />
      {ConfirmDialog}
        </Container>
    </View>
  )
};

export default ManageEmployeesScreen;
