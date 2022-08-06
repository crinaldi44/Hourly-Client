import React from 'react'
import View from '../../components/View'
import Container from "@mui/material/Container"
import Header from '../../components/Header'
import Button from '@mui/material/Button'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import PaginationTable from '../../../../components/Table'
import { useSnackbar } from 'notistack'
import IconButton from '@mui/material/IconButton'
import MoreVert from '@mui/icons-material/MoreVert'
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings'
import EmployeeApiController from "../../../../api/impl/EmployeeApiController";
import CompanyApiController from "../../../../api/impl/CompanyApiController";
import RoleApiController from "../../../../api/impl/RoleApiController";
import {useNavigate} from "react-router-dom";

/**
 * The ManageCompaniesScreen is an interactive menu reserved only for developers
 * and administrators. This screen allows users with elevated privilege to manage
 * setup for new companies within the application.
 * @author chrisrinaldi
 * @date 18 July, 2022
 * @returns {JSX.Element}
 */
const ManageUsersScreen = () => {


    let EmployeeApi = new EmployeeApiController()
    let CompanyApi = new CompanyApiController()
    let RolesApi = new RoleApiController()

    const navigate = useNavigate()

    const { enqueueSnackbar } = useSnackbar();

    const [users, setUsers] = React.useState([])

    const [rowsPerPage, setRowsPerPage] = React.useState(5)

    const [totalRecords, setTotalRecords] = React.useState(0)

    const [loading, setLoading] = React.useState(true)

    const [searchQuery, setSearchQuery] = React.useState('')

    const [companyIdToCompany, setCompanyIdToCompany] = React.useState({})

    const [roleIdToRole, setRoleIdToRole] = React.useState({})

    const [isAddCompanyOpen, setIsAddCompanyOpen] = React.useState(false)

    const fetchUsers = async (page = 0, rowsPerPage = 5) => {
        try {
            if (!loading) setLoading(true)

            let query = {
                page: page,
                limit: rowsPerPage,
                sort: '^last_name',
                include_totals: true
            }

            if (searchQuery !== '') query['name'] = searchQuery

            const companies = await CompanyApi.findAll()
            let newCompanyIdToCompany = {}
            companies.map(company => {
                newCompanyIdToCompany[company.id] = company
            })
            setCompanyIdToCompany(newCompanyIdToCompany)
            const roles = await RolesApi.findAll()
            let newRoleIdToRole = {}
            roles.map(role => {
                newRoleIdToRole[role.id] = role
            })
            setRoleIdToRole(newRoleIdToRole)
            const users = await EmployeeApi.findAll(query)
            setUsers(users.records)
            setTotalRecords(users.total_records)
            setLoading(false)

        } catch (error) {
            enqueueSnackbar(error && error.response ? error.response.detail : "The server encountered an error whilst processing your request.", {
                variant: 'error'
            })
        }
    }

    React.useEffect(() => {
        fetchUsers()
    }, [])

    return ( <View>
            <Container maxWidth='xl'>
                <Header breadcrumbs={[
                    {
                        title: 'Users',
                        to: '/dashboard/developer/users',
                    }
                ]} action={<Button style={{height: '50px'}} startIcon={<PersonAdd/>} onClick={() => { navigate('/dashboard/developer/users/signup') }} variant="contained">New User</Button>}>Users</Header>
                <br/>
                <PaginationTable
                    data={users}
                    count={totalRecords}
                    onRowClick={(row) => {
                        navigate(`/dashboard/developer/users/${row.id}`)
                    }}
                    loading={loading}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(newPg) => {
                        fetchUsers(newPg)
                    }}
                    onRowsPerPageChange={(newRowsPg) => {
                        setRowsPerPage(newRowsPg)
                        fetchUsers(0, newRowsPg)
                    }}
                    renderEmpty={() => (
                        <Grid textAlign='center'>
                            <AdminPanelSettings opacity={0.1} style={{ fontSize: '80px' }} />
                            <Typography variant='h6' style={{ opacity: 0.3 }}><strong>No Users Found</strong></Typography>
                            <Typography variant='caption' color='textSecondary' style={{ opacity: 0.5 }}>No users were found. To get started, please add a user.</Typography>
                        </Grid>
                    )}
                    columns={[
                        {
                            name: 'Email',
                            field: 'email'
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
                            name: 'Pay Rate',
                            field: 'pay_rate',
                            renderCell: (row) => (
                                <>
                                    {row.pay_rate}
                                </>
                            )
                        },
                        {
                          name: "Company",
                          field: "company_id",
                          renderCell: (row) => (
                              <>{Object.keys(companyIdToCompany).length > 0 && row.role_id in Object.keys(companyIdToCompany) ? companyIdToCompany[row.company_id].name : ''}</>
                          )
                        },
                        {
                          name: "Department",
                          field: "department.department_id",
                            renderCell: (row) => (
                                <>{row.department.department_name}</>
                            )
                        },
                        {
                            name: '',
                            width: 20,
                            renderCell: (row) => (
                                <IconButton>
                                    <MoreVert/>
                                </IconButton>
                            )
                        }
                    ]}
                />
            </Container>
        </View>
    )
}


export default ManageUsersScreen