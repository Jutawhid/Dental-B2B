const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesState = require('../queries/state');

// Promises Method
let getAllStateList = async () => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesState.getAllStateList(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getStateById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesState.getStateById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


module.exports = {
    getAllStateList,
    getStateById
}

