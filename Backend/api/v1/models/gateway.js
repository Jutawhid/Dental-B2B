const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesGateway = require('../queries/gateway');

// Promises Method

let getGatewayList = async () => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesGateway.getGatewayList(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getGatewayByName = async (name = "") => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesGateway.getGatewayByName(), [name], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getGatewayById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesGateway.getGatewayById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let addNewGateway = async (info) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesGateway.addNewGateway(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let updateGatewayByID = async (name, image, updated_by, updated_at, id) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesGateway.updateGatewayByID(), [name, image, updated_by, updated_at, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let deleteGatewayById = async (updated_by, updated_at, id) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesGateway.deleteGatewayById(), [updated_by, updated_at, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let enableGatewayById = async (updated_by, updated_at, id) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesGateway.enableGatewayById(), [updated_by, updated_at, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let disableGatewayById = async (updated_by, updated_at, id) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesGateway.disableGatewayById(), [updated_by, updated_at, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}



module.exports = {
    getGatewayList,
    getGatewayByName,
    getGatewayById,
    addNewGateway,
    updateGatewayByID,
    deleteGatewayById,
    enableGatewayById,
    disableGatewayById
}

