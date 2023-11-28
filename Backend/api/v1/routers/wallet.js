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


router.post('/withdrawMoney', [verifyToken, routeAccessChecker("withdrawMoney")], async (req, res) => {


    let reqData = {

        "amount": req.body.amount,
        "paymentType": req.body.payment_type, // 1 = stripe
    }
   
 

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

    // current balance of user
    let userBalanceData = await userAccountBalanceModel.getCurrentBalanceByUserID(req.decoded.userInfo.id);
    if (isEmpty(userBalanceData)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "Unknown data",
        });
    }

    // check withdraw possible or not
    

    if(userBalanceData[0].balance < reqData.amount){
        return res.status(404).send({
            success: false,
            status: 404,
            message: "Invalid Amount",
        });
    }

    

    if(reqData.paymentType !== 1){
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Please select stripe.",
        });
    } 

    let isWithdrawPossible = false;

    if(reqData.paymentType == 1){

        let accountMerchantDetails = await stripeObject.getAccountBalance(process.env.STRIPE_MERCHANT_ACCOUNT_ID);
    
        if (isEmpty(accountMerchantDetails)) {
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": "Try again later.",
            });
        }

        
    
        try {
            if (accountMerchantDetails.hasOwnProperty("available")) {
                isWithdrawPossible = accountMerchantDetails.available[0].amount >= (reqData.amount * 100) ? true : false;
                console.log(isWithdrawPossible);

                if (isWithdrawPossible == false) {
                    return res.status(400).send({
                        "success": false,
                        "status": 400,
                        "message": "Transaction Not Possible,Insufficient Balance.", // on merchant side
                    });
                }
            } else {
                return res.status(400).send({
                    "success": false,
                    "status": 400,
                    "message": "Transaction Not Possible.",
                });
            }
        } catch (error) {
    
        }
        

        // transfer the amount from merchant account to user account
        let transferMoney = await stripeObject.transferAmountProcess(existingDataById[0].account_id, (reqData.amount * 100));

        if (transferMoney.success == false) {
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": error_code
            });
        }

        


        /// transaction queries
        let walletTransaction = {
            "userWallet": [],
            "easifiWallet": [],
            "walletTransaction": [],
        };
    
    
        walletTransaction.userWallet.push({
            "user_id": req.decoded.userInfo.id,
            "balance": userBalanceData[0].balance - reqData.amount,
            "updated_by": req.decoded.userInfo.id,
            "updated_at": await commonObject.getGMT()
        });
    
        walletTransaction.walletTransaction.push({
            "user_id": req.decoded.userInfo.id,
            "table_name": "mtae_payment_transactions",
            "table_id": userBalanceData[0].id,
            "starting_amount": userBalanceData[0].balance,
            "ending_amount": userBalanceData[0].balance - reqData.amount,
            "amount": reqData.amount,
            "transaction_type": 2, // outgoing
            "transaction_to": "Account",
            "reason": "Cash Withdraw Wallet to Stripe",
            "transaction_info": JSON.stringify({ ...walletTransaction.userWallet[0], "reason": "Withdraw Own Money" }),
            "created_by": req.decoded.userInfo.id,
            "updated_by": req.decoded.userInfo.id,
            "created_at": await commonObject.getGMT(),
            "updated_at": await commonObject.getGMT()
        })
    
    
        walletTransaction.paymentTransactionData = {
            "user_id": req.decoded.userInfo.id,
            "transaction_id": transferMoney.data.id,
            "card_no": existingDataById[0].account_id,
            "card_type": "stripe", // stripe
            "amount": reqData.amount,
            "transaction_response": JSON.stringify(transferMoney.data),
            "transaction_status": 1, // approved
            "customer_name": reqData.customer_name,
            "transaction_type": 2, // outgoing
            "details": JSON.stringify(transferMoney.data),
            "created_by": req.decoded.userInfo.id,
            "updated_by": req.decoded.userInfo.id,
            "created_at": await commonObject.getGMT(),
            "updated_at": await commonObject.getGMT()
        };

        let result = await stripeModel.withdrawMoneyToStripeAccount(walletTransaction);

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
            "message": "Withdraw money Successful.",
        });
    } 

});

module.exports = router;