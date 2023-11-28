import axios from '../api/BaseURL';
import authHeader from './auth-header';

class caseAPI {
  // case create
  createCase(data) {
    return axios.post('/case/add', data, { headers: authHeader() });
  }
  // case update
  updateCase(data) {
    return axios.put('/case/update', data, { headers: authHeader() });
  }
  // case delete
  deleteCase(id) {
    return axios.delete('/case/caseDelete/', {
      headers: authHeader(),
      data: { id: id },
    });
  }

  // case list -> users
  getCaseList() {
    return axios.get('/case/list', {
      headers: authHeader(),
    });
  }

  // case details
  getCaseDetails(id) {
    return axios.get(`/case/details/${id}`, {
      headers: authHeader(),
    });
  }

  // case status change
  changeCaseStatus(data) {
    return axios.put('/case/changeCaseStatus', data, {
      headers: authHeader(),
    });
  }

  // cancel case service
  cancelCaseService(data) {
    console.log(data);
    // return axios.put('/case/cancelCaseService', data, {
    //   headers: authHeader(),
    // });
  }
  // get suggestions for add case member
  getSuggestions(data) {
    return axios.post('/case/userListForAddService', data, {
      headers: authHeader(),
    });
  }
  // add case member
  addCaseMember(data) {
    return axios.post('/case/sendRequest', data, {
      headers: authHeader(),
    });
  }
  // case file upload
  uploadCaseFile(data) {
    return axios.post('/case/uploadFile', data, {
      headers: authHeader(),
    });
  }

  // case file download
  downloadCaseFile(id) {
    return axios.get(`/case/file-download/${id}`, {
      responseType: 'blob',
      headers: authHeader(),
    });
  }

  // case file delete
  removeCaseFile(id) {
    return axios.delete('/case/caseFileDelete', {
      headers: authHeader(),
      data: {
        id: id,
      },
    });
  }

  // recommendation list for dentist
  getDentistsRecommendation() {
    return axios.get(`/case/recommendListForCase`, {
      headers: authHeader(),
    });
  }

  // dentist sent request to case member
  sendRequestList() {
    return axios.get('/case/mySendRequestList', {
      headers: authHeader(),
    });
  }
  // Change case member status
  changeStatus(caseId, actionStatus) {
    console.log('case ID' + caseId);
    console.log('Action Status' + actionStatus);
    let formData = new FormData();
    formData.append('id', caseId);
    formData.append('action', actionStatus);
    return axios.post('/case/changeMyServiceStatus', formData, {
      headers: authHeader(),
    });
  }

  // case list for admin/super admin
  getCaseListForAdmin() {
    return axios.get('/case/list-for-admin', {
      headers: authHeader(),
    });
  }

  // get case types
  getCaseTypes() {
    return axios.get('/caseType/list', {
      headers: authHeader(),
    });
  }

  // get confirm Pay Data
  getConfirmPayData(caseId) {
    return axios.get(`/case/completeList/${caseId}`, {
      headers: authHeader(),
    });
  }

  // pay service holder
  submitConfirmPayData(data) {
    return axios.post('/case/payment-pay-to-service-holder', data, {
      headers: authHeader(),
    });
  }

  // cancel service
  cancelService(id) {
    return axios.post(
      '/case/cancelServiceInCase',
      { id: id },
      {
        headers: authHeader(),
      },
    );
  }

  // get case cancellation list
  getCaseCancelList() {
    return axios.get('/case/canceledCaseMemberList', {
      headers: authHeader(),
    });
  }

  // completed case list
  getCompletedCase(id) {
    return axios.get('/user/completedCaseList/' + id, {
      headers: authHeader(),
    });
  }
}

export default new caseAPI();
