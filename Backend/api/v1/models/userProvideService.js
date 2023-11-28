const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesUserProvideService = require('../queries/userProvideService');

// Promises Method

let getUserProvideUserProvideServiceList = async () => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUserProvideService.getUserProvideServiceList(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getUnusedServiceListByUserIdAndRoleId = async (userId = 0, roleId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUserProvideService.getUnusedServiceListByUserIdAndRoleId(), [roleId, roleId, userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getMyUsedServiceListByUserIdAndRoleId = async (userId = 0, roleId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUserProvideService.getMyUsedServiceListByUserIdAndRoleId(), [roleId, roleId, userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getUserProvideServiceByNameAndIdentityId = async (name = "", identityId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUserProvideService.getUserProvideServiceByNameAndIdentityId(), [name, identityId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getUserProvideServiceById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUserProvideService.getUserProvideServiceById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getUserProvideServiceByUserIdAndServiceId = async (userId = 0, serviceId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUserProvideService.getUserProvideServiceByUserIdAndServiceId(), [userId, serviceId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let addNewUserProvideService = async (info) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUserProvideService.addNewUserProvideService(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let updateUserProvideServiceByID = async (updateInfo, id) => {


    // get object, generate an array and push data value here

    let keys = Object.keys(updateInfo);
    let dataParameter = [];


    for (let index = 0; index < keys.length; index++) {
        dataParameter.push(updateInfo[keys[index]]);
    }

    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUserProvideService.updateUserProvideServiceByID(updateInfo), [...dataParameter, id], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}

let deleteUserProvideServiceById = async (updated_by, updated_at, id) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUserProvideService.deleteUserProvideServiceById(), [updated_by, updated_at, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}




module.exports = {
    // getUserProvideUserProvideServiceList,
    // getUserProvideServiceByNameAndIdentityId,
    addNewUserProvideService,
    getUserProvideServiceById,
    updateUserProvideServiceByID,
    deleteUserProvideServiceById,
    getUnusedServiceListByUserIdAndRoleId,
    getMyUsedServiceListByUserIdAndRoleId,
    getUserProvideServiceByUserIdAndServiceId
}

