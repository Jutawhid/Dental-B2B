const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesForgetPassword = require('../queries/forgetPassword');



// Forget Password code
let insertForgetPassword = async (info) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesForgetPassword.insertForgetPassword(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getUserByToken = async (token = '') => { // get only active user
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesForgetPassword.getUserByToken(), [token], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let disableLinkById = async (id, conn) => {

    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesForgetPassword.disableLinkById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}





module.exports = {

    insertForgetPassword,
    getUserByToken,
    disableLinkById,
}

