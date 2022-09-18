/**
 * Reads from a CSV. If successful, resolves the promise with the array 
 * of CSV lines.
 * @param {*} file 
 * @returns {Array<String>} the CSV lines
 */
export const readValidationsFromCsv = (file) => {
    return new Promise((resolve, reject) => {
        var fr = new FileReader();  
        fr.onload = () => {
          resolve(fr.result.split('\n'))
        };
        fr.onerror = reject;
        fr.readAsText(file);
    });
}

/**
 * Represents the default value delimiter for the text.
 */
export const VALUE_DELIMITER = ',';

/**
 * Parses employee validations from a spreadsheet. This is used to bulk import employees
 * as well as their respective timesheets.
 * @param {*} csvLines 
 * @param {*} index 
 * @param {*} validations 
 * @returns {Array<EmployeeValidations>} the array of identified validations
 */
export const parseValidationsFromSpreadsheet = (csvLines, index=1, validations=[]) => {
    if (index >= csvLines.length) return validations;
    if (!csvLines[index]) return parseValidationsFromSpreadsheet(csvLines, ++index, validations);
    const unparsedValidation = csvLines[index].split(VALUE_DELIMITER)
    const unparsedName = unparsedValidation[1].split(' ')
    const newValidation = {
        "email": unparsedValidation[0],
        'first_name': unparsedName[0],
        'last_name': unparsedName[1],
        'department_name': unparsedValidation[2],
        'company_name': unparsedValidation[3],
        'pay_rate': parseFloat(unparsedValidation[4])
    }
    validations.push(newValidation);
    return parseValidationsFromSpreadsheet(csvLines, ++index, validations);
}