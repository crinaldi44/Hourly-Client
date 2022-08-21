import ApiController from "../ApiController";
import APIResponseError from "../ApiResponseError";
import axios from "axios";

/**
 * Handles communication with the Employees domain within the cloud. Manages
 * create-read-update-delete operations as well as functionality to authenticate
 * and de-authenticate the user.
 * @author chrisrinaldi
 * @date 17 July, 2022
 */
export default class EmployeeApiController extends ApiController {
    
    constructor() {
        super('employees');
    }

    /**
     * Authenticates the user with a username and a password. Utilizes
     * the direct POST method within Axios to avoid running into CORS
     * and preflight check issues.
     * @param {string} username 
     * @param {string} password 
     */
    async loginUser(email, password) {

        let data = {
            'email': email,
            'password': password
        }

        await axios.request({
            url: `/${this.tableName}/login`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: data,
            baseURL: this.baseUrl
        }).then(response => {
            if (response && response.data['accessToken']) {
                localStorage.setItem('token', response.data['accessToken'])
                return response.data['accessToken']
            }
        }, (error) => {
            throw new APIResponseError(error.response.data)
        })
    }

    /**
     * Retrieves the profile for the specified user.
     * @param {*} id represents the id of the user
     */
    async getUsersProfile(id) {
        let response = await this.sendRequest(`/employees/profile/${id}`, 'GET')
        if (response && response.data) {
            return response.data
        }
    }

    /**
     * Signs up a user with the specified email and password.
     * @param {string} email 
     * @param {string} password 
     * @param {float} payRate 
     */
    async signupUser(email, password, departmentId, firstName, lastName, payRate=0.0) {
        let response = await this.sendRequest(`${this.baseUrl}/user/signup`, 'POST', {
            email: email,
            password: password,
            pay_rate: payRate,
            department_id: departmentId,
            first_name: firstName,
            last_name: lastName
        })
    }

}