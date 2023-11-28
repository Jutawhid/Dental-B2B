import axios from '../api/BaseURL';
import authHeader from './auth-header';

class trashAPI {
  // trash list
  getTrashList() {
    return axios.get('/trash/trashList', {
      headers: authHeader(),
    });
  }

  // trash file download
  downloadTrashFile(id) {
    return axios.get(`/trash/trashFileDownload/${id}`, {
      responseType: 'blob',
      headers: authHeader(),
    });
  }

  // restore trash file
  restoreTrashFile(id) {
    return axios.post(
      '/trash/restoreTrash',
      { id: id },
      { headers: authHeader() },
    );
  }

  // recover case
  recoverCase(id) {
    return axios.post(
      '/trash/restoreCase',
      { id: id },
      { headers: authHeader() },
    );
  }

  // super admin & admin trash list
  getAdminTrashList() {
    return axios.get('/trash/adminTrashList', {
      headers: authHeader(),
    });
  }

  // super admin & admin trash file download
  downloadAdminTrashFile(id) {
    return axios.get(`/trash/trashFileDownloadByAdmins/${id}`, {
      responseType: 'blob',
      headers: authHeader(),
    });
  }

  // super admin & admin restore trash file
  restoreAdminTrashFile(id) {
    return axios.post(
      '/trash/restoreTrashByAdmins',
      { id: id },
      { headers: authHeader() },
    );
  }
}

export default new trashAPI();
