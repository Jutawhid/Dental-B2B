const isEmpty = require('is-empty');
const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesAdmin = require('../queries/admin');
const queriesUser = require('../queries/user');
//const userModel = require('./user');


let getAllAdminList = async () => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesAdmin.getAllAdminList(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getAdminById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesAdmin.getAdminById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getAdminDetailsById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesAdmin.getAdminDetailsById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let addNewAdmin = async (info = {}, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesAdmin.addNewAdmin(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let disableAdminById = async (updatedBy, updatedAt, adminId, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesAdmin.disableAdminById(), [updatedBy, updatedAt, adminId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let enableAdminById = async (updatedBy, updatedAt, adminId, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesAdmin.enableAdminById(), [updatedBy, updatedAt, adminId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let updateAdminProfileById = (adminId, userId, adminData = {}, userData = {}) => {
    // get object, generate an array and push data value here
    // for admin data
    let keys = Object.keys(adminData);
    let dataParameter = [];

    for (let index = 0; index < keys.length; index++) {
        dataParameter.push(adminData[keys[index]]);

    }

    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }

                if (!isEmpty(userData)) {

                    // get object, generate an array and push data value here
                    // for user data
                    let keys2 = Object.keys(userData);
                    let dataParameter2 = [];

                    for (let index2 = 0; index2 < keys2.length; index2++) {
                        dataParameter2.push(userData[keys2[index2]]);

                    }
                    conn.query(queriesUser.updateAdminUserData(userData), [...dataParameter2, userId], (error, result, fields) => {

                        if (error) {
                            console.log(error);
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        }


                        // let updateUserData = await userModel.updateAdminUserData(userId,userData,conn);

                        // if (updateUserData.affectedRows == undefined || updateUserData.affectedRows < 1) {
                        //     return conn.rollback(function () {
                           // conn.release();
                        //         resolve([]);
                        //     });
                        // }
                    });
                }


                conn.query(queriesAdmin.updateAdminProfileById(adminData), [...dataParameter, adminId], (error, result, fields) => {

                    if (error) {
                        console.log(error);
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    } else {

                        conn.commit(function (err) {
                            if (err) {
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            }
                            conn.release();
                            return resolve(result);

                        });
                    }


                });


            });
        });
    });
}

let updateAdminEmailById = async (email, updatedAt,updatedBy, techId, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesAdmin.updateAdminEmailById(), [email,updatedAt,updatedBy, techId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

module.exports = {
    getAllAdminList,
    getAdminById,
    addNewAdmin,
    disableAdminById,
    enableAdminById,
    getAdminDetailsById,
    updateAdminProfileById,
    updateAdminEmailById
}

