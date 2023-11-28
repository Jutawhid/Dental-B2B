const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesCustomerPayableAmount = require('../queries/customerPayableAmount');
const userBalanceModel = require('../models/userBalance');
const userBalanceRecordModel = require('../models/userBalanceRecord');
const easifiAccountBalanceModel = require('../models/easifiAccountBalance');
const casePaymentRecordModel = require('../models/casePaymentRecord');


let addNewCustomerPayableAmount = async (data = {}, conn = undefined) => {

    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    return new Promise((resolve, reject) => {
        connection.query(queriesCustomerPayableAmount.addNewCustomerPayableAmount(), [data], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getPaymentRequestInfoByIdAndPaymentSenderId = async (id = 0, userId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCustomerPayableAmount.getPaymentRequestInfoByIdAndPaymentSenderId(), [id, userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let updateCustomerPayableAmountByID = (data, id, amountUpdateData = []) => {
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

                conn.query(queriesCustomerPayableAmount.updatePaymentRequestByID(keys), [...dataKeysValue, id], async (error, result, fields) => {

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

                    if (amountUpdateData.hasOwnProperty('casePaymentRecord')) {
                        for (let i = 0; i < amountUpdateData.casePaymentRecord.length; i++) {
                            let casePaymentRecord = amountUpdateData.casePaymentRecord[i];

                            let casePaymentRecordAddedInfo = await casePaymentRecordModel.addNewRecord(casePaymentRecord, conn);
                            if (casePaymentRecordAddedInfo.affectedRows == undefined || casePaymentRecordAddedInfo.affectedRows < 1) {
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


    });
}


let getMyCaseCompletedListByCaseId = async ( userId = 0,table_name = '',id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCustomerPayableAmount.getMyCaseCompletedListByCaseId(), [id, userId,table_name], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getCaseApprovedPaymentsByCaseId = async (table_name = '',id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCustomerPayableAmount.getCaseApprovedPaymentsByCaseId(), [id,table_name], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getCaseApprovedPaymentsByCaseIdAndUserId = async ( userId = 0,table_name = '',id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCustomerPayableAmount.getCaseApprovedPaymentsByCaseIdAndUserId(), [id,table_name,userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getInvoicesByUserId = async ( userId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCustomerPayableAmount.getInvoicesByUserId(), [userId,userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getInvoiceDetailsById = async (invoiceId) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCustomerPayableAmount.getInvoiceDetailsById(), [invoiceId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getAllInvoicesList = async () => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCustomerPayableAmount.getAllInvoicesList(), [], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getCompletedCaseListByUserId = async ( userId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCustomerPayableAmount.getCompletedCaseListByUserId(), [userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


module.exports = {
    addNewCustomerPayableAmount,
    getPaymentRequestInfoByIdAndPaymentSenderId,
    updateCustomerPayableAmountByID,
    getMyCaseCompletedListByCaseId,
    getCaseApprovedPaymentsByCaseId,
    getCaseApprovedPaymentsByCaseIdAndUserId,
    getInvoicesByUserId,
    getInvoiceDetailsById,
    getAllInvoicesList,
    getCompletedCaseListByUserId
}

