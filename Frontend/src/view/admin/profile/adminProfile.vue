<template>
  <div class="app-content content">
    <div class="content-overlay"></div>
    <div class="header-navbar-shadow"></div>
    <div class="col-lg-9 content-wrapper">
      <div class="row">
        <div class="col-lg-6 col-sm-12">
          <h1 class="text-bold-700 mb-0 headerTXT">My Profile</h1>
        </div>
        <div
          v-if="isEditProfile === false"
          class="col-lg-6 col-sm-12 d-flex justify-content-lg-end justify-content-center align-items-center"
        >
          <!-- <a href="/edit/admin-profile/" class="btn-default"> -->
          <router-link :to="{ name: 'UpdateAdminProfile' }">
            <button type="submit" class="update__btn" v-if="role === 2">
              <i class="fa fa-edit"></i>
              Edit
            </button>
          </router-link>
          <!-- </a> -->
          <!-- <router-link :to="{ name: 'ChangePassword' }">
            <button type="submit" class="update__btn">
              <i class="fa fa-key"></i>
              Change Password
            </button>
          </router-link> -->
        </div>

        <div class="col-12">
          <hr />
        </div>
      </div>

      <div v-if="isEditProfile === false">
        <AdminProfileView />
      </div>
      <div v-if="isEditProfile === true"><UpdateAdminProfile /></div>
    </div>
  </div>
</template>

<script>
import UpdateAdminProfile from './updateAdminProfile';
import AdminProfileView from './displayAdminProfile';
import profileService from '../../../services/profile.service';
export default {
  name: 'AdminProfile',
  components: {
    UpdateAdminProfile,
    AdminProfileView,
  },
  data() {
    return {
      user: {},
      isEditProfile: false,
      role: '',
    };
  },
  methods: {
    EditAction() {
      this.isEditProfile = true;
    },
    backToProfile() {
      this.isEditProfile = false;
    },
    submitted() {
      this.isSubmitted = true;
      console.log(this.userData.email, 'submitted form');
    },
  },
  mounted() {
    profileService.getUser().then(response => {
      // console.log(response);
      this.role = response.role.role_id;
    });
  },
};
</script>

<style scoped>
.card {
  padding: 50px;
}
.card-body {
  padding: 0;
}
.dentist {
  min-height: 50px;
}
.dentist p {
  margin-top: 3px;
  margin-left: 3px;
  font-size: 15px;
  letter-spacing: 0px;
  color: #000000;
}
.dentist h6 {
  font-size: 12px !important;
  color: #707070;
}
.avatar-upload {
  position: relative;
  max-width: 200px;
  margin: 10px auto;
  margin-top: 30px;
}
.avatar-upload .avatar-preview {
  width: 192px;
  height: 192px;
  position: relative;
  border-radius: 20px;
  border: 0 solid #ececec;
  box-shadow: 0 2px 10px 3px rgb(0 0 0 / 10%);
}

.avatar-upload .avatar-preview > div {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
button,
.update__btn {
  margin-left: 5px;
  background: #123c3d;
  box-shadow: none;
  border-radius: 5px;
  padding: 10px 30px;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  font-family: poppins;
  letter-spacing: 0px;
  color: #ffffff;
  opacity: 1;
  border: 1px solid #123c3d;
  cursor: pointer;
}
.update__btn:hover {
  background: #ffcc3f;
  color: #123c3d;
  border: 1px solid #ffcc3f;
}
@media only screen and (max-width: 565px) {
  .headerTXT {
    text-align: center;
    margin: 30px !important;
  }
}
</style>
