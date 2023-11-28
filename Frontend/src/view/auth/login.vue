<template>
  <div v-if="!this.loggedIn" class="auth-page">
    <div class="app-content content blank-page">
      <div class="content-wrapper">
        <div class="container">
          <div class="row flexbox-container">
            <div class="col-lg-6 d-lg-block">
              <img
                class="img-fluid thum-img"
                src="../../assets/images/pages/login.png"
                alt="branding logo"
              />
            </div>
            <div class="col-lg-6 col-12 login-form">
              <img
                class="img-fluid"
                src="../../assets/images/logo/easifi_dark_logo.png"
              />
              <div class="title">Sign In</div>

              <Form @submit="handleLogin" :validation-schema="schema">
                <div class="form-group">
                  <fieldset
                    class="form-label-group form-group position-relative has-icon-left"
                  >
                    <Field
                      name="username"
                      type="text"
                      class="form-control"
                      placeholder="Username"
                      id="username"
                    />
                    <ErrorMessage name="username" class="error-feedback" />
                    <div class="form-control-position">
                      <i class="feather icon-user"></i>
                    </div>
                  </fieldset>
                </div>
                <div class="form-group">
                  <!--<label for="password">Password</label>
                                    <Field name="password" type="password" class="form-control"
                                           id="password"/>
                                    <ErrorMessage name="password" class="error-feedback"/>-->

                  <fieldset
                    class="form-label-group form-group position-relative has-icon-left"
                  >
                    <Field
                      name="password"
                      type="password"
                      class="form-control"
                      placeholder="Password"
                      id="password"
                    />
                    <ErrorMessage name="password" class="error-feedback" />
                    <div class="form-control-position">
                      <i class="feather icon-lock"></i>
                    </div>
                  </fieldset>
                </div>

                <div
                  class="form-group mb-0 cup-padding"
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
                  ></vue-recaptcha>
                  <small v-if="captchaAlert">Captcha Check required</small>
                </div>

                <div class="row">
                  <div class="col-12 mb-1">
                    <div class="forget-text">
                      <router-link to="/forgot" class="card-link"
                        >Forgot Password?
                      </router-link>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <button class="btn btn-block" :disabled="loading">
                    <div v-show="loading">
                      <div class="sp sp-wave"></div>
                    </div>
                    <span>Sign in</span>
                  </button>
                </div>

                <div class="form-group">
                  <div
                    v-if="message"
                    class="alert alert-danger alert-dismissible fade show"
                    role="alert"
                  >
                    <strong class="err">{{ message }}</strong>
                  </div>
                </div>
              </Form>

              <div class="login-footer">
                <div class="divider">
                  <div class="divider-text">New to Easifi?</div>
                </div>
                <div class="footer-btn text-center">
                  <router-link to="/register" class="font-weight-bolder">
                    Create an account
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="javascript">
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import profileService from '../../services/profile.service';
import { VueRecaptcha } from 'vue-recaptcha';

export default {
  name: 'login',
  components: {
    Form,
    Field,
    ErrorMessage,
    VueRecaptcha,
  },
  data() {
    const schema = yup.object().shape({
      username: yup.string().required('Username is required!'),
      password: yup.string().required('Password is required!'),
    });

    return {
      loading: false,
      // loggedIn: this.$store.state.auth.status.loggedIn,
      message: '',
      schema,
      recaptcha: null,
      captchaAlert: false,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    // console.log(!(window.location.href.indexOf("login") > -1));
    if (this.loggedIn) {
      this.$router.push('/explore');
      profileService
        .getUser()
        .then(res => {
          console.log(res.role.role_id);
          let role = res.role.role_id;
          if (role === 1) {
            this.$router.push('/cpanel/users');
          } else if (role === 2) {
            this.$router.push('/cpanel/users');
          } else {
            this.$router.push('/explore');
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
    // console.log(this.recaptcha);
  },
  methods: {
    verifyMethod(response) {
      // when you need a reCAPTCHA challenge
      this.recaptcha = response;
      // console.log(response);
    },
    handleLogin(user) {
      // console.log(user);
      // if(this.recaptcha === null){
      //   this.captchaAlert = true;
      // // } else if (this.schema && this.recaptcha !== null) {
      //   } else
      if (this.schema) {
        // if (this.schema) {
        this.loading = true;
        this.$store
          .dispatch('auth/login', user)
          .then(
            () => {
              this.loading = false;
              user = this.$store.state.auth.user;
              this.$store.dispatch('profile/loadUser');
              this.$store.dispatch('notification/notiList');

              profileService.getUser().then(res => {
                console.log(res.role.role_id);
                let role = res.role.role_id;
                if (role === 1) {
                  console.log('super admin');
                  this.$router.push({ name: 'UserCpanel' });
                } else if (role === 2) {
                  console.log('admin');
                  this.$router.push({ name: 'UserCpanel' });
                } else {
                  console.log('user');
                  this.$router.push({ name: 'ExplorePage' });
                }
                location.reload()
              });
            },
            error => {
              this.loading = false;
              this.message =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
              // console.log(error.response.data.code);
              this.$moshaToast('Login Failed', {
                position: 'top-right',
                type: 'danger',
                transition: 'bounce',
                showIcon: 'true',
              });
            },
          )
          .catch(error => {
            this.loading = false;
            this.message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            // console.log(error.response.data.code);
            this.$moshaToast(this.message, {
              position: 'top-right',
              type: 'danger',
              transition: 'bounce',
              showIcon: 'true',
            });
          });
      }
    },
  },
};
</script>

<style type="text/css" scoped>
.bg-authentication .card {
  border: none !important;
}

.auth-page .flexbox-container {
  margin: auto 15%;
}

.auth-page .col-lg-6 {
  padding: 30px;
}
/*
.auth-page .login-form {
} */

.auth-page .title {
  padding: 40px 0 10px;
}

.auth-page form input {
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
}

.auth-page form input:focus {
  border: 2px solid #00e2f2;
  box-shadow: none;
}

.auth-page .login-form input[type='checkbox'] {
  width: 23px;
  height: 23px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
}

.auth-page .login-form > img {
  width: 40%;
}

.auth-page .login-form button {
  width: 100%;
  height: 50px;
  background-color: #00e2f2;
  border-color: #00e2f2;
  border-radius: 10px;
  font-weight: 500;
}

.auth-page .login-form .footer-btn a {
  font-size: 16px;
  font-weight: 600;
  color: #123c3d;
  text-decoration: none;
}

.vs-checkbox-con .vs-checkbox {
  border-radius: 5px;
}

.forget-text {
  text-align: right;
}

.forget-text a {
  font-size: 13px;
  color: #000000;
  text-decoration: none;
  line-height: 2;
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
  border: 1px #000 solid;
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
.blank-page .content-wrapper .flexbox-container {
  height: calc(1vh * 80);
  /* height: 100%; */
  margin: auto 10%;
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

@media screen and (max-width: 768px) {
  .forget-text a {
    font-size: 10px;
  }
  .mx_recaptcha_failed > div {
    margin-left: 0px !important;
  }
  .mx_recaptcha_failed small {
    float: left;
    margin: auto;
    font-size: 10px;
  }
  .auth-page .col-lg-6 {
    padding: 15px;
  }

  .auth-page .flexbox-container {
    margin: auto;
  }

  .auth-page .thum-img {
    padding: 0 30%;
  }
  .rc-anchor-normal .rc-anchor-pt {
    margin: 2px 11px 0 0;
    padding-right: 2px;
    position: relative;
    left: 0;
    text-align: right;
    width: 85px;
  }

  .blank-page .content-wrapper .flexbox-container {
    /*height: calc(1vh * 80);*/
    height: 100%;
    margin: 10% 5%;
  }

  .login-form {
    text-align: center;
  }

  .auth-page .title {
    padding: 20px 0 10px;
  }
  html body .app-content {
    padding-top: 0px !important;
  }
}
strong.err {
  font-weight: 500;
}
</style>
