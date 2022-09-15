import React from 'react'
import Card from '@mui/material/Card'
import LoadingButton from '@mui/lab/LoadingButton'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import CopyAll from '@mui/icons-material/CopyAll'
import Delete from '@mui/icons-material/Delete'
import Email from '@mui/icons-material/Email'
import Print from '@mui/icons-material/Print'

/**
 * Represents an action pane allowing the user to make decisions regarding a particular
 * event. Accepts a prop which is the mapping of 'action names' to callback functions.
 * @author chrisrinaldi
 * @date 13 September, 2022
 * @returns {JSX.Element}
 */
const EventSummaryActionPane = (props) => {

    const {

        /**
         * Represents the mapping of action name to actionable callback
         * function.
         * @optional
         */
        actions,

        /**
         * Represents whether the EventSummaryActionPane is disabled.
         */
        disabled=true,

        /**
         * Represents the title of the event summary.
         */
        title='Actions',

    } = props;

    /**
     * Represents the currently selected action.
     */
    const [currentAction, setCurrentAction] = React.useState('reminder')

    /**
     * Handles logic for when the user confirms the action they'd like to perform.
     */
    const handleActionConfirmed = () => {
        if (actions[currentAction] && typeof actions[currentAction] === 'function') actions[currentAction]();
    }

    /**
     * Handles logic for when the user swaps the action they'd like to perform.
     * @param {*} newValue 
     */
    const handleActionChanged = (newValue) => {
        setCurrentAction(newValue);
    }

  return ( <Card variant='outlined'>
  <CardContent>
    <Typography><strong>{title}</strong></Typography>
  </CardContent>
  <Divider/>
  <CardContent>
    <Select disabled={disabled} onChange={(e) => { handleActionChanged(e.target.value) }} fullWidth defaultValue={'default'} variant='outlined' size='small'>
        <MenuItem key={'default'} value={'default'}>Select an action...</MenuItem>
        {actions && Object.keys(actions).map(action => (
            <MenuItem key={action} value={action}>{action}</MenuItem>
        ))}
    </Select>
    <br/>
    <br/>
    <LoadingButton loading={disabled} disabled={disabled} size='small' variant='outlined' startIcon={<Email/>} onClick={handleActionConfirmed}>Send Email</LoadingButton>
  </CardContent>
  <Divider/>
    <List>
      <ListItemButton disabled={disabled}>
        <ListItemIcon>
          <Print/>
        </ListItemIcon>
        <ListItemText primary='Print Questionnaire'/>
      </ListItemButton>
      <ListItemButton disabled={disabled}>
        <ListItemIcon>
          <CopyAll/>
        </ListItemIcon>
        <ListItemText primary='Duplicate'/>
      </ListItemButton>
      <ListItemButton disabled={disabled}>
        <ListItemIcon>
          <Delete/>
        </ListItemIcon>
        <ListItemText primary='Delete'/>
      </ListItemButton>
    </List>
</Card>
  )
}

export default EventSummaryActionPane