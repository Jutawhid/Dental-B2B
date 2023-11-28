<template>
  <div class="app-content content">
    <div class="content-overlay"></div>
    <div class="header-navbar-shadow"></div>
    <div class="col-lg-12 content-wrapper">
      <div class="row">
        <div class="col-6">
          <h1 class="text-bold-700 mb-0 headerTXT">My Profile</h1>
        </div>
        <div class="col-6 text-right">
          <router-link
            v-show="user.id"
            :to="{ path: '/' + user.id && user.id + '/edit' }"
          >
            <button type="submit" class="update__btn">
              <i class="fa fa-edit"></i>
              Edit
            </button>
          </router-link>
        </div>

        <div class="col-12">
          <hr />
        </div>
      </div>

      <div>
        <DentistProfileView :user="user" />
      </div>
    </div>
  </div>
</template>

<script>
import DentistProfileView from './displayDentistProfile';
import profileService from '../../../../services/profile.service';

export default {
  name: 'DentistProfile',
  components: {
    DentistProfileView,
  },
  data() {
    return {
      user: {},
    };
  },
  mounted() {
    profileService.getUser().then(
      response => {
        console.log(response);
        if (response) this.user = response;
        console.log(this.user);
      },
      error => {
        console.log(error.response.data);
        if (error.response.data) this.user = {};
      },
    );
  },
};
</script>

<style scoped>
h1.headerTXT {
  font-size: 20px;
  text-transform: uppercase;
}
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
  .profile-img-container {
    padding: 0px !important;
  }
  .headerTXT {
    text-align: center;
    margin: 10px;
  }
  .card {
    padding: 30px;
  }
}
</style>
