const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesCaseMemberRequest = require('../queries/caseMemberRequest');
const queriesCaseMember = require('../queries/caseMember');
const userBalanceModel = require('../models/userBalance');
const userBalanceRecordModel = require('../models/userBalanceRecord');
const easifiAccountBalanceModel = require('../models/easifiAccountBalance');

// Promises Method

let getCaseMemberRequestById = async (id) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMemberRequest.getCaseMemberRequestById(),[id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getSentCaseMemberRequestListByCaseIdServiceIdAndUserId = async (caseId = 0, serviceId = 0, userId = 0, dateTimeNow) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMemberRequest.getSentCaseMemberRequestListByCaseIdServiceIdAndUserId(), [caseId, serviceId, userId, dateTimeNow], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getSentCaseMemberRequestListByCaseIdAndUserId = async (caseId = 0, userId = 0, dateTimeNow) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMemberRequest.getSentCaseMemberRequestListByCaseIdAndUserId(), [caseId, userId, dateTimeNow], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getSentCaseMemberRecommendListByCaseIdServiceIdAndUserId = async (caseId = 0, serviceId = 0, userId = 0, dateTimeNow) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMemberRequest.getSentCaseMemberRecommendListByCaseIdServiceIdAndUserId(), [caseId, serviceId, userId, dateTimeNow], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}
let getSentCaseMemberRecommendListByCaseIdAndServiceId = async (caseId = 0, serviceId = 0, dateTimeNow) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMemberRequest.getSentCaseMemberRecommendListByCaseIdAndServiceId(), [caseId, serviceId, dateTimeNow], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getSentCaseMemberRequestListByCaseIdServiceId = async (caseId = 0, serviceId = 0, dateTimeNow) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMemberRequest.getSentCaseMemberRequestListByCaseIdServiceId(), [caseId, serviceId, dateTimeNow], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getMyRequestList = async (userId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMemberRequest.getMyRequestList(), [userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getSendRequestListByUserId = async (userId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMemberRequest.getSendRequestListByUserId(), [userId, userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getRecommendListByUserId = async (userId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMemberRequest.getRecommendListByUserId(), [userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getSendRecommendListByUserId = async (userId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMemberRequest.getSendRecommendListByUserId(), [userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getPendingSentRecommendListByIdAndUserId = async (id = 0, userId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMemberRequest.getPendingSentRecommendListByIdAndUserId(), [id, userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getMyRequestByIdAndServiceProviderId = async (id = 0, userId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMemberRequest.getMyRequestByIdAndServiceProviderId(), [id, userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getRecommendDetailsByIdAndCaseCreatorUserId = async (id = 0, userId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMemberRequest.getRecommendDetailsByIdAndCaseCreatorUserId(), [id, userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getSendRequestDetailsByIdAndUserId = async (id = 0, userId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMemberRequest.getSendRequestDetailsByIdAndUserId(), [id, userId, userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let updatedAllDateOverRequest = async (nowDateTime) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMemberRequest.updatedAllDateOverRequest(), [nowDateTime], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let updateCaseMemberRequestByID = (data, id, amountUpdateData = {}) => {
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


                conn.query(queriesCaseMemberRequest.updateCaseMemberRequestByID(keys), [...dataKeysValue, id], async (error, result, fields) => {

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

        // connectionEasifiMYSQL.query(queriesCaseMemberRequest.updateCaseMemberRequestByID(keys), [...dataKeysValue, id], (error, result, fields) => {
        //     if (error) reject(error)
        //     else resolve(result)
        // });
    });
}


let addNewCaseMemberRequest = async (info, amountUpdateData = {}, userId) => {
    return new Promise((resolve, reject) => {

        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }


                conn.query(queriesCaseMemberRequest.addNewCaseMemberRequest(), [info], async (error, result, fields) => {

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


        // connectionEasifiMYSQL.query(queriesCaseMemberRequest.addNewCaseMemberRequest(), [info], (error, result, fields) => {
        //     if (error) {
        //         console.log(error);
        //         reject(error)
        //     }
        //     else resolve(result)
        // });

    });


}

let rejectMyCaseMemberRequest = async (userId, nowDateTime, id, amountUpdateData = {}) => {
    return new Promise((resolve, reject) => {

        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }


                conn.query(queriesCaseMemberRequest.rejectMyCaseMemberRequest(), [userId, nowDateTime, id], async (error, result, fields) => {

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

        // connectionEasifiMYSQL.query(queriesCaseMemberRequest.rejectMyCaseMemberRequest(), [userId, nowDateTime, id], (error, result, fields) => {
        //     if (error) reject(error)
        //     else resolve(result)
        // });

    });
}



let acceptMyCaseMemberRequest = async (caseMemberObject, userId, nowDateTime, id) => {
    return new Promise((resolve, reject) => {

        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }


                conn.query(queriesCaseMember.addNewCaseMember(), [caseMemberObject], (error, result, fields) => {

                    if (error) {
                        console.log(error);
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    conn.query(queriesCaseMemberRequest.acceptMyCaseMemberRequest(), [userId, nowDateTime, id], (error, success, fields) => {

                        if (error) {
                            console.log(error);
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        }


                        conn.query(queriesCaseMemberRequest.updateAddExistingRequest(), [userId, nowDateTime, caseMemberObject.case_id, caseMemberObject.service_id], (error, finalResult, fields) => {

                            if (error) {
                                console.log(error);
                                console.log(caseMemberObject);
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
                    });
                });
            });
        });

    });
}

let getCaseMemberRequestListByCaseId = async (caseId) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseMemberRequest.getCaseMemberRequestListByCaseId(), [caseId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}



module.exports = {
    getCaseMemberRequestById,
    getSentCaseMemberRequestListByCaseIdServiceIdAndUserId,
    getSentCaseMemberRequestListByCaseIdServiceId,
    addNewCaseMemberRequest,
    updatedAllDateOverRequest,
    getMyRequestList,
    getSendRequestListByUserId,
    getRecommendListByUserId,
    getSendRecommendListByUserId,
    getPendingSentRecommendListByIdAndUserId,
    getMyRequestByIdAndServiceProviderId,
    updateCaseMemberRequestByID,
    rejectMyCaseMemberRequest,
    acceptMyCaseMemberRequest,
    getRecommendDetailsByIdAndCaseCreatorUserId,
    getSentCaseMemberRequestListByCaseIdAndUserId,
    getCaseMemberRequestListByCaseId,
    getSentCaseMemberRecommendListByCaseIdAndServiceId,
    getSentCaseMemberRecommendListByCaseIdServiceIdAndUserId,
    getSendRequestDetailsByIdAndUserId
}

