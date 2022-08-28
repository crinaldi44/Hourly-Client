import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import LeaderboardTwoTone from '@mui/icons-material/LeaderboardTwoTone'
import PaginationTable from '../../../../components/Table';
import WatchLater from '@mui/icons-material/WatchLater';
import View from '../../components/View';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import PackageApiController from '../../../../api/impl/PackageApiController';
import EventApiController from '../../../../api/impl/EventApiController';
import LoadingCircle from '../../../../components/LoadingCircle';
import ClockinApiController from '../../../../api/impl/ClockinApiController';
import EmployeeApiController from '../../../../api/impl/EmployeeApiController'
import Header from '../../components/Header';
import Stack from '@mui/material/Stack'
import { MenuItem, Select, useMediaQuery } from '@mui/material';
import { PersonOutlineTwoTone, ScheduleTwoTone } from '@mui/icons-material';
import useTheme from '@mui/material/styles/useTheme'

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Event Trends by Month',
    },
  },
};

export const options3 = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Department Clockin by Utilization',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [15, 102, 17, 18, 19, 20, 21],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: [90, 3, 19, 2, 25, 20, 21],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

export const data3 = {
  labels,
  datasets: [
    {
      label: 'Dataset 2',
      data: [90, 3, 19, 2, 25, 20, 21],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

/**
 * Represents the Dashboard Home Screen.
 * @returns {JSX.Element}
 */
const DashboardHomeScreen = () => {
  


  const [packageNames, setPackageNames] = React.useState([])
  const [packageTotalEvents, setPackageTotalEvents] = React.useState([])
  const [totalClockins, setTotalClockins] = React.useState(0)
  const [totalPackages, setTotalPackages] = React.useState(0)
  const [totalEmployees, setTotalEmployees] = React.useState(0)
  const [clockins, setClockins] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  const data2 = {
    labels: packageNames,
    datasets: [
      {
        label: '# of Events Scheduled',
        data: packageTotalEvents,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const PackagesApi = new PackageApiController();
  const EventsApi = new EventApiController();
  const ClockinsApi = new ClockinApiController();
  const EmployeesApi = new EmployeeApiController();

  /**
   * Represents the MUI v5 theme.
   */
   const theme = useTheme();

   /**
      * When the application becomes mobile, returns true. Else, returns false.
      * The breakpoint for md is 900px.
      */
     const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const options2 = {
      responsive: true,
      // maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          display: true
        },
        title: {
          display: true,
          text: 'Event Utilization by Package',
        },
      },
    };

  /**
   * Fetch event totals for events of each package type.
   * @param {*} packageIds 
   * @param {*} index 
   * @param {*} totals 
   * @returns {Array<number>} the array of totals of each package type
   */
  const fetchEventTotalsForPackageIds = async (packageIds, index = 0, totals = []) => {
    if (index >= packageIds.length) return totals
    const results = await EventsApi.findAll({ q: `{"package_id": "${packageIds[index]}"}`, include_totals: true })
    return await fetchEventTotalsForPackageIds(packageIds, ++index, [...totals, results.total_records])
  }

  /**
   * Fetches the package data. An array of all existing package names is first generated to
   * be labelled within the line chart. Simultaneously, the listing of unique package ids
   * is coalesced and tossed into a recursive querying function which will obtain the totals
   * of each package type and store them into an array to be displayed within the chart.
   */
  const fetchData = async () => {
    const packages = await PackagesApi.findAll()
    if (packages && packages.length > 0) {
      let packageIds = []
      let packageNames = []
      packages.map(pack => {
        if (!packageIds.includes(pack.id)) {
          packageIds.push(pack.id)
          packageNames.push(pack.name)
        }
      })
      const eventTotals = await fetchEventTotalsForPackageIds(packageIds)
      const clockins = await ClockinsApi.findAll({ include_totals: true })
      const employees = await EmployeesApi.findAll({include_totals: true})
      setClockins(clockins)
      setTotalEmployees(employees.total_records)
      setPackageNames(packageNames)
      setPackageTotalEvents(eventTotals)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])



  return (<View>
    <Container maxWidth={'xl'}>
      <Header>Dashboard</Header>
      <br/>
      <Grid container spacing={isMobile ? 1 : 3}>
        <Grid item xs={isMobile ? 12 : 4}>
        <Card variant='outlined' sx={{ textAlign: 'left'}}>
            <CardContent>
              <Grid container justifyContent='space-between'>
                <Grid item>
                  <Typography variant='body2' color='textSecondary'><strong>Packages</strong></Typography>
                </Grid>
                <Grid item><LeaderboardTwoTone color='primary'/></Grid>
              </Grid>
              <Typography color='var(--primary-dark)' variant='h4'><strong>{totalPackages}</strong></Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={isMobile ? 12 : 4}>
        <Card variant='outlined' sx={{ textAlign: 'left'}}>
            <CardContent>
            <Grid container justifyContent='space-between'>
                <Grid item>
                  <Typography variant='body2' color='textSecondary'><strong>Employees</strong></Typography>
                </Grid>
                <Grid item><PersonOutlineTwoTone color='primary'/></Grid>
              </Grid>
              <Typography color='var(--primary-dark)' variant='h4'><strong>{totalEmployees}</strong></Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={isMobile ? 12 : 4}>
        <Card variant='outlined' sx={{ textAlign: 'left'}}>
            <CardContent>
            <Grid container justifyContent='space-between'>
                <Grid item>
                  <Typography variant='body2' color='textSecondary'><strong>Events</strong></Typography>
                </Grid>
                <Grid item><ScheduleTwoTone color='primary'/></Grid>
              </Grid>
              <Typography variant='h4' color='var(--primary-dark)'><strong>64</strong></Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <br/>
      <Grid container spacing={2}>
        <Grid item xs={isMobile ? 12 : 6}>
          <Card variant='outlined'>
              <CardContent>
              <Bar options={options} data={data3}/>
              </CardContent>
          </Card>
        </Grid>
        <Grid item xs={isMobile ? 12 : 6}>
          <Card variant='outlined'>
            <CardContent>
              <Line options={options} data={data} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <br/>
      <Grid container columnSpacing={3}>
      <Grid item xs={isMobile ? 12 : 4}>
          <Card variant='outlined' style={{height: '100%'}}>
            <CardContent style={{height: '100%'}}>
              <div>
                {loading ? <LoadingCircle /> : <Doughnut width={'20%'} data={data2} options={options2} />}
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={isMobile ? 12 : 8}>
          <Card variant='outlined' sx={{ textAlign: 'left', height: '100%' }}>
            <CardContent>
              <Grid container alignItems={'center'} justifyContent='space-between'>
                <Grid item>
                  <Typography variant='body1'>
                    <strong>Clockins</strong> <Typography variant='caption' color='textSecondary'>{clockins ? clockins.length : 0} total</Typography>
                  </Typography>
                </Grid>
                <Grid item>
                  <Stack alignItems={'center'} direction='row'>
                  <Typography variant='body2' color='textSecondary'><strong>Sort by:</strong></Typography>
                  <Select defaultValue={'clockin_time'} style={{marginLeft: 20, marginRight: 20}} variant='standard' size='small'>
                    <MenuItem value='clockin_time'>Clockin Time</MenuItem>
                    <MenuItem value='clockout_time'>Clockout Time</MenuItem>
                  </Select>
                  <Button variant='outlined' size='small'>Events</Button>
                  </Stack>
                </Grid>
              </Grid>
              <br />
              <PaginationTable
                variant='outlined'
                data={clockins}
                count={totalClockins}
                innerHeight={50}
                loading={loading}
                // rowsPerPage={rowsPerPage}
                // onPageChange={(newPg) => {
                //     fetchPackages(newPg)
                // }}
                // onRowsPerPageChange={(newRowsPg) => {
                //     setRowsPerPage(newRowsPg)
                //     fetchPackages(0, newRowsPg)
                // }}
                renderEmpty={() => (
                  <Grid textAlign='center'>
                    <WatchLater opacity={0.1} style={{ fontSize: '80px' }} />
                    <Typography variant='h6' style={{ opacity: 0.3 }}><strong>No Clockins Found</strong></Typography>
                    <Typography variant='caption' color='textSecondary' style={{ opacity: 0.5 }}>No clockins were found.</Typography>
                  </Grid>
                )}
                columns={[
                  {
                    name: 'Employee',
                    field: 'employee_id',
                    width: 120
                  },
                  {
                    name: 'Clockin Time',
                    field: 'clockin_time',
                    width: 120,
                  },
                  {
                    name: 'Clockout Time',
                    field: 'clockout_time',
                    width: 120,
                  },
                ]}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  </View>);

};

export default DashboardHomeScreen;
