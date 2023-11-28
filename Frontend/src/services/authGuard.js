import ls from 'localstorage-slim';
import { AES } from 'crypto-js';
import encUTF8 from 'crypto-js/enc-utf8';

ls.config.encrypt = true;
ls.config.secret = 'my-secret-password';
ls.config.decrypter = (data, secret) => {
  try {
    return JSON.parse(AES.decrypt(data, secret).toString(encUTF8));
  } catch (e) {
    // incorrect secret, return the encrypted data instead / or null
    localStorage.clear();
    location.reload();
    return data; // or return null;
  }
};

let role_id = JSON.parse(ls.get('user'))?.role?.role_id;
let user = JSON.parse(ls.get('user'));
// console.log(user);
class AuthGuard {
  // Checking if the user is Admin
  async isAdmin(to, from, next) {
    var isAdmin = false;

    if (role_id === 2) isAdmin = true;
    else isAdmin = false;

    if (isAdmin) {
      await next(); // allow to enter route
    } else {
      next('/');
    }
  }

  // Checking if the user is Super Admin
  async isSuperAdmin(to, from, next) {
    var isSuperAdmin = false;

    if (role_id === 1) {
      isSuperAdmin = true;
      console.log(role_id);
    } else isSuperAdmin = false;

    if (isSuperAdmin) {
      await next(); // allow to enter route
    } else {
      next('/');
    }
  }

  // is Admin - Super Admin
  async isAdmin_SuperAdmin(to, from, next) {
    var isAdmin_SuperAdmin = false;

    if (role_id === 1 || role_id === 2) isAdmin_SuperAdmin = true;
    else isAdmin_SuperAdmin = false;

    if (isAdmin_SuperAdmin) {
      await next(); // allow to enter route
    } else {
      next('/');
    }
  }

  // Checking if the user is Dentist
  async isDentist(to, from, next) {
    var isDentist = false;

    if (role_id === 3) isDentist = true;
    else isDentist = false;

    if (isDentist) {
      await next(); // allow to enter route
    } else {
      next('/');
    }
  }

  // Checking if the user is Consultant
  async isConsultant(to, from, next) {
    let isConsultant = false;

    if (role_id === 4) isConsultant = true;
    else isConsultant = false;

    if (isConsultant) {
      await next(); // allow to enter route
    } else {
      next('/');
    }
  }

  // Checking if the user is Lab
  async isLab(to, from, next) {
    let isLab = false;

    if (role_id === 5) isLab = true;
    else isLab = false;

    if (isLab) {
      await next(); // allow to enter route
    } else {
      next('/');
    }
  }

  // Checking if the user is Tech
  async isTech(to, from, next) {
    let isTech = false;

    if (role_id === 6) isTech = true;
    else isTech = false;

    if (isTech) {
      await next(); // allow to enter route
    } else {
      next('/');
    }
  }

  // Checking if the user is isProfessional
  async isProfessional(to, from, next) {
    let isProfessional = false;

    if (role_id === 5 || role_id === 6 || role_id === 4 || role_id === 3)
      isProfessional = true;
    else isProfessional = false;

    if (isProfessional) {
      await next(); // allow to enter route
    } else {
      next('/');
    }
  }

  // Checking if the user is GUEST
  async isGuest(to, from, next) {
    let isGuest = false;

    if (!localStorage.getItem('user') || user === []) isGuest = true;
    else isGuest = false;

    if (isGuest) {
      await next(); // allow to enter route
    } else {
      next('/');
    }
  }

  // Checking if the user is GUEST
  async isLogged(to, from, next) {
    let isLogged = false;
    // console.log(user);
    if (user) isLogged = true;
    else isLogged = false;

    if (isLogged) {
      await next(); // allow to enter route
    } else {
      next('/');
    }
  }
}

export default new AuthGuard();
