import { AES } from 'crypto-js';
import encUTF8 from 'crypto-js/enc-utf8';
import ls from 'localstorage-slim';

ls.config.encrypt = true;
ls.config.secret = 'my-secret-password';
ls.config.decrypter = (data, secret) => {
  try {
    return JSON.parse(AES.decrypt(data, secret).toString(encUTF8));
  } catch (e) {
    return data; // or return null;
  }
};

export default function authHeader() {
  let user = JSON.parse(ls.get('user'));
  if (user && user?.token) {
    return { 'x-access-token': user?.token };
  } else {
    return {};
  }
}
