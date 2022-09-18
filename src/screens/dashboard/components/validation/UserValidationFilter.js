import React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Select from '@mui/material/Select'
import LoadingButton from '@mui/lab/LoadingButton'
import MenuItem from '@mui/material/MenuItem'
import Search from '@mui/icons-material/Search'

/**
 * Represents a user validation filter.
 * @returns {JSX.Element}
 */
const UserValidationFilter = (props) => {

    const {
        loading
    } = props;

  return ( <Accordion defaultExpanded={true} variant='outlined'>
    <AccordionSummary><Typography variant='body2' color='textSecondary'>Filters</Typography></AccordionSummary>
    <AccordionDetails>
        <Grid container spacing={3}>
            <Grid item xs={6}>
                <TextField disabled={loading} size='small' fullWidth placeholder='Email address'/>
            </Grid>
            <Grid item xs={6}>
                <TextField disabled={loading} size='small' fullWidth placeholder='Company Name'/>
            </Grid>
            <Grid item xs={6}>
                <TextField disabled={loading} size='small' fullWidth placeholder='Department Name'/>
            </Grid>
            <Grid item xs={6}>
                <Select defaultValue={'all'} fullWidth size='small' disabled={loading}>
                    <MenuItem key='all' value='all'>All</MenuItem>
                    <MenuItem key='true' value='true'>Valid</MenuItem>
                    <MenuItem key='false' value='false'>Invalid</MenuItem>
                </Select>
            </Grid>
        </Grid>
        <br/>
        <div style={{textAlign: 'right'}}>
            <LoadingButton loading={loading} startIcon={<Search/>} variant='contained' size='small'>Search</LoadingButton>
        </div>
    </AccordionDetails>
  </Accordion>
  )
}

export default UserValidationFilter