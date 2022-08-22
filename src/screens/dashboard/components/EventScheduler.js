import React from 'react'
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import {
  ViewState,
} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  DayView,
  Appointments,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
  AppointmentForm,
  AppointmentTooltip,
  TodayButton,
  MonthView,
} from '@devexpress/dx-react-scheduler-material-ui';

/**
 * This is a Scheduler view provided by DevExtreme to display appointments and events data
 * with times.
 * @author chrisrinaldi
 * @date 22 August, 2022
 * @returns {JSX.Element}
 */


 const PREFIX = 'Demo';

 const classes = {
   toolbarRoot: `${PREFIX}-toolbarRoot`,
   progress: `${PREFIX}-progress`,
 };
 
 const StyledDiv = styled('div')({
   [`&.${classes.toolbarRoot}`]: {
     position: 'relative',
   },
 });
 
 const StyledLinearProgress = styled(LinearProgress)(() => ({
   [`&.${classes.progress}`]: {
     position: 'absolute',
     width: '100%',
     bottom: 0,
     left: 0,
   },
 }));
 
 const ToolbarWithLoading = (
   ({ children, ...restProps }) => (
     <StyledDiv className={classes.toolbarRoot}>
       <Toolbar.Root {...restProps}>
         {children}
       </Toolbar.Root>
       <StyledLinearProgress className={classes.progress} />
     </StyledDiv>
   )
 );
 
 const usaTime = date => new Date(date).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
 
 const mapAppointmentData = appointment => ({
   id: appointment.id,
   startDate: usaTime(appointment.start_datetime),
   endDate: usaTime(appointment.end_datetime),
   title: appointment.name,
 });
 
 const initialState = {
   data: [],
   loading: false,
//    currentDate: '2017-05-23',
   currentViewName: 'Month',
 };
 
 const reducer = (state, action) => {
   switch (action.type) {
     case 'setLoading':
       return { ...state, loading: action.payload };
     case 'setData':
       return { ...state, data: action.payload.map(mapAppointmentData) };
     case 'setCurrentViewName':
       return { ...state, currentViewName: action.payload };
     case 'setCurrentDate':
       return { ...state, currentDate: action.payload };
     default:
       return state;
   }
 };

const EventScheduler = (props) => {

    const {

        /**
        * Handles action taken when data is to be fetched.
        */
        fetchData,

    } = props


    const [state, dispatch] = React.useReducer(reducer, initialState);
    const {
        data, loading, currentViewName, currentDate,
    } = state;
    const setCurrentViewName = React.useCallback(nextViewName => dispatch({
        type: 'setCurrentViewName', payload: nextViewName,
    }), [dispatch]);
    const setData = React.useCallback(nextData => dispatch({
        type: 'setData', payload: nextData,
    }), [dispatch]);
    const setCurrentDate = React.useCallback(nextDate => dispatch({
        type: 'setCurrentDate', payload: nextDate,
    }), [dispatch]);
    const setLoading = React.useCallback(nextLoading => dispatch({
        type: 'setLoading', payload: nextLoading,
    }), [dispatch]);

    const getData = (setData, setLoading) => {

        setLoading(true)
    
        return fetchData(setData).then(() => {
            setLoading(false);
        });
     };

    React.useEffect(() => {
        getData(setData, setLoading);
    }, [setData, currentViewName, currentDate]);

    return (
        <Paper>
            <Scheduler
                data={data}
                height={660}
            >
                <ViewState
                    currentDate={currentDate}
                    currentViewName={currentViewName}
                    onCurrentViewNameChange={setCurrentViewName}
                    onCurrentDateChange={setCurrentDate}
                />
                <MonthView
                    startDayHour={7.5}
                    endDayHour={17.5}
                />
                <DayView
                    startDayHour={7.5}
                    endDayHour={17.5}
                />
                <WeekView
                    startDayHour={7.5}
                    endDayHour={17.5}
                />
                <Appointments />
                <Toolbar
                    {...loading ? { rootComponent: ToolbarWithLoading } : null}
                />
                <DateNavigator />
                <TodayButton />
                <ViewSwitcher />
                <AppointmentTooltip
                    showOpenButton
                    showCloseButton
                />
                <AppointmentForm readOnly />
            </Scheduler>
        </Paper>
    );
}


export default EventScheduler