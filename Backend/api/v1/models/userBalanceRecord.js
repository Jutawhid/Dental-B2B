const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesUserBalanceRecords = require('../queries/userBalanceRecord');



let getAllBalanceRecordsByUserID = async (userId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUserBalanceRecords.getAllBalanceRecordsByUserID(), [userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getAllBalanceRecordsByID = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUserBalanceRecords.getAllBalanceRecordsByID(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}
let getTotalInBalanceByUserId = async (userID = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUserBalanceRecords.getTotalInBalanceByUserId(), [userID], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}
let getTotalOutBalanceByUserId = async (userID = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUserBalanceRecords.getTotalOutBalanceByUserId(), [userID], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}
    

let addNewUserBalanceRecord = async (data = {}, conn = undefined) => {

    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesUserBalanceRecords.addNewUserBalanceRecord(), [data], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let updateBalanceRecords = async (id, updateData = {}, conn = undefine) => {

    // get object, generate an array and push data value here

    // for update data

    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    let keysOfUpdateData = Object.keys(updateData);
    let dataParameterUpdateData = [];

    for (let index = 0; index < keysOfUpdateData.length; index++) {
        dataParameterUpdateData.push(updateData[keysOfUpdateData[index]]);

    }
    return new Promise((resolve, reject) => {
        connection.query(queriesUserBalanceRecords.updateBalanceRecords(updateData), [...dataParameterUpdateData, id], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}


module.exports = {
    getAllBalanceRecordsByUserID,
    addNewUserBalanceRecord,
    getAllBalanceRecordsByID,
    getTotalInBalanceByUserId,
    getTotalOutBalanceByUserId

}

