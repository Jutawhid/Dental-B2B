const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesService = require('../queries/service');

// Promises Method

let getServiceList = async () => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesService.getServiceList(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getServiceByNameAndPriority = async (name = "", priority = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesService.getServiceByNameAndPriority(), [name, priority], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getServiceByName = async (name = "") => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesService.getServiceByName(), [name], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getServiceByPriority = async (priority = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesService.getServiceByPriority(), [priority], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getServiceById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesService.getServiceById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let addNewService = async (info) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesService.addNewService(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let updateServiceByID = async (name, priority, updated_by, updated_at, id) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesService.updateServiceByID(), [name, priority, updated_by, updated_at, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let deleteServiceById = async (updated_by, updated_at, id) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesService.deleteServiceById(), [updated_by, updated_at, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let enableServiceById = async (updated_by, updated_at, id) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesService.enableServiceById(), [updated_by, updated_at, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let disableServiceById = async (updated_by, updated_at, id) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesService.disableServiceById(), [updated_by, updated_at, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}



module.exports = {
    getServiceList,
    getServiceByNameAndPriority,
    getServiceByName,
    getServiceByPriority,
    addNewService,
    getServiceById,
    updateServiceByID,
    deleteServiceById,
    enableServiceById,
    disableServiceById
}

