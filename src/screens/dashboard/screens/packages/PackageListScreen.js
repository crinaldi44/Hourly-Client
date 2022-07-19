import React from 'react'
import View from '../../components/View'
import Container from "@mui/material/Container"
import Header from '../../components/Header'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Festival from '@mui/icons-material/Festival'
import Typography from '@mui/material/Typography'
import AddCircle from '@mui/icons-material/AddCircle'
import PaginationTable from '../../../../components/Table'
import PackageApiController from '../../../../api/impl/PackageApiController'
import Checkbox from '@mui/material/Checkbox'
import { useSnackbar } from 'notistack'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import ExpandMore from '@mui/icons-material/ExpandMore'
import InsertPhoto from '@mui/icons-material/InsertPhoto'
import MonetizationOn from '@mui/icons-material/MonetizationOn'
import TextField from '@mui/material/TextField'
import Search from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import LoadingButton from '@mui/lab/LoadingButton'

/**
 * The PackageListScreen is a view that is intended to display all
 * available packages to users.
 * @author chrisrinaldi
 * @date 17 July, 2022
 * @returns {JSX.Element}
 */
const PackageListScreen = () => {

    let PackagesApi = new PackageApiController();

    const [packages, setPackages] = React.useState([])

    const [rowsPerPage, setRowsPerPage] = React.useState(5)

    const [totalRecords, setTotalRecords] = React.useState(0)

    const [loading, setLoading] = React.useState(true)

    const [searchQuery, setSearchQuery] = React.useState('')

    const { enqueueSnackbar } = useSnackbar();

    const fetchPackages = async (page = 0, rowsPerPage = 5) => {
        try {
            if (!loading) setLoading(true)

            let query = {
                page: page,
                limit: rowsPerPage,
                sort: '^name',
                include_totals: true
            }

            if (searchQuery !== '') query['name'] = searchQuery

            const packages = await PackagesApi.findAll(query)
            setPackages(packages.records)
            setTotalRecords(packages.total_records)
            setLoading(false)
        } catch (error) {
            enqueueSnackbar(error && error.response ? error.response.details : "The server encountered an error whilst processing your request.", {
                variant: 'error'
            })
        }
    }

    React.useEffect(() => {
        fetchPackages(0, rowsPerPage)
    }, [])

    const handleSearchQueryChanged = (e) => {
        setSearchQuery(e.target.value)
    }

    return (
        <View>
            <Container maxWidth='xl'>
                <Header action={<Button style={{ height: '50px' }} startIcon={<AddCircle />} variant="contained">New Package</Button>}>Manage Packages</Header>
                <br />
                <Card square style={{textAlign: 'left'}}>
                    <CardContent>
                        <Typography>
                            <strong>What are you looking for?</strong>
                        </Typography>
                        <Grid container marginTop={0.001} alignItems={'center'} spacing={2}>
                            <Grid item xs={10}>
                                <TextField fullWidth size='small' 
                                    value={searchQuery}
                                    onChange={handleSearchQueryChanged}
                                    disabled={loading}
                                InputProps={{
                                        startAdornment: <InputAdornment position='start'>
                                            <Search />
                                        </InputAdornment>
                                    }}
                                        variant='filled' placeholder='Search for packages by name...' />
                            </Grid>
                            <Grid item xs={2}>
                                <LoadingButton onClick={() => { fetchPackages(0, rowsPerPage) }} loading={loading} fullWidth size='large' variant='contained'>Search</LoadingButton>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <br />
                <PaginationTable
                    data={packages}
                    count={totalRecords}
                    loading={loading}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(newPg) => {
                        fetchPackages(newPg)
                    }}
                    onRowsPerPageChange={(newRowsPg) => {
                        setRowsPerPage(newRowsPg)
                        fetchPackages(0, newRowsPg)
                    }}
                    renderEmpty={() => (
                        <Grid textAlign='center'>
                            <Festival opacity={0.1} style={{ fontSize: '80px' }} />
                            <Typography variant='h6' style={{ opacity: 0.3 }}><strong>No Packages Found</strong></Typography>
                            <Typography variant='caption' color='textSecondary' style={{ opacity: 0.5 }}>No packages were found. To get started, please add a package.</Typography>
                        </Grid>
                    )}
                    columns={[
                        {
                            name: '',
                            width: 120,
                            renderCell: () => (
                                <Tooltip title="More details">
                                    <IconButton size='small'>
                                        <ExpandMore />
                                    </IconButton>
                                </Tooltip>
                            )
                        },
                        {
                            name: 'Image',
                            field: 'img_url',
                            renderCell: (item) => (
                                <Avatar style={{ width: '70px', height: '70px' }} variant='square' src={item}><InsertPhoto /></Avatar>
                            )
                        },
                        {
                            name: 'Name',
                            field: 'name'
                        },
                        {
                            name: 'Description',
                            field: 'description',
                            renderCell: (row) => (
                                <div style={{ maxWidth: '250px', maxHeight: '75px', overflow: 'hidden' }}>
                                    <Typography variant='caption'>
                                        {row.description ? row.description : 'None provided.'}
                                    </Typography>
                                </div>
                            )
                        },
                        {
                            name: 'Pricing',
                            field: 'price',
                            renderCell: (price) => (
                                <Chip color='primary' size='small' icon={<MonetizationOn fontSize='small' />} label={"$" + parseFloat(price.price).toFixed(2)} />
                            )
                        },
                        {
                            name: 'Active',
                            renderCell: (data) => (
                                <Checkbox />
                            )
                        }
                    ]}
                />
            </Container>
        </View>
    )
}


export default PackageListScreen