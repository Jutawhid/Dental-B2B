const { connectionEasifiMYSQL } = require('../connections/connection');
const isEmpty = require('is-empty');
const queriesStripe = require('../queries/stripe');
const queriesUserPaymentInfo = require('../queries/userPaymentInfo');
const queriesPaymentTransaction = require('../queries/paymentTransaction');
const queriesUserBalance = require('../queries/userBalance');
const userBalanceModel = require('./userBalance');
const queriesUserBalanceRecord = require('../queries/userBalanceRecord');
const easifiAccountBalanceModel = require('../models/easifiAccountBalance');
const userBalanceRecordModel = require('../models/userBalanceRecord');

let getStripeAccountByUserId = async (userID = 0) => {

    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesStripe.getStripeAccountByUserId(), [userID], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getStripeDetailsById = async (id = 0, userId = 0) => {

    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesStripe.getStripeDetailsById(), [id, userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let addNewStripeAccount = async (reqData) => {


    return new Promise((resolve, reject) => {

        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }

                conn.query(queriesStripe.addNewStripeAccount(), [reqData], (error, result, fields) => {

                    if (error) {
                        console.log(error);
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }

                    let userPaymentInfo = {

                        user_id: reqData.user_id,
                        user_payment_info_type: 0,
                        table_name: "mtae_card_records",
                        table_id: result.insertId,
                        created_by: reqData.created_by,
                        updated_by: reqData.updated_by,
                        created_at: reqData.created_at,
                        updated_at: reqData.updated_at
                    }

                    try {
                        conn.query(queriesUserPaymentInfo.addPaymentInfo(), [userPaymentInfo], (error, result, fields) => {

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

let updateStripeAccountDataByID = async (id, updateData = {}) => {

    // get object, generate an array and push data value here

    // for update data
    let keysOfUpdateData = Object.keys(updateData);
    let dataParameterUpdateData = [];

    for (let index = 0; index < keysOfUpdateData.length; index++) {
        dataParameterUpdateData.push(updateData[keysOfUpdateData[index]]);

    }
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesStripe.updateStripeAccountDataByID(updateData), [...dataParameterUpdateData, id], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}


let addMoneyToWallet = async (amountUpdateData = []) => {
    return new Promise((resolve, reject) => {

        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }



                if (amountUpdateData.hasOwnProperty('paymentTransactionData')) {
                    let paymentTransactionData = amountUpdateData.paymentTransactionData;

                    conn.query(queriesPaymentTransaction.addNewTransaction(), [paymentTransactionData], async (error, result, fields) => {

                        if (error) {
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        }


                        // userBalanceRecordData.table_id = ;

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

                                walletTransaction.table_id  = result.insertId;

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
                }
            });


        });
    });
}

let withdrawMoneyToStripeAccount = async (amountUpdateData = []) => {
    return new Promise((resolve, reject) => {

        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }



                if (amountUpdateData.hasOwnProperty('paymentTransactionData')) {
                    let paymentTransactionData = amountUpdateData.paymentTransactionData;

                    conn.query(queriesPaymentTransaction.addNewTransaction(), [paymentTransactionData], async (error, result, fields) => {

                        if (error) {
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        }


                        // userBalanceRecordData.table_id = ;

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

                                walletTransaction.table_id  = result.insertId;

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
                }
            });


        });
    });
}



module.exports = {
    getStripeAccountByUserId,
    addNewStripeAccount,
    getStripeDetailsById,
    updateStripeAccountDataByID,
    addMoneyToWallet,
    withdrawMoneyToStripeAccount
}

