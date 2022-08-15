import ApiController from "../ApiController";
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

        let options = {
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                'email': email,
                'password': password
            }
        }

        let response = await axios.post(`${this.baseUrl}/${this.tableName}/login`, options)

        if (response && response.data['token']) {
            localStorage.setItem('token', response.data['token'])
            return response.data['token']
        } else {
            return null;
        }
    }

    /**
     * Retrieves the profile for the specified user.
     * @param {*} id represents the id of the user
     */
    async getUsersProfile(id) {
        let response = await this.sendRequest(`/user/profile/${id}`, 'GET')
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
    async signupUser(email, password, departmentId, payRate=0.0) {
        let response = await this.sendRequest(`${this.baseUrl}/user/signup`, 'POST', {
            email: email,
            password: password,
            pay_rate: payRate,
            department_id: departmentId
        })
    }

}