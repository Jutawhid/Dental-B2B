const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesCaseFile = require('../queries/caseFile');
const queriesTrash = require('../queries/trash');

// Promises Method

let getCaseFileListByCaseId = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseFile.getCaseFileListByCaseId(),[id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getCaseFileDataById = async (id = 0 ) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseFile.getCaseFileDataById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getDeletedCaseFileDataById = async (id = 0 ) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseFile.getDeletedCaseFileDataById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let addNewCaseFile = async (info) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseFile.addNewCaseFile(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let deleteCaseFileById = async (reqData,trashData) => {


    return new Promise((resolve, reject) => {

        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }

                conn.query(queriesCaseFile.deleteCaseFileById(), [reqData.updated_by,reqData.updated_at,reqData.id], (error, result, fields) => {

                    if (error) {
                        console.log(error);
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }
                    
                   

                        try {
                            conn.query(queriesTrash.addNewTrash(), [trashData], (error, updateResult, fields) => {
        
                                if (error) {
                                    console.log(error);
                                    return conn.rollback(function () {
                                        conn.release();
                                        resolve([]);
                                    });
                                }
        
                                conn.commit(function (err) {
                                    if (err) {
                                        return conn.rollback(function () {
                                            conn.release();
                                            resolve([]);
                                        });
                                    }
                                    conn.release();
                                    return resolve(result);
                                });
                            });
        
                        } catch (error) {
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        }
                    
                });
            });
        });

    });
}


module.exports = {
    getCaseFileDataById,
    addNewCaseFile,
    getCaseFileListByCaseId,
    deleteCaseFileById,
    getDeletedCaseFileDataById
}

