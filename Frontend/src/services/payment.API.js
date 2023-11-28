import axios from '../api/BaseURL';
import authHeader from './auth-header';

class paymentAPI {
  // get wallet info
  getWalletInfo() {
    return axios.get('/userPaymentInfo/currentWalletBalance', {
      headers: authHeader(),
    });
  }

  //  add card
  addCard(data) {
    console.log(data);
    return axios.post(
      '/userPaymentInfo/addCardRecord',
      {
        gateway_id: 1,
        card_type: 0,
        card_number: data.card_number,
        card_holder: data.card_holder,
        cvv_no: data.cvv_no,
        expired_date: data.expired_date,
      },
      {
        headers: authHeader(),
      },
    );
  }

  //   remove card
  removeCard(id) {
    return axios.delete('/userPaymentInfo/deleteCard', {
      headers: authHeader(),
      data: {
        id: id,
      },
    });
  }

  //   make default card
  makeDefaultCard(id) {
    return axios.post(
      '/userPaymentInfo/defaultCard',
      { id: id },
      {
        headers: authHeader(),
      },
    );
  }

  //   add money to Wallet
  addMoneyToWallet(data) {
    return axios.post(
      '/userPaymentInfo/addMoneyToWallet',
      {
        card_id: data.card_id,
        amount: data.amount,
      },
      {
        headers: authHeader(),
      },
    );
  }

  addStripeMoneyToWallet(data) {
    return axios.post(
      '/stripe/addMoneyToWallet',
      { amount: data.amount },
      { headers: authHeader() },
    );
  }
  withdrawStripeMoney(amount) {
    return axios.post(
      '/wallet/withdrawMoney',
      {
        amount: amount,
        payment_type: 1,
      },
      { headers: authHeader() },
    );
  }
  // update card info
  updateCardInfo(data) {
    return axios.put(
      '/userPaymentInfo/updateCardRecord',
      {
        id: data.id,
        gateway_id: 1,
        card_type: 0,
        card_number: data.card_number,
        card_holder: data.card_holder,
        cvv_no: data.cvv_no,
        expired_date: data.expired_date,
      },
      {
        headers: authHeader(),
      },
    );
  }

  // get account status
  getAccountStatus() {
    return axios.get('/stripe/accountStatus', {
      headers: authHeader(),
    });
  }

  // add stripe account
  addStripeAccount() {
    return axios.post(
      '/stripe/addNewRecord',
      {},
      {
        headers: authHeader(),
      },
    );
  }

  // update Stripe card
  updateStripeCard() {
    return axios.post(
      '/stripe/updateMyAccountStatus',
      {},
      {
        headers: authHeader(),
      },
    );
  }

  // get Transaction List
  getUserTransactionList() {
    return axios.get('/user/user-transaction-history', {
      headers: authHeader(),
    });
  }
  // get Transaction List
  getInvoiceList() {
    return axios.get('/user/invoiceList', {
      headers: authHeader(),
    });
  }
  // get Admin Invoice List
  getInvoiceListForAdmins() {
    return axios.get('/user/invoiceListForAdmins', {
      headers: authHeader(),
    });
  }

  // get invoice details -> users
  getInvoiceDetails(id) {
    return axios.get(`/user/invoiceDetails/${id}`, {
      headers: authHeader(),
    });
  }
  // get invoice details -> users
  getAdminInvoiceDetails(id) {
    return axios.get('/user/invoiceDetailsForAdmin/' + id, {
      headers: authHeader(),
    });
  }
  // get Case Payment History
  getCasePaymentHistory(caseID) {
    return axios.get('/case/casePaymentHistory/' + caseID, {
      headers: authHeader(),
    });
  }
  //Admin get Payment Summey
  getSummery() {
    return axios.get('/user/payment-short-summary', {
      headers: authHeader(),
    });
  }

  // amount add to stripe
  addAmountToStripe() {
    return axios.post(
      '/stripe/autoTransferAmount',
      {},
      { headers: authHeader() },
    );
  }

  // get stripe url
  getStripeUrl() {
    return axios.get('/stripe/account-login-url', {
      headers: authHeader(),
    });
  }
}
export default new paymentAPI();
