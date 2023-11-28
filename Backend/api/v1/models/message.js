const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesMessage = require('../queries/message');

let getMessageList = async (userId) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesMessage.getMessageList(), [userId,userId, userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getMessageDetails = async (userId,reqUserId) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesMessage.getMessageDetails(), [userId,reqUserId,reqUserId,userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getMessageById = async (id) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesMessage.getMessageById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let addNewMessage = async (info) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesMessage.addNewMessage(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let updateMessageSeenId = async (updated_by, updated_at, id) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesMessage.updateMessageSeenId(), [updated_by, updated_at, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


module.exports = {
    getMessageList,
    getMessageDetails,
    getMessageById,
    addNewMessage,
    updateMessageSeenId,
}

