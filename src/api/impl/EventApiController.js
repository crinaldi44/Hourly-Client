import ApiController from "../ApiController";

/**
 * Represents an API controller instance that manages interactions with
 * the packages domain.
 * @author chrisrinaldi
 * @date 17 July, 2022
 */
export default class EventApiController extends ApiController {

    constructor() {
        super('events')
    }
    

    async search(fromDate, toDate) {
        Date.prototype.mmddyyyy = function() {
            var mm = this.getMonth() + 1; // getMonth() is zero-based
            var dd = this.getDate();
          
            return [(mm>9 ? '' : '0') + mm,
                    (dd>9 ? '' : '0') + dd,
                    this.getFullYear(),
                   ].join('/');
          };
        let result = await this.sendRequest(`${this.baseUrl}/${this.tableName}/search`, 'POST', {
            'from_date': fromDate.mmddyyyy(),
            'to_date': toDate.mmddyyyy()
        })
        if (result && result.data) {
            return result.data
        }
        return [];
    }

}