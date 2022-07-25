import React from 'react'
import View from '../../components/View'
import Container from "@mui/material/Container"
import Header from '../../components/Header'
import Button from '@mui/material/Button'
import AddCircle from '@mui/icons-material/AddCircle'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Business from '@mui/icons-material/Business'
import PaginationTable from '../../../../components/Table'
import CompanyApiController from '../../../../api/impl/CompanyApiController'
import { useSnackbar } from 'notistack'
import AddCompanyDialog from '../../components/AddCompanyDialog'
import IconButton from '@mui/material/IconButton'
import MoreVert from '@mui/icons-material/MoreVert'

/**
 * The ManageCompaniesScreen is an interactive menu reserved only for developers
 * and administrators. This screen allows users with elevated privilege to manage
 * setup for new companies within the application.
 * @author chrisrinaldi
 * @date 18 July, 2022
 * @returns {JSX.Element}
 */
const ManageCompaniesScreen = () => {


  let CompaniesApi = new CompanyApiController()

  const { enqueueSnackbar } = useSnackbar();

    const [companies, setCompanies] = React.useState([])

    const [rowsPerPage, setRowsPerPage] = React.useState(5)

    const [totalRecords, setTotalRecords] = React.useState(0)

    const [loading, setLoading] = React.useState(true)

    const [searchQuery, setSearchQuery] = React.useState('')

    const [isAddCompanyOpen, setIsAddCompanyOpen] = React.useState(false)

  const fetchCompanies = async (page = 0, rowsPerPage = 5) => {
    try {
      if (!loading) setLoading(true)

            let query = {
                page: page,
                limit: rowsPerPage,
                sort: '^name',
                include_totals: true
            }

            if (searchQuery !== '') query['name'] = searchQuery

            const companies = await CompaniesApi.findAll(query)
            setCompanies(companies.records)
            setTotalRecords(companies.total_records)
            setLoading(false)

    } catch (error) {
      enqueueSnackbar(error && error.response ? error.response.detail : "The server encountered an error whilst processing your request.", {
        variant: 'error'
      })
    }
  }

  React.useEffect(() => {
    fetchCompanies()
  }, [])

  return ( <View>
    <Container maxWidth='xl'>
        <Header action={<Button style={{height: '50px'}} startIcon={<AddCircle/>} onClick={() => { setIsAddCompanyOpen(true) }} variant="contained">New Company</Button>}>Developer Menu</Header>
        <br/>
        <PaginationTable
                    data={companies}
                    count={totalRecords}
                    loading={loading}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(newPg) => {
                        fetchCompanies(newPg)
                    }}
                    onRowsPerPageChange={(newRowsPg) => {
                        setRowsPerPage(newRowsPg)
                        fetchCompanies(0, newRowsPg)
                    }}
                    renderEmpty={() => (
                        <Grid textAlign='center'>
                            <Business opacity={0.1} style={{ fontSize: '80px' }} />
                            <Typography variant='h6' style={{ opacity: 0.3 }}><strong>No Companies Found</strong></Typography>
                            <Typography variant='caption' color='textSecondary' style={{ opacity: 0.5 }}>No companies were found. To get started, please add a company.</Typography>
                        </Grid>
                    )}
                    columns={[
                        {
                            name: 'Company Name',
                            field: 'name'
                        },
                        {
                            name: 'About',
                            field: 'about',
                            renderCell: (row) => (
                                <div style={{ maxWidth: '250px', maxHeight: '75px', overflow: 'hidden' }}>
                                    <Typography variant='caption'>
                                        {row.about ? row.about : 'None provided.'}
                                    </Typography>
                                </div>
                            )
                        },
                        {
                          name: 'Address',
                          field: 'address_street',
                          renderCell: (row) => (
                            <>
                              {row.address_street + ' ' + row.city + ' ' + row.state + ' ' + row.zip_code}
                            </>
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
                <AddCompanyDialog open={isAddCompanyOpen} onSuccess={() => { 
                  setIsAddCompanyOpen(false)
                  fetchCompanies() }} handleClose={() => { setIsAddCompanyOpen(false) }}/>
    </Container>
  </View>
  )
}


export default ManageCompaniesScreen