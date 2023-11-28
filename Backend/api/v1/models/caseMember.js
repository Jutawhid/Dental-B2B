const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesCaseMember = require('../queries/caseMember');
const customerPayableAmountModel = require('../models/customerPayableAmount');
const userBalanceModel = require('../models/userBalance');
const userBalanceRecordModel = require('../models/userBalanceRecord');
const easifiAccountBalanceModel = require('../models/easifiAccountBalance');
const consultantModel = require("../models/consultant");
const labModel = require("../models/lab");
const techCompanyModel = require("../models/techCompany");

// Promises Method

// let getCaseMemberList = async () => {
//     return new Promise((resolve, reject) => {
//         connectionEasifiMYSQL.query(queriesCaseMember.getCaseMemberList(), (error, result, fields) => {
//             if (error) reject(error)
//             else resolve(result)
//         });
//     });
// }

let getCaseMemberDetailsById = async (id) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMember.getCaseMemberDetailsById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getCaseMemberListByCaseId = async (caseId) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMember.getCaseMemberListByCaseId(), [caseId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getRunningCaseMemberListByCaseIdServiceId = async (caseId, serviceId) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMember.getRunningCaseMemberListByCaseIdServiceId(), [caseId, serviceId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getRunningCaseMemberListByCaseId = async (caseId) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMember.getRunningCaseMemberListByCaseId(), [caseId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getTotalCaseMemberListByCaseIdServiceId = async (caseId, serviceId) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMember.getTotalCaseMemberListByCaseIdServiceId(), [caseId, serviceId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getCaseMemberInfoByCaseIdAndUserId = async (caseId = 0, userId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMember.getCaseMemberInfoByCaseIdAndUserId(), [caseId, userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getCaseMemberInfoAndCaseInfoById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMember.getCaseMemberInfoAndCaseInfoById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getCaseMemberInfoByIdAndUserId = async (id = 0, userId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMember.getCaseMemberInfoByIdAndUserId(), [id, userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getCaseMemberInfoByIdAndRequestSenderIdOrServiceProviderId = async (id = 0, userId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMember.getCaseMemberInfoByIdAndRequestSenderIdOrServiceProviderId(), [userId, userId, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getMyCaseList = async (userId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMember.getMyCaseList(), [userId, userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getMyCaseListWithLimit = async (userId = 0, limit) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMember.getMyCaseListWithLimit(), [userId, userId, limit], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getMyNextCaseListWithLimit = async (userId = 0, startId = 0, limit) => {

    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMember.getMyNextCaseListWithLimit(), [userId, userId, startId, limit], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getMyCaseListForAdmin = async () => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMember.getMyCaseListForAdmin(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getCancelCaseMemberList = async () => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMember.getCancelCaseMemberList(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getMyCaseListForAdminWithLimit = async (limit) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMember.getMyCaseListForAdminWithLimit(), [limit], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getMyNextCaseListForAdminWithLimit = async (startId, limit) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMember.getMyNextCaseListForAdminWithLimit(), [startId, limit], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let addNewCaseMember = async (info) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMember.addNewCaseMember(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let updateCaseMemberByID = (data, id, customerPayableAmount = []) => {
    return new Promise((resolve, reject) => {

        let keys = Object.keys(data);
        let dataKeysValue = [];

        keys.forEach((key) => {
            dataKeysValue.push(data[key]);
        });

        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }

                conn.query(queriesCaseMember.updateCaseMemberByID(keys), [...dataKeysValue, id], async (error, result, fields) => {

                    if (error) {
                        console.log(error);
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }

                    for (let i = 0; i < customerPayableAmount.length; i++) {
                        let customerPayableAmountAddedResult = await customerPayableAmountModel.addNewCustomerPayableAmount(customerPayableAmount[i], conn);
                        if (customerPayableAmountAddedResult.affectedRows == undefined || customerPayableAmountAddedResult.affectedRows < 1) {
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        }
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
            });
        });


        // connectionEasifiMYSQL.query(queriesCaseMember.updateCaseMemberByID(keys), [...dataKeysValue, id], (error, result, fields) => {
        //     if (error) reject(error)
        //     else resolve(result)
        // });


    });
}

let cancelCaseMemberByID = (data, id, amountUpdateData = []) => {
    return new Promise((resolve, reject) => {

        let keys = Object.keys(data);
        let dataKeysValue = [];

        keys.forEach((key) => {
            dataKeysValue.push(data[key]);
        });

        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }

                conn.query(queriesCaseMember.updateCaseMemberByID(keys), [...dataKeysValue, id], async (error, result, fields) => {

                    if (error) {
                        console.log(error);
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }

                    if (amountUpdateData.hasOwnProperty('userWallet')) {
                        for (let i = 0; i < amountUpdateData.userWallet.length; i++) {
                            let userWallet = amountUpdateData.userWallet[i];

                            let userWalletAddedInfo = await userBalanceModel.updateUserBalanceByUserId(userWallet.user_id, userWallet, conn);
                            if (userWalletAddedInfo.affectedRows == undefined || userWalletAddedInfo.affectedRows < 1) {
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            }
                        }
                    }

                    if (amountUpdateData.hasOwnProperty('easifiWallet')) {
                        for (let i = 0; i < amountUpdateData.easifiWallet.length; i++) {
                            let easifiWallet = amountUpdateData.easifiWallet[i];

                            let easifiWalletAddedInfo = await easifiAccountBalanceModel.updateEasifiBalanceRecordsById(1, easifiWallet, conn);
                            if (easifiWalletAddedInfo.affectedRows == undefined || easifiWalletAddedInfo.affectedRows < 1) {
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            }
                        }
                    }

                    if (amountUpdateData.hasOwnProperty('walletTransaction')) {
                        for (let i = 0; i < amountUpdateData.walletTransaction.length; i++) {
                            let walletTransaction = amountUpdateData.walletTransaction[i];

                            let walletTransactionAddedInfo = await userBalanceRecordModel.addNewUserBalanceRecord(walletTransaction, conn);
                            if (walletTransactionAddedInfo.affectedRows == undefined || walletTransactionAddedInfo.affectedRows < 1) {
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            }
                        }
                    }


                    if (amountUpdateData.hasOwnProperty('extraInfoUpdate') && amountUpdateData.extraInfoUpdate.hasOwnProperty('userProfile')) {
                        for (let i = 0; i < amountUpdateData.extraInfoUpdate.userProfile.length; i++) {
                            let userProfile = amountUpdateData.extraInfoUpdate.userProfile[i];

                            if (userProfile.roleId == 4) {
                                profileUpdate = await consultantModel.updateConsultantById(
                                    userProfile.id, { "service_cancel_availability": userProfile.service_cancel_availability }, conn
                                );
                            } else if (userProfile.roleId == 5) {
                                profileUpdate = await labModel.updateLabById(
                                    userProfile.id, { "service_cancel_availability": userProfile.service_cancel_availability }, conn
                                );
                            } else if (userProfile.roleId == 6) {
                                profileUpdate = await techCompanyModel.updateTechById(
                                    userProfile.id, { "service_cancel_availability": userProfile.service_cancel_availability }, conn
                                );
                            }

                            if (profileUpdate.affectedRows == undefined || profileUpdate.affectedRows < 1) {
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            }
                        }
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
            });
        });


        // connectionEasifiMYSQL.query(queriesCaseMember.updateCaseMemberByID(keys), [...dataKeysValue, id], (error, result, fields) => {
        //     if (error) reject(error)
        //     else resolve(result)
        // });


    });
}



module.exports = {
    // getCaseMemberList,
    getCaseMemberListByCaseId,
    getRunningCaseMemberListByCaseIdServiceId,
    getTotalCaseMemberListByCaseIdServiceId,
    addNewCaseMember,
    getCaseMemberInfoByCaseIdAndUserId,
    getCaseMemberInfoByIdAndUserId,
    updateCaseMemberByID,
    getMyCaseList,
    getMyCaseListForAdmin,
    getMyCaseListForAdminWithLimit,
    getMyNextCaseListForAdminWithLimit,
    getMyCaseListWithLimit,
    getMyNextCaseListWithLimit,
    getCaseMemberInfoByIdAndRequestSenderIdOrServiceProviderId,
    cancelCaseMemberByID,
    getCaseMemberDetailsById,
    getRunningCaseMemberListByCaseId,
    getCancelCaseMemberList,
    getCaseMemberInfoAndCaseInfoById
}

