import { AES } from 'crypto-js';
import ls from 'localstorage-slim';
import encUTF8 from 'crypto-js/enc-utf8';

ls.config.encrypt = true;
ls.config.secret = 'my-secret-password';
ls.config.encrypter = (data, secret) =>
  AES.encrypt(JSON.stringify(data), secret).toString();
ls.config.decrypter = (data, secret) => {
  try {
    return JSON.parse(AES.decrypt(data, secret).toString(encUTF8));
  } catch (e) {
    // incorrect secret, return the encrypted data instead / or null
    return data; // or return null;
  }
};
class TokenService {
  getLocalRefreshToken() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.refreshToken;
  }

  getLocalAccessToken() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.data?.token;
  }

  updateLocalAccessToken(token) {
    let user = JSON.parse(localStorage.getItem('user'));
    user.data.token = token;
    localStorage.setItem('user', JSON.stringify(user));
  }

  // getUser() {
  //   return JSON.parse(localStorage.getItem('user'));
  // }
  getUser() {
    ls.config.encrypt = true;
    return JSON.parse(ls.get('user'));
  }

  // setUser(user) {
  //   // console.log(JSON.stringify(user));
  //   localStorage.setItem('user', JSON.stringify(user));
  // }
  setUser(user) {
    // console.log(JSON.stringify(user));
    ls.set('user', JSON.stringify(user));
  }

  removeUser() {
    localStorage.clear();
    sessionStorage.clear();
  }
}

export default new TokenService();
