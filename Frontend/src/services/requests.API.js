import axios from '../api/BaseURL';
import authHeader from './auth-header';

class requestsAPI {
  // recommendation approve
  approveRequest(id) {
    return axios.post(
      '/case/responseForRecommend',
      {
        id: id,
        action: 1,
        payment_type: 1,
      },
      {
        headers: authHeader(),
      },
    );
  }

  // recommendation reject
  rejectRequest(id) {
    return axios.post(
      '/case/responseForRecommend',
      {
        id: id,
        action: 2,
        payment_type: 1,
      },
      {
        headers: authHeader(),
      },
    );
  }
  // dentist sent request to case member
  dentistSentRequestList() {
    return axios.get('/case/mySendRequestList', {
      headers: authHeader(),
    });
  }
  // sent request -> cancel action
  dentistCancelSentRequest(id) {
    return axios.post(
      '/case/cancelMySendRequest',
      {
        id: id,
      },
      {
        headers: authHeader(),
      },
    );
  }
  // received request list
  receivedRequestList() {
    return axios.get('/case/myRequestList', {
      headers: authHeader(),
    });
  }
  // response for received request
  responseForReceivedRequest(data) {
    return axios.post('/case/responseForMyRequest', data, {
      headers: authHeader(),
    });
  }
  // send recommendation list
  getSendRecommendationList() {
    return axios.get('/case/mySendRecommendList', {
      headers: authHeader(),
    });
  }
  // cancel sent request
  cancelSentRecommendRequest(id) {
    return axios.post(
      '/case/cancelMySendRecommendList',
      {
        id: id,
      },
      {
        headers: authHeader(),
      },
    );
  }
}
export default new requestsAPI();
