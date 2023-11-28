var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;

require('dotenv').config();


async function authorizeCreditCard(

    creditCardInfo = { expiredDate: "0", cardNumber: "", cnnNo: "" },
    orderDetailsInfo = { invoiceNumber: "", description: "" },
    amount = 0) {

    return new Promise((resolve, reject) => {

        var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
        merchantAuthenticationType.setName(process.env.API_LOGIN_ID);
        merchantAuthenticationType.setTransactionKey(process.env.TRANSACTION_KEY);

        var creditCard = new ApiContracts.CreditCardType();
        creditCard.setCardNumber(creditCardInfo.cardNumber);
        creditCard.setExpirationDate(creditCardInfo.expiredDate);
        creditCard.setCardCode(creditCardInfo.cnnNo);

        var paymentType = new ApiContracts.PaymentType();
        paymentType.setCreditCard(creditCard);

        var orderDetails = new ApiContracts.OrderType();
        orderDetails.setInvoiceNumber(orderDetailsInfo.invoiceNumber);
        orderDetails.setDescription(orderDetailsInfo.description);

        // var tax = new ApiContracts.ExtendedAmountType();
        // tax.setAmount('4.26');
        // tax.setName('level2 tax name');
        // tax.setDescription('level2 tax');

        // var duty = new ApiContracts.ExtendedAmountType();
        // duty.setAmount('8.55');
        // duty.setName('duty name');
        // duty.setDescription('duty description');

        // var shipping = new ApiContracts.ExtendedAmountType();
        // shipping.setAmount('8.55');
        // shipping.setName('shipping name');
        // shipping.setDescription('shipping description');

        var billTo = new ApiContracts.CustomerAddressType();
        billTo.setFirstName('EASIFI');
        billTo.setLastName('GROUP');
        billTo.setCompany('EASIFI');
        billTo.setAddress('14 Main Street');
        billTo.setCity('USA');
        billTo.setState('TX');
        billTo.setZip('1');
        billTo.setCountry('USA');

        // var shipTo = new ApiContracts.CustomerAddressType();
        // shipTo.setFirstName('China');
        // shipTo.setLastName('Bayles');
        // shipTo.setCompany('Thyme for Tea');
        // shipTo.setAddress('12 Main Street');
        // shipTo.setCity('Pecan Springs');
        // shipTo.setState('TX');
        // shipTo.setZip('44628');
        // shipTo.setCountry('USA');

        // var lineItem_id1 = new ApiContracts.LineItemType();
        // lineItem_id1.setItemId('1');
        // lineItem_id1.setName('vase');
        // lineItem_id1.setDescription('cannes logo');
        // lineItem_id1.setQuantity('18');
        // lineItem_id1.setUnitPrice(45.00);

        // var lineItem_id2 = new ApiContracts.LineItemType();
        // lineItem_id2.setItemId('2');
        // lineItem_id2.setName('vase2');
        // lineItem_id2.setDescription('cannes logo2');
        // lineItem_id2.setQuantity('28');
        // lineItem_id2.setUnitPrice('25.00');

        // var lineItemList = [];
        // lineItemList.push(lineItem_id1);
        // lineItemList.push(lineItem_id2);

        // var lineItems = new ApiContracts.ArrayOfLineItem();
        // lineItems.setLineItem(lineItemList);

        // var userField_a = new ApiContracts.UserField();
        // userField_a.setName('A');
        // userField_a.setValue('Aval');

        // var userField_b = new ApiContracts.UserField();
        // userField_b.setName('B');
        // userField_b.setValue('Bval');

        // var userFieldList = [];
        // userFieldList.push(userField_a);
        // userFieldList.push(userField_b);

        // var userFields = new ApiContracts.TransactionRequestType.UserFields();
        // userFields.setUserField(userFieldList);

        // var transactionSetting1 = new ApiContracts.SettingType();
        // transactionSetting1.setSettingName('duplicateWindow');
        // transactionSetting1.setSettingValue('120');

        // var transactionSetting2 = new ApiContracts.SettingType();
        // transactionSetting2.setSettingName('recurringBilling');
        // transactionSetting2.setSettingValue('false');

        // var transactionSettingList = [];
        // transactionSettingList.push(transactionSetting1);
        // transactionSettingList.push(transactionSetting2);

        // var transactionSettings = new ApiContracts.ArrayOfSetting();
        // transactionSettings.setSetting(transactionSettingList);

        var transactionRequestType = new ApiContracts.TransactionRequestType();
        transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHONLYTRANSACTION);
        transactionRequestType.setPayment(paymentType);
        transactionRequestType.setAmount(amount);
       // transactionRequestType.setLineItems(lineItems);
        //transactionRequestType.setUserFields(userFields);
        //transactionRequestType.setOrder(orderDetails);
        // transactionRequestType.setTax(tax);
        // transactionRequestType.setDuty(duty);
        // transactionRequestType.setShipping(shipping);
         transactionRequestType.setBillTo(billTo);
        // transactionRequestType.setShipTo(shipTo);
         //transactionRequestType.setTransactionSettings(transactionSettings);

        var createRequest = new ApiContracts.CreateTransactionRequest();
        createRequest.setMerchantAuthentication(merchantAuthenticationType);
        createRequest.setTransactionRequest(transactionRequestType);

        //pretty print request
        console.log(JSON.stringify(createRequest.getJSON(), null, 2));

        var ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());

        ctrl.execute(function () {

            var apiResponse = ctrl.getResponse();

            var response = new ApiContracts.CreateTransactionResponse(apiResponse);

            //pretty print response
            console.log(JSON.stringify(response, null, 2));


            if (response != null) {

                if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                    if (response.getTransactionResponse().getMessages() != null) {
                        resolve({
                            "success": true,
                            "response_code": response.getTransactionResponse().getResponseCode(),
                            "transaction_response": response.getTransactionResponse(),
                            "tran_id": response.getTransactionResponse().getTransId(),
                            "message": response.getTransactionResponse().getMessages().getMessage()[0].getDescription(),
                            "message-code": response.getTransactionResponse().getMessages().getMessage()[0].getCode()
                        });
                    }
                    else {

                        if (response.getTransactionResponse().getErrors() != null) {
                            console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
                            console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());

                            resolve({
                                "success": false,
                                "response_code": response.getTransactionResponse().getErrors().getError()[0].getErrorCode(),
                                "tran_id": "",
                                "message": response.getTransactionResponse().getErrors().getError()[0].getErrorText(),
                                "message-code": response.getTransactionResponse().getErrors().getError()[0].getErrorCode()
                            });
                        }
                    }
                } else {
                    console.log('Failed Transaction.');
                    if (response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null) {
                        resolve({
                            "success": false,
                            "response_code": response.getTransactionResponse().getErrors().getError()[0].getErrorCode(),
                            "tran_id": "",
                            "message": response.getTransactionResponse().getErrors().getError()[0].getErrorText(),
                            "message-code": response.getTransactionResponse().getErrors().getError()[0].getErrorCode()
                        });
                    } else {
                        resolve({
                            "success": false,
                            "response_code": response.getMessages().getMessage()[0].getCode(),
                            "tran_id": "",
                            "message": response.getMessages().getMessage()[0].getText(),
                            "message-code": response.getMessages().getMessage()[0].getCode()
                        });
                    }
                }
            } else {
                console.log('Null Response.');
                resolve({
                    "success": false,
                    "response_code": "",
                    "tran_id": "",
                    "message": "Null Response.",
                    "message-code": ""
                });
            }
        });

    });
}


module.exports = {
    authorizeCreditCard
}

