import axios from 'axios'
    
    const deAuthenticate = () => {
        localStorage.removeItem('token')
    }

    const isAuthenticated = () => {
        // This should 1) check to verify 'employee' is in local storage and
        // 2), verify that the 'exp' field in the JWT payload has not expired.
        return checkCredentials() || false
    }
    
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

        const jwtDecodePayload = (token) => {
            token = token.split('.');
            token[1] = JSON.parse(window.atob(token[1]))

            return token[1]
        }

        const getActiveEmployee = () => {
            return jwtDecodePayload(localStorage.getItem('token'))
        }

        const getToken = () => {
            return localStorage.getItem('token')
        }

export default { isAuthenticated, deAuthenticate, checkCredentials, jwtDecodePayload, getActiveEmployee, getToken };