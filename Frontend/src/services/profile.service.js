import axios from '../api/BaseURL';
import authHeader from './auth-header';
class ProfileService {
  getUser() {
    return axios
      .get('/user/me', { headers: authHeader() })
      .then(response => response.data.data);
  }
  updateUser() {
    return axios.post('/user/profile/update', {
      headers: authHeader(),
    });
  }
  userProUpdate(users, address) {
    let formData = new FormData();
    console.log(users);
    if (users.currentImage) {
      formData.append('image', users.currentImage);
    }
    if (users.coverImg) {
      formData.append('cover_image', users.coverImg);
    }
    formData.append('phone', users.phone);
    formData.append('name', users.name);
    formData.append('first_name', users.first_name);
    formData.append('last_name', users.last_name);
    formData.append('license', users.license);
    formData.append('fax', users.fax);
    formData.append('address', users.address);
    formData.append('state_id', address.state);
    formData.append('zip_id', address.zip);
    formData.append('city_id', address.city);
    formData.append('description', users.description);

    return axios.put('/user/profile/update', formData, {
      headers: authHeader(),
    });
  }
  getActiveService() {
    return axios
      .get('/my-service/list', { headers: authHeader() })
      .then(response => response.data);
  }
}
export default new ProfileService();
