const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesServiceAccessRoles = require('../queries/serviceAccessRoles');

// Promises Method



let addNewServiceAccessRoles = async (info) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesServiceAccessRoles.addNewServiceAccessRoles(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getAccessListByServiceId = async (serviceId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesServiceAccessRoles.getAccessListByServiceId(), [serviceId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getUserListByServiceId = async (serviceId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesServiceAccessRoles.getUserListByServiceId(), [serviceId, serviceId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let disableServiceAccessId = async (id, updated_by, updated_at) => {
    console.log(updated_by);
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesServiceAccessRoles.disableServiceAccessId(), [updated_by, updated_at, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let enableServiceAccessId = async (id, updated_by, updated_at) => {

    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesServiceAccessRoles.enableServiceAccessId(), [updated_by, updated_at, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let updateServiceId = async (id, service_id) => {

    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesServiceAccessRoles.updateServiceId(), [service_id, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let deleteServiceAccessId = async (id, updated_by, updated_at) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesServiceAccessRoles.deleteServiceAccessId(), [updated_by, updated_at, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}






module.exports = {
    addNewServiceAccessRoles,
    getAccessListByServiceId,
    disableServiceAccessId,
    enableServiceAccessId,
    deleteServiceAccessId,
    updateServiceId,
    getUserListByServiceId
}

