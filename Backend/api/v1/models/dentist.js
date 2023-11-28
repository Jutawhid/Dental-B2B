const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesDentist = require('../queries/dentist');


let getAllDentistList = async (limit = -1) => {
    return new Promise((resolve, reject) => {
        if(limit === -1){
            connectionEasifiMYSQL.query(queriesDentist.getAllDentistList(), (error, result, fields) => {
                if (error) reject(error)
                else resolve(result)
            });
        } else {
            connectionEasifiMYSQL.query(queriesDentist.getAllDentistListWithLimit(),[limit], (error, result, fields) => {
                if (error) reject(error)
                else resolve(result)
            });
        }
        
    });
}

let getActiveDentistList = async () => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesDentist.getActiveDentistList(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });  
    });
}


let getDentistListByName = async (name) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesDentist.getDentistListByName(),['%'+name+'%','%'+name+'%'] ,(error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });  
    });
}

let getNextDentistList = async (startId,limit) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesDentist.getNextDentistList(), [startId,limit], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getDentistById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesDentist.getDentistById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getDentistDataById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesDentist.getDentistDataById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}



let getDentistByNpi = async (npi = "") => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesDentist.getDentistByNpi(), [npi], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getDentistByLicense = async (licenseNumber = "") => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesDentist.getDentistByLicense(), [licenseNumber], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let addNewDentist = async (info = {}, conn) => {

    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesDentist.addNewDentist(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let verifyDentist = async (profileId, updatedAt, conn) => {

    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesDentist.verifyDentist(), [updatedAt, profileId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let disableDentistById = async (updatedBy, updatedAt, dentistId, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesDentist.disableDentistById(), [updatedBy, updatedAt, dentistId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let enableDentistById = async (updatedBy, updatedAt, dentistId, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesDentist.enableDentistById(), [updatedBy, updatedAt, dentistId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let deleteDentistById = async (updatedBy, updatedAt, dentistId, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesDentist.deleteDentistById(), [updatedBy, updatedAt, dentistId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let updateDentistById = async (profileId, profileData = {}, conn) => {
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
        connection.query(queriesDentist.updateDentistById(profileData), [...dataParameter, profileId], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}

let updateDentistEmailById = async (email, updatedAt,updatedBy, dentistId, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesDentist.updateDentistEmailById(), [email,updatedAt,updatedBy, dentistId], (error, result, fields) => {
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
        connection.query(queriesDentist.updateRatingById(data), [...dataParameter, profileId], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}


module.exports = {
    getAllDentistList,
    getActiveDentistList,
    getNextDentistList,
    getDentistById,
    getDentistDataById,
    getDentistByNpi,
    getDentistByLicense,
    addNewDentist,
    verifyDentist,
    disableDentistById,
    enableDentistById,
    deleteDentistById,
    updateDentistById,
    updateDentistEmailById,
    getDentistListByName,
    updateRatingById,
}

