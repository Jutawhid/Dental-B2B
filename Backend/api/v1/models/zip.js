const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesZip = require('../queries/zip');

// Promises Method



let getZipListByCityId = async (cityId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesZip.getZipListByCityId(), [cityId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getZipById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesZip.getZipById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getZipDetailsById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesZip.getZipDetailsById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


module.exports = {
    getZipListByCityId,
    getZipById,
    getZipDetailsById
}

