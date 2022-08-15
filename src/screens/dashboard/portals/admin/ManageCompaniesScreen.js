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
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Search from '@mui/icons-material/Search'
import Pagination from '@mui/material/Pagination'
import LinearProgress from '@mui/material/LinearProgress'
import { Avatar, CardActionArea, ImageList, ImageListItem, List, ListItem, ListItemButton, ListItemText, ListSubheader } from '@mui/material'
import DirectoryFilter from '../../components/DirectoryFilter'

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

    const [page, setPage] = React.useState(1)

    const [totalRecords, setTotalRecords] = React.useState(0)

    const [loading, setLoading] = React.useState(true)

    const [searchQuery, setSearchQuery] = React.useState('')

    const [isAddCompanyOpen, setIsAddCompanyOpen] = React.useState(false)

  const fetchCompanies = async (page = 0, rowsPerPage = 15) => {
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
        <Header breadcrumbs={[{
            title: 'Company Directory',
            to: '/dashboard/developer'
        }]} action={<Button startIcon={<AddCircle/>} onClick={() => { setIsAddCompanyOpen(true) }} variant="contained">New Company</Button>}>Company Directory</Header>
        <br/>
        <Grid container spacing={3}>
          <Grid item xs={3} style={{textAlign: 'left'}}>
            <Card variant='outlined'>
              <CardContent>
              <TextField
              disabled={loading}
              onChange={(e) => {
                setSearchQuery(e.target.value)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  fetchCompanies()
                }
              }}
            fullWidth
            InputProps={{
              endAdornment: <InputAdornment>
              <Search/>
              </InputAdornment>
            }}
            size='small' color='primary' variant='filled' placeholder='Search...'/>
              </CardContent>
            </Card>
            <br/>
            <DirectoryFilter
              disabled={loading}
              filters={[{
                category: 'Company size',
                type: 'checkbox',
                fieldName: 'compSize',
                options: ['1-50', 'Greater than 50', 'Greater than 100', 'Greater than 500', '1000 or more']
              },
              {
                category: 'Sort',
                fieldName: 'sort',
                type: 'chip',
                options: ['Sort alphabetically by name', 'Sort alphabetically descending by name']
              },
              {
                category: 'Sort',
                fieldName: 'test',
                type: 'dropdown',
                options: ['Sort alphabetically by name', 'Sort alphabetically descending by name']
              }
            ]}
            />
          </Grid>
          <Grid item xs={9}>
            <Card variant='outlined'>
              <CardContent style={{textAlign: 'left'}}>
                <Typography variant='h6'><strong>Companies ({totalRecords})</strong></Typography>
              </CardContent>
              <Divider/>
              {loading && <LinearProgress/>}
              <CardContent>
                <br/>
                <ImageList cols={5} rowHeight={190}>
              {companies.length > 0 && companies.map(company => (
                <ImageListItem style={{marginRight: '5px'}}>
                <Card variant='outlined' style={{height: '175px'}}>
                  <CardActionArea style={{height: '100%'}}>
                    <CardContent>
                          <Avatar variant='rounded' src={company.logo_url}/>
                          <br/>
                          <div style={{textAlign: 'left'}}>
                            <Typography variant='body2'><strong>{company.name}</strong></Typography>
                      <Typography variant='caption' color='textSecondary'>{company.city + ', ' + company.state}</Typography>
                          </div>
                        
                    </CardContent>
                  </CardActionArea>
                </Card>
              </ImageListItem>
              ))}
            </ImageList>
              </CardContent>
              <Divider/>
              <CardContent>
              <Pagination variant='outlined' page={page} onChange={(e, newPage) => {
              fetchCompanies(newPage - 1)
              setPage(newPage)
            }} color='primary' count={Math.ceil(parseInt(totalRecords) / 15)} showFirstButton showLastButton />
              </CardContent>
            </Card>
            
            
          </Grid>
        </Grid>
                <AddCompanyDialog open={isAddCompanyOpen} onSuccess={() => { 
                  setIsAddCompanyOpen(false)
                  fetchCompanies() }} handleClose={() => { setIsAddCompanyOpen(false) }}/>
    </Container>
  </View>
  )
}


export default ManageCompaniesScreen