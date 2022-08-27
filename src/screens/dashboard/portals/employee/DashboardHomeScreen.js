import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Authentication from '../../../../api/util/Authentication'
import EmployeeService from '../../../../services/EmployeeService';
import ChargingStation from '@mui/icons-material/ChargingStation'
import LeaderboardTwoTone from '@mui/icons-material/LeaderboardTwoTone'
import RequestPage from '@mui/icons-material/RequestPage'
import DiagramImage from '../../../../assets/images/diagram.png'
import View from '../../components/View';

/**
 * Represents the Dashboard Home Screen.
 * @returns {JSX.Element}
 */
const DashboardHomeScreen = () => {

  const dashPaper = {
    height: 200,
    width: '1fr',
    borderWidth: '2px'
  }

  useEffect(() => {
  }, [])
  


  return (<View>
    <Container maxWidth={'xl'}>
      <Grid container direction={'row'} spacing={2}>
        <Grid item xs={6}>
      <Card variant='outlined' sx={{textAlign: 'left', mt: 5, height: '90%'}}>
                <CardContent>
                  <LeaderboardTwoTone color='primary'/>
                  <Typography variant='h5'>
                    Overview
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>Application Structure</Typography>
                  <br/>
                  <Typography maxWidth={800}>
                    This application is a "full-stack" web application. The frontend is a React application wrapped with a component library called Material-UI (Google theme). The backend is Python-based and is run on a library called Flask. The Flask backend uses a library called SQLAlchemy to connect to a MySQL database.
                  </Typography>
                  <br/>
                </CardContent>
                <CardActions>
                  <Button variant='outlined'>View Host</Button>
                </CardActions>
      </Card>
      </Grid>
      <Grid item xs={6}>
      <Card variant='outlined' sx={{textAlign: 'left', mt: 5, height: '90%'}}>
                <CardContent>
                  <RequestPage color='primary'/>
                  <Typography variant='h5'>
                    Walkthrough
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>How does it work?</Typography>
                  <br/>
                  <Typography maxWidth={800}>
                    Like any web app, your browser will request the entire "front end" (React app) from the server, which will send it over to us. Then, whenever you interact with the application, we make a request to the server to either perform some business logic or interact with the database. The server will perform the request and send back a response, which is used to display the data.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant='outlined'>See In Action</Button>
                </CardActions>
      </Card>
      </Grid>
      <Grid item xs={12}>
      <Card variant='outlined' sx={{textAlign: 'left'}}>
                <CardContent>
                  <ChargingStation color='primary'/>
                  <Typography variant='h5'>
                    Diagram
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>View Below</Typography>
                  <br/>
                  <Typography maxWidth={800}>
                    Below is a diagram of the request-response cycle of the application:
                  </Typography>
                  <img src={DiagramImage} width={550} height={150}/>
                </CardContent>
      </Card>
      </Grid>
      </Grid>
      </Container>
    </View>);

};

export default DashboardHomeScreen;
