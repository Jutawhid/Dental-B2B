<template>
  <div>
    <!-- Container Fluid-->
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="content-wrapper">
        <div class="row">
          <div class="col-lg-4 my-1">
            <h1 class="text-bold-700 mb-0 headerTXT">Verify Email</h1>
          </div>
          <div class="col-lg-4 col-sm-12 text-right">
            <router-link :to="'/email-change-request'">
              <button type="submit" class="backBtn">
                <i class="feather icon-arrow-left"></i>
                Back
              </button>
            </router-link>
          </div>
          <div class="col-lg-8">
            <hr />
          </div>
        </div>
        <div class="col-lg-8 px-lg-0 py-1">
          <!--  Section -->
          <div class="card">
            <div class="card-body text-center">
              <p class="col-lg-8">
                We're sending you an OTP because you requested email change.
                Please input the OTP.
              </p>
              <h3 class="otpTxt">OTP Verification</h3>
              <form @submit.prevent="submitOTP" :validation-schema="schema">
                <div class="form-group">
                  <div class="otp-input-wrapper">
                    <input
                      v-model="otp"
                      type="text"
                      maxlength="6"
                      pattern="[0-9]*"
                      autocomplete="off"
                    />
                    <svg viewBox="0 0 400 1" xmlns="http://www.w3.org/2000/svg">
                      <line
                        x1="0"
                        y1="0"
                        x2="400"
                        y2="0"
                        stroke="#3e3e3e"
                        stroke-width="3"
                        stroke-dasharray="44,22"
                      />
                    </svg>
                  </div>
                </div>

                <button class="sendBtn" type="submit">
                  <i class="fa fa-paper-plane"></i>
                  Submit
                </button>
              </form>
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
import profileService from '../../../services/profile.service';
import userAPI from '../../../services/user.API';

export default {
  name: 'emailChangeRequest',

  components: {},

  data() {
    return {
      otp: '',
      user_id: '',
    };
  },

  methods: {
    submitOTP() {
      // console.log(this.otp);
      if (this.otp) {
        let data = {
          otp: this.otp,
        };
        userAPI.verifyEmail(data).then(
          res => {
            if (res.data.success == true) {
              this.$router.push('/profile/user');
              createToast(res.data.message, {
                position: 'top-right',
                type: 'success',
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

    onChange(event) {
      if (event.target.value.length === 1) {
        const nextElement =
          this.$refs?.[`input-${Number(event.target.dataset.index) + 1}`];
        if (nextElement) nextElement.focus();
      }
    },
  },
  mounted() {
    // get user id
    profileService.getUser().then(res => {
      if (res.id) {
        this.user_id = res.user_id;
      }
    });
  },
};
</script>


<style scoped>
.otp-input-wrapper {
  width: 240px;
  text-align: left;
  display: inline-block;
}
.otp-input-wrapper input {
  padding: 0;
  /* width: 264px; */
  font-size: 30px;
  font-weight: 600;
  color: #3e3e3e;
  background-color: transparent;
  border: 0;
  margin-left: 4px;
  letter-spacing: 23px;
  font-family: sans-serif !important;
}
.otp-input-wrapper input:focus {
  box-shadow: none;
  outline: none;
}
.otp-input-wrapper svg {
  position: relative;
  display: block;
  width: 235px;
  height: 2px;
}

.sendBtn {
  background: #00e2f2;
  border: 1px solid #00e2f2;
  border-radius: 41px;
  padding: 10px 20px;
  min-width: 200px;
  margin-top: 20px;
}
p {
  color: #1a1919;
  font-size: 18px;
  margin: 20px auto;
}
.otpTxt {
  text-align: center;
  font-size: 23px;
  font-weight: 400;
  letter-spacing: 0px;
  color: #123c3d;
  margin: 30px auto 40px;
}
input {
  border-radius: 10px;
  color: #123c3d;
  text-shadow: 0px 3px 6px #00000029;
  font-size: 24px;
}
/* input {
  text-align: center;
} */
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
.update__btn {
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
}
.backBtn {
  padding: 10px 20px;
  background: #ffffff;
  border: 1px solid #008b9c;
  color: #123c3d;
  box-shadow: none;
  border-radius: 5px;
  text-align: center;
  font-size: 15px;
  font-family: poppins;
  opacity: 1;
}
.backBtn:hover {
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
