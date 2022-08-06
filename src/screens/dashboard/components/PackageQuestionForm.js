import React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import DragHandle from '@mui/icons-material/DragHandle'
import Delete from '@mui/icons-material/Delete'
import AddCircle from '@mui/icons-material/AddCircle'
import Tooltip from '@mui/material/Tooltip'
import Close from '@mui/icons-material/Close'
import SwapVert from '@mui/icons-material/SwapVert'

/**
 * Represents a form that is utilized to display a question form and
 * control validations of data.
 * @date 6 August, 2022
 * @author chrisrinaldi
 * @returns {JSX.Element}
 */
const PackageQuestionForm = (props) => {

    const {

        /**
         * Represents the unique ID of this package question.
         */
        id,

        /**
         * Represents whether the form should be disabled.
         */
        disabled,

        /**
         * Represents the number of this question.
         */
        order,

        /**
         * Represents the initial package question.
         */
        initialPackageQuestion,


        /**
         * Handles action to be taken when the package
         * question form model has changed.
         * @param {string} id represents the uuid of the package question
         * @param {Object} newPackageQuestion represents the new package question
         * @optional
         */
        handlePackageQuestionChange,

        /**
         * Handles action to be taken when the package
         * question has been deleted.
         */
        handlePackageQuestionDelete,

    } = props;

    /**
     * Handles action to be taken when the package question changes. Sets
     * the state and invokes the callback with the new package question
     * model.
     * @param {*} field 
     * @param {*} newValue 
     */
    const handlePackageQuestionNameChange = (newValue) => {
        let newPackageQuestion = {...packageQuestion, title: newValue};
        setPackageQuestion(newPackageQuestion)
        callbackPackageQuestion(newPackageQuestion)
    }

    /**
     * Handles action taken when the data type of the package question
     * changes.
     * @param {*} newValue 
     */
    const handlePackageQuestionDataTypeChange = (newValue) => {
        let newPackageQuestion = {...packageQuestion, dataType: newValue, values: newValue === 'dropdown' || newValue === 'multiselect' ? [...packageQuestion.values] : []}
        setPackageQuestion(newPackageQuestion)
        callbackPackageQuestion(newPackageQuestion)
    }

    /**
     * Handles action taken when a new package question value has
     * been added.
     */
    const handleNewPackageQuestionValue = () => {
        let newPackageQuestion = {...packageQuestion, values: packageQuestion.values.concat('')}
        setPackageQuestion(newPackageQuestion)
        callbackPackageQuestion(newPackageQuestion)
    }

    /**
     * Handles action taken when a package question value has been
     * deleted.
     */
    const handlePackageQuestionValueDelete = () => {
        if (packageQuestion.values.length > 0) {
            let newPackageQuestionValues = packageQuestion.values.slice(0, packageQuestion.values.length - 1)
            let newPackageQuestion = {...packageQuestion, values: newPackageQuestionValues}
            setPackageQuestion(newPackageQuestion)
            callbackPackageQuestion(newPackageQuestion)
        }
    }

    /**
     * Handles action taken when a package question value
     * has changed.
     * @param {*} index 
     * @param {*} newValue 
     */
    const handlePackageQuestionValueChange = (index, newValue) => {
        let newPackageQuestionValues = [...packageQuestion.values]
        newPackageQuestionValues[index] = newValue;
        let newPackageQuestion = {...packageQuestion, values: newPackageQuestionValues}
        setPackageQuestion(newPackageQuestion)
        callbackPackageQuestion(newPackageQuestion)
    }

    /**
     * Calls back to the handler method specified when the package
     * question has changed.
     * @param {*} newPackageQuestion 
     */
    const callbackPackageQuestion = (newPackageQuestion) => {
        if (handlePackageQuestionChange) {
            handlePackageQuestionChange(id, newPackageQuestion);
        }
    }

    /**
     * Represents the data types of each possible package
     * question.
     */
    const dataTypes = {
        "multiselect": {
            label: "Multiple choice"
        },
        "dropdown": {
            label: "Dropdown"
        },
        "textfield": {
            label: "Short answer"
        },
        "paragraph": {
            label: "Paragraph"
        },
    }

    /**
     * Stores the value of the package question.
     */
    const [packageQuestion, setPackageQuestion] = React.useState(initialPackageQuestion ? initialPackageQuestion : {
        title: "",
        dataType: "",
        value: "",
        values: ['']
    })

    return (
        <Card style={{ borderLeftWidth: '5px', borderRightWidth: '5px', borderLeftStyle: 'solid', borderRightStyle: 'solid', borderColor: 'grey' }}>
            <CardContent>
                <div style={{textAlign: 'center'}}>
                    <DragHandle style={{color: 'grey'}}/>
                </div>
            {/* <Button color='error' variant='contained' onClick={handlePackageQuestionDelete}>DELETE</Button> */}
            <Typography>Question {order && `#${order}`}</Typography>
            <Typography variant='body2' color='textSecondary'>Select a question type from the selection below.</Typography>
            <br/>
            <Grid container spacing={3}>
                <Grid item xs={9}>
                    <TextField disabled={disabled} onChange={e => {handlePackageQuestionNameChange(e.target.value)}} required fullWidth variant='filled' label="Enter question" />
                </Grid>
                <Grid item xs={3}>
                <Select disabled={disabled} onChange={(e) => { handlePackageQuestionDataTypeChange(e.target.value) }} defaultValue={initialPackageQuestion ? initialPackageQuestion.dataType : 'textfield'} fullWidth>
                        {Object.keys(dataTypes).map(type => (
                            <MenuItem key={type} value={type}>
                                {dataTypes[type].label}
                            </MenuItem>
                        ))}
                    </Select> 
                </Grid>
            </Grid>
            <br/>
            {
                packageQuestion && (packageQuestion.dataType === 'multiselect' || packageQuestion.dataType === 'dropdown') && <>
                    {packageQuestion.values.length > 0 ? packageQuestion.values.map((value, index) => (
                        <Grid container alignItems={'center'} spacing={1}>
                            <Grid item xs={11}>
                                <TextField disabled={disabled} defaultValue={packageQuestion.values[index]} style={{marginTop: '5px', marginBottom: '5px'}} onChange={e => { handlePackageQuestionValueChange(index, e.target.value) }} size='small' variant='outlined' placeholder='Enter a value' fullWidth/>
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton size='small' onClick={() => { handlePackageQuestionValueDelete() }}>
                                    <Close fontSize='small'/>
                                </IconButton>
                            </Grid>
                        </Grid>
                    )) : <>
                        <Typography variant='body2' color='textSecondary'>To add a new value, please click the <AddCircle fontSize='inherit'/> icon below.</Typography>
                    </>}
                </>
            }
            </CardContent>
            <Divider/>
            <CardActions>
                {(packageQuestion.dataType === 'multiselect' || packageQuestion.dataType === 'dropdown') && <Tooltip title='Add a new selectable choice'>
                    <IconButton disabled={disabled} onClick={handleNewPackageQuestionValue}>
                        <AddCircle/>
                    </IconButton>
                </Tooltip>}
                <Tooltip title='Delete this question' onClick={() => { handlePackageQuestionDelete(id) }}>
                    <IconButton disabled={disabled}>
                        <Delete/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Reorder this question">
                    <IconButton disabled={disabled}>
                        <SwapVert/>
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    )
}

export default PackageQuestionForm