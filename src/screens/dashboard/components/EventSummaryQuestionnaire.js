import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import LoadingCircle from '../../../components/LoadingCircle'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import SaveAlt from '@mui/icons-material/SaveAlt'
import Divider from '@mui/material/Divider'

/**
 * Represents a form that allows the user to edit the questionnaire inline.
 * @author chrisrinaldi
 * @date 14 September, 2022
 * @returns {JSX.Element}
 */
const EventSummaryQuestionnaire = (props) => {

    const {

        /**
         * Represents the initial event, for retrieving data about the questions.
         * @required
         */
        initialEvent,

        /**
         * Represents whether the questionnaire is loading.
         */
        loading=false,

        /**
         * A callback that is invoked with the new event questions when
         * the user saves their changes.
         */
        onSave,

        /**
         * Represents a mapping of the package ID to the respective package.
         */
        packageIdToPackage,

    } = props;

    /**
     * Represents the event questions, for tracking state.
     */
    const [eventQuestions, setEventQuestions] = React.useState(initialEvent.questions.length > 0 ? initialEvent.questions : packageIdToPackage[initialEvent.package_id].questions);

    /**
     * Represents the state of whether the user is editing or not.
     */
    const [editing, setEditing] = React.useState(initialEvent.questions.length === 0);

    /**
     * Handles logic that takes place when the user opts to save their
     * questionnaire. Invokes the callback and passes in the current state
     * of the event questions.
     */
    const handleSave = () => {
        if (onSave && typeof onSave === 'function') onSave(eventQuestions);
    }

    /**
     * Handles action taken when a question changes.
     * @param {*} index 
     * @param {*} newValue 
     */
    const handleQuestionChange = (index, newValue) => {
        let newQuestions = [...eventQuestions]
        newQuestions[index].value = newValue;
        console.log(newQuestions)
        setEventQuestions(newQuestions);
    }

    /**
   * Renders the event questionnaire.
   * @param {*} packageQuestions 
   */
  const renderEventQuestionnaire = (packageQuestions) => {
    if (packageQuestions && packageQuestions.length > 0) {
      return packageQuestions.map((question, index) => (
        <>
          {question.data_type === 'textfield' && <>
            <CardContent>
              <Typography variant='body2'><strong>{index + 1}. {question.title}</strong></Typography>
              <FormHelperText style={{ marginLeft: 0 }}>Enter a short response to the prompt.</FormHelperText>
              <br/>
              {!editing ? packageQuestions[index].value : <TextField onChange={(e) => { handleQuestionChange(index, e.target.value) }} variant='filled' fullWidth size='small' placeholder='Enter response...' />}
            </CardContent>
            <Divider />
          </>}

          {question.data_type === 'multiselect' && <><CardContent><FormControl>
            <Typography variant='body2'><strong>{index + 1}. {question.title}</strong></Typography>
            <FormHelperText style={{ marginLeft: 0 }}>*Select all that apply</FormHelperText>
            {!editing ? packageQuestions[index].value : question.values.length > 0 && question.values.map(pQuestion => (
              <FormControlLabel control={<Checkbox />} label={pQuestion} />
            ))}
          </FormControl></CardContent><Divider /></>}

          {question.data_type === 'dropdown' && <><CardContent>
            <Typography variant='body2'><strong>{index + 1}. {question.title}</strong></Typography>
            <FormHelperText style={{ marginLeft: 0 }}>Select the option that best fits.</FormHelperText>
            <br/>
            {!editing ? packageQuestions[index].value : <Select onChange={(e) => { handleQuestionChange(index, e.target.value) }} fullWidth variant='filled' defaultValue={'none'} size='small' key={question.title}>
              <MenuItem key='none' value='none'>Select an option...</MenuItem>
              {question.values.length > 0 && question.values.map(pQuestionValue => (
                <MenuItem key={pQuestionValue} value={pQuestionValue}>{pQuestionValue}</MenuItem>
              ))}</Select>}
              </CardContent><Divider /></>}

          {question.data_type === 'paragraph' && <><CardContent>
            <Typography variant='body2'><strong>{index + 1}. {question.title}</strong></Typography>
            <br/>
            {!editing ? packageQuestions[index].value : <TextField onChange={(e) => { handleQuestionChange(index, e.target.value) }} fullWidth variant='filled' placeholder='Enter response...' multiline minRows={4} />}
            </CardContent><Divider /></>}
        </>
      ))
    }
  }

  return (
    (loading || !initialEvent) ? <LoadingCircle/> : <Card variant='outlined'>
        <CardContent>
          <Typography variant='body2' color={'textSecondary'}><strong>Questions</strong></Typography>
          {initialEvent.questions.length === 0 && <FormHelperText>You have not filled out the questionnaire yet. Begin doing so below, then 'Save' to commit your changes.</FormHelperText>}
        </CardContent>
        {renderEventQuestionnaire(eventQuestions)}
        <CardActions>
          <Button color='inherit' disabled={editing} onClick={() => { setEditing(true) }} startIcon={<SaveAlt />}>Edit</Button>
          <Button color='inherit' onClick={handleSave} startIcon={<SaveAlt />}>Save</Button>
        </CardActions>
      </Card>
  )
}

export default EventSummaryQuestionnaire