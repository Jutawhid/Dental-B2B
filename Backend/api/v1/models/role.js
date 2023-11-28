const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesRole = require('../queries/role');

let getRoleById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesRole.getRoleById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getRoleByIdentityId = async (identity_id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesRole.getRoleByIdentityId(), [identity_id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

module.exports = {
    getRoleById,
    getRoleByIdentityId,
}

