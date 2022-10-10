import React from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import View from '../../../components/View'
import Header from '../../../components/Header'
import TabView from '../../../components/TabView'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import { Alert, Card, CardContent, Divider, FormControl, FormLabel, IconButton, List, ListItem, ListItemIcon, ListItemText, MenuItem, Select, Switch } from '@mui/material'
import { ArrowRight, CalendarMonth, Delete, FileCopy, History, Home, LocationCity, PaidTwoTone, Public, Smartphone } from '@mui/icons-material'
import LoadingCircle from '../../../../../components/LoadingCircle'
import { LoadingButton } from '@mui/lab'
import EmployeeApiController from '../../../../../api/impl/EmployeeApiController'
import CompanyApiController from '../../../../../api/impl/CompanyApiController'
import Authentication from '../../../../../api/util/Authentication'

/**
 * Allows the org owner to edit their company.
 * @author chrisrinaldi
 * @date 21 August, 2022
 * @returns {JSX.Element}
 */
const EditCompanyScreen = () => {

  /**
   * Represents whether the panel is loading or not.
   */
  const [loading, setLoading] = React.useState(false)

  /**
   * Represents the user's company
   */
  const [company, setCompany] = React.useState()

  const EmployeesApi = new EmployeeApiController();
  const CompaniesApi = new CompanyApiController();

  const fetchData = async () => {
    const company = await CompaniesApi.findById(Authentication.getUsersCompany())
    if (company) {
      setCompany(company)
    }
  }

  React.useEffect(() => {
    fetchData();
  }, [])

  return (
    <View>
        <Container maxWidth='xl'>
            <Header breadcrumbs={[
                {
                    title: 'My Company',
                    to: '/dashboard/company'
                }
            ]}>My Company</Header>
            <br/>
            <TabView>
              <Box label="General Information" style={{textAlign: 'left'}}>
                <Typography style={{color: 'var(--primary-dark)'}}><strong>Your Company</strong></Typography>
                <br/>
                <Stack spacing={2} direction={'row'}>
                  <Avatar src={company && company.img_url} variant='rounded' style={{width: 85, height: 85}}/>
                  <Box>
                    <Typography variant='body2'><strong>{company && company.name}</strong></Typography>
                    <Typography variant='caption' color='textSecondary'>{company && company.about}</Typography>
                  </Box>
                </Stack>
                <br/>
                <Stack direction='row' columnGap={2}>
                  <LoadingButton startIcon={<Delete/>} variant='outlined' size='small' color='error'>Remove Logo</LoadingButton>
                  <Button variant='outlined' size='small'>Edit Logo</Button>
                </Stack>
                <br/>
                <FormLabel>
                  <Typography variant='caption' color='textSecondary'><strong>Company UID</strong>
                  </Typography>
                </FormLabel>
                <Grid container spacing={1}>
                  <Grid item xs={11}>
                    <TextField value={company ? company.id : ''} fullWidth disabled placeholder='Company UID' style={{marginRight: '10px'}} size='small'/>
                    </Grid>
                  <Grid item xs={1}><Button startIcon={<FileCopy/>} variant='contained'>Copy</Button></Grid>
                </Grid>
                <br/>
                <Alert severity='warning'><strong>Note:</strong> Your company's details exist within a reserved and protected subsection of our database. Sensitive information is encrypted within our official API. This guarantees the data's security and integrity at all times.</Alert>
                <br/>
                <Typography variant='caption' color='textSecondary'><strong>General Information</strong></Typography>
                <br/>
                <Card variant='outlined'>
                  {loading ? <Box style={{padding: '50px'}}>
                    <LoadingCircle/>
                  </Box> : <List>
                  <ListItem secondaryAction={<IconButton><ArrowRight/></IconButton>}>
                      <ListItemIcon><Smartphone/></ListItemIcon>
                      <ListItemText primary='Phone Number' secondary='(856) 123-4567'/>
                    </ListItem>
                    <Divider/>
                  <ListItem secondaryAction={<IconButton><ArrowRight/></IconButton>}>
                      <ListItemIcon><Home/></ListItemIcon>
                      <ListItemText primary='Street Address' secondary='540 6th Avenue'/>
                    </ListItem>
                    <Divider/>
                    <ListItem secondaryAction={<IconButton><ArrowRight/></IconButton>}>
                      <ListItemIcon><LocationCity/></ListItemIcon>
                      <ListItemText primary='City' secondary='Lindenwold NJ'/>
                    </ListItem>
                    <Divider/>
                    <ListItem secondaryAction={<IconButton><ArrowRight/></IconButton>}>
                      <ListItemIcon><Public/></ListItemIcon>
                      <ListItemText primary='State' secondary='NJ'/>
                    </ListItem>
                  </List>}
                </Card>
              </Box>
              <Box label="Payroll Settings" style={{textAlign: 'left'}}>
                <Card variant='outlined'>
                <ListItem secondaryAction={<Switch/>} >
                  <ListItemIcon><CalendarMonth/></ListItemIcon>
                  <ListItemText primary='Employees can view event details' secondary='True'/>
                </ListItem>
                <Divider/>
                <ListItem secondaryAction={<Select style={{width: '200px'}} size='small'><MenuItem>Test</MenuItem></Select>} >
                  <ListItemIcon><PaidTwoTone/></ListItemIcon>
                  <ListItemText primary='Payroll Type' secondary='Clockin'/>
                </ListItem>
                <Divider/>
                <ListItem secondaryAction={<Switch/>} >
                  <ListItemIcon><History/></ListItemIcon>
                  <ListItemText primary='Auto-remind employees of events' secondary='True'/>
                </ListItem>
                </Card>
              </Box>
            </TabView>
        </Container>
    </View>
  )
}


export default EditCompanyScreen