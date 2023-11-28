const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesTechCompany = require('../queries/techCompany');


let getAllTechList = async (limit = -1) => {
    return new Promise((resolve, reject) => {
        if(limit === -1) {
            connectionEasifiMYSQL.query(queriesTechCompany.getAllTechList(), (error, result, fields) => {
                if (error) reject(error)
                else resolve(result)
            });
        } else {
            connectionEasifiMYSQL.query(queriesTechCompany.getAllTechListWithLimit(), [limit], (error, result, fields) => {
                if (error) reject(error)
                else resolve(result)
            });
        }
        
    });
}

let getActiveTechList = async () => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesTechCompany.getActiveTechList(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });  
    });
}

let getTechListByName = async (name) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesTechCompany.getTechListByName(),['%'+name+'%'] ,(error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });  
    });
}

let getNextTechList = async (startId,limit) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesTechCompany.getNextTechList(), [startId,limit], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getTechCompanyById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesTechCompany.getTechCompanyById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getTechCompanyForOtherById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesTechCompany.getTechCompanyForOtherById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getTechCompanyDataById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesTechCompany.getTechCompanyDataById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let addNewTech = async (info = {}, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesTechCompany.addNewTech(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let disableTechById = async (updatedBy, updatedAt, techId, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesTechCompany.disableTechById(), [updatedBy, updatedAt, techId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let enableTechById = async (updatedBy, updatedAt, techId, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesTechCompany.enableTechById(), [updatedBy, updatedAt, techId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let deleteTechById = async (updatedBy, updatedAt, techId, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesTechCompany.deleteTechById(), [updatedBy, updatedAt, techId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getTechByLicense = async (licenseNumber = "") => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesTechCompany.getTechByLicense(), [licenseNumber], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let updateTechById = async (profileId, profileData = {}, conn) => {
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
        connection.query(queriesTechCompany.updateTechById(profileData), [...dataParameter, profileId], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}

let updateTechEmailById = async (email, updatedAt,updatedBy, techId, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesTechCompany.updateTechEmailById(), [email,updatedAt,updatedBy, techId], (error, result, fields) => {
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
        connection.query(queriesTechCompany.updateRatingById(data), [...dataParameter, profileId], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}

module.exports = {
    getAllTechList,
    getActiveTechList,
    getNextTechList,
    getTechCompanyById,
    getTechCompanyForOtherById,
    getTechCompanyDataById,
    addNewTech,
    disableTechById,
    enableTechById,
    deleteTechById,
    updateTechById,
    getTechByLicense,
    updateTechEmailById,
    getTechListByName,
    updateRatingById
}

