import http from '../api/BaseURL';
import authHeader from './auth-header';

class UploadProfile {
  createGateway(users) {
    let formData = new FormData();
    if (users.currentImage) {
      formData.append('image', users.currentImage);
    }

    formData.append('name', users.name);

    return http.post('/gateway/add', formData, {
      headers: authHeader(),
    });
  }
  editGateway(users) {
    let formData = new FormData();
    formData.append('id', users.id);

    if (users.currentImage) {
      formData.append('image', users.currentImage);
    }
    formData.append('name', users.name);

    return http.put('/gateway/update', formData, {
      headers: authHeader(),
    });
  }
  dentistUpdate(users, address) {
    let formData = new FormData();
    // let userData = JSON.parse(localStorage.getItem('user'));
    console.log(users);
    if (users.currentImage) {
      formData.append('image', users.currentImage);
    }

    formData.append('phone', users.phone);
    formData.append('email', users.email);
    formData.append('first_name', users.first_name);
    formData.append('last_name', users.last_name);
    formData.append('user_name', users.user_name);
    formData.append('fax', users.fax);
    formData.append('npi_number', users.npi_number);
    formData.append('license', users.license);
    formData.append('state_id', address.state);
    formData.append('zip_id', address.zip);
    formData.append('city_id', address.city);
    formData.append('address', users.address);
    console.log(formData);

    return http.put('/user/profile/update', formData, {
      // headers: {
      //   'Content-Type': 'multipart/form-data',
      //   'x-access-token': `${userData.token}`,
      // },
      headers: authHeader(),
    });
  }

  labProUpdate(users, address) {
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

    return http.put('/user/profile/update', formData, {
      headers: authHeader(),
    });
  }

  consultentProUpdate(users, address) {
    let formData = new FormData();
    let token = JSON.parse(localStorage.getItem('user'));
    let userToken = token.token;
    console.log(userToken);
    console.log(users);
    if (users.currentImage) {
      formData.append('image', users.currentImage);
    }
    if (users.coverImage) {
      formData.append('cover_image', users.coverImage);
    }

    formData.append('phone', users.phone);
    formData.append('first_name', users.first_name);
    formData.append('last_name', users.last_name);
    // formData.append("npi", users.npi);
    formData.append('fax', users.fax);
    formData.append('license', users.license);
    formData.append('address', users.address);
    formData.append('state_id', address.state);
    formData.append('zip_id', address.zip);
    formData.append('city_id', address.city);
    formData.append('description', users.description);

    return http.put('/user/profile/update', formData, {
      headers: authHeader(),
    });
  }

  adminProfileUpdate(users) {
    let formData = new FormData();
    // let userData = JSON.parse(localStorage.getItem('user'));

    if (users.currentImage) {
      formData.append('image', users.currentImage);
    }

    formData.append('phone', users.phone);
    formData.append('email', users.email);
    formData.append('first_name', users.first_name);
    formData.append('last_name', users.last_name);
    formData.append('address', users.address);

    return http.put('/admin/profile/update', formData, {
      // headers: {
      //   'Content-Type': 'multipart/form-data',
      //   'x-access-token': `${userData.token}`,
      // },
      headers: authHeader(),
    });
  }

  getFiles() {
    return http.get('/me', {
      headers: authHeader(),
    });
  }
}

export default new UploadProfile();
