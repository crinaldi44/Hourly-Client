import React, { useState, useEffect } from 'react'
import Authentication from '../../../../../api/util/Authentication'
import EmployeeService from '../../../../../services/EmployeeService'
import Header from '../../../components/Header'
import useConfirmationDialog from '../../../../../hooks/ui/Confirmation'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import styled from '@mui/material/styles/styled'
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Switch from '@mui/material/Switch'
import Container from '@mui/material/Container'
import CardContent from '@mui/material/CardContent'
import View from '../../../components/View'
import Avatar from '@mui/material/Avatar'
import EmployeeApiController from '../../../../../api/impl/EmployeeApiController'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Launch from '@mui/icons-material/Launch'


/**
 * Represents the account settings screen.
 **/ 
const AccountSettingsScreen = () => {

    const Accordion = styled((props) => (
        <MuiAccordion disableGutters elevation={0} square {...props} />
      ))(({ theme }) => ({
        border: `1px solid ${theme.palette.divider}`,
        '&:not(:last-child)': {
          borderBottom: 0,
        },
        '&:before': {
          display: 'none',
        },
      }));
      
      const AccordionSummary = styled((props) => (
        <MuiAccordionSummary
          expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
          {...props}
        />
      ))(({ theme }) => ({
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
        flexDirection: 'row-reverse',
        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
          transform: 'rotate(90deg)',
        },
        '& .MuiAccordionSummary-content': {
          marginLeft: theme.spacing(1),
        },
      }));
      
      const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
        padding: theme.spacing(2),
        borderTop: '1px solid rgba(0, 0, 0, .125)',
      }));

    /**
     * Represents the active user.
     */
    const [user, setUser] = useState({})

    const EmployeesApi = new EmployeeApiController();


    /**
     * Gets the active user.
     */
    const getActiveUser = async () => {
        try {
          let user = await EmployeesApi.getUsersProfile(Authentication.getActiveEmployee()["employee_id"])
          setUser(user);
        } catch (error) {
          
        }
    }

    // Represents action taken when the component re-renders.
    useEffect(() => {
      getActiveUser();
    }, [])
  

  return (
    <View>
      <Container maxWidth={'xl'} style={{textAlign: 'left'}}>
        <Header alert={{
          title: <strong>Beta Software</strong>,
          message: 'This software is in beta mode. Should you have any concerns, please report them accordingly.'
        }} action={<Button variant='contained'>Reset to Defaults</Button>}>
            Settings
        </Header>
        
        <br/>
        <Typography marginBottom={1} marginLeft={1} variant='body1' color='textSecondary'><strong>Account Security</strong></Typography>
        <Card variant='outlined'>
          <CardContent>
            <Typography variant='body2' color='textSecondary'><strong>Security Guarantee</strong></Typography>
            <Typography variant='body2' color='textSecondary'>Never share your account with anyone! Those with your credentials will be able to access your personal details.</Typography>
          </CardContent>
          <CardActions>
            <Button size='small' variant='contained'>Learn More</Button>
          </CardActions>
        </Card>

        <br/>
        <Typography marginBottom={1} marginLeft={1} variant='body1' color='textSecondary'><strong>Settings</strong></Typography>
        <Card variant='outlined'>
          <CardContent>
            <Grid alignItems='center' container justifyContent={'space-between'}>
              <Grid item>
                <Grid container spacing={1} alignItems='center'>
              <Grid item>
                <Avatar style={{height: 55, width: 55}}/>
              </Grid>
              <Grid item>
                <Typography variant='body1' color='textSecondary'><strong>crinaldi44@gmail.com</strong></Typography>
                <Typography variant='body2' color='textSecondary'>Web Developer</Typography>
              </Grid>
            </Grid>
              </Grid>
              <Grid item>
                <Button>Change Password</Button>
              </Grid>
            </Grid>
            
          </CardContent>
          <Divider/>
          <CardContent>
          <Grid alignItems='center' container justifyContent={'space-between'}>
              <Grid item>
                <Grid container spacing={1} alignItems='center'>
              <Grid item>
                <Typography variant='body1'>Shortcut</Typography>
                <Typography variant='body2' color='textSecondary'>Add to Home Screen</Typography>
              </Grid>
            </Grid>
              </Grid>
              <Grid item>
                <IconButton>
                  <Launch/>
                </IconButton>
              </Grid>
            </Grid>
          </CardContent>
          <Divider/>
          <CardContent>
          <Grid alignItems='center' container justifyContent={'space-between'}>
              <Grid item>
                <Grid container spacing={1} alignItems='center'>
              <Grid item>
                <Typography variant='body1'>Dark Mode</Typography>
                <Typography variant='body2' color='textSecondary'>Coming Soon</Typography>
              </Grid>
            </Grid>
              </Grid>
              <Grid item>
                <Switch disabled/>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        
        </Container>
        </View>
  )
}

/**
 * Represents the account settings screen.
 **/ 
export default AccountSettingsScreen