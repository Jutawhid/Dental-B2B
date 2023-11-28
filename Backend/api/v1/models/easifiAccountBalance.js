const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesEasifiAccountBalance = require('../queries/easifiAccountBalance');



let getAllEasifiBalanceRecordsById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesEasifiAccountBalance.getAllEasifiBalanceRecordsById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let updateBalanceById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesEasifiAccountBalance.updateBalanceById(), [id, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let addNewBalanceRecords = async (data = {}) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesEasifiAccountBalance.addNewBalanceRecords(), [data], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getBalanceByID = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesEasifiAccountBalance.getBalanceByID(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let updateEasifiBalanceRecordsById = async (id, updateData = {}, conn = undefined) => {

    // get object, generate an array and push data value here

    // for update data
    let keysOfUpdateData = Object.keys(updateData);
    let dataParameterUpdateData = [];

    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    for (let index = 0; index < keysOfUpdateData.length; index++) {
        dataParameterUpdateData.push(updateData[keysOfUpdateData[index]]);

    }
    return new Promise((resolve, reject) => {
        connection.query(queriesEasifiAccountBalance.updateEasifiBalanceRecordsById(updateData), [...dataParameterUpdateData, id], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}

module.exports = {
    getAllEasifiBalanceRecordsById,
    updateEasifiBalanceRecordsById,
    addNewBalanceRecords,
    getBalanceByID,
    updateBalanceById
}