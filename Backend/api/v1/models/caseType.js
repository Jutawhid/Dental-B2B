const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesCaseType = require('../queries/caseType');

// Promises Method

let getCaseTypeList = async () => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseType.getCaseTypeList(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getCaseTypeById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseType.getCaseTypeById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}



module.exports = {
    getCaseTypeList,
    getCaseTypeById,
}

