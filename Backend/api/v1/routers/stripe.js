require('dotenv').config();
const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const superAdminModel = require('../models/superAdmin');
const adminModel = require('../models/admin');
const dentistModel = require('../models/dentist');
const consultantModel = require('../models/consultant');
const labModel = require('../models/lab');
const techCompanyModel = require('../models/techCompany');
const roleModel = require('../models/role');
const stripeModel = require('../models/stripe');
const userPaymentInfoModel = require('../models/userPaymentInfo');
const userAccountBalanceModel = require('../models/userBalance');
const gatewayModel = require('../models/gateway');
const verifyToken = require('../middlewares/jwt_verify/verifyToken');
const verifyRegistrationRequestToken = require('../middlewares/jwt_verify/verifyRegistrationRequestToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const fileUploaderCommonObject = require('../common/fileUploader');

const stripeObject = require('../payments/stripes/stripe');
const easifiAccountBalanceModel = require('../models/easifiAccountBalance');

const commonObject = require('../common/common');
const crypto = require('crypto');
const moment = require("moment");

// payment
const creditCardPayment = require('../payments/authorizeDotnet/creditCardPayment');
const withdrawMoney = require('../payments/authorizeDotnet/creditCardWithdrawMoney');



router.post('/addNewRecord', [verifyToken, routeAccessChecker("addStripeRecord")], async (req, res) => {

    let nowTime = await commonObject.getGMT();

    let existingCardsOfThisUsers = await stripeModel.getStripeAccountByUserId(req.decoded.userInfo.id);
    let stripeAccountId;

    try {

        // check if stripe account already exists, if not create account
        if (isEmpty(existingCardsOfThisUsers)) {
            let createConnectedStripeAccountResult = await stripeObject.createConnectedAccount();

            if (createConnectedStripeAccountResult.hasOwnProperty('id')) {

                stripeAccountId = createConnectedStripeAccountResult.id;
                let newStripeAccountCreateData = {
                    "user_id": req.decoded.userInfo.id,
                    "account_id": createConnectedStripeAccountResult.id,
                    "account_type": "express",
                    "account_status": "inprogress",
                    "response": JSON.stringify(createConnectedStripeAccountResult),
                    "status": 1,
                    "created_by": req.decoded.userInfo.id,
                    "updated_by": req.decoded.userInfo.id,
                    "created_at": nowTime,
                    "updated_at": nowTime,
                }

                let result = await stripeModel.addNewStripeAccount(newStripeAccountCreateData);

                if (result.affectedRows == undefined || result.affectedRows < 1) {
                    return res.status(500).send({
                        "success": false,
                        "status": 500,
                        "message": "Something Wrong in system database. Try again later.",
                    });
                }
            } else {
                // Stripe not give us the response
                return res.status(400).send({
                    "success": false,
                    "status": 400,
                    "message": " Try again later.",
                });
            }
        } else {
            // if already completed, then not accept the request
            if (existingCardsOfThisUsers[0].account_status == "completed") {
                return res.status(422).send({
                    "success": false,
                    "status": 422,
                    "message": "Stripe account is already added.",
                });
            } else {
                stripeAccountId = existingCardsOfThisUsers[0].account_id;

                let stripeConnectedAccountInfo = await stripeObject.getAccountInfo(existingCardsOfThisUsers[0].account_id);
                if (stripeConnectedAccountInfo.hasOwnProperty("business_profile") && stripeConnectedAccountInfo.hasOwnProperty("capabilities")) {

                    if (stripeConnectedAccountInfo.business_profile.mcc !== null && stripeConnectedAccountInfo.capabilities.card_payments === "active") {

                        let result = await stripeModel.updateStripeAccountDataByID(existingCardsOfThisUsers[0].id, {
                            "account_status": "completed",
                            "updated_by": req.decoded.userInfo.id,
                            "updated_at": nowTime,
                        });


                        if (result.affectedRows == undefined || result.affectedRows < 1) {
                            return res.status(500).send({
                                "success": false,
                                "status": 500,
                                "message": "Something Wrong in system database. Try again later.",
                            });
                        }

                        return res.status(422).send({
                            "success": false,
                            "status": 422,
                            "message": "Stripe account is already added.",
                        });

                    } else if (stripeConnectedAccountInfo.business_profile.mcc === null || (stripeConnectedAccountInfo.requirements.hasOwnProperty("errors") && stripeConnectedAccountInfo.requirements.errors.length > 0)) {
                        stripeAccountId = existingCardsOfThisUsers[0].account_id;
                    } else {
                        return res.status(400).send({
                            "success": false,
                            "status": 400,
                            "message": "Account is updating, wait for few time.",
                        });
                    }

                }
            }
        }

        // Then linked the account to the user
        let linkedConnectedAccount = await stripeObject.linkWithConnectedAccount(stripeAccountId);

        if (linkedConnectedAccount.hasOwnProperty('url')) {

            return res.status(200).send({
                "success": true,
                "status": 200,
                "message": "account linked url",
                "data": {

                    url: linkedConnectedAccount.url,

                }
            });

        } else {
            // Stripe not give us the response
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": " Try again later. Thank you.",
            });
        }

    } catch (error) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": " Try again later.",
        });
    }

});


router.post('/updateMyAccountStatus', [verifyToken, routeAccessChecker("updateMyStripeAccountStatus")], async (req, res) => {

    let nowTime = await commonObject.getGMT();

    let existingCardsOfThisUsers = await stripeModel.getStripeAccountByUserId(req.decoded.userInfo.id);

    try {

        if (isEmpty(existingCardsOfThisUsers)) {

            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": "Unknown stripe account, first connect your account.",
            });

        } else {
            if (existingCardsOfThisUsers[0].account_status == "completed") {

                return res.status(422).send({
                    "success": false,
                    "status": 422,
                    "message": "Stripe account is already added.",
                });

            } else {

                let stripeConnectedAccountInfo = await stripeObject.getAccountInfo(existingCardsOfThisUsers[0].account_id);
                if (stripeConnectedAccountInfo.hasOwnProperty("business_profile") && stripeConnectedAccountInfo.hasOwnProperty("capabilities")) {

                    console.log(stripeConnectedAccountInfo)
                    if (stripeConnectedAccountInfo.business_profile.mcc !== null && stripeConnectedAccountInfo.capabilities.card_payments === "active") {

                        let result = await stripeModel.updateStripeAccountDataByID(existingCardsOfThisUsers[0].id, {
                            "account_status": "completed",
                            "updated_by": req.decoded.userInfo.id,
                            "updated_at": nowTime,
                        });


                        if (result.affectedRows == undefined || result.affectedRows < 1) {
                            return res.status(500).send({
                                "success": false,
                                "status": 500,
                                "message": "Something Wrong in system database. Try again later.",
                            });
                        }

                        return res.status(200).send({
                            "success": true,
                            "status": 200,
                            "message": "Account has successfully updated",
                        });

                    } else {
                        return res.status(400).send({
                            "success": false,
                            "status": 400,
                            "message": "Account has not updated yet, wait for few time.",
                        });
                    }


                } else if (stripeConnectedAccountInfo.requirements.hasOwnProperty("errors") && stripeConnectedAccountInfo.requirements.errors.length > 0) {
                    return res.status(400).send({
                        "success": false,
                        "status": 400,
                        "message": "You provided wrong information. Please provide correct information.",
                    });
                } else {
                    return res.status(400).send({
                        "success": false,
                        "status": 400,
                        "message": "Account has not updated yet, wait for few time.",
                    });
                }
            }
        }



    } catch (error) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": " Try again later.",
        });
    }

});


/// get account status
router.get('/accountStatus', [verifyToken, routeAccessChecker("stripeAccountStatus")], async (req, res) => {

    let existingStripe = await stripeModel.getStripeAccountByUserId(req.decoded.userInfo.id);

    if (isEmpty(existingStripe)) {

        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "No Stripe Account.",
            "data": existingStripe,
            "willShowPlusButton": true,
        });

    }

    let accountStatusInDatabase = existingStripe[0].account_status;
    if (accountStatusInDatabase != "completed") {

        let stripeConnectedAccountInfo = await stripeObject.getAccountInfo(existingStripe[0].account_id);

        if (stripeConnectedAccountInfo.business_profile.mcc !== null && stripeConnectedAccountInfo.capabilities.card_payments === "active") {

            let result = await stripeModel.updateStripeAccountDataByID(existingStripe[0].id, {
                "account_status": "completed",
                "updated_by": req.decoded.userInfo.id,
                "updated_at": await commonObject.getGMT(),
            });


            if (result.affectedRows == undefined || result.affectedRows < 1) {
                return res.status(500).send({
                    "success": false,
                    "status": 500,
                    "message": "Something Wrong in system database. Try again later.",
                });
            }

            return res.status(200).send({
                "success": true,
                "status": 200,
                "message": "Stripe Account",
                "account_status": "completed",
                "data": existingStripe,
                "willShowPlusButton": false,
            });

        } else if (stripeConnectedAccountInfo.business_profile.mcc === null || (stripeConnectedAccountInfo.requirements.hasOwnProperty("errors") && stripeConnectedAccountInfo.requirements.errors.length > 0)) {
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": "You provided wrong information. Please provide correct information to complete your stripe account.",
                "account_status": "inprogress",
                "data": existingStripe,
                "willShowPlusButton": true,
            });
        } else {

            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": "Account is updating, wait for few time.",
                "account_status": "inprogress",
                "data": existingStripe,
                "willShowPlusButton": false,
            });

        }
    } else {
        return res.status(200).send({
            "success": true,
            "status": 200,
            "message": "Stripe Account",
            "account_status": "completed",
            "data": existingStripe,
            "willShowPlusButton": false,
        });
    }


});

// add money to card
router.post('/addMoneyToWallet', [verifyToken, routeAccessChecker("addMoneyToWalletByStripe")], async (req, res) => {


    let reqData = {

        "amount": req.body.amount
    }

    reqData.created_by = req.decoded.userInfo.id;
    reqData.updated_by = req.decoded.userInfo.id;
    reqData.created_at = await commonObject.getGMT();
    reqData.updated_at = await commonObject.getGMT();

    let profileDetails = await commonObject.getUserInfoByUserId(req.decoded.userInfo.id);
    reqData.customer_name = profileDetails.data[0].full_name;


    let existingDataById = await stripeModel.getStripeAccountByUserId(req.decoded.userInfo.id);

    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "No data found",
        });
    }

    if (existingDataById[0].account_status !== "completed") {

        return res.status(422).send({
            "success": false,
            "status": 404,
            "message": "Please add your stripe account.",
        });

    }



    // amount validate

    let validateAmount = await commonObject.checkItsNumber(reqData.amount);

    if (validateAmount.success === false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Value should be integer.",
        });
    }

    reqData.amount = validateAmount.data;

    // for user_account_balance table
    let userBalanceData = await userAccountBalanceModel.getCurrentBalanceByUserID(req.decoded.userInfo.id);
    if (isEmpty(userBalanceData)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "Unknown data",
        });
    }

    // now check owner balance for add user in this service
    let easifiBalance = await easifiAccountBalanceModel.getBalanceByID(1);



    // now only on stripe account

    ///   start 

    // add money to wallet
    let accountDetails = await stripeObject.getAccountBalance(existingDataById[0].account_id);
    // let addMoneyToWallet = await stripeObject.transferAmountByAccountId(existingDataById[0].account_id, reqData.amount);

    // console.log(accountDetails);

    if (isEmpty(accountDetails)) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Try again later.",
        });
    }

    let isLimitedBalance = true;

    try {
        if (accountDetails.hasOwnProperty("instant_available")) {
            isLimitedBalance = accountDetails.instant_available[0].amount < (reqData.amount * 100) ? true : false;
        } else {
            isLimitedBalance = (accountDetails.available[0].amount - accountDetails.pending[0].amount) < (reqData.amount * 100) ? true : false;
        }
    } catch (error) {

    }

    if (isLimitedBalance) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Insufficient balance in your account."
        });
    }


    let addMoneyToWallet = await stripeObject.chargeAmountFromUserAccount(existingDataById[0].account_id, (reqData.amount * 100));


    if (addMoneyToWallet.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": error_code
        });
    }

    let walletTransaction = {
        "userWallet": [],
        "easifiWallet": [],
        "walletTransaction": [],
        // "paymentTransactionData": {},
    };


    walletTransaction.userWallet.push({
        "user_id": req.decoded.userInfo.id,
        "balance": userBalanceData[0].balance + reqData.amount,
        "updated_by": req.decoded.userInfo.id,
        "updated_at": await commonObject.getGMT()
    });

    // walletTransaction.easifiWallet.push({
    //     "balance": easifiBalance[0].balance + reqData.amount,
    //     "updated_by": req.decoded.userInfo.id,
    //     "updated_at": await commonObject.getGMT()
    // });

    walletTransaction.walletTransaction.push({
        "user_id": req.decoded.userInfo.id,
        "table_name": "mtae_payment_transactions",
        "table_id": userBalanceData[0].id,
        "starting_amount": userBalanceData[0].balance,
        "ending_amount": userBalanceData[0].balance + reqData.amount,
        "amount": reqData.amount,
        "transaction_type": 1,
        "transaction_to": "Account",
        "reason": "Cash in balance from stripe",
        "transaction_info": JSON.stringify({ ...walletTransaction.userWallet[0], "reason": "Get payment for service provide" }),
        "created_by": req.decoded.userInfo.id,
        "updated_by": req.decoded.userInfo.id,
        "created_at": await commonObject.getGMT(),
        "updated_at": await commonObject.getGMT()
    })

    // walletTransaction.walletTransaction.push({
    //     "user_id": 0,
    //     "table_name": "mtae_customer_payable_amount",
    //     "table_id": 1,
    //     "starting_amount": easifiBalance[0].balance,
    //     "ending_amount": easifiBalance[0].balance - reqData.amount,
    //     "amount": reqData.amount,
    //     "transaction_type": 2,
    //     "transaction_to": "Account",
    //     "transaction_info": JSON.stringify(walletTransaction.easifiWallet[0]),
    //     "transaction_info": JSON.stringify({ ...walletTransaction.userWallet[0], "reason": `Receive transaction from wallet` }),
    // });

    walletTransaction.paymentTransactionData = {
        "user_id": req.decoded.userInfo.id,
        "transaction_id": addMoneyToWallet.data.id,
        "card_no": existingDataById[0].account_id,
        "card_type": "stripe", // credit card
        "amount": reqData.amount,
        "transaction_response": JSON.stringify(addMoneyToWallet.data),
        "transaction_status": 1, // approved
        "customer_name": reqData.customer_name,
        "transaction_type": 1, // in
        "details": JSON.stringify(addMoneyToWallet.data),
        "created_by": req.decoded.userInfo.id,
        "updated_by": req.decoded.userInfo.id,
        "created_at": await commonObject.getGMT(),
        "updated_at": await commonObject.getGMT()
    };



    let result = await stripeModel.addMoneyToWallet(walletTransaction);

    if (result.affectedRows == undefined || result.affectedRows < 1) {

        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    return res.status(201).send({
        "success": true,
        "status": 201,
        "message": "Added Money to Wallet Successfully.",
    });

});


// auto transfer money to for testing purpose
router.post('/autoTransferAmount', [verifyToken], async (req, res) => {

    let amount = 45000;
    let existingStripe = await stripeModel.getStripeAccountByUserId(req.decoded.userInfo.id);

    if (isEmpty(existingStripe)) {

        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "No Stripe Account.",
        });

    }

    let accountStatusInDatabase = existingStripe[0].account_status;
    if (accountStatusInDatabase == "completed") {

        // transfer the amount from merchant account to user account
        let transferMoney = await stripeObject.autoTransferAmount(existingStripe[0].account_id, amount);

        if (transferMoney.success == false) {
            return res.status(400).send({
                "success": false,
                "status": 400,
                //"message": error_code
                "message": "Something went wrong"
            });
        } else {
            return res.status(200).send({
                "success": true,
                "status": 200,
                "message": `${amount / 100} Dollar  added into your stripe account.You can now add money into your easifi wallet`,
            });
        }


    } else {
        return res.status(400).send({
            "success": false,
            "status": 200,
            "message": "Stripe Account is not completed yet",
            "account_status": accountStatusInDatabase,
            "data": existingStripe[0]
        });
    }


});


router.get('/account-login-url', [verifyToken], async (req, res) => {

    let existingStripe = await stripeModel.getStripeAccountByUserId(req.decoded.userInfo.id);

    if (isEmpty(existingStripe)) {

        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "No Stripe Account.",
            "data": {
                "url": "#"
            }
        });

    }

    if (existingStripe[0].account_status == "completed") {

        let loginUrlResult = await stripeObject.connectAccountLoginLink(existingStripe[0].account_id);

        if (loginUrlResult.success == false) {
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": "Something went wrong",
                "data": {
                    "url": "#"
                }
            });
        } else {
            return res.status(200).send({
                "success": true,
                "status": 200,
                "message": ``,
                "data": {
                    "url": loginUrlResult.url
                }
            });
        }

    } else {
        return res.status(400).send({
            "success": false,
            "status": 200,
            "message": "Stripe Account is not completed yet",
            "data": {
                "url": "#"
            }
        });
    }

});


module.exports = router;