<template>
  <div>
    <div class="blank-page auth-page">
      <div class="content-wrapper">
        <div class="content-header row"></div>
        <div class="content-body">
          <section class="row signup-header">
            <div class="col-md-6 col-xl-6">
              <h4 class="primary">Create an Account</h4>
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
                        <div class="col-lg-12">
                          <div class="form-group">
                            <span class="top-text">Basic Information </span>
                          </div>
                        </div>
                        <div class="col-lg-6">
                          <div class="form-group">
                            <label>Case Role </label>
                            <!-- dentist-->
                            <div
                              v-if="this.userData.role_id === 3"
                              class="position-relative"
                            >
                              <div type="text" class="form-control disable">
                                Dentist
                              </div>
                            </div>
                            <!-- Consultant-->
                            <div
                              v-if="this.userData.role_id === 4"
                              class="position-relative"
                            >
                              <div type="text" class="form-control disable">
                                Consultant
                              </div>
                            </div>
                            <!-- lab-->
                            <div
                              v-if="this.userData.role_id === 5"
                              class="position-relative"
                            >
                              <div type="text" class="form-control disable">
                                Lab Company
                              </div>
                            </div>
                            <!-- Tech Company-->
                            <div
                              v-if="this.userData.role_id === 6"
                              class="position-relative"
                            >
                              <div type="text" class="form-control disable">
                                Tech Company
                              </div>
                            </div>
                            <Field
                              type="text"
                              id="role_id"
                              class="form-control"
                              name="role_id"
                              v-model="this.userData.role_id"
                              hidden
                            />
                          </div>
                        </div>

                        <div class="col-lg-6"></div>

                        <!-- NPI -->
                        <div
                          class="col-lg-6"
                          v-if="
                            this.userData.role_id === 3 ||
                            this.userData.role_id === 4
                          "
                        >
                          <div class="form-group">
                            <label>NPI <span class="required">*</span></label>
                            <div class="position-relative has-icon-left">
                              <Field
                                type="number"
                                name="npi"
                                class="form-control"
                                placeholder="e.g.: 1790964484"
                                required
                                @blur="handleBlur"
                              />
                              <ErrorMessage name="npi" class="error-feedback" />
                              <div class="form-control-position">
                                <i class="feather icon-hash"></i>
                              </div>
                            </div>
                            <!-- Loading -->
                            <div class="load3-outer" v-if="npiLoading">
                              <div class="load3-inner"></div>
                            </div>
                            <!-- Loading -->
                          </div>
                        </div>
                        <!-- Email -->
                        <div class="col-lg-6">
                          <!-- Email -->
                          <div class="form-group">
                            <label>Email</label>
                            <div class="position-relative">
                              <div
                                type="text"
                                class="form-control email-disable"
                              >
                                <div class="form-control-position">
                                  <i class="feather icon-mail"></i>
                                </div>
                                {{ this.userData.email }}
                              </div>
                            </div>
                            <Field
                              name="email"
                              id="email"
                              type="text"
                              class="form-control"
                              v-model="this.userData.email"
                              hidden
                            />
                            <ErrorMessage name="email" class="error-feedback" />
                          </div>
                        </div>
                        <!-- First Name-->
                        <div
                          class="col-lg-6"
                          v-if="
                            this.userData.role_id === 3 ||
                            this.userData.role_id === 4
                          "
                        >
                          <div class="form-group">
                            <label for="firstname"
                              >First Name <span class="required">*</span>
                            </label>
                            <div class="position-relative has-icon-left">
                              <Field
                                id="firstname"
                                name="firstname"
                                type="text"
                                class="form-control"
                                placeholder="e.g.: Mr."
                                v-model="this.userData.first_name"
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
                        <div
                          class="col-lg-6"
                          v-if="
                            this.userData.role_id === 3 ||
                            this.userData.role_id === 4
                          "
                        >
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
                                v-model="this.userData.last_name"
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
                        <div
                          class="col-lg-6"
                          v-if="this.userData.role_id === 5"
                        >
                          <div class="form-group">
                            <label for="name"
                              >Lab Name <span class="required">*</span>
                            </label>
                            <div class="position-relative has-icon-left">
                              <Field
                                id="name"
                                name="name"
                                type="text"
                                class="form-control"
                                placeholder="e.g.: X Company"
                                required
                              />
                              <ErrorMessage
                                name="name"
                                class="error-feedback"
                              />

                              <div class="form-control-position">
                                <i class="feather icon-user"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- Tech Name-->
                        <div
                          class="col-lg-6"
                          v-if="this.userData.role_id === 6"
                        >
                          <div class="form-group">
                            <label for="techname"
                              >Tech Company Name <span class="required">*</span>
                            </label>
                            <div class="position-relative has-icon-left">
                              <Field
                                id="techname"
                                name="techname"
                                type="text"
                                class="form-control"
                                placeholder="e.g.: X Company"
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
                          v-if="
                            this.userData.role_id === 3 ||
                            this.userData.role_id === 4
                          "
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
                                v-model="this.userData.license"
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

                        <!-- Mobile-->
                        <div class="col-lg-6">
                          <div class="form-group">
                            <label for="contact"
                              >Mobile <span class="required">*</span>
                              <span class="hints"
                                >(Max: 10 | Only numeric)</span
                              ></label
                            >
                            <div class="position-relative has-icon-left">
                              <Field
                                type="text"
                                id="contact"
                                class="form-control"
                                placeholder="e.g.: 415 123 1234"
                                required
                                pattern="/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im"
                                name="contact"
                                v-model="this.userData.contact"
                              />
                              <ErrorMessage
                                name="contact"
                                class="error-feedback"
                              />
                              <div class="form-control-position">
                                <i class="feather icon-smartphone"></i>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Fax -->
                        <div class="col-lg-6">
                          <!---->
                          <div class="form-group">
                            <label for="fax"
                              >Fax <span class="required">*</span>
                              <span class="hints"
                                >(Max: 10 | Only numeric)</span
                              ></label
                            >
                            <div class="position-relative has-icon-left">
                              <Field
                                type="text"
                                id="fax"
                                class="form-control"
                                name="fax"
                                placeholder="e.g.: 121287654"
                                v-model="this.userData.fax"
                              />
                              <ErrorMessage name="fax" class="error-feedback" />
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

                        <!-- Practice & Address -->
                        <div class="col-lg-12">
                          <div class="form-group top-text">
                            <span
                              v-if="
                                this.userData.role_id === 3 ||
                                this.userData.role_id === 4
                              "
                              >Practice </span
                            >Address <span class="required">*</span>
                          </div>
                        </div>
                        <!-- State -->
                        <div class="col-lg-6">
                          <div class="form-group">
                            <label for="state"
                              >State / Province
                              <span class="required">*</span></label
                            >
                            <div class="position-relative has-icon-left">
                              <Field
                                id="state"
                                as="select"
                                name="state"
                                @change="selectState"
                                class="form-control select"
                                required
                              >
                                <option value="" disabled selected>
                                  Select State
                                </option>
                                <option
                                  v-for="state in states"
                                  :key="state"
                                  :value="state.id"
                                >
                                  {{ state.name }}
                                </option>
                              </Field>
                              <ErrorMessage
                                name="state"
                                class="error-feedback"
                              />
                              <div class="form-control-position">
                                <i class="feather icon-map-pin"></i>
                              </div>
                            </div>
                          </div>
                          <!---->
                        </div>
                        <!-- City-->
                        <div class="col-lg-6">
                          <div class="form-group">
                            <label for="city"
                              >City <span class="required">*</span></label
                            >
                            <div class="position-relative has-icon-left">
                              <Field
                                id="city"
                                as="select"
                                name="city"
                                @change="selectCities"
                                class="form-control select"
                                required
                              >
                                <option value="" disabled selected>
                                  Select City
                                </option>
                                <option
                                  v-for="city in cities"
                                  :key="city"
                                  :value="city.id"
                                >
                                  {{ city.name }}
                                </option>
                              </Field>
                              <ErrorMessage
                                name="city"
                                class="error-feedback"
                              />
                              <div class="form-control-position">
                                <i class="feather icon-map-pin"></i>
                              </div>
                            </div>
                          </div>
                          <!---->
                        </div>
                        <!-- Zip-->
                        <div class="col-lg-6">
                          <div class="form-group">
                            <label for="zip">Zip / Postal code</label>
                            <div class="position-relative">
                              <div type="text" class="form-control disable">
                                {{ zip.code }}
                              </div>
                            </div>
                            <div class="position-relative has-icon-left">
                              <Field
                                type="hidden"
                                id="zip"
                                name="zip"
                                class="form-control"
                                v-model="zips.id"
                                required
                              />
                            </div>
                          </div>
                          <!---->
                        </div>
                        <!-- Street address -->
                        <div class="col-lg-6">
                          <div class="form-group">
                            <label for="street"
                              >Street address
                              <span class="required">*</span></label
                            >
                            <div class="position-relative has-icon-left">
                              <Field
                                id="street"
                                type="text"
                                class="form-control"
                                name="street"
                                placeholder="e.g.: 899 Agoura Rd Agoura Hills"
                                required
                              />
                              <ErrorMessage
                                name="street"
                                class="error-feedback"
                              />
                              <div class="form-control-position">
                                <i class="feather icon-map-pin"></i>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="col-lg-12">
                          <hr />
                        </div>

                        <div class="col-lg-12">
                          <div class="form-group">
                            <span class="top-text">Security </span>
                          </div>
                        </div>
                        <div class="col-lg-6">
                          <!-- Username-->
                          <div class="form-group">
                            <label for="password"
                              >Username <span class="required">*</span
                              ><span class="hints"> (Min: 6)</span></label
                            >
                            <div class="position-relative has-icon-left">
                              <Field
                                type="text"
                                id="username"
                                class="form-control"
                                name="username"
                                placeholder="e.g.: jhone"
                                min="6"
                                required
                              />
                              <ErrorMessage
                                name="username"
                                class="error-feedback"
                              />
                              <div class="form-control-position">
                                <i class="feather icon-lock"></i>
                              </div>
                            </div>
                          </div>
                          <!-- password-->
                          <div class="form-group">
                            <label for="password"
                              >Password <span class="required">*</span
                              ><span class="hints"> (Min: 10)</span></label
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
                          <!--Confirm Password -->
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
                        <!-- Sign Up-->
                        <div class="col-12">
                          <button
                            class="btn btn-primary float-left btn-inline my-50 w-100"
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
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import profileService from '../../../services/profile.service';
import authService from '../../../services/auth.service';
import { createToast } from 'mosha-vue-toastify';
import axios from '../../../api/BaseURL';

export default {
  name: 'Register',
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      firstname: yup.string().when('role_id', {
        is: role_id => role_id === 3 || role_id === 4,
        then: yup.string().required('First Name is required!'),
      }),
      lastname: yup.string().when('role_id', {
        is: role_id => role_id === 3 || role_id === 4,
        then: yup.string().required('Last Name is required!'),
      }),
      name: yup.string().when('role_id', {
        is: role_id => role_id === 5,
        then: yup.string().required('Name is required!'),
      }),
      techname: yup.string().when('role_id', {
        is: role_id => role_id === 6,
        then: yup.string().required('Name is required!'),
      }),
      role_id: yup.string(),
      license: yup
      .string()
      .when('isNPI', {
          is: (isNPI)=> isNPI == true,
          then: yup.string().required('NPI is required!'),
        }),
      isNPI: yup.boolean('NPI is required'),
      npi: yup
        .string()
        .when('isNPI', {
          is: (isNPI)=> isNPI == true,
          then: yup.string().required('NPI is required!'),
        }),
      contact: yup
        .string()
        .required('Mobile number is required!')
        .min(10, 'Minimum 10 digit'),
      state: yup.string().required('State Name is required!'),
      city: yup.string().required('City Name is required!'),
      street: yup.string().required('Street Address is required!'),
      username: yup
        .string()
        .required('Username is required!')
        .min(6, 'Must be at least 6 characters!')
        .max(20, 'Must be maximum 20 characters!'),
      email: yup
        .string()
        .required('Email is required!')
        .email('Email is invalid!')
        .max(50, 'Must be maximum 50 characters!'),
      password: yup
        .string()
        .required('Password is required!')
        .min(10, 'Must be at least 10 characters!')
        .max(20, 'Must be maximum 20 characters!')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,})/,
          'Min 10 Char, 1 Upper, 1 Lower, 1 Number and 1 Special Char',
        ),
      confirmed_password: yup
        .string()
        .required('Confirmed Password is required!')
        .oneOf([yup.ref('password'), null], 'Confirmed Password must match with Passwords above!'),
    });

    return {
      successful: false,
      loading: false,
      message: '',
      schema,
      token: this.$route.params.id,
      states: [],
      cities: [],
      state_id: '',
      city_id: '',
      zip: {
        id: '',
        code: '',
      },
      zips: '',
      userData: {
        role_id: '',
        npi: '',
        license: '',
        name: '',
        first_name: '',
        last_name: '',
        contact: '',
        fax: '',
        email: '',
        city: '',
        address: '',
        state: '',
        postal_code: '',
        token: '',
      },
      isNPI: false,
      npiLoading: false,
    };
  },
  created() {
    // console.log(!(window.location.href.indexOf("login") > -1));
    if (this.loggedIn) {
      profileService.getUser().then(res => {
        // console.log(res.role.role_id);
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

    /* Verify Token*/
    if (this.token) {
      authService.verifyRegisterEmail(this.token).then(
        // check if token is valid
        res => {
          // console.log(res.data);
          if (res.data.data) {
            this.userData = res.data.data;
            this.userData.role_id = res.data.data.role_id;
            this.userData.email = res.data.data.email;
            this.userData.token = res.data.data.token;
            if(this.userData.role_id === 3 || this.userData.role_id === 4){
              this.isNPI = true;
            }
          }
          console.log(this.userData.role_id);
          console.log(this.userData.email);
          console.log(this.userData.token);
        },
        // check if token is not valid
        error => {
          if (error.response.data.success === false) {
            // console.log(error.response);
            this.$router.push('/register');
            createToast(error.response.data.message, {
              position: 'top-right',
              type: 'danger',
              transition: 'bounce',
              showIcon: 'true',
              timeout: 3000,
            });
          }
        },
      );
    } else {
      this.$router.push('/register');
    }
    // console.log(this.recaptcha);
    //  State call
    authService.stateList().then(res => {
      // console.log(res.data.data);
      this.states = res.data.data;
    });
    console.log(this.token);
  },
  methods: {
    selectState(e) {
      console.log(e.target.value);
      let stateId = e.target.value;
      // this.state_id = e.target.value
      if (stateId) {
        axios.get('/location/cityListByStateId/' + stateId).then(
          // check if token is valid
          res => {
            console.log(res.data.data);
            this.cities = res.data.data;
          },
        );
      }
    },
    selectCities(e) {
      console.log(e.target.value);
      let cityId = e.target.value;
      // this.city_id = e.target.value
      if (cityId) {
        axios.get('/location/zipListByCityId/' + cityId).then(
          // check if token is valid
          res => {
            console.log(res.data.data[0]);
            this.zips = res.data.data[0];
            this.zip.id = res.data.data[0].id;
            this.zip.code = res.data.data[0].code;
            console.log(this.zip.id);
            console.log(this.zip.code);
          },
        );
      }
    },
    handleBlur(e) {

      if(e.target.value !== ''){
        this.npiLoading = true;
      } else {
        this.npiLoading = false;
      }
      // console.log(typeof this.userData.role_id);
      // console.log(e.target.value);
      this.userData.npi = e.target.value;
      axios
        .post('/user/npiVerification', {
          npi: e.target.value,
          user_type: this.userData.role_id,
        })
        .then(
          // check if token is valid
          res => {
            // console.log(res);

            if (res.data.success === true) {
              this.npiLoading = false;
              console.log(res.data.data);
              this.userData.first_name = res.data.data.firstName;
              this.userData.last_name = res.data.data.lastName;
              this.userData.license = res.data.data.license;
              this.userData.contact = res.data.data.telephone_number;
              if (res.data.data.fax_number) {
                this.userData.fax = '+' + res.data.data.fax_number;
              }
              /*this.userData.address = res.data.data.address;
            this.userData.city = res.data.data.city;
            this.userData.state = res.data.data.state;
            this.userData.postal_code = res.data.data.postal_code;*/
              // console.log(this.selectState);
            }
          },
          error => {
            // this.message =
            //     (error.response && error.response.data && error.response.data.message) || error.message ||
            //     error.toString();
            console.log(error.status);
            this.$moshaToast('Please Enter Valid NPI', {
              position: 'top-right',
              type: 'danger',
              transition: 'bounce',
              showIcon: 'true',
              timeout: 3000,
            });
          },
        );
    },
    handleRegister(user) {
      this.message = '';
      this.successful = false;
      this.loading = true;

      console.log(this.zip.id);
      console.log(user);
      let userType = parseInt(this.userData.role_id);
      console.log(typeof userType);
      axios
        .post('/user/registration', {
          user_type: userType,
          name: user.name || user.techname,
          first_name: user.firstname,
          last_name: user.lastname,
          phone_number: user.contact,
          email: user.email,
          fax: user.fax,
          npi: user.npi,
          license_number: user.license,
          address: user.street,
          user_name: user.username,
          password: user.password,
          confirm_password: user.confirmed_password,
          state_id: user.state,
          city_id: user.city,
          zip_id: this.zip.id,
          token: this.userData.token,
        })
        .then(
          data => {
            this.message = data.message;
            this.success = true;
            this.loading = false;
            this.$router.push('/login');
            this.$moshaToast('Registration Successful!', {
              position: 'top-right',
              type: 'success',
              transition: 'bounce',
              showIcon: 'true',
              timeout: 5000,
            });
          },
          error => {
            this.message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            this.success = false;
            this.loading = false;
          },
        );
    },
    onChange(event) {
      this.role_id = event.target.value;
      console.log(this.role_id);
    },
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  }
};
</script>

<style type="text/css" scoped>
.top-text {
  color: #1492e6;
  font-size: 18px;
}
.btn-primary {
  padding: 1.2rem 2rem;
}
.disable {
  background-color: #d9d9d9;
  padding: 10px 20px;
  border-radius: 10px;
  text-transform: uppercase;
  white-space: pre-wrap;
  height: auto;
  min-height: 40px;
  word-wrap: break-word;
  white-space: initial;
}
.email-disable {
  background-color: #d9d9d9;
  padding: 10px 20px 10px 40px;
  border-radius: 10px;
  white-space: pre-wrap;
  height: auto;
  word-wrap: break-word;
  white-space: initial;
}
.email-disable .form-control-position {
  position: absolute;
  top: 2px;
  left: 5px;
  z-index: 2;
  display: block;
  width: 2.5rem;
  height: 2.5rem;
  line-height: 2.5rem;
  text-align: center;
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
  padding: 50px 0 10px 0;
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

.radio-tabs-wrapper label:last-child {
  border-radius: 0 10px 10px 0;
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
  margin: 0 auto 0 20px;
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
  left: 0;
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
    border-radius: 0;
    padding: 20px 0;
  }

  .signup-header {
    padding: 20px 0 10px 0;
  }

  .signup-header a {
    font-size: 14px;
  }

  .signup-header h4 {
    text-align: center;
  }

  input.radio-tab + label {
    padding: 5px 0;
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
@keyframes load {
  100% {
    transform: rotate(360deg);
  }
}

.load3-outer {
  position: absolute;
  right: 7%;
  top: 45%;
  margin-left: 20%;
  width: 20px;
  height: 20px;
  border: 1px solid var(--bg-color);
  border-top: 1px solid #999;
  border-bottom: 1px solid #999;
  border-radius: 55px;
  animation: load 1.5s linear infinite;
  display: flex;
  align-items: center;
  justify-content: center;
}
.load3-inner {
  width: 10px;
  height: 10px;
  border: 1px solid var(--bg-color);
  border-left: 1px solid #999;
  border-right: 1px solid #999;
  border-radius: 40px;
  animation: load 0.75s linear infinite reverse;
}
</style>
