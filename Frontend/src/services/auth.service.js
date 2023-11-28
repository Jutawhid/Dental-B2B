import axios from '../api/BaseURL';
import TokenService from './token.service';

class AuthService {
  login(user) {
    return axios
      .post('/authentication/login', {
        user_name: user.username,
        password: user.password,
      })
      .then(response => {
        // console.log(response.data.data.token);
        if (response.data.data.token) {
          // localStorage.setItem("user", JSON.stringify(response.data));
          // TokenService.setEn(response.data.data);
          TokenService.setUser(response.data.data);
          // location.reload();
        }

        return response.data.data;
      });
  }

  logout() {
    // console.log("test");
    TokenService.removeUser();
  }
  //register Step 01
  register(user) {
    return axios.post('/user/registrationRequest', {
      user_type: user.role_id,
      email: user.email,
    });
  }
  //registration email verification
  verifyRegisterEmail(token) {
    return axios.post('/user/verifyRegistrationToken', { token: token });
  }
  //State List
  stateList() {
    return axios.get('/location/stateList');
  }
  //City List
  cityList(id) {
    return axios.get('/location/stateList' + id);
  }
}

export default new AuthService();
