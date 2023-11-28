require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KET);


let createConnectedAccount = async () => {
    const account = await stripe.accounts.create({
        type: 'express',
        capabilities: {
            "card_payments": { "requested": true },
            "transfers": { "requested": true },
        },
    });

    return account;
};


let accountRetrieve = async (accountNo = "") => {

    const accountInfo = await stripe.accounts.retrieve(
        accountNo
    );

    return accountInfo;
}


let chargeAAccountBy = async (accountNo = "", amount = 0, reason = "") => {

    let result = {
        success: false,
        data: {}
    }

    try {
        const charge = await stripe.charges.create({
            amount: amount,
            currency: 'usd',
            source: accountNo,
            description: reason
        });

        result.success = true;
        result.data = charge;

    } catch (error) {
        result.data = error;
        result.error_code = error.balance_insufficient;
    }


    return result;
}

let transferAmount = async (accountNo = "", amount = 0) => {

    let result = {
        success: false,
        data: {}
    }

    try {
        const transfer = await stripe.transfers.create({
            amount: amount,
            currency: 'usd',
            destination: accountNo,
            transfer_group: 'ORDER_95',
        });

        result.success = true;
        result.data = transfer;
    } catch (error) {
        result.data = error;
        result.error_code = error.balance_insufficient;
        // console.log(error)
        // console.log(error.message)
    }


    return result;
}

let topUpAccount = async (amount = 0, reason = "") => {

    const topUp = await stripe.topups.create({
        amount: amount,
        currency: 'usd',
        description: reason,
        statement_descriptor: 'Top-up',
    });

    return topUp;
}


let linkedAccount = async (accountNo = "") => {

    const account = await stripe.accountLinks.create({
        account: accountNo,
        refresh_url: process.env.STRIPE_REFRESH_URL,
        return_url: process.env.STRIPE_RETURN_URL,
        type: 'account_onboarding'
    });


    // console.log({
    //     account: accountNo, 
    //     refresh_url: process.env.STRIPE_REFRESH_URL,
    //     return_url:  process.env.STRIPE_RETURN_URL,
    //     type: 'account_onboarding'
    // })

    return account;
}

let connectAccountLoginLink = async (accountNo = "") => {

    let result = {
        success: false,
        url: '#'
    }

    try {
        const loginLink = await stripe.accounts.createLoginLink(
            accountNo
        );

        if (loginLink.hasOwnProperty("url")) {
            result.url = loginLink.url;
            result.success = true;
        } 
    } catch (error) {}

    return result;
}


let getAccountBalance = async (accountNo = "") => {

    const balance = await stripe.balance.retrieve({
        stripeAccount: accountNo
    });

    return balance;
}


// let c = async () => {
//     const account = await stripe.accounts.retrieve(
//         // 'acct_1Kl4r9QjGGr5k0dT'
//         'acct_1Kl4kGQhkuwpbfo2'
//     );
//     console.log(account)
// }



// let updateCapability = async () => {
//     const capability = await stripe.accounts.updateCapability(
//         'acct_1Kl4kGQhkuwpbfo2',
//         'transfers',
//         { requested: true }
//     );

// }



// let balanceCheck = async () => {
//     const balanceTransactions = await stripe.balanceTransactions.list({
//         limit: 3,
//     });

//     console.log(balanceTransactions)
// }



// let createCustomer = async () => {
//     const customer = await stripe.customers.create({
//         email: 'person@example.edu',
//     });

//     console.log(customer)

// }



// let createCustomer1 = async () => {

//     const customer = await stripe.customers.create(
//         {email: 'mdriad@example.edu'},
//         {stripeAccount: 'acct_1KlQhTQVwQ8pjTSa'}
//       );

//       // Fetching an account just needs the ID as a parameter
//     //   const account = await stripe.accounts.retrieve('acct_1Kl9Z1GfFVpeQbmb');

//     console.log(customer)
//     // console.log(account)

// }



// auto transfer process for testing purpose
let autoTransferAmount = async (accountNo = "", amount = 0) => {

    let result = {
        success: false,
        data: {}
    }

    try {
        const transfer = await stripe.transfers.create({
            amount: amount,
            currency: 'usd',
            destination: accountNo,
            transfer_group: 'ORDER_95',
        });

        result.success = true;
        result.data = transfer;
    } catch (error) {
        result.data = error;
        result.error_code = error.balance_insufficient;
        // console.log(error)
        // console.log(error.message)
    }


    return result;
}



module.exports = {
    createConnectedAccount,
    getAccountInfo: accountRetrieve,
    getAccountBalance: getAccountBalance,
    linkWithConnectedAccount: linkedAccount,
    topUpByAccountId: topUpAccount,
    chargeAmountFromUserAccount: chargeAAccountBy,
    transferAmountProcess: transferAmount,
    autoTransferAmount: autoTransferAmount,
    connectAccountLoginLink
}