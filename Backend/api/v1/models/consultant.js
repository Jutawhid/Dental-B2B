const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesConsultant = require('../queries/consultant');


let getAllConsultantList = async (limit = -1 ) => {
    return new Promise((resolve, reject) => {
        if(limit === -1){
            connectionEasifiMYSQL.query(queriesConsultant.getAllConsultantList(), (error, result, fields) => {
                if (error) reject(error)
                else resolve(result)
            });
        } else {
            connectionEasifiMYSQL.query(queriesConsultant.getAllConsultantListWithLimit(),[limit], (error, result, fields) => {
                if (error) reject(error)
                else resolve(result)
            });
        }
        
    });
}

let getActiveConsultantList = async () => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesConsultant.getActiveConsultantList(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });  
    });
}

let getConsultantListByName = async (name) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesConsultant.getConsultantListByName(),['%'+name+'%','%'+name+'%'] ,(error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });  
    });
}


let getNextConsultantList = async (startId,limit) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesConsultant.getNextConsultantList(), [startId,limit], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getConsultantById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesConsultant.getConsultantById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getConsultantForOtherById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesConsultant.getConsultantForOtherById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getConsultantDataById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesConsultant.getConsultantDataById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getConsultantByNpi = async (npi = "") => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesConsultant.getConsultantByNpi(), [npi], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getConsultantByLicense = async (licenseNumber = "") => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesConsultant.getConsultantByLicense(), [licenseNumber], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let addNewConsultant = async (info = {}, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesConsultant.addNewConsultant(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let disableConsultantById = async (updatedBy, updatedAt, consultantId, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesConsultant.disableConsultantById(), [updatedBy, updatedAt, consultantId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let enableConsultantById = async (updatedBy, updatedAt, consultantId, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesConsultant.enableConsultantById(), [updatedBy, updatedAt, consultantId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let deleteConsultantById = async (updatedBy, updatedAt, consultantId, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesConsultant.deleteConsultantById(), [updatedBy, updatedAt, consultantId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let updateConsultantById = async (profileId, profileData = {}, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    // get object, generate an array and push data value here

    // for  data
    let keys = Object.keys(profileData);

    let dataParameter = [];

    for (let index = 0; index < keys.length; index++) {
        dataParameter.push(profileData[keys[index]]);

    }
    return new Promise((resolve, reject) => {
        connection.query(queriesConsultant.updateConsultantById(profileData), [...dataParameter, profileId], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}

let updateConsultantEmailById = async (email, updatedAt,updatedBy, consultantId, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesConsultant.updateConsultantEmailById(), [email,updatedAt,updatedBy, consultantId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let updateRatingById = async (data = {},profileId ,conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    // get object, generate an array and push data value here

    // for  data
    let keys = Object.keys(data);

    let dataParameter = [];

    for (let index = 0; index < keys.length; index++) {
        dataParameter.push(data[keys[index]]);

    }
    return new Promise((resolve, reject) => {
        connection.query(queriesConsultant.updateRatingById(data), [...dataParameter, profileId], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}

module.exports = {
    getAllConsultantList,
    getActiveConsultantList,
    getNextConsultantList,
    getConsultantById,
    getConsultantDataById,
    getConsultantByNpi,
    getConsultantByLicense,
    addNewConsultant,
    disableConsultantById,
    enableConsultantById,
    deleteConsultantById,
    updateConsultantById,
    updateConsultantEmailById,
    getConsultantForOtherById,
    getConsultantListByName,
    updateRatingById,
}

