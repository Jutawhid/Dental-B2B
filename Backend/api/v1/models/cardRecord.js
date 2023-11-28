const { connectionEasifiMYSQL } = require('../connections/connection');
const isEmpty = require('is-empty');
const queriesCardRecord = require('../queries/cardRecord');
const queriesUserPaymentInfo = require('../queries/userPaymentInfo');
const queriesPaymentTransaction = require('../queries/paymentTransaction');
const queriesUserBalance = require('../queries/userBalance');
const userBalanceModel = require('./userBalance');
const queriesUserBalanceRecord = require('../queries/userBalanceRecord');

let getCardListByUserId = async (userID = 0 ) => {
    
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCardRecord.getCardListByUserId(), [userID], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getCardData = async (user_id ,gateway_id,card_type,card_number,card_holder,cvv_no,expired_date ) => {
    
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCardRecord.getCardData(), [user_id,gateway_id,card_type,cvv_no,card_number,card_holder,expired_date], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getCardDetailsById = async (id = 0,userId = 0 ) => {
    
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCardRecord.getCardDetailsById(), [id,userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getExistingCardsByUserId = async (userId = 0 ) => {
    
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCardRecord.getExistingCardsByUserId(), [userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let addNewCard = async (reqData) => {


    return new Promise((resolve, reject) => {

        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }

                conn.query(queriesCardRecord.addNewCard(), [reqData], (error, result, fields) => {

                    if (error) {
                        console.log(error);
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }

                        let userPaymentInfo = {
                            
                            user_id : reqData.user_id,
                            user_payment_info_type : 0,
                            table_name : "mtae_card_records",
                            table_id : result.insertId,
                            created_by : reqData.created_by,
                            updated_by : reqData.updated_by,
                            created_at : reqData.created_at,
                            updated_at : reqData.updated_at
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

let updateCardData = async (id,updateData = {}) => {

    // get object, generate an array and push data value here

    // for update data
    let keysOfUpdateData = Object.keys(updateData);
    let dataParameterUpdateData = [];

    for (let index = 0; index < keysOfUpdateData.length; index++) {
        dataParameterUpdateData.push(updateData[keysOfUpdateData[index]]);

    }
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCardRecord.updateCardData(updateData), [...dataParameterUpdateData, id], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}

let makeDefault = async (id,updatedBy,updatedAt) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCardRecord.makeDefault(), [updatedBy,updatedAt,id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let deleteCard = async (id,updatedBy,updatedAt,userId) => {
    return new Promise((resolve, reject) => {

        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }

                conn.query(queriesCardRecord.deleteCard(), [updatedBy,updatedAt,id], (error, result, fields) => {

                    if (error) {
                        console.log(error);
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }

                        let tableName = "mtae_card_records";

                        try {
                            conn.query(queriesUserPaymentInfo.deletePaymentInfo(), [updatedBy,updatedAt,userId,tableName,id], (error, result, fields) => {
        
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

let setDefaultZeroOfOtherCards = async (id,updatedBy,updatedAt) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCardRecord.setDefaultZeroOfOtherCards(), [updatedBy,updatedAt,id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let addMoneyToWallet =  (paymentTransactionData,updateUserAccountBalance,userBalanceRecordData) => {

    return new Promise((resolve, reject) => {

        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }

                conn.query(queriesPaymentTransaction.addNewTransaction(), [paymentTransactionData], (error, result, fields) => {

                    if (error) {
                        console.log(error);
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }

                    userBalanceRecordData.table_id = result.insertId;

                    

                        // get object, generate an array and push data value here
                        // for user data
                        let keys = Object.keys(updateUserAccountBalance);
                        let dataParameter = [];
    
                        for (let index = 0; index < keys.length; index++) {
                            dataParameter.push(updateUserAccountBalance[keys[index]]);
    
                        }
                        conn.query(queriesUserBalance.updateUserBalance(updateUserAccountBalance), [...dataParameter, updateUserAccountBalance.id], (error, result2, fields) => {
    
                            if (error) {
                                console.log(error);
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            }

                            conn.query(queriesUserBalanceRecord.addNewUserBalanceRecord(), [userBalanceRecordData], (error, result3, fields) => {

                    
                                if (error) {
                                    console.log(error);
                                    return conn.rollback(function () {
                                        conn.release();
                                        resolve([]);
                                    });
                                }
            
                                else {
            
                                    conn.commit(function (err) {
                                        if (err) {
                                            return conn.rollback(function () {
                                                conn.release();
                                                resolve([]);
                                            });
                                        }
                                        conn.release();
                                        return resolve(result3);
            
                                    });
                                }
                                console.log(' addNewUserBalanceRecord: ',  result3);
            
                            });
    
                        });                  
                    
                });

            });
        });

    });
}


module.exports = {
    getCardListByUserId,
    getExistingCardsByUserId,
    addNewCard,
    getCardDetailsById,
    getCardData,
    updateCardData,
    makeDefault,
    setDefaultZeroOfOtherCards,
    addMoneyToWallet,
    deleteCard
}

