import io from 'socket.io-client';
import { AES } from 'crypto-js';
import encUTF8 from 'crypto-js/enc-utf8';
import ls from 'localstorage-slim';
import SocketBaseURL from './SocketBaseURL';

ls.config.encrypt = true;
ls.config.secret = 'my-secret-password';
ls.config.decrypter = (data, secret) => {
  try {
    return JSON.parse(AES.decrypt(data, secret).toString(encUTF8));
  } catch (e) {
    // incorrect secret, return the encrypted data instead / or null
    return data; // or return null;
  }
};
let user = JSON.parse(ls.get('user'));
// console.log(user.token);
var SOCKET_URL = null;
if (user !== null) {
  SOCKET_URL = io(SocketBaseURL, {
    auth: { token: user.token },
  });
}

export default SOCKET_URL;
