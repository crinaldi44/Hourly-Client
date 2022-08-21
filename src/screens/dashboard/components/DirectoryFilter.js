import React from 'react'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import CheckCircle from '@mui/icons-material/CheckCircle'
import Search from '@mui/icons-material/Search'

/**
 * Represents a component that outputs a series of filters within categories. JSX
 * may be specified to dictate the layout of the filters. When filters change,
 * invokes a callback which will translate the filters into a JSON of filters
 * to be provided to an API controller.
 * @returns {JSX.Element}
 */
const DirectoryFilter = (props) => {

    const [filterObject, setFilterObject] = React.useState({})

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


        onFiltersChanged,

        /**
         * Represents the styling of the inner container
         */
        style
        
    } = props

    /**
     * Handles action taken when the filters change.
     * @param {*} filterName 
     * @param {*} fieldName 
     * @param {*} value 
     */
    const handleChange = (fieldName, value) => {
        console.log(fieldName);
        if (!fieldName) return;
        let newFilters = {...filterObject};
        if (value === 'none') {
            delete newFilters[fieldName]
            setFilterObject(newFilters)
            return;
        }
        newFilters[fieldName] = value;
        console.log(newFilters);
        setFilterObject(newFilters)
        if (onFiltersChanged) {
            onFiltersChanged(newFilters);
        }
    }

    const clearFilters = () => {
        setFilterObject({})
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
                        <Chip color={filterObject[filter.fieldName] === option ? 'info' : 'default'} disabled={disabled} onClick={() => {
                            handleChange(filter.fieldName, option)
                        }} onDelete={filterObject[filter.fieldName] === option ? () => { handleChange(filter.fieldName, 'none') } : null} clickable size='small' style={{margin: '2px'}} label={option}/>
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
                    <FormGroup>
                    {filter.options && filter.options.map(option => (
                        <>
                                <FormControlLabel label={option} control={<Checkbox disabled={disabled} name={option} onChange={(e, checked) => {
                                    handleChange('hi', e.target.name)
                                }} checked={filterObject['hi'] === option}/>}/>
                        </>
                    ))}
                    </FormGroup>
                    <br/>
                </>
        }
    }
  
    return ( <Card variant='outlined'>
        <CardContent>
        <Grid container justifyContent={'space-between'} alignItems='center'>
            <Grid item>
                <Typography variant='h6' color='textSecondary'><strong>Filters ({Object.keys(filterObject).length})</strong></Typography>
            </Grid>
            <Grid item>
                <Button disabled={disabled} onClick={clearFilters}>CLEAR</Button>
            </Grid>
        </Grid>
        <Divider/>
        <br/>
        <div style={{...style, overflow: 'scroll'}}>
            {filters && filters.length > 0 && filters.map(filter => renderFilterForType(filter))}
        </div>
    </CardContent>
    <CardActions>
        <Button startIcon={<Search/>} variant='outlined' size='small' disabled={disabled}>Search</Button>
    </CardActions>
    </Card>
  )
}

export default DirectoryFilter