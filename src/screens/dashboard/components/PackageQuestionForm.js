import React from 'react'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
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
import ArrowUpward from '@mui/icons-material/ArrowUpward'
import ArrowDownward from '@mui/icons-material/ArrowDownward'

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
        initialOrder,

        /**
         * Represents the initial package question.
         */
        initialPackageQuestion,

        /**
         * Represents the total count of questions. If this
         * is provided, displays a selector that allows the
         * user to change the order of the questions. The
         * default value is the 'order' field.
         */
        totalCountQuestions,

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

        /**
         * Handles action taken when the ordering is changed.
         */
        handleOrderChange,

    } = props;

    /**
     * Represents the order of the package question.
     */
    const [order, setOrder] = React.useState(initialOrder ? initialOrder : 0);

    /**
     * Handles action to be taken when the package question changes. Sets
     * the state and invokes the callback with the new package question
     * model.
     * @param {*} field 
     * @param {*} newValue 
     */
    const handlePackageQuestionNameChange = (newValue) => {
        let newPackageQuestion = { ...initialPackageQuestion, title: newValue };
        // setPackageQuestion(newPackageQuestion)
        callbackPackageQuestion(newPackageQuestion)
    }

    /**
     * Handles action taken when the data type of the package question
     * changes.
     * @param {*} newValue 
     */
    const handlePackageQuestionDataTypeChange = (newValue) => {
        let newPackageQuestion = { ...initialPackageQuestion, dataType: newValue, values: newValue === 'dropdown' || newValue === 'multiselect' ? [...initialPackageQuestion.values] : [] }
        // setPackageQuestion(newPackageQuestion)
        callbackPackageQuestion(newPackageQuestion)
    }

    /**
     * Handles action taken when a new package question value has
     * been added.
     */
    const handleNewPackageQuestionValue = () => {
        let newPackageQuestion = { ...initialPackageQuestion, values: initialPackageQuestion.values.concat('') }
        // setPackageQuestion(newPackageQuestion)
        callbackPackageQuestion(newPackageQuestion)
    }

    /**
     * Handles action taken when a package question value has been
     * deleted.
     */
    const handlePackageQuestionValueDelete = () => {
        if (initialPackageQuestion.values.length > 0) {
            let newPackageQuestionValues = initialPackageQuestion.values.slice(0, initialPackageQuestion.values.length - 1)
            let newPackageQuestion = { ...initialPackageQuestion, values: newPackageQuestionValues }
            // setPackageQuestion(newPackageQuestion)
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
        let newPackageQuestionValues = [...initialPackageQuestion.values]
        newPackageQuestionValues[index] = newValue;
        let newPackageQuestion = { ...initialPackageQuestion, values: newPackageQuestionValues }
        // setPackageQuestion(newPackageQuestion)
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

    return (
        <Card variant='outlined'>
            <CardContent>
                <div style={{ float: 'right' }}>
                    <IconButton size='small' onClick={() => {
                        if (order - 1 < 0) return;
                        handleOrderChange(id, order, order - 1)
                    }}>
                        <ArrowUpward fontSize='small' />
                    </IconButton>
                    <IconButton size='small' onClick={() => {
                        if ((order + 1) > (totalCountQuestions - 1)) return;
                        handleOrderChange(id, order, order + 1)
                    }}>
                        <ArrowDownward fontSize='small' />
                    </IconButton>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <DragHandle style={{ color: 'grey' }} />
                </div>
                <Typography>Question #{initialOrder + 1}</Typography>
                <Typography variant='body2' color='textSecondary'>Select a question type from the selection below.</Typography>
                <br />
                <Grid container spacing={3}>
                    <Grid item xs={9}>
                        <TextField disabled={disabled} value={initialPackageQuestion ? initialPackageQuestion.title : ''} onChange={e => { handlePackageQuestionNameChange(e.target.value) }} required fullWidth variant='filled' label="Enter question" />
                    </Grid>
                    <Grid item xs={3}>
                        <Select disabled={disabled} onChange={(e) => { handlePackageQuestionDataTypeChange(e.target.value) }} value={initialPackageQuestion ? initialPackageQuestion.dataType : 'textfield'} fullWidth>
                            {Object.keys(dataTypes).map(type => (
                                <MenuItem key={type} value={type}>
                                    {dataTypes[type].label}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                </Grid>
                <br />
                {
                    initialPackageQuestion && (initialPackageQuestion.dataType === 'multiselect' || initialPackageQuestion.dataType === 'dropdown') && <>
                        {initialPackageQuestion.values.length > 0 ? initialPackageQuestion.values.map((value, index) => (
                            <Grid container alignItems={'center'} spacing={1}>
                                <Grid item xs={11}>
                                    <TextField disabled={disabled} value={initialPackageQuestion.values[index]} style={{ marginTop: '5px', marginBottom: '5px' }} onChange={e => { handlePackageQuestionValueChange(index, e.target.value) }} size='small' variant='outlined' placeholder='Enter a value' fullWidth />
                                </Grid>
                                <Grid item xs={1}>
                                    <IconButton size='small' onClick={() => { handlePackageQuestionValueDelete() }}>
                                        <Close fontSize='small' />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        )) : <>
                            <Typography variant='body2' color='textSecondary'>To add a new value, please click the <AddCircle fontSize='inherit' /> icon below.</Typography>
                        </>}
                    </>
                }
            </CardContent>
            <Divider />
            <CardActions>
                {(initialPackageQuestion.dataType === 'multiselect' || initialPackageQuestion.dataType === 'dropdown') && <Tooltip title='Add a new selectable choice'>
                    <span>
                        <IconButton disabled={disabled} onClick={handleNewPackageQuestionValue}>
                            <AddCircle />
                        </IconButton>
                    </span>
                </Tooltip>}
                <Tooltip title='Delete this question' onClick={() => { handlePackageQuestionDelete(id, order) }}>
                    <span>
                        <IconButton disabled={disabled}>
                            <Delete />
                        </IconButton>
                    </span>
                </Tooltip>
            </CardActions>
        </Card>
    )
}

export default PackageQuestionForm