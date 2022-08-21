import React from "react";
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Send from '@mui/icons-material/Send'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Checkbox from "@mui/material/Checkbox";
import Divider from '@mui/material/Divider'
import LoadingButton from '@mui/lab/LoadingButton'
import CircularProgress from '@mui/material/CircularProgress'
import Select from "@mui/material/Select";
import WarningAmber from '@mui/icons-material/WarningAmber'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import ErrorOutline from '@mui/icons-material/ErrorOutline'
import Tooltip from "@mui/material/Tooltip";
import Autocomplete from '@mui/material/Autocomplete'
import DepartmentApiController from "../../../api/impl/DepartmentApiController";

/**
 * Represents the form to allow an administrative user to sign up
 * a user thru the database.
 * @author chrisrinaldi
 * @date 25 July, 2022
 * @param props the props
 */
const UserSignupForm = (props) => {

    const {

        /**
         * Represents the initial user to base the
         * submission off of, if any. If this prop is provided,
         * this form will become an "edit" form
         * @optional
         * @type {Object}
         */
        initialUser,

        /**
         * Represents a function that accepts a parameter for
         * when the user model has changed.
         * @optional
         * @type {Function}
         */
        onUserModelChanged,

        /**
         * Represents a function that accepts a parameter for
         * the user model and triggers when the form has been
         * submitted.
         * @optional
         * @type {Function}
         */
        onSubmit,

        /**
         * Represents whether the form should be loading or not, i.e.
         * in the case of an API request or when awaiting data. In this
         * situation, fields within the form will be disabled and the
         * button will show that the form is loading.
         */
        loading,

        /**
         * Represents the listing of companies available to the user
         * to be selected. This is done to provide control to the parent
         * for which companies the user can be added to, i.e. utilizing
         * this form for administrators versus organization owners.
         */
        companies,

        /**
         * Represents the listing of roles to allow control to the
         * parent.
         */
        roles,

    } = props;

    /**
     * Represents an instance of the Departments API, for querying
     * departments when the company selection has changed.
     * @type {DepartmentApiController}
     */
    const DepartmentsApi = new DepartmentApiController();

    /**
     * Represents the user in this submission. If one is provided, takes
     * the form of the user provided in props. Otherwise, sets the default
     * parameters of a user.
     */
    const [user, setUser] = React.useState(initialUser ? initialUser : {
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        pay_rate: 0.0,
        title: '',
        department_id: null,
        role_id: 1,
        company_id: 'none',
        account_disabled: false
    })

    /**
     * Represents the available departments for selection from the user.
     */
    const [departments, setDepartments] = React.useState([])

    /**
     * Represents whether departments are loading, to be provided to the
     * Autocomplete.
     */
    const [departmentsLoading, setDepartmentsLoading] = React.useState(false)

    /**
     * Represents whether the user has an invalid email address.
     * @returns {boolean}
     */
    const userHasInvalidEmail = !user.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    /**
     * Queries the list of options for departments based on the company PID provided.
     * This functionality is intended to leave control of the companies with the
     * parent to be able to easily utilize this component in any setting.
     * @param companyId
     * @returns {Promise<void>}
     */
    const queryDepartmentsForCompanyId = async (companyId) => {

        setDepartmentsLoading(true)

        try {
            const options = await DepartmentsApi.findAll({
                q: {
                    company_id: companyId
                }
            })
            if (options && options.length) {
                setDepartments(options)
            }
            setDepartmentsLoading(false);
        } catch (error) {
            console.error(error)
        }

    }

    /**
     * Handles action to be taken when a field in the user object
     * should change.
     * @param fieldName
     * @param value
     */
    const handleFieldDidChange = (fieldName, value) => {

        if (fieldName === 'company_id' && companies && companies.length > 0 && value) {
            queryDepartmentsForCompanyId(value)
        }

        let newUser = {...user}
        newUser[fieldName] = value;
        setUser(newUser)
    }

    return (<><Card variant={'outlined'}>
        <CardContent style={{textAlign: 'left'}}>
            <Typography style={{color: 'var(--primary-dark)'}}><strong>Signup User</strong></Typography>
        </CardContent>
        <Divider/>
        <CardContent style={{textAlign: 'left'}}>
            <Typography variant={'h6'}>Account Details</Typography>
            <br/>
            <TextField disabled={loading} onChange={e => { handleFieldDidChange('first_name', e.target.value) }} size={'small'} fullWidth label={'First Name'} variant={'filled'}/>
            <br/>
            <br/>
            <TextField disabled={loading} onChange={e => { handleFieldDidChange('last_name', e.target.value) }} size={'small'} fullWidth label={'Last Name'} variant={'filled'}/>
            <br/>
            <br/>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <FormControl error={userHasInvalidEmail} fullWidth>
                        <TextField onChange={(e) => { handleFieldDidChange('email', e.target.value) }} disabled={loading} required InputProps={{
                            endAdornment: userHasInvalidEmail ? <InputAdornment position={'end'}>
                            <WarningAmber color={'error'}/>
                            </InputAdornment> : null
                        }} size={'small'} error={userHasInvalidEmail} fullWidth label={'Email address'} variant={'filled'}/>
                        {userHasInvalidEmail && <FormHelperText>Email must be a valid email address!</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl disabled={loading} error={user.password.length < 8} fullWidth>
                        <TextField onChange={e => { handleFieldDidChange('password', e.target.value) }} disabled={loading} required InputProps={{
                            endAdornment: user.password.length < 8 ? <InputAdornment position={'end'}>
                            <WarningAmber color={'error'}/>
                            </InputAdornment> : null
                        }} size={'small'} type={'password'} error={user.password.length < 8} label={'Password'} variant={'filled'}/>
                        {user.password.length < 8 && <FormHelperText>Please ensure password is greater than 8 characters in
                            length.</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <TextField disabled={loading} onChange={e => { handleFieldDidChange('title', e.target.value) }} size={'small'} fullWidth label={'Title'} variant={'filled'}/>
                </Grid>
                <Grid item xs={6}>
                    <TextField disabled={loading} size={'small'} fullWidth label={'Profile image'} variant={'filled'}/>
                </Grid>
            </Grid>
        </CardContent>
        <Divider/>
        <CardContent style={{textAlign: 'left'}}>
            <Typography variant={'h6'}>Company Information</Typography>
            <br/>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Autocomplete
                        id="user-input"
                        options={companies}
                        disabled={loading}
                        fullWidth
                        onChange={(_, newValue) => {
                            handleFieldDidChange('company_id', newValue.id)
                        }}
                        autoHighlight
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size={'small'}
                                required
                                fullWidth
                                label="Company"
                                variant={'filled'}
                                InputProps={{
                                    ...params.InputProps,
                                    autoComplete: 'new-password',
                                    endAdornment: (
                                        <React.Fragment>
                                            {companies.length === 0 ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Autocomplete
                        id="user-input"
                        options={departments}
                        disabled={loading}
                        fullWidth
                        onChange={(_, newValue) => {
                            handleFieldDidChange('department_id', newValue.id)
                        }}
                        autoHighlight
                        getOptionLabel={(option) => option.department_name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size={'small'}
                                required
                                fullWidth
                                label="Department"
                                variant={'filled'}
                                InputProps={{
                                    ...params.InputProps,
                                    autoComplete: 'new-password',
                                    endAdornment: (
                                        <React.Fragment>
                                            {departmentsLoading ? <CircularProgress color="primary" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Select onChange={e => { handleFieldDidChange('role_id', e.target.value) }} disabled={loading} size={'small'} placeholder={'t'} label={'User role'} fullWidth defaultValue={'none'} variant={'filled'}>
                        <MenuItem value={'none'}>Select a role...</MenuItem>
                        {roles && roles.length > 0 && roles.map(role => (
                            <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={6}>
                    <br/>
                    <Typography>User Account Options</Typography>
                    <FormHelperText>*Select all that apply</FormHelperText>
                    <FormControlLabel  disabled={loading} control={<Checkbox onChange={(e) => { handleFieldDidChange('account_disabled', e.target.value) }} defaultChecked={user.account_disabled}/>} label={"Disable this user's account"}/>
                </Grid>
            </Grid>
        </CardContent>
        <Divider/>
        <CardContent style={{textAlign: 'left'}}>
            <Grid container alignContent={'center'} justifyContent={'space-between'}>
                <Grid item>
                    <Tooltip title={'All required fields must be filled out in order for your request to succeed.'}>
                        <Typography style={{alignContent: 'center', display: 'flex'}} variant={'caption'} color={'textSecondary'}>
                            <ErrorOutline style={{marginRight: '7px', fontSize: '16px'}}/>
                            Please fill all fields that have an asterisk (*).
                        </Typography>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <LoadingButton disabled={userHasInvalidEmail || user.password.length < 8} loading={loading} startIcon={<Send/>} variant={'contained'} onClick={() => {
                        if (onSubmit) onSubmit(user)
                    }}>SIGNUP USER</LoadingButton>
                </Grid>
            </Grid>
        </CardContent>
    </Card>
        <br/>

    </>)

}

export default UserSignupForm;