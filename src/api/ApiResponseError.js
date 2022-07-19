/**
 * An APIResponseError is an error that is caught when the API
 * responds with a code that is not a 'success' error code.
 */
class APIResponseError extends Error {

    /**
     * Constructs a new APIResponseError.
     * @param {number} status
     * @param {JSON} json represents the json data containing the response
     * @param {string} message 
     */
    constructor(response) {
        super('The server responded with error code: ' + response.status + '.');
        this.response = response
    }

}

export default APIResponseError