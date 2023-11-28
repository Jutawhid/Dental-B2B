<template>
  <div>
    <div class="blank-page auth-page">
      <div class="content-wrapper">
        <div class="content-header row"></div>
        <div class="content-body">
          <section class="row signup-header">
            <div class="col-xl-6">
              <section class="row">
                <div class="col-xl-6"></div>
                <div class="col-xl-6 sign-in"></div>
              </section>
            </div>
          </section>
          <section class="row flexbox-container">
            <div class="col-xl-12 signup-form">
              <div class="card">
                <div class="card-body pt-0">
                  <Form
                    class="user"
                    @submit="handleRegister"
                    :validation-schema="schema"
                  >
                    <div class="form-body" v-if="!successful">
                      <div class="row">
                        <div class="col-lg-12 col-12 login-form">
                          <div v-if="!sendMail">
                            <div class="forget-title">Change Password</div>

                            <div class="sub-sub-title mb-3">
                              Hi <b>{{ this.userData.name }} </b>, please enter
                              a new password
                            </div>

                            <Form
                              @submit="handleForgot"
                              :validation-schema="schema"
                            >
                              <div class="form-group">
                                <label>New Password</label>
                                <fieldset
                                  class="form-label-group form-group position-relative has-icon-left"
                                >
                                  <Field
                                    name="new_password"
                                    type="password"
                                    class="form-control"
                                    placeholder="Enter Password"
                                    id="new_password"
                                  />
                                  <ErrorMessage
                                    name="new_password"
                                    class="error-feedback"
                                  />
                                  <div class="form-control-position">
                                    <i class="feather icon-lock"></i>
                                  </div>
                                </fieldset>
                              </div>

                              <div class="form-group">
                                <label>Confirm New Password</label>
                                <fieldset
                                  class="form-label-group form-group position-relative has-icon-left"
                                >
                                  <Field
                                    name="confirm_password"
                                    type="password"
                                    class="form-control"
                                    placeholder="Confirm Password"
                                    id="confirm_password"
                                  />
                                  <ErrorMessage
                                    name="confirm_password"
                                    class="error-feedback"
                                  />
                                  <div class="form-control-position">
                                    <i class="feather icon-lock"></i>
                                  </div>
                                </fieldset>
                              </div>

                              <div class="form-group">
                                <div class="form-group">
                                  <button
                                    class="changePass"
                                    @click="handleForgot"
                                  >
                                    <span>Change Password</span>
                                  </button>
                                </div>
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
                                <router-link
                                  to="/login"
                                  class="font-weight-bolder"
                                >
                                  <i class="feather icon-arrow-left"></i> Login
                                </router-link>
                              </div>
                            </div>
                          </div>
                          <!-- <div class="sent-mail-text" v-if="sendMail">
                            <router-link to="/recover/changePassword">
                              <span>
                                A link has been sent to your registered E-mail
                              </span>
                            </router-link>
                          </div> -->
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="javascript">
import { Form, Field, ErrorMessage } from "vee-validate";
import * as Yup from "yup";
import userAPI from "../../../services/user.API";
import { createToast } from "mosha-vue-toastify";
export default {
  name: "ConfirmResetPassword",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = Yup.object().shape({
      new_password: Yup.string()
        .min(8, "should be at least 8 characters")
        .required("required field"),
      confirm_password: Yup.string()
        .min(8, "should be at least 8 characters")
        .required("required field")
        .oneOf([Yup.ref("new_password")], "Passwords do not match"),
    });
    return {
      successful: false,
      loading: false,
      message: "",
      schema,
      token: this.$route.params.id,
      userData: [],
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/");
    }
    // },
    // // mounted() {},
    // created() {
    // Check token
    if (this.token) {
      userAPI.verifyResetPassword(this.token).then(
        // check if token is valid
        (res) => {
          console.log(res.data);
          if (res.data.data) {
            this.userData = res.data.data;
          }
          console.log(this.userData);
        },
        // check if token is not valid
        (error) => {
          if (error.response.data.success == false) {
            this.$router.push("/login");
            createToast(error.response.data.message, {
              position: "top-right",
              type: "danger",
              transition: "bounce",
              showIcon: "true",
              timeout: 2000,
            });
          }
        }
      );
    }
  },
  methods: {
    handleForgot(user) {
      this.message = "";
      this.successful = false;
      this.loading = true;
      // console.log(user);
      if (user.new_password && user.confirm_password && this.token) {
        userAPI.resetPassword(user, this.token).then(
          (res) => {
            console.log(res.data);
            if (res.data.success == true) {
              this.$router.push("/login");
              createToast(res.data.message, {
                position: "top-right",
                type: "success",
                transition: "bounce",
                showIcon: "true",
                timeout: 2000,
              });
            }
          },
          (error) => {
            console.log(error.response.data);
            if (error.response.data.success == false) {
              createToast(error.response.data.message, {
                position: "top-right",
                type: "danger",
                transition: "bounce",
                showIcon: "true",
                timeout: 2000,
              });
            }
          }
        );
      }
    },
  },
};
</script>

<style type="text/css" scoped>
textarea.form-control {
  min-height: calc(9em);
}

.has-icon-left .form-control {
  border-radius: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  top: 5px;
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
  height: 282px;
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
  top: 197px;
  display: flex;
  justify-content: center;
}

.auth-page .signup-form .card {
  border-radius: 20px;
  padding: 60px 50px;
  margin-bottom: -100px;
  min-width: 481px;
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

input[type="radio"].radio-tab {
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
  content: "";
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
.forget-title {
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  font-size: 30px;
  color: #123c3d;
  margin-bottom: 10px;
}

.sub-title {
  font-weight: bold;
  font-size: 12px;
  color: #123c3d;
}
.sub-sub-title {
  font-size: 12px;
  color: #123c3d;
  line-height: 18px;
  opacity: 0.8;
}
.sub-sub-title b {
  text-transform: capitalize;
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
}
.form-label-group {
  margin: 0;
}
.card-body.pt-0 {
  padding: 0;
}
input.radio-tab.active + label {
  background-color: #123c3d;
  /* border-color: #428bca; */
  color: #00e2f2;
}
button.changePass {
  width: 100%;
  height: 50px;
  background-color: #00e2f2;
  border: 1px solid #00e2f2;
  border-radius: 10px;
  font-weight: 500;
  font-weight: 600;
}
@media only screen and (min-width: 1200px) {
  .blank-page .content-wrapper .flexbox-container {
    display: flex;
    align-items: center;
    max-height: 100vh;
    justify-content: center;
  }
}
</style>
