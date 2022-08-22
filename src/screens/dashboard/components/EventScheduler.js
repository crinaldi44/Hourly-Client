import React from 'react'
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import {
    ViewState,
    EditingState,
    IntegratedEditing,
} from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    AllDayPanel,
    DragDropProvider,
    WeekView,
    DayView,
    Appointments,
    Toolbar,
    DateNavigator,
    ViewSwitcher,
    AppointmentForm,
    AppointmentTooltip,
    TodayButton,
    Resources,
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

/**
 * Translates server-readable events to events readable by the events
 * scheduler.
 * @param {*} appointment 
 * @returns 
 */
const mapAppointmentData = appointment => ({
    id: appointment.id,
    startDate: usaTime(appointment.start_datetime),
    endDate: usaTime(appointment.end_datetime),
    title: appointment.name,
    package_id: appointment.package_id
});

/**
 * Reduces new events to server-processable events.
 * @param {*} newEvent 
 * @returns 
 */
const mapNewAppointmentData = (newEvent) => ({
    name: newEvent.title,
    description: newEvent.notes || '',
    agreed_price: 0.0,
    package_id: newEvent.package_id,
    questions: [],
    start_datetime: newEvent.startDate,
    end_datetime: newEvent.endDate
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

        /**
         * Represents action to be taken on event deleted.
         */
        onAddEvent,

        /**
         * Represents action to be taken once the user opts
         * to delete an event from the calendar.
         * @param {number} id represents the ID of the event to delete
         */
        onDeleteEvent,

        /**
         * Represents action to be taken on event updated.
         * @param {Array} changes represents a mapping of IDs to updated fields for that ID
         */
        onUpdateEvents,

        /**
         * Represents the additional resources to be displayed within the
         * Event scheduler.
         */
        additionalFields=[
            {
              fieldName: 'package_id',
              title: 'Package',
              allowMultiple: false,
              instances: [
                { id: 8, text: 'This is a package' },
              ],
            },
          ]

    } = props


    const [state, dispatch] = React.useReducer(reducer, initialState);
    const {
        data, loading, currentViewName, currentDate,
    } = state;

    /**
     * Callback that listens for changes on calls on dispatch and sets the current view
     * name accordingly.
     */
    const setCurrentViewName = React.useCallback(nextViewName => dispatch({
        type: 'setCurrentViewName', payload: nextViewName,
    }), [dispatch]);

    /**
     * Callback that listens for changes on calls on data and sets the current data
     * name accordingly.
     */
    const setData = React.useCallback(nextData => dispatch({
        type: 'setData', payload: nextData,
    }), [dispatch]);

    /**
     * Callback that listens for changes on calls on date and sets the current date
     * accordingly.
     */
    const setCurrentDate = React.useCallback(nextDate => dispatch({
        type: 'setCurrentDate', payload: nextDate,
    }), [dispatch]);

    /**
     * Callback that listens for changes on calls on loading and sets the current view
     * name accordingly.
     */
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

    /**
     * Commits changes to the database by firing a callback provided to this
     * component as props. Destructures the changes to commit by add, change,
     * or delete status.
     * @param {*} param0 
     */
    const commitChanges = ({ added, changed, deleted }) => {

        let { data } = state;
        if (added) {
            const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
            let proposedEvent = mapNewAppointmentData(added)
            data = [...data, proposedEvent];
            onAddEvent(proposedEvent, setData);
        }
        if (changed) {
            data = data.map(appointment => (
                changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
            onUpdateEvents(changed, setData);
        }
        if (deleted !== undefined) {
            data = data.filter(appointment => appointment.id !== deleted);
            onDeleteEvent(deleted, setData)
        }

        // this.setState((state) => {
        //   let { data } = state;
        //   if (added) {
        //     const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
        //     let proposedEvent = { id: startingAddedId, ...added }
        //     data = [...data, proposedEvent];
        //     onAddEvent(proposedEvent);
        //   }
        //   if (changed) {
        //     data = data.map(appointment => (
        //       changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
        //     onUpdateEvents(changed);
        //   }
        //   if (deleted !== undefined) {
        //     data = data.filter(appointment => appointment.id !== deleted);
        //     onDeleteEvent(deleted)
        //   }
        //   return { data };
        // });
    }

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
                <EditingState
                    onCommitChanges={commitChanges}
                />
                <IntegratedEditing />
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
                <AllDayPanel />
                <DragDropProvider
                    // allowDrag={allowDrag}
                />
                <Toolbar
                    {...loading ? { rootComponent: ToolbarWithLoading } : null}
                />
                <DateNavigator />
                <TodayButton />
                <ViewSwitcher />
                <AppointmentTooltip
                    showOpenButton
                    showCloseButton
                    showDeleteButton
                />
                <Resources data={additionalFields}/>
                <AppointmentForm />
            </Scheduler>
        </Paper>
    );
}


export default EventScheduler