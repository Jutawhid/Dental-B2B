const isEmpty = require('is-empty');
const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesTraining = require('../queries/training');
const queriesTrainingDocument = require('../queries/trainingDocument');

// Promises Method


let getTrainingListByUserId = async (userId ) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesTraining.getTrainingListByUserId(), [userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getTrainingById = async (id = 0 ) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesTraining.getTrainingById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getTrainingByName = async (userId = 0, title = "") => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesTraining.getTrainingByName(), [userId , title], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let addNewTraining = async (reqData) => {

    let trainingData = {
        created_by: reqData.created_by,
        updated_by :  reqData.updated_by,
        created_at : reqData.created_at,
        updated_at : reqData.updated_at,
        user_id : reqData.user_id,
        title : reqData.title,
        description : reqData.description,
    }
    return new Promise((resolve, reject) => {

        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }

                conn.query(queriesTraining.addNewTraining(), [trainingData], (error, result, fields) => {

                    if (error) {
                        console.log(error);
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }
                    
                    if(reqData.document){

                        let documentData = {
                            training_id : result.insertId,
                            file_original_name : reqData.file_original_name,
                            file_temp_name : reqData.document,
                            created_by : reqData.created_by,
                            updated_by : reqData.updated_by,
                            created_at : reqData.created_at,
                            updated_at : reqData.updated_at
                        }

                        try {
                            conn.query(queriesTrainingDocument.addDocument(), [documentData], (error, updateResult, fields) => {
        
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
                    } else {
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
                    }
                });
            });
        });

    });
}


let deleteTrainingById = async (updatedBy,updatedAt,trainingId,totalDocument) => {


    return new Promise((resolve, reject) => {

        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }

                conn.query(queriesTraining.deleteTrainingById(), [updatedBy,updatedAt,trainingId], (error, result, fields) => {

                    if (error) {
                        console.log(error);
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }
                    
                    if(totalDocument > 0){

                        try {
                            conn.query(queriesTrainingDocument.deleteDocumentByTrainingId(), [updatedBy,updatedAt,trainingId], (error, updateResult, fields) => {
        
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
                    } else {
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
                    }
                });
            });
        });

    });
}


let updateTraining = async (id,updateData = {},updateDocumentData = {}) => {

    // get object, generate an array and push data value here

    // for update data
    let keysOfUpdateData = Object.keys(updateData);
    let dataParameterUpdateData = [];

    for (let index = 0; index < keysOfUpdateData.length; index++) {
        dataParameterUpdateData.push(updateData[keysOfUpdateData[index]]);

    }

    // for update Document Data
    if(!isEmpty(updateDocumentData)){
        let keysOfDocumentData = Object.keys(updateDocumentData);
        let dataParameterUpdateDocumentData = [];

        for (let index = 0; index < keysOfDocumentData.length; index++) {
            dataParameterUpdateDocumentData.push(updateDocumentData[keysOfDocumentData[index]]);

        }
        
    }


    return new Promise((resolve, reject) => {

        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }

                conn.query(queriesTraining.updateTraining(updateData),[...dataParameterUpdateData, id], (error, result, fields) => {

                    if (error) {
                        console.log(error);
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }
                    
                    if(!isEmpty(updateDocumentData)){

                        let keysOfDocumentData = Object.keys(updateDocumentData);
                        let dataParameterUpdateDocumentData = [];

                        for (let index = 0; index < keysOfDocumentData.length; index++) {
                            dataParameterUpdateDocumentData.push(updateDocumentData[keysOfDocumentData[index]]);

                        }

                        try {
                            conn.query(queriesTrainingDocument.updateDocument(updateDocumentData), [...dataParameterUpdateDocumentData, id], (error, updateResult, fields) => {
        
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
                    } else {
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
                    }
                });
            });
        });

    });
}


module.exports = {
    getTrainingListByUserId,
    getTrainingById,
    getTrainingByName,
    addNewTraining,
    deleteTrainingById,
    updateTraining,
}

