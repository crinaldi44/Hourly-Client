import axios from "axios"
import AppConfiguration from "./AppConfiguration"
import APIResponseError from "./ApiResponseError";
import Authentication from "./util/Authentication";

/**
 * An API controller is an entity that manages the iteraction between the client
 * and the server. The API controller contains various CRUD-based operations
 * as well as any additionally functionality as required by that particular
 * domain.
 * @author chrisrinaldi
 * @date 17 July, 2022
 */
export default class ApiController {

    /**
     * Constructs a new APIController class.
     */
    constructor(tableName) {
        this.tableName = tableName;
        this.baseUrl = AppConfiguration['PRODUCTION_MODE'] ? AppConfiguration['PROD_BASE'] : AppConfiguration['DEV_BASE']
    }

    /**
     * Appends a specified search query to the base path of the
     * request.
     * @param {any} obj 
     */
    appendQueryToBasePath(obj) {

        let result = this.baseUrl + '/' + this.tableName + '?';

        if (obj) {
            let keys = Object.keys(obj);
            for (let i = 0; i < keys.length; i++) {

                let key = keys[i]
    
                if (typeof obj[key] === 'object' && Object.keys(obj[key]).length > 0) {
                    result += key + '=' + JSON.stringify(obj[key]) + '&';
                } else {
                    result = result.concat(key + '=' + obj[key] + '&')
                }
            }
        }

        return result;
    }

    /**
     * Submits a request to the HourlyCloud with the specified methods and basePath.
     * @param {*} path the path to submit the request to
     * @param {*} method the method to utilize
     * @param {*} body the body of the request
     * @param {*} header the headers to set in the request
     * @param {*} basePath optionally, the base path to use
     * @returns 
     */
    async sendRequest(path, method, body, header, basePath=this.baseUrl) {
        let result = null;

        await axios.request({
            url: path,
            method: method,
            headers: {
                ...header,
                'Authorization': 'Bearer ' + Authentication.getToken() || 'unauthorized'
            },
            data: body,
            baseURL: basePath
        }).then(response => {
            if (response && response.data) result = response.data;
        }, (error) => {
            throw new APIResponseError(error.response.data)
        })

        return result;
    }

    /**
     * Adds the specified resource to the collection of items.
     * @param {Object} body a JSON whose keys match those of the model
     */
    async add(body) {
        let response = await this.sendRequest(`${this.baseUrl}/${this.tableName}`, 'POST', body);
        return response
    }

    /**
     * Retrieves all rows of the specified table. Specify a 
     * query object to append particular filters for that collection
     * of items.
     * 
     * You may, additionally, specify a query object to dictate the response,
     * which follows the following example:
     * 
     * {
     *   sort: '^name',
     *   filter: `{name: 'hello'}`,
     *   page: 1,
     *   offset: 0,
     *   limit: 50
     * }
     * 
     * Note that if the page parameter is specified, the cloud will ignore the
     * offset parameters. The default number of rows per page is 50, however
     * you may override this default limit by specifying the limit parameter.
     * @param {Object} queryObject 
     */
    async findAll(queryObject) {
        let result = await this.sendRequest(this.appendQueryToBasePath(queryObject), 'GET')
        return result && result.data ? result.data : null
    }

    /**
     * Finds the specified row by its unique identifier.
     * @param {Number} id 
     */
    async findById(id) {
        let result = await this.sendRequest(`${this.baseUrl}/${this.tableName}/${id}`, 'GET')
        return result && result.data && result.data.length > 0 ? result.data[0] : null;
    }

    /**
     * Patches the specified resource within the table by unique identifier. Accepts
     * an array of PatchDocuments which is the sequence of changes to be processed
     * on the particular resource.
     * @param {Number} id 
     * @param {Array<PatchDocument>} patchDocumentList 
     */
    async patch(id, patchDocumentList) {
        let result = await this.sendRequest(`${this.baseUrl}/${this.tableName}/${id}`, 'PATCH', patchDocumentList)
        return result
    }

    /**
     * Updates a specified resource within the space. Accepts a JSON with the
     * fields that exist within the item. For each field, constructs a patch document
     * with the respective operation of 'remove', 'add', or 'replace' and appends it to
     * the list. Invokes the patch method.
     * @param {*} id 
     * @param {*} fields 
     */
    async update(id, fields, oldValue) {

        let patchDocumentList = []
        for (let value in Object.keys(fields)) {
            if (fields[value] !== oldValue[value]) {

                let newDocument = {
                    op: (fields[value] === null || fields[value] === undefined) ? 'remove' : 'add',
                    path: value,
                    value: fields[value]
                }

                patchDocumentList.push(newDocument)

            }
        }

        await this.patch(id, patchDocumentList);

    }

    /**
     * Deletes the specified resource by its unique identifier.
     * @param {Number} id 
     */
    async delete(id) {
        let result = await this.sendRequest(`${this.baseUrl}/${this.tableName}/${id}`, 'DELETE')
        return result ? result : null;
    }

}