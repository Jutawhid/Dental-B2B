const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesSuperAdmin = require('../queries/superAdmin');

let getSuperAdminById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesSuperAdmin.getSuperAdminById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let updateSuperAdminEmailById = async (email, updatedAt,updatedBy, techId, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesSuperAdmin.updateSuperAdminEmailById(), [email,updatedAt,updatedBy, techId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

module.exports = {
    getSuperAdminById,
    updateSuperAdminEmailById
}

