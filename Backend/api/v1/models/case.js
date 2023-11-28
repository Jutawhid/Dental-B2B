const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesCase = require('../queries/case');
const queriesCaseMemberRequest = require('../queries/caseMemberRequest');
const queriesTrash = require('../queries/trash');
const queriesCaseFile = require('../queries/caseFile');
// Promises Method

let getCaseList = async () => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCase.getCaseList(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getCaseListByUserId = async (userId) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCase.getCaseListByUserId(), [userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

// let getCaseByName = async (name = "") => {
//     return new Promise((resolve, reject) => {
//         connectionEasifiMYSQL.query(queriesCase.getCaseByName(), [name], (error, result, fields) => {
//             if (error) reject(error)
//             else resolve(result)
//         });
//     });
// }

let getCaseById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCase.getCaseById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getCaseAllDetailsById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCase.getCaseAllDetailsById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getCaseFullDetailsById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCase.getCaseFullDetailsById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getDeletedCaseDetailsById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCase.getDeletedCaseDetailsById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getCaseByIdAndUserId = async (id = 0, userId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCase.getCaseByIdAndUserId(), [id, userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let addNewCase = async (caseData, userId, profileId) => {
    return new Promise((resolve, reject) => {

        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }

                conn.query(queriesCase.addNewCase(), [caseData], (error, result, fields) => {

                    if (error) {
                        console.log(error);
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }

                    let insertId = result.insertId;

                    conn.query(queriesCase.getTotalCaseByUserId(), [userId], (error, totalCountResult, fields) => {

                        if (error) {
                            console.log(error);
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        }

                        try {

                            let caseID = totalCountResult[0].total_case < 10 ? "000" : totalCountResult[0].total_case < 100 ? "00" : totalCountResult[0].total_case < 1000 ? "0" : "";
                            caseID = profileId + "E" + caseID + (totalCountResult[0].total_case);

                            conn.query(queriesCase.updateCaseIdById(), [caseID, insertId], (error, updateResult, fields) => {

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

    });
}


let updateCaseByID = async (id, data) => {

    return new Promise((resolve, reject) => {

        let keys = Object.keys(data);
        let dataKeysValue = [];

        keys.forEach((key) => {
            dataKeysValue.push(data[key]);
        });

        connectionEasifiMYSQL.query(queriesCase.updateCaseByID(keys), [...dataKeysValue, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let deleteCaseById = async (reqData,totalMemberInRequestList,caseTrashData,) => {
    
    return new Promise((resolve, reject) => {

        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }

                conn.query(queriesCase.deleteCaseById(), [reqData.updated_by,reqData.updated_at,reqData.id], (error, result, fields) => {

                    if (error) {
                        console.log(error);
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }

                    conn.query(queriesTrash.addNewTrash(), [caseTrashData], (error, updateResult, fields) => {
        
                        if (error) {
                            console.log(error);
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        }

                    });

                    // if(totalCaseFile > 0){

                    //     for(let i = 0; i < caseFileIds.length; i++){

                    //         let caseTrashFileData = {
                    //             "user_id": userId,
                    //             "trash_type": "case_file",
                    //             "table_name": "mtae_case_files",
                    //             "table_id": caseFileIds[i],
                    //             "expired_time": expiredTime,
                    //         }
                    //         console.log(caseFileIds[i]);

                    //         conn.query(queriesCaseFile.deleteCaseFileById(), [reqData.updated_by,reqData.updated_at,caseFileIds[i]], (error, updateResult, fields) => {
                
                    //             if (error) {
                    //                 console.log(error);
                    //                 return conn.rollback(function () {
                        //conn.release();
                    //                     resolve([]);
                    //                 });
                    //             }

                    //         });

                    //         conn.query(queriesTrash.addNewTrash(), [caseTrashFileData], (error, updateResult, fields) => {
        
                    //             if (error) {
                    //                 console.log(error);
                    //                 return conn.rollback(function () {
                        //conn.release();
                    //                     resolve([]);
                    //                 });
                    //             }
                    //         });
                    //     }

                    // }
                    
                    
                    if(totalMemberInRequestList > 0){

                        try {
                            conn.query(queriesCaseMemberRequest.deleteRequestedMembersByCaseId(), [reqData.updated_by,reqData.updated_at,reqData.id], (error, updateResult, fields) => {
        
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
                    }  else {
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

// let enableCaseById = async (updated_by, updated_at, id) => {
//     return new Promise((resolve, reject) => {
//         connectionEasifiMYSQL.query(queriesCase.enableCaseById(), [updated_by, updated_at, id], (error, result, fields) => {
//             if (error) reject(error)
//             else resolve(result)
//         });
//     });
// }

// let disableCaseById = async (updated_by, updated_at, id) => {
//     return new Promise((resolve, reject) => {
//         connectionEasifiMYSQL.query(queriesCase.disableCaseById(), [updated_by, updated_at, id], (error, result, fields) => {
//             if (error) reject(error)
//             else resolve(result)
//         });
//     });
// }



module.exports = {
    getCaseList,
    getCaseListByUserId,
    // getCaseByName,
    getCaseById,
    getCaseAllDetailsById,
    addNewCase,
    updateCaseByID,
    deleteCaseById,
    getCaseByIdAndUserId,
    getDeletedCaseDetailsById,
    getCaseFullDetailsById
    // enableCaseById,
    // disableCaseById
}

