'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
require('dotenv').config();

async function creditBankAccount(

    creditCardInfo = { nameOnAccount: "", cardNumber: ""},
    amount = 0) {

    return new Promise((resolve, reject) => {
	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(process.env.API_LOGIN_ID);
	merchantAuthenticationType.setTransactionKey(process.env.TRANSACTION_KEY);

	var paymentType = new ApiContracts.PaymentType();

	var bankAccountType = new ApiContracts.BankAccountType();
	bankAccountType.setAccountType(ApiContracts.BankAccountTypeEnum.SAVINGS);
	bankAccountType.setRoutingNumber('121042882');
	//added code
	var bankAccountNum = Math.floor(Math.random() * 9999999999) + 10000;
	bankAccountType.setAccountNumber(creditCardInfo.cardNumber);
	bankAccountType.setNameOnAccount(creditCardInfo.nameOnAccount);
	paymentType.setBankAccount(bankAccountType);

	var orderDetails = new ApiContracts.OrderType();
	orderDetails.setInvoiceNumber('INV-12345');
	orderDetails.setDescription('Payment Withdraw');

	var transactionRequestType = new ApiContracts.TransactionRequestType();
	transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.REFUNDTRANSACTION);
	transactionRequestType.setPayment(paymentType);
	//transactionRequestType.setRefTransId(transactionId);
	transactionRequestType.setRefTransId("111");
	transactionRequestType.setAmount(amount);
	transactionRequestType.setOrder(orderDetails);

	var createRequest = new ApiContracts.CreateTransactionRequest();
	createRequest.setMerchantAuthentication(merchantAuthenticationType);
	createRequest.setTransactionRequest(transactionRequestType);

	//pretty print request
	console.log(JSON.stringify(createRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.CreateTransactionResponse(apiResponse);

		//pretty print response
		console.log(JSON.stringify(response, null, 2));

		if(response != null){
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
				if(response.getTransactionResponse().getMessages() != null){
			
					resolve({
						"success": true,
						"response_code": response.getTransactionResponse().getResponseCode(),
						"transaction_response": response.getTransactionResponse(),
						"response_code": response.getTransactionResponse().getResponseCode(),
						"tran_id": response.getTransactionResponse().getTransId(),
						"message": response.getTransactionResponse().getMessages().getMessage()[0].getDescription(),
						"message-code": response.getTransactionResponse().getMessages().getMessage()[0].getCode()
					});
				}
				else {
					console.log('Failed Transaction.');
					if(response.getTransactionResponse().getErrors() != null){
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
			}
			else {
				console.log('Failed Transaction. ');
				if(response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null){
				
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
				else {
					console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
					console.log('Error message: ' + response.getMessages().getMessage()[0].getText());

					resolve({
						"success": false,
						"response_code": response.getMessages().getMessage()[0].getCode(),
						"tran_id": "",
						"message": response.getMessages().getMessage()[0].getText(),
						"message-code": response.getMessages().getMessage()[0].getCode()
					});
				}
			}
		}
		else {
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
    creditBankAccount
}
