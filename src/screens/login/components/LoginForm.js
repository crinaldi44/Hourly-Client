import React, {useState} from "react";
import './LoginForm.css'
import Logo from '../../../assets/images/logo-clock.png'
import {useNavigate} from 'react-router-dom'
import EmployeeApiController from "../../../api/impl/EmployeeApiController";
import { useSnackbar } from 'notistack'

/**
 * Represents the login screen.
 * @constructor
 * @see https://fontawesome.com/v5/cheatsheet
 */
const LoginForm = () => {

    /**
     * Represents the user-input ID.
     */
    const [id, setId] = useState('')

    /**
     * Represents the user-input password.
     */
    const [password, setPassword] = useState('')

    /**
     * Represents the navigation hook.
     */
    const navigate = useNavigate();

    /**
     * Represents the Employees API instance.
     */
    const EmployeesApi = new EmployeeApiController();

    /**
     * Represents a hook for the notistack snackbar queue.
     */
    const { enqueueSnackbar } = useSnackbar()


    /**
     * Handles action taken on submit.
     * @param {*} e the default event provider
     */
    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await EmployeesApi.loginUser(id, password);
            navigate('/dashboard')
        } catch (error) {
            enqueueSnackbar(error.response && error.response.detail, {
                variant: 'error'
            })
        }
    }

    return (
        <form method='POST' className='login-form' onSubmit={e => {handleSubmit(e)}}>
            <div className='form-logo-wrapper'>
                <img className='form-logo' src={Logo} alt='Logo'/>
                <h2>Sign In</h2>
            </div>
            <div style={{marginTop: '15px'}}>
                <span className='input-wrapper' data-label='&#xf007;'>
                    <input onInput={e => {setId(e.target.value)}} id='employee' className='login-input' type='text' name='id' placeholder='Enter your email address'/>
                </span>
                <span className='input-wrapper' data-label='&#xf023;'>
                    <input onInput={e => {setPassword(e.target.value)}} className='login-input' type='password' name='password' placeholder='Enter your password.'/>
                </span>
                <p className='form-header-text'>To request access to this portal, please contact Human Resources.</p>
            </div>
            <input className='login-input' type='submit' value={'SIGN IN'}/>
        </form>
    )

}


export default LoginForm;