const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesUserBalance = require('../queries/userBalance');
const dentistModel = require('./dentist');
const consultantModel = require('./consultant');
const labModel = require('./lab');
const techCompanyModel = require('./techCompany');
const adminModel = require('./admin');
const superAdminModel = require("./superAdmin");
const otpModel = require('./otp');
const forgetPasswordModel = require('./forgetPassword');
const isEmpty = require('is-empty');

let getCurrentBalanceByUserID = async (userId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUserBalance.getCurrentBalanceByUserID(), [userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let updateUserBalance = async (id, updateData = {}, conn = undefined) => {

    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;
    // get object, generate an array and push data value here

    // for update data
    let keysOfUpdateData = Object.keys(updateData);
    let dataParameterUpdateData = [];

    for (let index = 0; index < keysOfUpdateData.length; index++) {
        dataParameterUpdateData.push(updateData[keysOfUpdateData[index]]);

    }
    return new Promise((resolve, reject) => {
        connection.query(queriesUserBalance.updateUserBalance(updateData), [...dataParameterUpdateData, id], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}

let updateUserBalanceByUserId = async (userId = 0, updateData = {}, conn = undefined) => {

    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;
    // get object, generate an array and push data value here

    // for update data
    let keysOfUpdateData = Object.keys(updateData);
    let dataParameterUpdateData = [];

    for (let index = 0; index < keysOfUpdateData.length; index++) {
        dataParameterUpdateData.push(updateData[keysOfUpdateData[index]]);
    }

    return new Promise((resolve, reject) => {
        connection.query(queriesUserBalance.updateUserBalanceByUserId(updateData), [...dataParameterUpdateData, userId], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}

let updateBalanceByUserId = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUserBalance.updateBalanceByUserId(), [id, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

module.exports = {
    getCurrentBalanceByUserID,
    updateUserBalance,
    updateUserBalanceByUserId,
    updateBalanceByUserId
}

