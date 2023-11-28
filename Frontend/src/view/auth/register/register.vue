<template>
  <div>
    <div class="blank-page auth-page">
      <div class="content-wrapper">
        <div class="content-header row"></div>
        <div class="content-body">
          <section class="row signup-header">
            <div class="col-xl-6">
              <section class="row">
                <div class="col-xl-12">
                  <h3 class="primary text-bold-700">Register</h3>
                </div>
              </section>
            </div>
          </section>
          <section class="row flexbox-container">
            <div class="col-xl-6 signup-form">
              <div class="card">
                <div class="card-body pt-0">
                  <Form
                    class="user"
                    @submit="handleRegister"
                    :validation-schema="schema"
                  >
                    <div class="form-body" v-if="!successful">
                      <div class="row">
                        <div class="col-12">
                          <div class="form-group mb-0">
                            <label>Select Case Role</label>
                          </div>
                        </div>
                        <div class="col-12">
                          <div class="radio-tabs-wrapper">
                            <Field
                              type="radio"
                              class="radio-tab"
                              :class="role_id === 3 ? 'active' : ''"
                              name="role_id"
                              value="3"
                              v-model="role_id"
                              @change="onChange($event)"
                              id="dentist"
                            />
                            <label for="dentist" class="first-child"
                              >Dentist</label
                            >

                            <Field
                              type="radio"
                              class="radio-tab"
                              name="role_id"
                              value="5"
                              v-model="role_id"
                              @change="onChange($event)"
                              id="lab"
                            />
                            <label for="lab">Lab</label>

                            <Field
                              type="radio"
                              class="radio-tab"
                              name="role_id"
                              value="6"
                              v-model="role_id"
                              @change="onChange($event)"
                              id="tech"
                            />
                            <label for="tech">Tech Company</label>
                            <Field
                              type="radio"
                              class="radio-tab"
                              name="role_id"
                              value="4"
                              v-model="role_id"
                              @change="onChange($event)"
                              id="consultant"
                            />
                            <label for="consultant">Consultant</label>
                          </div>
                        </div>

                        <div class="col-lg-12">
                          <!-- Email -->
                          <div class="form-group">
                            <label for="email"
                              >E-mail <span class="required">*</span></label
                            >
                            <div class="position-relative has-icon-left">
                              <Field
                                name="email"
                                id="email"
                                type="text"
                                class="form-control"
                                placeholder="e.g: example@something.com"
                                required
                              />
                              <ErrorMessage
                                name="email"
                                class="error-feedback"
                              />

                              <div class="form-control-position">
                                <i class="feather icon-mail"></i>
                              </div>
                            </div>
                          </div>
                          <div
                            class="form-group cupreg-padding"
                            :class="{ mx_recaptcha_failed: !recaptcha }"
                          >
                            <vue-recaptcha
                              ref="recaptcha"
                              sitekey="6LdBUV4eAAAAAEtCsJhFG9HVwk5bamJBhCRM9_-M"
                              @verify="verifyMethod"
                              style="
                                transform: scale(0.9);
                                -webkit-transform: scale(0.9);
                                transform-origin: 0 0;
                                -webkit-transform-origin: 0 0;
                              "
                              class="recaptcha-box"
                            ></vue-recaptcha>
                            <small v-if="captchaAlert"
                              >Captcha Check required</small
                            >
                          </div>
                        </div>
                        <div class="col-12">
                          <button
                            class="btn btn-primary float-left btn-inline my-50 w-100"
                            :disabled="loading"
                          >
                            <div v-show="loading">
                              <div class="sp sp-wave"></div>
                            </div>
                            Submit
                          </button>
                        </div>
                        <div class="col-lg-12">
                          <div
                            v-if="message"
                            class="alert mt-1"
                            :class="
                              successful ? 'alert-success' : 'alert-danger'
                            "
                          >
                            {{ message }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
              <div class="d-flex justify-content-center">
                <div class="txt-bdr"></div>
                <div class="btm-txt">Already Have an Account ?</div>
                <div class="txt-bdr"></div>
              </div>
              <router-link to="/login" class="sinBtnRegis">
                Sign In
              </router-link>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="javascript">
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { VueRecaptcha } from 'vue-recaptcha';
import profileService from '../../../services/profile.service';

export default {
  name: 'Register',
  components: {
    Form,
    Field,
    ErrorMessage,
    VueRecaptcha,
  },
  data() {
    const schema = yup.object().shape({
      email: yup
        .string()
        .required('Email is required!')
        .email('Email is invalid!')
        .max(50, 'Must be maximum 50 characters!'),
    });

    return {
      successful: false,
      loading: false,
      message: '',
      schema,
      role_id: 3,
      recaptcha: null,
      captchaAlert: false,
    };
  },
  created() {
    // console.log(!(window.location.href.indexOf("login") > -1));
    if (this.loggedIn) {
      profileService.getUser().then(res => {
        console.log(res.role.role_id);
        let role = res.role.role_id;
        if (role === 1) {
          this.$router.push('/cpanel/users');
        } else if (role === 2) {
          this.$router.push('/cpanel/users');
        } else {
          this.$router.push('/explore');
        }
      });
    }
    // console.log(this.recaptcha);
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  mounted() {
    if (this.schema && this.loggedIn) {
      this.$router.push('/explore');
    }
    // console.log(this.role_id);
  },
  methods: {
    verifyMethod(response) {
      this.recaptcha = response;
      // console.log(response);
    },
    handleRegister(user) {
      if (this.recaptcha === null) {
        this.captchaAlert = true;
      } else if (this.schema && this.recaptcha !== null) {
        // } else if (this.schema && this.recaptcha) {
        this.message = '';
        this.successful = false;
        this.loading = true;

        // console.log(user);

        this.$store.dispatch('auth/register', user).then(
          data => {
            console.log(data);
            this.message = data.message;
            this.loading = false;
            if (data.status === 201) {
              this.successful = true;
              this.$router.push('/sendmail');
            } else {
              this.$moshaToast(this.message, {
                position: 'top-right',
                type: 'danger',
                transition: 'bounce',
                showIcon: 'true',
                timeout: 3000,
              });
            }
          },
          error => {
            this.message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            this.successful = false;
            this.loading = false;
          },
        );
      }
    },
    onChange(event) {
      this.role_id = event.target.value;
      console.log(this.role_id);
    },
  },
};
</script>

<style type="text/css" scoped>
.radio-tabs-wrapper > .active + .first-child {
  border-radius: 10px 0 0 10px;
  background-color: #123c3d;
  /* border-color: #428bca; */
  color: #00e2f2;
}
textarea.form-control {
  min-height: calc(9em);
}

.has-icon-left .form-control {
  border-radius: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  top: 5px;
}

.signup-form button.btn-primary {
  padding: 20px;
  border-radius: 10px;
}

.form-control:focus {
  box-shadow: none;
  border: 2px solid #00e2f2;
}

.form-group label {
  margin-bottom: 10px;
  padding-left: 0.2rem;
  font-weight: 600;
  font-size: 12px;
}

.form-control:focus ~ .form-control-position i {
  color: #00e2f2;
}

.hints {
  font-size: 0.7rem;
  color: #707070;
}

.bg-authentication .card {
  border: none !important;
}

.signup-header {
  height: 200px;
  display: flex;
  justify-content: center;
  background-color: #00e2f2;
  padding: 50px 0px 10px 0px;
}

.signup-header span {
  color: #000000;
  opacity: 0.5;
  font-size: 12px;
}

.signup-header a {
  color: #123c3d;
  text-decoration: none;
  font-size: 16px;
  font-weight: 700;
}

.auth-page .signup-form {
  position: absolute;
  top: 90px;
  /*display: flex;
  justify-content: center;*/
}

.auth-page .signup-form .card {
  border-radius: 20px;
  padding: 50px 20px 20px;
}

/* Radio Tab*/

.radio-tabs-wrapper {
  clear: both;
  display: inline-block;
  width: 100%;
  /*padding: 0 10px;*/
  position: relative;
  margin-bottom: 20px;
}

input[type='radio'].radio-tab {
  position: absolute;
  left: -99999em;
  top: -99999em;
}

input.radio-tab + label {
  cursor: pointer;
  float: left;
  border: 1px solid #123c3d80;
  background-color: #fff;
  margin-right: -1px;
  padding: 15px 10px;
  position: relative;
  width: 25%;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
}

input.radio-tab + label:hover {
  background-color: #eee;
}

input.radio-tab:checked + label {
  background-color: #123c3d;
  /* border-color: #428bca; */
  color: #00e2f2;
}

.radio-tabs-wrapper label.first-child {
  border-radius: 10px 0 0 10px;
}

.radio-tabs-wrapper label:last-child {
  border-radius: 0px 10px 10px 0px;
}

.sign-in > div {
  text-align: right;
  margin-right: 15px;
}

.row {
  margin: 0;
}

.sp {
  width: 20px;
  height: 20px;
  clear: both;
  margin: 0px auto;
  margin-left: 20px;
}

/* Spinner Wave */
.sp-wave {
  border-radius: 50%;
  position: absolute;
  opacity: 1;
}

.sp-wave:before,
.sp-wave:after {
  content: '';
  border: 1px #fff solid;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0px;
}

.sp-wave:before {
  transform: scale(1, 1);
  opacity: 1;
  -webkit-animation: spWaveBe 0.6s infinite linear;
  animation: spWaveBe 0.6s infinite linear;
}

.sp-wave:after {
  transform: scale(0, 0);
  opacity: 0;
  -webkit-animation: spWaveAf 0.6s infinite linear;
  animation: spWaveAf 0.6s infinite linear;
}

.txt-bdr {
  width: 20%;
  background-color: #333;
  height: 1px;
  margin: 8px 0;
  opacity: 0.2;
}
.btm-txt {
  margin: 0 15px;
  font-size: 11px;
}
.sinBtnRegis {
  text-align: center;
  margin: auto;
  display: flex;
  justify-content: center;
  background-color: #ffd700;
  width: 100px;
  padding: 10px 20px;
  margin-top: 20px;
  border-radius: 10px;
}

.mx_recaptcha_failed small {
  display: flex;
  color: red;
  margin: 0 30px;
  justify-content: center;
}

@-webkit-keyframes spWaveAf {
  from {
    -webkit-transform: scale(0.5, 0.5);
    opacity: 0;
  }
  to {
    -webkit-transform: scale(1, 1);
    opacity: 1;
  }
}

@keyframes spWaveAf {
  from {
    transform: scale(0.5, 0.5);
    opacity: 0;
  }
  to {
    transform: scale(1, 1);
    opacity: 1;
  }
}

@-webkit-keyframes spWaveBe {
  from {
    -webkit-transform: scale(1, 1);
    opacity: 1;
  }
  to {
    -webkit-transform: scale(1.5, 1.5);
    opacity: 0;
  }
}

@keyframes spWaveBe {
  from {
    -webkit-transform: scale(1, 1);
    opacity: 1;
  }
  to {
    -webkit-transform: scale(1.5, 1.5);
    opacity: 0;
  }
}
/* .mx_recaptcha_failed {
  margin: auto;
  padding: 0 30%;
} */

@media screen and (max-width: 768px) {
  .card-body {
    padding: 0;
  }
  .auth-page .signup-form .card {
    border-radius: 0px;
    padding: 20px 0px;
  }

  .signup-header {
    padding: 20px 0px 10px 0px;
  }

  .signup-header a {
    font-size: 14px;
  }

  .signup-header h4 {
    text-align: center;
  }

  .sign-in {
    margin-top: 20px;
  }

  input.radio-tab + label {
    padding: 5px 0px;
    /* min-width: 20%; */
    min-height: 55px;
    /* font-size: 12px; */
    justify-content: center;
    align-items: center;
    display: flex;
  }
  /* .mx_recaptcha_failed {
    margin: auto;
    padding: 0 10%;
  } */
  .blank-page .content-wrapper .flexbox-container {
   
    height: 65vh;
}
}

input.radio-tab.active + label {
  background-color: #123c3d;
  /* border-color: #428bca; */
  color: #00e2f2;
}
</style>
