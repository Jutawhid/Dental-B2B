import authHeader from './auth-header';
import axios from '../api/BaseURL';

class UserService {
  getPublicContent() {
    return axios.get('/all');
  }

  getUserBoard() {
    return axios.get('/user/me', { headers: authHeader() });
  }
  updateUserService() {
    return axios.put('/my-service/update', { headers: authHeader() });
  }
  getUserServiceList() {
    return axios.get('/my-service/formDataForAddService', {
      headers: authHeader(),
    });
  }
  addService(service) {
    let formData = new FormData();
    formData.append('service_id', service.selected_service);
    formData.append('price', service.price);
    formData.append('description', service.description);

    return axios.post('/my-service/add', formData, {
      headers: authHeader(),
    });
  }

  getModeratorBoard() {
    return axios.get('/mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get('/admin', { headers: authHeader() });
  }
}

export default new UserService();
