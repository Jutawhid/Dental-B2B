const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesCity = require('../queries/city');

// Promises Method 


let getCityById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCity.getCityById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getCityListByStateId = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCity.getCityListByStateId(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}




module.exports = {
    getCityById,
    getCityListByStateId
}

