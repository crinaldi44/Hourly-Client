import React from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import PackageQuestionForm from './PackageQuestionForm'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Authentication from '../../../api/util/Authentication'
import { v4 as uuidv4 } from 'uuid'
import LoadingButton from '@mui/lab/LoadingButton'

/**
 * Represents a form that allows a user to add a new package.
 * @returns {JSX.Element}
 */
const PackageForm = (props) => {

    const {

        /**
         * Represents the initial package, if any.
         */
        initialPackage,

        /**
         * Handles action taken when the user has submitted the form.
         * @param {Package} package represents the package to be submitted
         * @optional
         * @type {Function}
         */
        onSubmit,

        /**
         * Represents whether the form is loading.
         */
        loading

    } = props;

    const [eventPackage, setEventPackage] = React.useState(initialPackage ? initialPackage : {
        name: '',
        description: '',
        img_url: '',
        price: 0.0,
        company_id: Authentication.getUsersCompany(),
        questions: []
    })

    /**
     * Represents the event package questions.
     */
    const [eventPackageQuestions, setEventPackageQuestions] = React.useState({})

    /**
     * Initializes the event package questions into PackageQuestionForms indexable
     * by a unique identifier. This makes insertion and deletion efficient at the
     * cost of initialization time of the form. When the form has been submitted,
     * the values contained can be mapped and sent.
     */
    const initializePackageQuestions = () => {
        if (initialPackage && initialPackage.questions.length > 0) {
            let newEventPackageQuestions = {}
            initialPackage.questions.map(question => {
                newEventPackageQuestions[uuidv4()] = question
            })
            setEventPackageQuestions(newEventPackageQuestions)
        } else {
            let newEventPackageQuestions = {}
            newEventPackageQuestions[uuidv4()] = {
                title: '',
                dataType: 'textfield',
                value: '',
                values: []
            }
            setEventPackageQuestions(newEventPackageQuestions);
        }
    }

    const handlePackageNameChange = (newValue) => {
        let newEventPackage = {...eventPackage, name: newValue}
        setEventPackage(newEventPackage)
    }

    const handlePackagePriceChange = (newValue) => {
        let newEventPackage = {...eventPackage, price: newValue}
        setEventPackage(newEventPackage)
    }

    const handlePackageImgUrlChange = (newValue) => {
        let newEventPackage = {...eventPackage, img_url: newValue}
        setEventPackage(newEventPackage)
    }

    const handlePackageDescriptionChange = (newValue) => {
        let newEventPackage = {...eventPackage, description: newValue}
        setEventPackage(newEventPackage)
    }

    const handleSubmit = () => {
        if (!eventPackage.name || !onSubmit) return;

        const questions = Object.values(eventPackageQuestions);
        let newEventPackage = {...eventPackage, questions: questions}
        onSubmit(newEventPackage);
    }

    React.useEffect(() => {
        initializePackageQuestions();
    }, [])

    const handleNewPackageQuestion = () => {
        let newEventPackageQuestions = {...eventPackageQuestions};
        newEventPackageQuestions[uuidv4()] = {
            title: '',
            dataType: 'textfield',
            value: '',
            values: []
        }
        console.log();
        setEventPackageQuestions(newEventPackageQuestions)
    }

    const handleEventPackageQuestionChange = (uuid, newValue) => {
        let newEventPackageQuestions = {...eventPackageQuestions}
        newEventPackageQuestions[uuid] = newValue;
        setEventPackageQuestions(newEventPackageQuestions)
    }

    const handlePackageQuestionDelete = (uuid) => {
        let newEventPackageQuestions = {...eventPackageQuestions}
        delete newEventPackageQuestions[uuid]
        setEventPackageQuestions(newEventPackageQuestions)
    }

  return ( <><Card style={{textAlign: 'left', borderTopColor: 'gray', borderTop: 'solid', borderTopWidth: '9px'}}>
    <CardContent>
        <Typography variant='h4' marginBottom={1} fontWeight={400}>Create Package</Typography>
        <Typography variant='body2' color='darkgray'><strong>Use the form below to build a new package to be utilized by employees or attendees.</strong></Typography>
        <br/>
        <FormControlLabel disabled={loading} style={{marginBottom: '10px'}} control={<Checkbox/>} label="Make this package active upon submission"/>
        <TextField disabled={loading} onChange={e => { handlePackageNameChange(e.target.value) }} defaultValue={eventPackage.name} label="Package name" fullWidth variant='filled'/>
        <br/>
        <br/>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <TextField disabled={loading} onChange={e => { handlePackagePriceChange(e.target.value) }} defaultValue={eventPackage.price} label="Price" type={'number'} fullWidth variant='filled'/>
            </Grid>
            <Grid item xs={6}>
                <TextField disabled={loading} onChange={e => { handlePackageImgUrlChange(e.target.value) }} defaultValue={eventPackage.img_url} label="Image url" type={'url'} fullWidth variant='filled'/>
            </Grid>
        </Grid>
        <br/>
        <TextField disabled={loading} onChange={e => { handlePackageDescriptionChange(e.target.value) }} defaultValue={eventPackage.description} multiline minRows={4} label="Description" fullWidth variant='filled'/>
    </CardContent>
    <Divider/>
    <CardContent>
        <Typography>Questions</Typography>
        <Typography variant='body2' color='textSecondary'>Questions are answerable fields that are typically details that surround an event. You will want questions for any information you want to obtain from clients. These are visible to both employees and clients.</Typography>
        <br/>
        {Object.keys(eventPackageQuestions).length > 0 && Object.entries(eventPackageQuestions).map(([uuid, question], index) => (
            <>
            <PackageQuestionForm 
                disabled={loading}
                id={uuid}
                order={index + 1} 
                initialPackageQuestion={question}
                handlePackageQuestionChange={handleEventPackageQuestionChange}
                handlePackageQuestionDelete={handlePackageQuestionDelete}
            />
            <br/>
            </>
        ))}
        <Button disabled={loading} variant='contained' onClick={handleNewPackageQuestion}>New Question</Button>
    </CardContent>
  </Card>
  <br/>
  <LoadingButton loading={loading} onClick={handleSubmit} variant='contained' fullWidth>SUBMIT</LoadingButton>
  </>
  )
}


export default PackageForm