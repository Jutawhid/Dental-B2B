const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesCasePaymentRecord = require('../queries/casePaymentRecord');

let addNewRecord = async (data = {}, conn = undefined) => {

    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesCasePaymentRecord.addNewRecord(), [data], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


module.exports = {
    addNewRecord
}

