<template>
  <div>
    <!-- Container Fluid-->

    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="col-lg-8 content-wrapper">
        <div class="row">
          <div class="col-lg-6 col-sm-12">
            <h1 class="text-bold-700 mb-0 headerTXT">Change Password</h1>
          </div>
          <div
            class="col-lg-6 col-sm-12 d-flex justify-content-lg-end justify-content-center align-items-center"
          >
            <router-link to="/security" tag="button">
              <button
                type="submit"
                class="backBtn2 clrRed"
                @click="backToProfile"
              >
                <i class="feather icon-arrow-left"></i>
                Back
              </button>
            </router-link>
            <!-- <a href="#"> -->
            <button type="submit" class="update__btn" form="submitForm">
              <i class="fa fa-save"></i>
              Save Changes
            </button>
            <!-- </a> -->
          </div>
          <div class="col-12">
            <hr />
          </div>
        </div>
        <div class="row">
          <!-- <div class="col-sm-12 col-lg-4">
            <div class="mt-5 avatar-upload">
              <div class="avatar-preview">
                <div
                  v-if="this.imgPath"
                  id="imagePreview"
                  :style="{
                    backgroundImage: 'url(' + this.imgPath + ')',
                  }"
                  alt="photo"
                ></div>
              </div>
            </div>
          </div> -->
          <div class="col-sm-12 col-lg-12">
            <!-- 1st Section -->
            <div class="card">
              <div class="card-body">
                <Form
                  @submit="onSubmit"
                  :validation-schema="schema"
                  id="submitForm"
                >
                  <TextInput
                    name="old_password"
                    type="password"
                    label="Current Password"
                    placeholder="Your Current Password"
                  />
                  <TextInput
                    name="password"
                    type="password"
                    label="New Password"
                    placeholder="Your New Password"
                    success-message="Nice and secure!"
                  />
                  <TextInput
                    name="new_password"
                    type="password"
                    label="Confirm Password"
                    placeholder="Confirm your Password"
                    success-message="Glad you remembered it!"
                  />

                  <!-- <button class="text-right update__btn" type="submit">
                    Submit
                  </button> -->
                </Form>
              </div>
            </div>
            <!-- End Section -->
          </div>
        </div>
      </div>
    </div>

    <!---Container Fluid-->
  </div>
</template>

<script>
import { Form } from 'vee-validate';
import * as Yup from 'yup';
import TextInput from './textInput.vue';
import userAPI from '../../../services/user.API';
// import axios from "axios";
import { createToast } from 'mosha-vue-toastify';
import defaultImg from '../../../assets/images/portrait/pp.jpg';

export default {
  name: 'EditDentistProfile',
  components: {
    TextInput,
    Form,
  },
  mounted() {
    userAPI.getUserProfile().then(res => {
      console.log(res);
      this.imgPath =
        res.data.data.imageFolderPath + '/' + res.data.data.profile_image;
    });
  },
  setup() {
    function onSubmit(values) {
      userAPI.changeUserPassword(values).then(
        res => {
          console.log(res.data);
          if (res.data.success) {
            localStorage.removeItem('user');
            location.reload();
            createToast(res.data.message, {
              position: 'top-right',
              type: 'success',
              transition: 'bounce',
              showIcon: 'true',
              timeout: 2000,
            });
          } else {
            createToast(res.data.message, {
              position: 'top-right',
              type: 'danger',
              transition: 'bounce',
              showIcon: 'true',
              timeout: 2000,
            });
          }
        },
        error => {
          console.log(error.response.data.success);
          if (error.response.data.success == false) {
            createToast(error.response.data.message, {
              position: 'top-right',
              type: 'danger',
              transition: 'bounce',
              showIcon: 'true',
              timeout: 2000,
            });
          }
        },
      );
    }
    // generate a validation schema
    const schema = Yup.object().shape({
      old_password: Yup.string()
        .min(6, 'Should be at least 6 characters')
        .required('Current password is not valid'),
      password: Yup.string()
        .min(10, 'should be at least 10 characters')
        .matches(
          /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{5,}$/,
          'must contain at least 1 lowercase & uppercase letter, 2 digits and 1 special character',
        )
        .required('Password is required'),
      new_password: Yup.string()
        .min(10, 'should be at least 10 characters')
        .required('Password is required')
        .oneOf([Yup.ref('password')], 'Passwords do not match'),
    });

    return {
      onSubmit,
      schema,
    };
  },
  data() {
    return {
      imgPath: '',
      // BASE_IMG: "https://api.easifi.co/storage/app/",src\assets\images\portrait\pp.jpg
      defaultImg: defaultImg,
    };
  },
};
</script>

<style scoped>
/* .form-control {
  height: calc(2.25em + 1.4rem + 1px) !important;
} */
.dentist p {
  margin-top: 3px;
  margin-left: 3px;
  font-size: 15px;
  font: normal normal bold 15px/30px Poppins;
  letter-spacing: 0px;
  color: #000000;
}
.dentist h6 {
  font-size: 12px !important;
  font: normal normal small 10px/15px Poppins;
  color: #707070;
}
@media only screen and (max-width: 2100px) and (min-width: 1650px) {
  .avatar-upload .avatar-edit input + label {
    display: inline-block;
    width: 34px;
    height: 34px;
    margin-bottom: 0;
    margin-top: -5px;
    border-radius: 100%;
    background: #123c3d;
    border: 1px solid transparent;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
    cursor: pointer;
    font-weight: normal;
    transition: all 0.2s ease-in-out;
  }
  .avatar-upload .avatar-edit input + label:after {
    content: '\F030';
    font-family: 'FontAwesome';
    color: #fff;
    position: absolute;
    top: 5px;
    left: 0;
    right: 0;
    text-align: center;
    margin: auto;
  }
  .avatar-upload .avatar-edit {
    position: absolute;
    right: -5px;
    z-index: 1;
    top: 25px;
  }
}
@media only screen and (max-width: 1649px) and (min-width: 768px) {
  .avatar-upload .avatar-edit input + label {
    display: inline-block;
    width: 35px;
    height: 35px;
    margin-bottom: 0;
    margin-top: -5px;
    border-radius: 100%;
    background: #123c3d;
    border: 1px solid transparent;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
    cursor: pointer;
    font-weight: normal;
    transition: all 0.2s ease-in-out;
  }
  .avatar-upload .avatar-edit input + label:after {
    content: '\F030';
    font-family: 'FontAwesome';
    color: #fff;
    position: absolute;
    top: 5px;
    left: 0;
    right: 0;
    text-align: center;
    margin: auto;
  }
  .avatar-upload .avatar-edit {
    position: absolute;
    right: -5px;
    z-index: 1;
    top: 30px;
  }
}

.avatar-upload {
  position: relative;
  max-width: 200px;
  margin: 10px auto;
  margin-top: 30px;
}

.avatar-upload .avatar-edit input {
  display: none;
}
.avatar-upload .avatar-preview {
  width: 192px;
  height: 192px;
  position: relative;
  border-radius: 20px;
  border: 0px solid #ececec;
  box-shadow: 0px 2px 10px 3px rgb(0 0 0 / 10%);
}

.avatar-upload .avatar-preview > div {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.update__btn {
  margin-left: 5px;
  background: #123c3d;
  box-shadow: none;
  border-radius: 5px;
  padding: 10px 20px;
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
.backBtn2 {
  padding: 10px 20px;
  background: #ffffff;
  border: 1px solid #008b9c;
  color: #123c3d;
  box-shadow: none;
  border-radius: 5px;
  text-align: center;
  font-size: 12px;
  font-family: poppins;
  opacity: 1;
}
.backBtn2:hover {
  background: #ffcc3f;
  color: #123c3d;
  border: 1px solid #ffcc3f;
}
.update__btn:hover {
  background: #ffcc3f;
  color: #123c3d;
  border: 1px solid #ffcc3f;
}
.inputFocus {
  font-size: 15px;
  font: normal normal bold 15px/30px Poppins;
  color: #000000;
  border: none;
  margin-top: 20px;
  font-size: 16px;
  display: block;
  box-sizing: border-box;
  width: 100%;
  bottom: 0px;
}
.inputFocus {
  margin-left: 10px;
  position: relative;
  border: 1px solid #bcbaba;
  height: 40px;
  padding-left: 12px;
  margin-top: 10px;
}
.inputFocus:focus {
  height: 50px !important;
  outline: none;
}
/* .card {
  padding: 20px;
} */
/* .card-body {
  padding: 20px;
} */
@media only screen and (max-width: 565px) {
  .headerTXT {
    text-align: center;
    margin: 30px !important;
  }
}

* {
  box-sizing: border-box;
}

:root {
  --primary-color: #0071fe;
  --error-color: #f23648;
  --error-bg-color: #fddfe2;
  --success-color: #21a67a;
  --success-bg-color: #e0eee4;
}

html,
body {
  width: 100%;
  height: 100%;
}

#EditDentistProfile {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;

  width: 100%;
  height: 100%;
}

form {
  /* width: 300px; */
  margin: 0px auto;
  /* padding-bottom: 60px; */
}

.submit-btn {
  background: var(--primary-color);
  outline: none;
  border: none;
  color: #fff;
  font-size: 18px;
  padding: 10px 15px;
  display: block;
  width: 100%;
  border-radius: 7px;
  margin-top: 40px;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
}

.submit-btn:hover {
  transform: scale(1.1);
}
.text-right {
  float: right;
}
p.help-message {
  color: red !important;
}
</style>
