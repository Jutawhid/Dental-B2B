import axios from '../api/BaseURL';
import authHeader from './auth-header';

class USERS_API {
  // Profile Information
  getUserProfile() {
    return axios.get('/user/me', {
      headers: authHeader(),
    });
  }

  // Profile Update
  updateUserProfile(user) {
    // console.log(user)
    return axios.post(
      '/professional-profile-self-update',
      {
        // practice_name: user.practice_name,
        full_name: user.full_name,
        bio: user.bio,
        email: user.email,
        contact: user.contact,
        fax: user.fax,
        practice_address: user.practice_address,
        npi: user.npi,
        license: user.license,
        // credit_card: user.credit_card,
        // image_name: user.image_name,
        profile_image_name: user.profile_image_name,
        // image_path: user.image_path,
        // cover_image_name: user.cover_image_name,
        // cover_image: user.cover_image,
        // cover_image_path: user.cover_image_path,
        is_active: user.is_active,
        user_id: user.user_id,
      },
      {
        headers: authHeader(),
      },
    );
  }
  // Profile Update -> Dentist
  updateDentistProfile2(userData) {
    console.log(userData);
    return axios.post('/professional-profile-self-update', userData, {
      headers: authHeader(),
    });
  }

  // Profile Update -> LAB
  updateLabProfile(user) {
    console.log(user);
    return axios.post('/professional-profile-self-update', user, {
      headers: authHeader(),
    });
  }

  //get admin list
  getAdminList() {
    return axios.get('/admin/list', {
      headers: authHeader(),
    });
  }

  //get All User List
  getAllUsersList() {
    return axios.get('/professional-profiles', {
      headers: authHeader(),
    });
  }
  getExploreData() {
    // return axios.get('/explore/homeExploreList', {
    return axios.get('/explore/homeExploreListWithoutLimit', {
      headers: authHeader(),
    });
  }

  // user list for admin,super admin
  getAllUserAccessList() {
    return axios.get('/user/allUserList', {
      headers: authHeader(),
    });
  }

  //active-deactive user
  // changeUserStatus(id) {
  //   return axios.post('/users/activate-deactivate-user/' + id, {
  //     headers: authHeader(),
  //   });
  // }

  //get case List - ADMIN
  getCaseList() {
    return axios.get('/cases/get-all-cases', {
      headers: authHeader(),
    });
  }

  //get case List - Professional Users
  getUsersCaseList() {
    return axios.get('/case/list', {
      headers: authHeader(),
    });
  }

  //get user details for ADMIN & SUPER ADMIN
  getUserDetails(userID) {
    return axios.get('/user/userDetails/' + Number(userID), {
      headers: authHeader(),
    });
  }

  //for User
  getUsers(userID) {
    return axios.get('/user/profileDetails/' + userID, {
      headers: authHeader(),
    });
  }

  //for User
  getAdmin(userID) {
    return axios.get('/admin/adminProfileDetails/' + userID, {
      headers: authHeader(),
    });
  }
  //for All Message
  getMyMessage(userID) {
    return axios.get('/message/detailsByUserId/' + userID, {
      headers: authHeader(),
    });
  }
  // Message seen
  seenMessage(messageId) {
    return axios.post(
      '/message/messageSeen',
      { id: messageId },
      {
        headers: authHeader(),
      },
    );
  }
  //for All Notifications
  getNotificationList() {
    return axios.get('/notification/list/', {
      headers: authHeader(),
    });
  }

  //change password
  changeUserPassword(userData) {
    return axios.post('/user/password-change', userData, {
      headers: authHeader(),
    });
  }

  //log Out
  logMeout() {
    return axios.get('/authentication/logout', {
      headers: authHeader(),
    });
  }

  //recover/reset password
  requestResetPassword(email) {
    return axios.post('/user/forgetPasswordRequest', { email: email });
  }

  //recover/reset verify account
  verifyResetPassword(token) {
    return axios.post('/user/verifyResetToken', { resetToken: token });
  }

  //recover/reset verify account
  resetPassword(user, token) {
    return axios.post('/user/resetPasswordByToken', {
      new_password: user.new_password,
      confirm_password: user.confirm_password,
      resetToken: token,
    });
  }

  // user delete
  deleteUser(id) {
    return axios.post(
      '/user/deleteOtherUser',
      { id: id },
      {
        headers: authHeader(),
      },
    );
  }

  //device list
  otherDevices() {
    return axios.get('/user/logging-device-info', {
      headers: authHeader(),
    });
  }

  //other device logout
  otherDeviceLogout(id) {
    return axios.post(
      '/user/logout-from-login-device',
      { id: id },
      {
        headers: authHeader(),
      },
    );
  }

  //change admin status
  changeAdminStatus(id) {
    return axios.post(
      '/admin/changeAdminStatus',
      { id: id },
      {
        headers: authHeader(),
      },
    );
  }
  //change user status
  changeUserStatus(id) {
    return axios.post(
      '/user/changeUserStatus',
      { id: id },
      {
        headers: authHeader(),
      },
    );
  }
  //change admin status
  resetAdminPassword(id) {
    return axios.post(
      '/admin/resetPassword',
      { id: id },
      {
        headers: authHeader(),
      },
    );
  }

  //create admin
  createAdmin(userData) {
    return axios.post('/admin/registration', userData, {
      headers: authHeader(),
    });
  }
  //service type list
  getServiceTypes() {
    return axios.get('/service/list', {
      headers: authHeader(),
    });
  }

  //service enable-disable
  changeServiceTypeStatus(id) {
    return axios.put(
      '/service/changeServiceStatus',
      { id: id },
      {
        headers: authHeader(),
      },
    );
  }
  //service type delete
  removeServiceType(id) {
    return axios.delete('/service/delete', {
      // headers: {
      //   'x-access-token': JSON.parse(localStorage.getItem('user')).token,
      // },
      headers: authHeader(),
      data: {
        id: id,
      },
    });
  }

  // create Service Type
  createServiceType(userData) {
    return axios.post('/service/add', userData, {
      headers: authHeader(),
    });
  }

  // edit service type
  editServiceType(userData) {
    return axios.put('/service/update', userData, {
      headers: authHeader(),
    });
  }

  // get State List
  getStateList() {
    return axios.get('/location/stateList', {
      headers: authHeader(),
    });
  }

  // get City List
  getCityList(stateId) {
    return axios.get('/location/cityListByStateId/' + stateId, {
      headers: authHeader(),
    });
  }

  // get Zip Code List
  getZipCodeList(cityId) {
    return axios.get('/location/zipListByCityId/' + cityId, {
      headers: authHeader(),
    });
  }

  // get service Details
  getServiceDetails(id) {
    return axios.get('/service/details/' + Number(id), {
      headers: authHeader(),
    });
  }

  // payment gateway List
  getPaymentGatewayList() {
    return axios.get('/gateway/list', {
      headers: authHeader(),
    });
  }
  // payment gateway enable-disable
  changePaymentGatewayStatus(id) {
    return axios.put(
      '/gateway/changeGatewayStatus',
      { id: id },
      {
        headers: authHeader(),
      },
    );
  }
  // payment gateway delete
  removePaymentGateway(id) {
    return axios.delete('/gateway/delete', {
      // headers: {
      //   'x-access-token': JSON.parse(localStorage.getItem('user')).token,
      // },
      headers: authHeader(),
      data: {
        id: id,
      },
    });
  }

  // gateway details
  getGatewayDetails(id) {
    return axios.get('/gateway/details/' + Number(id), {
      headers: authHeader(),
    });
  }
  // email change request
  emailChangeRequest(userData) {
    return axios.post('/user/emailChangeRequest', userData, {
      headers: authHeader(),
    });
  }

  // service create
  addProfileService(userData) {
    return axios.post('/my-service/add', userData, {
      headers: authHeader(),
    });
  }

  // send OTP to change email
  verifyEmail(data) {
    return axios.post('/user/emailChangeSubmit', data, {
      headers: authHeader(),
    });
  }

  // feature list
  getFeatureList() {
    return axios.get('/feature/list', {
      headers: authHeader(),
    });
  }

  // add feature
  addFeature(userData) {
    return axios.post('/feature/add', userData, {
      headers: authHeader(),
    });
  }

  // remove feature
  removeFeature(id) {
    return axios.delete('/feature/delete', {
      // headers: {
      //   'x-access-token': JSON.parse(localStorage.getItem('user')).token,
      // },
      headers: authHeader(),

      data: {
        id: id,
      },
    });
  }

  // add feature
  changeFeatureStatus(id) {
    return axios.put(
      '/feature/changeFeatureUserStatus',
      { id: id },
      {
        headers: authHeader(),
      },
    );
  }

  // add feature
  updateSerial(data) {
    return axios.put(
      '/feature/changeFeatureUserSerial',
      { serial_id: data },
      {
        headers: authHeader(),
      },
    );
  }

  // get favorite list
  getFavoriteList() {
    return axios.get('/favorite/allFavoriteList', {
      headers: authHeader(),
    });
  }

  // get favorite list
  getAllMessages() {
    return axios.get('/message/list', {
      headers: authHeader(),
    });
  }

  // add favorite
  addToFavorite(id) {
    return axios.post(
      '/favorite/addToFavorite',
      { favorite_user_id: id },
      {
        headers: authHeader(),
      },
    );
  }
  // remove from favorites
  removeFromFavorites(id) {
    return axios.put(
      '/favorite/removeFromFavorite',
      { favorite_user_id: id },
      {
        headers: authHeader(),
      },
    );
  }

  // seen notification
  seenNotification(id) {
    return axios.post(
      '/notification/notificationSeen',
      { id: id },
      {
        headers: authHeader(),
      },
    );
  }
}
export default new USERS_API();
