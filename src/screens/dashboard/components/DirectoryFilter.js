import React from 'react'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { Button, Card, CardActions, CardContent, Checkbox, Divider, FormControlLabel, FormGroup, Grid, MenuItem, Select } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'
import Search from '@mui/icons-material/Search'

/**
 * Represents a component that outputs a series of filters within categories. JSX
 * may be specified to dictate the layout of the filters. When filters change,
 * invokes a callback which will translate the filters into a JSON of filters
 * to be provided to an API controller.
 * @returns {JSX.Element}
 */
const DirectoryFilter = (props) => {

    const [filter, setFilter] = React.useState({})

    const [check, setCheck] = React.useState({})
  
    const {

        /**
         * Format is of type: 
         * [
         *  {
         *      category: 'Tags',
         *      type: 'chip',            -- is of type dropdown, checkbox, chip, or list
         *      fieldName: 'tags',
         *      options: ['one', 'two', 'three'],
         *      multiple: false
         *  }
         * ]
         */
        filters,

        disabled,


        onFiltersChanged
    } = props

    /**
     * Handles action taken when the filters change.
     * @param {*} filterName 
     * @param {*} fieldName 
     * @param {*} value 
     */
    const handleChange = (fieldName, value) => {
        if (!fieldName) return;
        let newFilters = {...filter};
        if (value === 'none') {
            delete newFilters[fieldName]
            setFilter(newFilters)
            return;
        }
        newFilters[fieldName] = value;
        console.log(newFilters);
        setFilter(newFilters)
        if (onFiltersChanged) {
            onFiltersChanged(newFilters);
        }
    }

    const clearFilters = () => {
        setFilter({})
        if (onFiltersChanged) {
            onFiltersChanged({})
        }
    }

    const renderHeader = (optionHeader) => (
        <Typography style={{marginBottom: '10px'}} variant='body2'><strong>{optionHeader}</strong></Typography>
    )

    const renderFilterForType = (filter) => {

        switch (filter.type) {
            default:
            case 'chip':
                return filter.options && <>
                {renderHeader(filter.category)}
                    {filter.options.map(option => (
                        <Chip disabled={disabled} icon={filter[filter.fieldName] && <CheckCircle/>} onClick={() => {
                            handleChange(filter.fieldName, option)
                        }} onDelete={filter[filter.fieldName] === option ? () => {} : null} clickable size='small' style={{margin: '2px'}} label={option}/>
                    ))}
                <br/>
                <br/>
                </>
            case 'dropdown':
                return <>
                {renderHeader(filter.category)}
                <Select size='small' disabled={disabled} onChange={e => {
                    handleChange(filter.fieldName, e.target.value)
                }} fullWidth defaultValue={['none']}>
                    <MenuItem key='none' value='none'>Select an option...</MenuItem>
                    {filter.options && filter.options.map(option => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                </Select>
                </>
            case 'checkbox':
                return <>
                    {renderHeader(filter.category)}
                    {filter.options && filter.options.map(option => (
                        <>
                            <FormGroup>
                                <FormControlLabel label={option} control={<Checkbox disabled={disabled} name={option} title={filter.fieldName} onChange={(e) => {
                                    handleChange(e.target.title, e.target.name)
                                }} checked={filter[filter.fieldName] === option}/>}/>
                            </FormGroup>
                        </>
                    ))}
                    <br/>
                </>
        }
    }
  
    return ( <Card variant='outlined'>
        <CardContent>
        <Grid container justifyContent={'space-between'} alignItems='center'>
            <Grid item>
                <Typography variant='h6' color='textSecondary'><strong>Filters ({Object.keys(filter).length})</strong></Typography>
            </Grid>
            <Grid item>
                <Button disabled={disabled} onClick={clearFilters}>CLEAR</Button>
            </Grid>
        </Grid>
        <Divider/>
        <br/>
        {filters && filters.length > 0 && filters.map(filter => renderFilterForType(filter))}
    </CardContent>
    <CardActions>
        <Button startIcon={<Search/>} variant='outlined' size='small' disabled={disabled}>Search</Button>
    </CardActions>
    </Card>
  )
}

export default DirectoryFilter