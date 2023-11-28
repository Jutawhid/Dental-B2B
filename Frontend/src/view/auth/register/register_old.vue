<template>
  <div>
    <div class="blank-page auth-page">
      <div class="content-wrapper">
        <div class="content-header row"></div>
        <div class="content-body">
          <section class="row signup-header">
            <div class="col-xl-6">
              <section class="row">
                <div class="col-xl-6">
                  <h4 class="primary">Create an Account</h4>
                </div>
                <div class="col-xl-6 sign-in">
                  <div>
                    <span>Already Have an Account ? </span>
                    <router-link to="/login"> Sign In</router-link>
                  </div>
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

                        <!-- First Name-->
                        <div class="col-lg-6" v-if="role_id == '3' || role_id == '4'">
                          <div class="form-group">
                            <label for="first-name"
                              >First Name <span class="required">*</span>
                            </label>
                            <div class="position-relative has-icon-left">
                              <Field
                                id="first-name"
                                name="firstname"
                                type="text"
                                class="form-control"
                                placeholder="e.g.: Mr."
                                required
                              />
                              <ErrorMessage
                                name="firstname"
                                class="error-feedback"
                              />

                              <div class="form-control-position">
                                <i class="feather icon-user"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- Last Name-->
                        <div class="col-lg-6" v-if="role_id == '3' || role_id == '4'">
                          <div class="form-group">
                            <label for="lastname">
                              Last Name <span class="required">*</span></label
                            >
                            <div class="position-relative has-icon-left">
                              <Field
                                name="lastname"
                                id="lastname"
                                type="text"
                                class="form-control"
                                placeholder="e.g.: Smith"
                                required
                              />
                              <ErrorMessage
                                name="lastname"
                                class="error-feedback"
                              />

                              <div class="form-control-position">
                                <i class="feather icon-user"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- Lab Name-->
                        <div class="col-lg-12"
                         v-if="role_id == '5'"
                        >
                          <div class="form-group">
                            <label for="lab-name"
                            >Lab Name <span class="required">*</span>
                            </label>
                            <div class="position-relative has-icon-left">
                              <Field
                                      id="lab-name"
                                      name="labname"
                                      type="text"
                                      class="form-control"
                                      placeholder="e.g.: X Company"
                                      required
                              />
                              <ErrorMessage
                                      name="labname"
                                      class="error-feedback"
                              />

                              <div class="form-control-position">
                                <i class="feather icon-user"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- Tech Name-->
                        <div class="col-lg-12"
                             v-if="role_id == '6'"
                        >
                          <div class="form-group">
                            <label for="tech-name"
                            >Tech Company Name <span class="required">*</span>
                            </label>
                            <div class="position-relative has-icon-left">
                              <Field
                                      id="tech-name"
                                      name="techname"
                                      type="text"
                                      class="form-control"
                                      placeholder="e.g.: X Compny"
                                      required
                              />
                              <ErrorMessage
                                      name="techname"
                                      class="error-feedback"
                              />

                              <div class="form-control-position">
                                <i class="feather icon-user"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- License -->
                        <div
                          class="col-lg-6"
                          v-if="role_id == '3' || role_id == '4'"
                        >
                          <div class="form-group">
                            <label for="license"
                              >License Number
                              <span class="required">*</span></label
                            >
                            <div class="position-relative has-icon-left">
                              <Field
                                name="license"
                                id="license"
                                type="text"
                                class="form-control"
                                placeholder="e.g.: 60123456"
                                required
                              />
                              <ErrorMessage
                                name="license"
                                class="error-feedback"
                              />

                              <div class="form-control-position">
                                <i class="feather icon-hash"></i>
                              </div>
                            </div>
                          </div>
                          <!---->
                        </div>
                        <!-- NPI -->
                        <div
                          class="col-lg-6"
                          v-if="role_id == '3' || role_id == '4'"
                        >
                          <div class="form-group">
                            <label for="npi"
                              >NPI <span class="required">*</span></label
                            >
                            <div class="position-relative has-icon-left">
                              <Field
                                type="text"
                                id="npi"
                                class="form-control"
                                name="npi"
                                placeholder="e.g.: 1790964484"
                                required
                              />
                              <ErrorMessage name="npi" class="error-feedback" />
                              <div class="form-control-position">
                                <i class="feather icon-hash"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- Mobile-->
                        <div class="col-lg-6">
                          <div class="form-group">
                            <label for="contact"
                              >Mobile <span class="required">*</span>
                              <span class="hints"
                                >(Max: 11 | Only numeric)</span
                              ></label
                            >
                            <div class="position-relative has-icon-left">
                              <Field
                                type="number"
                                id="contact"
                                class="form-control"
                                placeholder="e.g.: 01XXXXXXXX"
                                maxlength="11"
                                required
                                name="contact"
                              />
                              <ErrorMessage
                                name="phone"
                                class="error-feedback"
                              />
                              <div class="form-control-position">
                                <i class="feather icon-smartphone"></i>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Practice & Address -->
                        <div class="col-lg-6">
                          <div class="form-group">
                            <label for="address"
                              ><span v-if="role_id == '3' || role_id == '4'"
                                >Practice &</span
                              >
                              Address</label
                            >
                            <div class="position-relative has-icon-left">
                              <Field
                                id="address"
                                type="text"
                                class="form-control"
                                name="address"
                                placeholder="e.g.: Los Angeles Rams 29899 Agoura Rd Agoura Hills"
                              />
                              <div class="form-control-position">
                                <i class="feather icon-map-pin"></i>
                              </div>
                            </div>
                          </div>
                          <!---->
                        </div>

                        <div class="col-lg-6">
                          <!-- Email -->
                          <div class="form-group">
                            <label for="email"
                              >Email <span class="required">*</span></label
                            >
                            <div class="position-relative has-icon-left">
                              <Field
                                name="email"
                                id="email"
                                type="text"
                                class="form-control"
                                placeholder="e.g.: xyz@something.com"
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
                        </div>

                        <!-- Fax -->
                        <div class="col-lg-6">
                          <!---->
                          <div class="form-group">
                            <label for="fax-floating-icon"
                              >Fax
                              <span class="hints"
                                >(Max: 10 | Only numeric)</span
                              ></label
                            >
                            <div class="position-relative has-icon-left">
                              <Field
                                type="number"
                                id="fax-floating-icon"
                                class="form-control"
                                name="fax"
                                placeholder="e.g.: 121287654"
                                maxlength="10"
                              />
                              <div class="form-control-position">
                                <i class="feather icon-printer"></i>
                              </div>
                            </div>
                          </div>
                          <!---->
                        </div>

                        <div class="col-lg-12">
                          <hr />
                        </div>

                        <div class="col-lg-6">
                          <div class="form-group">
                            <label for="username"
                              >Username <span class="required">*</span></label
                            >
                            <div class="position-relative has-icon-left">
                              <Field
                                type="username"
                                id="username"
                                class="form-control"
                                name="username"
                                placeholder="e.g.: smitj510"
                                min="6"
                                required
                              />
                              <ErrorMessage
                                name="username"
                                class="error-feedback"
                              />
                              <div class="form-control-position">
                                <i class="feather icon-user"></i>
                              </div>
                            </div>
                          </div>
                          <!---->
                          <div class="form-group">
                            <label for="password"
                              >Password <span class="required">*</span
                              ><span class="hints"> (Min: 8)</span></label
                            >
                            <div class="position-relative has-icon-left">
                              <Field
                                type="password"
                                id="password"
                                class="form-control"
                                name="password"
                                placeholder="e.g.: ********"
                                min="6"
                                required
                              />
                              <ErrorMessage
                                name="password"
                                class="error-feedback"
                              />
                              <div class="form-control-position">
                                <i class="feather icon-lock"></i>
                              </div>
                            </div>
                          </div>
                          <!---->
                          <div class="form-group">
                            <label for="confirmed_password">
                              Confirm Password <span class="required">*</span>
                              <span class="hints"
                                >(Same as password)</span
                              ></label
                            >
                            <div class="position-relative has-icon-left">
                              <Field
                                type="password"
                                id="confirmed_password"
                                class="form-control"
                                name="confirmed_password"
                                placeholder="e.g.: ********"
                                min="6"
                                required
                              />
                              <ErrorMessage
                                name="confirmed_password"
                                class="error-feedback"
                              />
                              <div class="form-control-position">
                                <i class="feather icon-lock"></i>
                              </div>
                            </div>
                          </div>
                          <!---->
                        </div>
                        <div class="col-12">
                          <button
                            class="
                              btn btn-primary
                              float-left
                              btn-inline
                              my-50
                              w-100
                            "
                            :disabled="loading"
                          >
                            <div v-show="loading">
                              <div class="sp sp-wave"></div>
                            </div>
                            Sign Up
                          </button>
                        </div>
                      </div>
                    </div>
                  </Form>
                  <div
                    v-if="message"
                    class="alert mt-3"
                    :class="successful ? 'alert-success' : 'alert-danger'"
                  >
                    {{ message }}
                  </div>
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
import {Form, Field, ErrorMessage} from "vee-validate";
import * as yup from "yup";

export default {
  name: "Register",
  components: {
    Form,
    Field,
    ErrorMessage
  },
  data() {
    const schema = yup.object().shape({
      firstname: yup
        .string()
        .when("role_id", {
            is: (role_id) => role_id === "3" || role_id === "4",
            then: yup.string().required("First Name is required!")
        }),
      lastname: yup
        .string()
        .when("role_id", {
            is: (role_id) => role_id === "3" || role_id === "4",
            then: yup.string().required("Last Name is required!")
        }),
      labname: yup
        .string()
        .when("role_id", {
            is: (role_id) => role_id === "5",
            then: yup.string().required("Lab Name is required!")
        }),
      techname: yup
        .string()
        .when("role_id", {
            is: (role_id) => role_id === "6",
            then: yup.string().required("TechCompany Name is required!")
        }),
      role_id: yup.string(),
      license: yup
        .string()
        // .required("License is required!")
        .when("role_id", {
          is: (role_id) => role_id === "3" || role_id === "4",
          then: yup.string().required("License is required!")
        }),
      npi: yup
        .string()
        // .required("NPI is required!")
        .when("role_id", {
          is: (role_id) => role_id === "3" || role_id === "4",
          then: yup.string().required("NPI is required!")
        }),
      contact: yup
        .string()
        .required("Phone number is required!")
        .min(11, "Minimum 11 digit")
        .max(11, "Maximum 11 digit"),
      username: yup
        .string()
        .required("Username is required!")
        .min(3, "Must be at least 3 characters!")
        .max(20, "Must be maximum 20 characters!"),
      email: yup
        .string()
        .required("Email is required!")
        .email("Email is invalid!")
        .max(50, "Must be maximum 50 characters!"),
      password: yup
        .string()
        .required("Password is required!")
        .min(8, "Must be at least 8 characters!")
        .max(40, "Must be maximum 40 characters!"),
      confirmed_password: yup
        .string()
        .required("Password is required!")
        .oneOf([yup.ref('password'), null], 'Passwords must match')
    });

    return {
      successful: false,
      loading: false,
      message: "",
      schema,
      role_id: 3,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push("/explore");
    }
    console.log(this.role_id)
  },
  methods: {
    handleRegister(user) {
      this.message = "";
      this.successful = false;
      this.loading = true;

      console.log(user);

      this.$store.dispatch("auth/register", user).then(
        (data) => {
          this.message = data.message;
          this.successful = true;
          this.loading = false;
          this.$router.push("/login");
          this.$moshaToast("Registration Successful!", {
            position: "top-right",
            type: "success",
            transition: "bounce",
            showIcon: "true",
            timeout: 3000,
          });
        },
        (error) => {
          this.message =
            (error.response && error.response.data && error.response.data.message) || error.message ||
            error.toString();
          this.successful = false;
          this.loading = false;
        }
      );
    },
    onChange(event) {

      this.role_id = event.target.value;
      console.log(this.role_id)
    },

  }
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
  display: flex;
  justify-content: center;
}

.auth-page .signup-form .card {
  border-radius: 20px;
  padding: 50px 40px;
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

input.radio-tab.active + label {
  background-color: #123c3d;
  /* border-color: #428bca; */
  color: #00e2f2;
}
</style>
