const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesTrainingDocument = require('../queries/trainingDocument');

// Promises Method
let getDocumentListByTrainingId = async (trainingId = 0 ) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesTrainingDocument.getDocumentListByTrainingId(), [trainingId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}




module.exports = {
    getDocumentListByTrainingId,
}

