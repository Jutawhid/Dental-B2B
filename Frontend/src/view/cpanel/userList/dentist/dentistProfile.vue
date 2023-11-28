<template>
  <div class="app-content content">
    <div class="content-overlay"></div>
    <div class="header-navbar-shadow"></div>
    <div class="col-lg-10 content-wrapper">
      <DentistProfileView :user_details="user_details" />
    </div>
  </div>
</template>

<script>
// import UpdateDentistProfile from "./edit/updateDentistProfile.vue";
import DentistProfileView from './displayDentistProfile';

export default {
  name: 'Dentist',
  components: {
    // UpdateDentistProfile,
    DentistProfileView,
  },
  data() {
    return {
      user: {},
      isEditProfile: false,
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
  computed: {
    posts() {
      return this.$store.state.profile.posts;
    },
  },
  mounted() {
    // console.log(this.$store.state.profile.posts);
    this.$store.dispatch('profile/loadUser');
  },
  props: ['user_details'],
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
