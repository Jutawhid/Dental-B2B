<template>
  <div>
    <!-- Container Fluid-->
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="content-wrapper">
        <div class="row">
          <div class="col-lg-4 my-lg-1">
            <h1 class="text-bold-700 mb-0 headerTXT">Change Email</h1>
          </div>
          <div
            class="col-lg-4 col-sm-12 d-flex justify-content-lg-end justify-content-center align-items-center"
          >
            <router-link :to="{ name: 'SecurityList' }">
              <button type="submit" class="backBtn2">
                <i class="feather icon-arrow-left"></i>
                Back
              </button>
            </router-link>
            <!-- <a href="#"> -->
            <button type="submit" class="ml-1 update__btn" form="submitForm">
              <i class="fa fa-save"></i>
              Save Changes
            </button>
            <!-- </a> -->
          </div>
          <div class="col-lg-8">
            <hr />
          </div>
        </div>
        <div class="col-lg-8 px-lg-0 py-1">
          <!-- <p>You can edit service type here.</p> -->
          <!--  Section -->
          <div class="card">
            <div class="card-body">
              <Form
                @submit="onSubmit"
                :validation-schema="schema"
                id="submitForm"
              >
                <div class="col-lg-6">
                  <div class="form-group">
                    <label for="state"
                      >Current Email<span class="required-input">*</span></label
                    >
                    <Field
                      id="current_email"
                      name="current_email"
                      type="email"
                      class="form-control"
                      placeholder="e.g.: jane.doe@easifi.co"
                      v-model="userData.current_email"
                      required
                    />
                    <ErrorMessage name="current_email" class="error-feedback" />
                  </div>
                </div>

                <div class="col-lg-6">
                  <div class="form-group">
                    <label for="state"
                      >New Email<span class="required-input">*</span></label
                    >
                    <Field
                      id="new_email"
                      name="new_email"
                      type="email"
                      class="form-control"
                      placeholder="e.g.: john.doe@easifi.co"
                      v-model="userData.new_email"
                      required
                    />
                    <ErrorMessage name="new_email" class="error-feedback" />
                  </div>
                </div>

                <div class="col-lg-6">
                  <div class="form-group">
                    <label for="state"
                      >Password <span class="required-input">*</span></label
                    >
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      class="form-control"
                      placeholder="e.g.: xxxxxxxx"
                      v-model="userData.password"
                      required
                    />
                    <ErrorMessage name="password" class="error-feedback" />
                  </div>
                </div>
              </Form>
            </div>
          </div>
          <!-- End Section -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createToast } from 'mosha-vue-toastify';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as Yup from 'yup';
import userAPI from '../../../services/user.API';
import profileService from '../../../services/profile.service';

export default {
  name: 'emailChangeRequest',

  components: {
    Form,
    Field,
    ErrorMessage,
  },

  data() {
    // generate a validation schema
    const schema = Yup.object().shape({
      current_email: Yup.string()
        .email('Invalid email')
        .required('Required field'),
      new_email: Yup.string().email('Invalid email').required('Required field'),
      password: Yup.string()
        .min(10, 'should be at least 10 characters')
        .matches(
          /^(?=(.*[a-z]){3,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
          'At lease 1 uppercase letter,3 lowercase letter, 1 Special Character required',
        )
        .required('Required field'),
    });

    return {
      schema,
      userData: {
        id: '',
        current_email: '',
        new_email: '',
        password: '',
        role: [],
      },
    };
  },

  methods: {
    onSubmit(values) {
      console.log(values);
      let userID = this.userData.id;
      //   console.log(userData);
      let userData = {
        current_email: values.current_email,
        new_email: values.new_email,
        password: values.password,
        id: userID,
      };
      console.log(userID);
      if (userData) {
        userAPI.emailChangeRequest(userData).then(
          res => {
            if (res.data.success == true) {
              // redirect
              this.$router.push('/email-verify-request');

              // show success alert
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
    },

    updateRole(value) {
      this.selected_role = value;
      console.log(this.example9);
    },
  },
  mounted() {
    // get user id
    profileService.getUser().then(res => {
      if (res.id) {
        this.userData.id = res.user_id;
      }
      if (res.role) {
        this.userData.role = res.role;
      }
    });
  },
};
</script>

<style scoped>
.form-group label {
  margin: 0 0 5px;
}
.has-icon-left .form-control {
  border-radius: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  top: 5px;
}
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
/* .update__btn {
  margin-left: 5px;
  background: #123c3d;
  box-shadow: none;
  border-radius: 5px;
  padding: 10px 20px;
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  font-family: poppins;
  letter-spacing: 0px;
  color: #ffffff;
  opacity: 1;
  border: 1px solid #123c3d;
  cursor: pointer;
} */
.update__btn {
  background: #123c3d;
  border: 1px solid #123c3d;
  color: #ffffff;
  box-shadow: none;
  border-radius: 5px;
  text-align: center;
  font-size: 15px;
  font-family: poppins;
  opacity: 1;
  padding: 7px 16px 10px 14px !important;
}
.backBtn2 {
  padding: 10px 20px;
  background: #ffffff;
  border: 1px solid #008b9c;
  color: #123c3d;
  box-shadow: none;
  border-radius: 5px;
  text-align: center;
  font-size: 13px;
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
.customAddress {
  margin-top: 20px;
}
</style>
