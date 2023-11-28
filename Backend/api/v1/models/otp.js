const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesOtp = require('../queries/otp');

let getEmailChangeRequestByUserId = async (id = 0, type = '') => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesOtp.getEmailChangeRequestByUserId(), [id, type], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getRequestByOTP = async (userId = 0, type = '',otp = '') => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesOtp.getRequestByOTP(), [userId, type, otp], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let updateEmailChangeRequest = async (id, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesOtp.updateEmailChangeRequest(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let addRequestMailChange = async (info) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesOtp.addRequestMailChange(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getActiveRequestByIdAndType = async (id = 0, type = '') => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesOtp.getActiveRequestByIdAndType(), [id, type], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let updateCounter = async (id, counter) => {
    

    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesOtp.updateCounter(), [counter , id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}



module.exports = {
    getEmailChangeRequestByUserId,
    getRequestByOTP,
    updateEmailChangeRequest,
    addRequestMailChange,
    getActiveRequestByIdAndType,
    updateCounter

}

