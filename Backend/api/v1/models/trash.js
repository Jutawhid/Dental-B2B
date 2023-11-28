const isEmpty = require('is-empty');
const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesTrash = require('../queries/trash');
const queriesCase = require('../queries/case');
const queriesCaseFile = require('../queries/caseFile');

// Promises Method
let getTrashFileListByUserId = async (userId = 0,trashType = '',tableName = '',nowDateTimeGMT) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesTrash.getTrashFileListByUserId(),[userId,trashType,tableName,nowDateTimeGMT], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getTrashCaseListByUserId = async (userId = 0,trashType = '',tableName = '',nowDateTimeGMT) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesTrash.getTrashCaseListByUserId(),[userId,trashType,tableName,nowDateTimeGMT], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getAllTrashFile = async (trashType = '',tableName = '',nowDateTimeGMT) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesTrash.getAllTrashFile(),[trashType,tableName,nowDateTimeGMT], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getTrashFileById = async (id) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesTrash.getTrashFileById(),[id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let restoreCaseFileById = async (reqData,caseFileId) => {


    return new Promise((resolve, reject) => {

        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }

                conn.query(queriesTrash.restoreCaseFileById(), [reqData.updated_at,reqData.id], (error, result, fields) => {

                    if (error) {
                        console.log(error);
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }
                    
                   

                        try {
                            conn.query(queriesCaseFile.restoreCaseFileFromTrash(), [reqData.updated_by,reqData.updated_at,caseFileId], (error, updateResult, fields) => {
        
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
                                //console.log(error);
                                conn.release();
                                resolve([]);
                            });
                        }
                    
                });
            });
        });

    });
}


let restoreCaseById = async (reqData,caseId) => {


    return new Promise((resolve, reject) => {

        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }

                 // this has used both for case file and case
                conn.query(queriesTrash.restoreCaseFileById(), [reqData.updated_at,reqData.id], (error, result, fields) => {

                    if (error) {
                        console.log(error);
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }
                    
                   

                        try {
                            conn.query(queriesCase.restoreCaseFromTrash(), [reqData.updated_by,reqData.updated_at,caseId], (error, updateResult, fields) => {
        
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
                                //console.log(error);
                                resolve([]);
                            });
                        }
                    
                });
            });
        });

    });
}


module.exports = {
    getTrashFileListByUserId,
    getTrashFileById,
    restoreCaseFileById,
    getAllTrashFile,
    getTrashCaseListByUserId,
    restoreCaseById
}

