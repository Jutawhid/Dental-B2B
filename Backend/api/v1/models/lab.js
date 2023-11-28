const { connectionEasifiMYSQL } = require('../connections/connection');
const queries_lab = require('../queries/lab');


let getAllLabList = async (limit = -1) => {
    return new Promise((resolve, reject) => {
        if(limit === -1) {
            connectionEasifiMYSQL.query(queries_lab.getAllLabList(), (error, result, fields) => {
                if (error) reject(error)
                else resolve(result)
            });
        } else {
            connectionEasifiMYSQL.query(queries_lab.getAllLabListWithLimit(),[limit], (error, result, fields) => {
                if (error) reject(error)
                else resolve(result)
            });
        }
        
    });
}

let getActiveLabList = async () => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queries_lab.getActiveLabList(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });  
    });
}

let getLabListByName = async (name) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queries_lab.getLabListByName(),['%'+name+'%'] ,(error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });  
    });
}

let getNextLabList = async (startId,limit) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queries_lab.getNextLabList(), [startId,limit], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getLabById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queries_lab.getLabById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getLabForOtherById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queries_lab.getLabForOtherById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getLabDataById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queries_lab.getLabDataById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let addNewLab = async (info = {}, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queries_lab.addNewLab(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let disableLabById = async (updatedBy, updatedAt, labId, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queries_lab.disableLabById(), [updatedBy, updatedAt, labId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let enableLabById = async (updatedBy, updatedAt, labId, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queries_lab.enableLabById(), [updatedBy, updatedAt, labId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let deleteLabById = async (updatedBy, updatedAt, labId, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queries_lab.deleteLabById(), [updatedBy, updatedAt, labId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getLabByLicense = async (licenseNumber = "") => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queries_lab.getLabByLicense(), [licenseNumber], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let updateLabById = async (profileId, profileData = {}, conn) => {
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
        connection.query(queries_lab.updateLabById(profileData), [...dataParameter, profileId], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}

let updateLabEmailById = async (email, updatedAt,updatedBy, labId, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queries_lab.updateLabEmailById(), [email,updatedAt,updatedBy, labId], (error, result, fields) => {
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
        connection.query(queries_lab.updateRatingById(data), [...dataParameter, profileId], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}

module.exports = {
    getAllLabList,
    getActiveLabList,
    getNextLabList,
    getLabById,
    getLabForOtherById,
    getLabDataById,
    addNewLab,
    disableLabById,
    enableLabById,
    deleteLabById,
    updateLabById,
    getLabByLicense,
    updateLabEmailById,
    getLabListByName,
    updateRatingById,
}

