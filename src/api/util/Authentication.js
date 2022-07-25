import axios from 'axios'


/**
 * De-authenticates the user by removing the access token.
 */
const deAuthenticate = () => {
        localStorage.removeItem('token')
    }

/**
 * Represents whether or not the user is authenticated, in real-time.
 * @returns {boolean}
 */
const isAuthenticated = () => {
        // This should 1) check to verify 'employee' is in local storage and
        // 2), verify that the 'exp' field in the JWT payload has not expired.
        return checkCredentials() || false
    }

/**
 * Checks user credentials. Validates that the user's token has not expired
 * and is valid.
 * @returns {boolean}
 */
const checkCredentials = () => {
        let authCredentials = localStorage.getItem('token')
        let payload;

        // Verify that the value of the token is a JSON.
        try {
            payload = JSON.parse(window.atob(authCredentials.split('.')[1]))
        } catch (error) {
            return false;
        }

        // console.log('Date now: ' + Date.now())
        // console.log('expiration: ' + (payload['exp'] * 1000))

        // console.log(Date.now() > (payload['exp'] * 1000))

        // Verify the token has not expired.
        if (Date.now() > (payload['exp'] * 1000)) {
            deAuthenticate()
            return false;
        }

        return true;
        }

/**
 * Decodes a JSON Web Token and returns the decoded payload.
 * @param token
 * @returns {*}
 */
const jwtDecodePayload = (token) => {
            token = token.split('.');
            token[1] = JSON.parse(window.atob(token[1]))

            return token[1]
        }

/**
 * Retrieves the user's access token.
 * @returns {*}
 */
const getActiveEmployee = () => {
            return jwtDecodePayload(localStorage.getItem('token'))
        }

/**
 * Retrieves the user's company from the access token.
 * @returns {*}
 */
const getUsersCompany = () => {
            return jwtDecodePayload(localStorage.getItem('token'))['company_id']
        }

        /**
         * Retrieves the role of the user from the access token.
         */
        const getUserRole = () => {
            let roleId = jwtDecodePayload(localStorage.getItem('token'))['role']
            switch (roleId) {
                case 1:
                    return 'employee'
                case 2:
                    return 'organization owner'
                case 3:
                    return 'administrator'
                case 4:
                    return 'developer'
                default:
                    return 'unauthorized'
            }
        }

/**
 * Gets the token.
 * @returns {string}
 */
const getToken = () => {
            return localStorage.getItem('token')
        }

export default { isAuthenticated, deAuthenticate, checkCredentials, jwtDecodePayload, getActiveEmployee, getUserRole, getUsersCompany, getToken };