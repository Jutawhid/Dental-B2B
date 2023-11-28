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
const cardRecordModel = require('../models/cardRecord');
const userPaymentInfoModel = require('../models/userPaymentInfo');
const userAccountBalanceModel = require('../models/userBalance');
const gatewayModel = require('../models/gateway');
const verifyToken = require('../middlewares/jwt_verify/verifyToken');
const verifyRegistrationRequestToken = require('../middlewares/jwt_verify/verifyRegistrationRequestToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const fileUploaderCommonObject = require('../common/fileUploader');

const commonObject = require('../common/common');
const crypto = require('crypto');
const moment = require("moment");

// payment
const creditCardPayment = require('../payments/authorizeDotnet/creditCardPayment');
const withdrawMoney = require('../payments/authorizeDotnet/creditCardWithdrawMoney');

router.get('/cardList', [verifyToken, routeAccessChecker("cardList")], async (req, res) => {


    let result = await cardRecordModel.getCardListByUserId(req.decoded.userInfo.id);

    for (let index = 0; index < result.length; index++) {
        result[index].cvv_no = await commonObject.decodingUsingCrypto(result[index].cvv_no);
        result[index].card_number = await commonObject.decodingUsingCrypto(result[index].card_number);
        result[index].expired_date = await commonObject.decodingUsingCrypto(result[index].expired_date);
    }

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Card List.",
        "count": result.length,
        "data": result
    });
});



router.post('/addCardRecord', [verifyToken, routeAccessChecker("addCardRecord")], async (req, res) => {


    let reqData = {
        "gateway_id": req.body.gateway_id,
        "card_type": req.body.card_type,
        "card_number": req.body.card_number,
        "card_holder": req.body.card_holder,
        "cvv_no": req.body.cvv_no,
        "expired_date": req.body.expired_date,
    }

    reqData.user_id = req.decoded.userInfo.id;
    reqData.created_by = req.decoded.userInfo.id;
    reqData.updated_by = req.decoded.userInfo.id;
    reqData.created_at = await commonObject.getGMT();
    reqData.updated_at = await commonObject.getGMT();


    let errorMessage = "";
    let isError = 0;

    // gateway_id validate 
    let validateId = await commonObject.checkItsNumber(reqData.gateway_id);

    if (validateId.success === false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Value should be integer.",
        });
    }

    reqData.gateway_id = validateId.data;

    let gatewayData = await gatewayModel.getGatewayById(reqData.gateway_id);

    if (isEmpty(gatewayData)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "Gateway not found with this id.",
        });
    }

    // card_type initial 0
    reqData.card_type = 0;

    // card number validate
    if (reqData.card_number == undefined || reqData.card_number == "") {
        errorMessage += "Card number is required.";
        isError = 1;
    }

    // card holder validate
    if (reqData.card_holder == undefined || reqData.card_holder == "") {
        errorMessage += "Card holder is required.";
        isError = 1;
    }

    // cvv validate
    if (reqData.cvv_no == undefined || reqData.cvv_no == "") {
        errorMessage += "CVV No is required.";
        isError = 1;
    }

    // expired date validate
    if (reqData.expired_date == undefined || reqData.expired_date == "") {
        errorMessage += "Expired date is required.";
        isError = 1;
    }

    if (isError == 1) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": errorMessage
        });
    }

    // existing card record check code will be here

    // hash check korte hbe
    // let existingDataById = await cardRecordModel.getCardData(
    //     reqData.user_id, reqData.gateway_id, reqData.card_type, reqData.card_number, reqData.card_holder, reqData.cvv_no, reqData.expired_date
    //     );

    // if (!isEmpty(existingDataById)) {
    //     return res.status(400).send({
    //         "success": false,
    //         "status": 400,
    //         "message": "This card already exists"
    //     });
    // }


    if (isError == 1) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": errorMessage
        });
    }

    let existingCardsOfThisUsers = await cardRecordModel.getExistingCardsByUserId(req.decoded.userInfo.id);

    if (isEmpty(existingCardsOfThisUsers)) {
        reqData.is_default = 1 ;
    }
    
    // validate the information of card by authorize.net
    let cardValidate = await creditCardPayment.authorizeCreditCard(
        { expiredDate: reqData.expired_date, cardNumber: reqData.card_number, cnnNo: reqData.cvv_no },
        undefined,  0);

    if (cardValidate.success === false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Invalid card information."
        });

    }

    
    reqData.card_number = await commonObject.hashingUsingCrypto(reqData.card_number);
    reqData.cvv_no = await commonObject.hashingUsingCrypto(reqData.cvv_no);
    reqData.expired_date = await commonObject.hashingUsingCrypto(reqData.expired_date);

    

    let result = await cardRecordModel.addNewCard(reqData);

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
        "message": "Card Information Added Successfully."
    });

});

router.put('/updateCardRecord', [verifyToken, routeAccessChecker("updateCardRecord")], async (req, res) => {


    let updateRequestData = {
        "id": req.body.id,
        "gateway_id": req.body.gateway_id,
        "card_type": req.body.card_type,
        "card_number": req.body.card_number,
        "card_holder": req.body.card_holder,
        "cvv_no": req.body.cvv_no,
        "expired_date": req.body.expired_date,
    }

    // card type
    updateRequestData.card_type = 0;

    let validateId = await commonObject.checkItsNumber(updateRequestData.id);

    if (validateId.success === false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Value should be integer.",
        });
    }

    updateRequestData.id = validateId.data;

    let existingDataById = await cardRecordModel.getCardDetailsById(updateRequestData.id, req.decoded.userInfo.id);

    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "No data found",
        });
    }

    existingDataById[0].card_number = await commonObject.decodingUsingCrypto(existingDataById[0].card_number);
    existingDataById[0].cvv_no = await commonObject.decodingUsingCrypto(existingDataById[0].cvv_no);
    existingDataById[0].expired_date = await commonObject.decodingUsingCrypto(existingDataById[0].expired_date);

    // existing card record check code will be here
    // hash diye check korte hbe
    // let duplicateData = await cardRecordModel.getCardData(
    //     req.decoded.userInfo.id, updateRequestData.gateway_id, updateRequestData.card_type, updateRequestData.card_number, updateRequestData.card_holder, updateRequestData.cvv_no, updateRequestData.expired_date
    //     );


    // if (!isEmpty(duplicateData) && duplicateData[0].id != updateRequestData.id) {
    //     return res.status(400).send({
    //         success: false,
    //         status: 400,
    //         message: "This card information already exists"
    //     });

    // }

    let updateData = {};
    let checkUpdatedCard = {};
    

    let errorMessage = "";
    let isError = 0; // 1 = yes, 0 = no
    let willWeUpdate = 0; // 1 = yes , 0 = no;


    // gate way id validate
    if(updateRequestData.gateway_id == undefined || updateRequestData.gateway_id == ""){
        updateRequestData.gateway_id = existingDataById[0].gateway_id;
    }

    if (existingDataById[0].gateway_id != updateRequestData.gateway_id) {

        let validateId = await commonObject.checkItsNumber(updateRequestData.gateway_id);

        if (validateId.success === false) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: "Gateway Value should be integer.",
            });
        }

        updateRequestData.gateway_id = validateId.data;

        let gatewayData = await gatewayModel.getGatewayById(updateRequestData.gateway_id);

        if (isEmpty(gatewayData)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "Gateway not found with this id.",
            });
        }

        willWeUpdate = 1;
        updateData.gateway_id = updateRequestData.gateway_id;
    } 

    // card_type validate
    if(updateRequestData.card_type == undefined || updateRequestData.card_type == ""){
        updateRequestData.card_type = existingDataById[0].card_type
    }
    
    

    // if (existingDataById[0].card_type != updateRequestData.card_type) {

    //     willWeUpdate = 1;
    //     updateData.card_type = updateRequestData.card_type;
    // }


    // card holder validate
    if(updateRequestData.card_holder == undefined || updateRequestData.card_holder == ""){
        updateRequestData.card_holder = existingDataById[0].card_holder
    }

    if (existingDataById[0].card_holder != updateRequestData.card_holder) {

        willWeUpdate = 1;
        updateData.card_holder = updateRequestData.card_holder;
    }


    // card number validate
    if(updateRequestData.card_number == undefined || updateRequestData.card_number == ""){
        updateRequestData.card_number = existingDataById[0].card_number;
        checkUpdatedCard.card_number = existingDataById[0].card_number;
    }

    if (existingDataById[0].card_number != updateRequestData.card_number) {

        willWeUpdate = 1;
        updateData.card_number = updateRequestData.card_number;
        checkUpdatedCard.card_number = updateData.card_number;
    } else {
        checkUpdatedCard.card_number = existingDataById[0].card_number;
    }

    

    // cvv validate
    if(updateRequestData.cvv_no == undefined || updateRequestData.cvv_no == ""){
        updateRequestData.cvv_no = existingDataById[0].cvv_no;
        checkUpdatedCard.cvv_no = existingDataById[0].cvv_no;
    }

    if (existingDataById[0].cvv_no != updateRequestData.cvv_no) {

        willWeUpdate = 1;
        updateData.cvv_no = updateRequestData.cvv_no;
        checkUpdatedCard.cvv_no = updateData.cvv_no;
    } else {
        checkUpdatedCard.cvv_no = existingDataById[0].cvv_no;
    }

    // expired date validate
    if(updateRequestData.expired_date == undefined || updateRequestData.expired_date == ""){
        updateRequestData.expired_date = existingDataById[0].expired_date;
        checkUpdatedCard.expired_date = existingDataById[0].expired_date;
    }

    if (existingDataById[0].expired_date != updateRequestData.expired_date) {

        willWeUpdate = 1;
        updateData.expired_date = updateRequestData.expired_date;
        checkUpdatedCard.expired_date = updateData.expired_date;
    } else {
        checkUpdatedCard.expired_date = existingDataById[0].expired_date;
    }

    if (isError == 1) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: errorMessage,
        });
    }

    if (willWeUpdate == 1) {

        updateData.updated_by = req.decoded.userInfo.id;
        updateData.updated_at = await commonObject.getGMT();

        if(!isEmpty(updateData.expired_date) || !isEmpty(updateData.card_number) || !isEmpty(updateData.cvv_no)){
            
            let cardValidate = await creditCardPayment.authorizeCreditCard(
                        { expiredDate: checkUpdatedCard.expired_date, cardNumber: checkUpdatedCard.card_number, cnnNo: checkUpdatedCard.cvv_no },
                        undefined,  0);
            
                    if (cardValidate.success === false) {
                        return res.status(400).send({
                            "success": false,
                            "status": 400,
                            "message": "Invalid card information."
                        });
                    }
        }

        if(updateData.card_number){
            updateData.card_number = await commonObject.hashingUsingCrypto(updateData.card_number);
        }

        if(updateData.cvv_no){
            updateData.cvv_no = await commonObject.hashingUsingCrypto(updateData.cvv_no);
        }

        if(updateData.expired_date){
            updateData.expired_date = await commonObject.hashingUsingCrypto(updateData.expired_date);
        }

        let result = await cardRecordModel.updateCardData(updateRequestData.id, updateData);

        if (result.affectedRows == undefined || result.affectedRows < 1) {
            return res.status(500).send({
                "success": false,
                "status": 500,
                "message": "Something Wrong in system database."
            });
        }

        return res.status(200).send({
            success: true,
            status: 200,
            message: "Card information successfully updated.",
        });
    } else {
        return res.status(200).send({
            success: true,
            status: 200,
            message: "Nothing to update.",
        });
    }


});

// card delete 
router.delete("/deleteCard", [verifyToken, routeAccessChecker("deleteCard")], async (req, res) => {

    let reqData = {
        id: req.body.id,
    };

    reqData.updated_by = req.decoded.userInfo.id;
    reqData.updated_at = await commonObject.getGMT();

    let validateId = await commonObject.checkItsNumber(reqData.id);

    if (validateId.success === false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Value should be integer.",
        });
    }

    reqData.id = validateId.data;

    let existingDataById = await cardRecordModel.getCardDetailsById(reqData.id, req.decoded.userInfo.id);
    

    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "No card found.",
        });
    }
    
   if(existingDataById[0].is_default == 1){
        return res.status(200).send({
            success: false,
            status: 304,
            message: "Default Card can't be deleted.",
        });
    }

    let result = await cardRecordModel.deleteCard(reqData.id,reqData.updated_by, reqData.updated_at, req.decoded.userInfo.id);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    return res.status(200).send({
        success: true,
        status: 200,
        message: "Card Deleted Successfully.",
    });
}
);


// set default
router.post('/defaultCard', [verifyToken, routeAccessChecker("defaultCard")], async (req, res) => {


    let reqData = {
        "id": req.body.id,
    }
   
    reqData.updated_by = req.decoded.userInfo.id;
    reqData.updated_at = await commonObject.getGMT();

    let validateId = await commonObject.checkItsNumber(reqData.id);

    if (validateId.success === false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Value should be integer.",
        });
    }

    reqData.id = validateId.data;

    let existingDataById = await cardRecordModel.getCardDetailsById(reqData.id, req.decoded.userInfo.id);

    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "No data found",
        });
    }
    

    if(existingDataById[0].is_default == 1){
        return res.status(200).send({
            success: true,
            status: 200,
            message: "Already default card.",
        });
    }

    let defaultCardIds = [];
    let existingCardList = await cardRecordModel.getCardListByUserId(req.decoded.userInfo.id);
    

    for(let i = 0; i < existingCardList.length; i++){
        if(existingCardList[i].is_default == 1){
            defaultCardIds.push(existingCardList[i].id);
        }
    }

    
    let result = await cardRecordModel.makeDefault(reqData.id,reqData.updated_by, reqData.updated_at);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    // make other default card as 0
    for(let i = 0; i < defaultCardIds.length; i++){
        if(defaultCardIds[i] != reqData.id){
            await cardRecordModel.setDefaultZeroOfOtherCards(defaultCardIds[i],reqData.updated_by, reqData.updated_at);
        }
    }
    


    return res.status(201).send({
        "success": true,
        "status": 201,
        "message": "This card has been set as default.",
    });

});


// wallet work

// add money to card
router.post('/addMoneyToWallet', [verifyToken, routeAccessChecker("addMoneyToWallet")], async (req, res) => {


    let reqData = {
        "id": req.body.card_id, // card id
        "amount": req.body.amount
    }
   
    reqData.created_by = req.decoded.userInfo.id;
    reqData.updated_by = req.decoded.userInfo.id;
    reqData.created_at = await commonObject.getGMT();
    reqData.updated_at = await commonObject.getGMT();

    let profileDetails = await commonObject.getUserInfoByUserId(req.decoded.userInfo.id);
    reqData.customer_name = profileDetails.data[0].full_name;
    


    // card id validate
    let validateId = await commonObject.checkItsNumber(reqData.id);

    if (validateId.success === false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Value should be integer.",
        });
    }

    reqData.card_id = validateId.data;

    let existingDataById = await cardRecordModel.getCardDetailsById(reqData.id, req.decoded.userInfo.id);

    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "No data found",
        });
    }
    
   if(existingDataById[0].is_default != 1){
        return res.status(200).send({
            success: true,
            status: 200,
            message: "Please set this as default card.",
        });
    }

    existingDataById[0].card_number = await commonObject.decodingUsingCrypto(existingDataById[0].card_number);
    existingDataById[0].cvv_no = await commonObject.decodingUsingCrypto(existingDataById[0].cvv_no);
    existingDataById[0].expired_date = await commonObject.decodingUsingCrypto(existingDataById[0].expired_date);

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

   

    // now only on credit card
    if(existingDataById[0].card_type == 0){ 
        
        // add money to wallet
        let cardValidate = await creditCardPayment.authorizeCreditCard(
            { expiredDate: existingDataById[0].expired_date, cardNumber: existingDataById[0].card_number, cnnNo: existingDataById[0].cvv_no },
            undefined,  reqData.amount);

        if (cardValidate.success === false) {
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": "Invalid card information."
            });
        }

        let details = {};

        details.card_type = 0;
        details.transaction_id = cardValidate.tran_id;

        // for payment_transactions table
        let paymentTransactionData = {
            "user_id": req.decoded.userInfo.id,
            "transaction_id": cardValidate.tran_id,
            "card_no": existingDataById[0].card_number,
            "card_type": 0, // credit card
            "amount": reqData.amount, 
            "transaction_response": JSON.stringify(cardValidate.transaction_response),
            "transaction_status": 1, // approved
            "customer_name": reqData.customer_name,
            "transaction_type": 1, // in
            "details": JSON.stringify(details),
            "created_by": reqData.created_by,
            "updated_by": reqData.updated_by,
            "created_at": await commonObject.getGMT(),
            "updated_at": await commonObject.getGMT()
        }

        

        let userLastBalance = userBalanceData[0].balance;
        

        let updateUserAccountBalance = {
            "id": userBalanceData[0].id,
            "balance": userLastBalance + reqData.amount,
            "created_by": reqData.created_by,
            "updated_by": reqData.updated_by,
            "created_at": await commonObject.getGMT(),
            "updated_at": await commonObject.getGMT()
        };


        // for user_balance_records table
        let userBalanceRecordData = {

            // table_id and ending_amount will be insert after transaction success

            "user_id": req.decoded.userInfo.id,
            "table_name" : "mtae_payment_transactions",
            "starting_amount": userLastBalance,
            "ending_amount": userLastBalance + reqData.amount,
            "amount": reqData.amount,
            "transaction_type": 1, // in
            "transaction_to": "card", 
            "transaction_info": "", 
            "reason": "user top-up balance card to wallet",
            "created_by": reqData.created_by,
            "updated_by": reqData.updated_by,
            "created_at": await commonObject.getGMT(),
            "updated_at": await commonObject.getGMT()
        }

        let result = await cardRecordModel.addMoneyToWallet(paymentTransactionData,updateUserAccountBalance,userBalanceRecordData);

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


    }  

});


// see my wallet money
router.get('/currentWalletBalance', [verifyToken, routeAccessChecker("currentWalletBalance")], async (req, res) => {

    let userBalanceData = await userAccountBalanceModel.getCurrentBalanceByUserID(req.decoded.userInfo.id);

    if (isEmpty(userBalanceData)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "Unknown data",
        });
    }

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Card List.",
        "data": userBalanceData[0]
    });
});

router.post('/withdrawMoney', [verifyToken, routeAccessChecker("withdrawMoney")], async (req, res) => {


    let reqData = {
        "id": req.body.card_id, // card id
    }
   
    reqData.created_by = req.decoded.userInfo.id;
    reqData.updated_by = req.decoded.userInfo.id;
    reqData.created_at = await commonObject.getGMT();
    reqData.updated_at = await commonObject.getGMT();

    let profileDetails = await commonObject.getUserInfoByUserId(req.decoded.userInfo.id);
    reqData.customer_name = profileDetails.data[0].full_name;
    


    // card id validate
    let validateId = await commonObject.checkItsNumber(reqData.id);

    if (validateId.success === false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Value should be integer.",
        });
    }

    reqData.card_id = validateId.data;

    let existingDataById = await cardRecordModel.getCardDetailsById(reqData.id, req.decoded.userInfo.id);

    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "No data found",
        });
    }

    
   

    existingDataById[0].card_number = await commonObject.decodingUsingCrypto(existingDataById[0].card_number);
    existingDataById[0].cvv_no = await commonObject.decodingUsingCrypto(existingDataById[0].cvv_no);
    existingDataById[0].expired_date = await commonObject.decodingUsingCrypto(existingDataById[0].expired_date);


    // current balance of user
    let userBalanceData = await userAccountBalanceModel.getCurrentBalanceByUserID(req.decoded.userInfo.id);
    if (isEmpty(userBalanceData)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "Unknown data",
        });
    }

    // now only on credit card
    if(existingDataById[0].card_type == 0){ 

        // withdraw money code
         userLastBalance = userBalanceData[0].balance;

         if(userLastBalance <= 0){
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": "Your wallet balance is below for withdrawal."
            });
        }

         
        // withdraw money request
        let withdraw = await withdrawMoney.creditBankAccount(
            { nameOnAccount: existingDataById[0].card_holder, cardNumber: existingDataById[0].card_number},
              userLastBalance);

        if (withdraw.success === false) {
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": "Invalid "
            });
        }

        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": withdraw
        });

        
        // add money to wallet
        let cardValidate = await creditCardPayment.authorizeCreditCard(
            { expiredDate: existingDataById[0].expired_date, cardNumber: existingDataById[0].card_number, cnnNo: existingDataById[0].cvv_no },
            undefined,  reqData.amount);

        if (cardValidate.success === false) {
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": "Invalid card information."
            });
        }

        let details = {};

        details.card_type = 0;
        details.transaction_id = cardValidate.tran_id;

        // for payment_transactions table
        let paymentTransactionData = {
            "user_id": req.decoded.userInfo.id,
            "transaction_id": cardValidate.tran_id,
            "card_no": existingDataById[0].card_number,
            "card_type": 0, // credit card
            "amount": reqData.amount, 
            "transaction_response": JSON.stringify(cardValidate.transaction_response),
            "transaction_status": 1, // approved
            "customer_name": reqData.customer_name,
            "transaction_type": 1, // in
            "details": JSON.stringify(details),
            "created_by": reqData.created_by,
            "updated_by": reqData.updated_by,
            "created_at": await commonObject.getGMT(),
            "updated_at": await commonObject.getGMT()
        }

        

        let updateUserAccountBalance = {
            "id": userBalanceData[0].id,
            "balance": userLastBalance + reqData.amount,
            "created_by": reqData.created_by,
            "updated_by": reqData.updated_by,
            "created_at": await commonObject.getGMT(),
            "updated_at": await commonObject.getGMT()
        };


        // for user_balance_records table
        let userBalanceRecordData = {

            // table_id and ending_amount will be insert after transaction success

            "user_id": req.decoded.userInfo.id,
            "table_name" : "mtae_payment_transactions",
            "starting_amount": userLastBalance,
            "ending_amount": userLastBalance + reqData.amount,
            "amount": reqData.amount,
            "transaction_type": 1, // in
            "transaction_to": "card", 
            "transaction_info": "", 
            "created_by": reqData.created_by,
            "updated_by": reqData.updated_by,
            "created_at": await commonObject.getGMT(),
            "updated_at": await commonObject.getGMT()
        }

        let result = await cardRecordModel.addMoneyToWallet(paymentTransactionData,updateUserAccountBalance,userBalanceRecordData);

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


    }  

});

router.get('/*', (req, res) => {
    return res.status(404)
        .send({
            'status': 404,
            'message': "unknown route",
            "success": false
        })
});


router.post('/*', (req, res) => {
    return res.status(404)
        .send({
            'status': 404,
            'message': "unknown route",
            "success": false
        })
});

module.exports = router;