<template>
  <div class="auth-page">
    <div class="app-content content blank-page">
      <div class="content-wrapper">
        <div class="container">
          <div class="row flexbox-container">
            <div class="col-lg-6 d-lg-block">
              <img
                class="img-fluid thum-img"
                src="../../assets/images/pages/password.png"
                alt="branding logo"
              />
            </div>
            <div class="col-lg-6 col-12 login-form">
              <div v-if="!sendMail">
                <div class="forget-title">Forgot Password ?</div>
                <div class="sub-title">Please enter your registered e-mail</div>
                <div class="sub-sub-title">
                  We will send a link to your registered E-mail
                </div>

                <Form @submit="handleForgot" :validation-schema="schema">
                  <div class="form-group">
                    <fieldset
                      class="form-label-group form-group position-relative has-icon-left"
                    >
                      <Field
                        name="email"
                        type="text"
                        class="form-control"
                        placeholder="E-mail"
                        id="email"
                      />
                      <ErrorMessage name="email" class="error-feedback" />
                      <div class="form-control-position">
                        <i class="feather icon-mail"></i>
                      </div>
                    </fieldset>
                  </div>
                  <div
                    class="form-group"
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
                        margin: auto 30px;
                      "
                    ></vue-recaptcha>
                    <small v-if="captchaAlert">Captcha Check required</small>
                  </div>
                  <div class="form-group">
                    <button class="btn btn-block" @click="handleForgot">
                      <span>Next <i class="feather icon-arrow-right"></i></span>
                    </button>
                  </div>

                  <div class="form-group">
                    <div
                      v-if="message"
                      class="alert alert-danger alert-dismissible fade show"
                      role="alert"
                    >
                      <strong>{{ message }}</strong>
                    </div>
                  </div>
                </Form>

                <div class="login-footer">
                  <div class="divider">
                    <div class="divider-text">Back to Login?</div>
                  </div>
                  <div class="footer-btn text-center">
                    <router-link to="/login" class="font-weight-bolder">
                      <i class="feather icon-arrow-left"></i> Login
                    </router-link>
                  </div>
                </div>
              </div>
              <div class="sent-mail-text" v-if="sendMail">
                <!-- <router-link to="/recover/changePassword"> -->
                <span> A link has been sent to your registered E-mail </span>
                <!-- </router-link> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="javascript">
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import userAPI from "../../services/user.API";
import { createToast } from "mosha-vue-toastify";
import { VueRecaptcha } from "vue-recaptcha";

export default {
  name: "Forgot",
  components: {
    Form,
    Field,
    VueRecaptcha,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      email: yup.string().required("Email is required!"),
    });

    return {
      loading: false,
      message: "",
      schema,
      sendMail: false,
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
    if (this.loggedIn) {
      this.$router.push("/explore");
    }
  },
  methods: {
    verifyMethod(response) {
      // when you need a reCAPTCHA challenge
      this.recaptcha = response;
    },
    handleForgot(user) {
      console.log(user.email);
      if(this.recaptcha === null){
        this.captchaAlert = true;
      // } else if (this.schema && this.recaptcha !== null) {
        } else if (user.email && this.recaptcha) {
          this.captchaAlert = false;
        userAPI.requestResetPassword(user.email).then(
          (res) => {
            if (res.data.success == true) {
              this.sendMail = true;
            } else {
              createToast(res.data.message, {
                position: "top-right",
                type: "danger",
                transition: "bounce",
                showIcon: "true",
                timeout: 2000,
              });
              this.sendMail = false;
            }
          },
          (error) => {
            console.log(error.response.data.success);
            if (error.response.data.success == false) {
              createToast(error.response.data.message, {
                position: "top-right",
                type: "danger",
                transition: "bounce",
                showIcon: "true",
                timeout: 2000,
              });

              this.sendMail = false;
            }
          }
        );
      }
    },
  },
};
</script>

<style type="text/css" scoped>
html body .app-content {
  padding-top: 0px;
}
.bg-authentication .card {
  border: none !important;
}

.auth-page .flexbox-container {
  margin: auto 15% auto 0;
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
  font-weight: 800;
  color: #123c3d;
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

.forget-title {
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  font-size: 30px;
  color: #123c3d;
  margin-bottom: 50px;
}

.sub-title {
  font-weight: bold;
  font-size: 12px;
  color: #123c3d;
}
.sub-sub-title {
  font-size: 12px;
  color: #123c3d;
}
.sent-mail-text span {
  color: #123c3d;
  font-size: 25px;
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
  .content.app-content.blank-page {
    overflow: inherit;
    overflow-x: initial;
  }
  .auth-page .col-lg-6 {
    padding: 15px;
  }

  .auth-page .flexbox-container {
    margin: auto;
  }

  .auth-page .thum-img {
    padding: 0 25%;
  }

  .blank-page .content-wrapper .flexbox-container {
    height: calc(1vh * 80);
  }

  .login-form {
    text-align: center;
  }

  .auth-page .title {
    padding: 20px 0 10px;
  }
}
</style>
