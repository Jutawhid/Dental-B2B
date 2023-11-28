const isEmpty = require('is-empty');
const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesNotification = require('../queries/notification');

// Promises Method
let addNewNotification = async (info) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesNotification.addNewNotification(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getNotificationByUserIdAndRoleId = async (userId = 0, userRoleId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesNotification.getNotificationByUserIdAndRoleId(), [userId, userRoleId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getNotificationByIDUserIdAndRoleId = async (id = 0, userId = 0, userRoleId = 0) => {
    return new Promise((resolve, reject) => {
        console.log(userId, userRoleId, id);
        connectionEasifiMYSQL.query(queriesNotification.getNotificationByIDUserIdAndRoleId(), [id, userId, userRoleId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let updateNotificationSeenById = async (updated_by, updated_at, id) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesNotification.updateNotificationSeenById(), [updated_by, updated_at, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

module.exports = {
    addNewNotification,
    getNotificationByUserIdAndRoleId,
    getNotificationByIDUserIdAndRoleId,
    updateNotificationSeenById
}

