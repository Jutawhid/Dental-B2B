const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesLoginTracker = require('../queries/loginTrack');

let getLoggingTrackerById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesLoginTracker.getLoggingTrackerById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getLoggingTrackerByUserId = async (user_id = 0, time = "2022-01-23 07:29:56") => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesLoginTracker.getLoggingTrackerByUserId(), [user_id, time], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getLoggingTrackerByUserIdANDId = async (user_id = 0, id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesLoginTracker.getLoggingTrackerByUserIdANDId(), [user_id, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getLoggingTrackerByUUID = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesLoginTracker.getLoggingTrackerByUUID(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let addNewLoggingTracker = async (info) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesLoginTracker.addNewLoggingTracker(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let deleteLoggingTrackerDataByUUID = async (uuid = "") => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesLoginTracker.deleteLoggingTrackerDataByUUID(), [uuid], (error, result, fields) => {
            if (error) reject(error)
            else {
                //console.log("as//");
                resolve(result)
            }
        });
    });
}

module.exports = {
    getLoggingTrackerById,
    addNewLoggingTracker,
    getLoggingTrackerByUUID,
    getLoggingTrackerByUserId,
    getLoggingTrackerByUserIdANDId,
    deleteLoggingTrackerDataByUUID
}

