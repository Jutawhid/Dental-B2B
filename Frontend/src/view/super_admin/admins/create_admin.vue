<template>
  <div>
    <!-- Container Fluid-->

    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="col-lg-8 content-wrapper">
        <div class="row">
          <div class="col-lg-6 col-sm-12">
            <h1 class="text-bold-700 mb-0 headerTXT">Create Admin</h1>
          </div>
          <div class="col-lg-6 col-sm-12 text-right">
            <router-link :to="{ name: 'AdminsCpanelSA' }">
              <button type="submit" class="backBtn">
                <i class="feather icon-arrow-left"></i>
                Back
              </button>
            </router-link>
            <!-- <a href="#"> -->
            <button type="submit" class="update__btn" form="saveForm">
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
          <div class="col-lg-12">
            <!--  Section -->
            <div class="card">
              <div class="card-body py-1">
                <!-- 1st Section -->
                <Form @submit="onSubmit" id="saveForm">
                  <div class="row">
                    <div class="col-lg-4">
                      <label for="first_name" class="mb-1 mt-2"
                        >First Name</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': !!errors.first_name }"
                        placeholder="ex. John"
                        v-model="user.first_name"
                        @blur="validate('first_name')"
                        @keypress="validate('first_name')"
                      />
                      <p class="form-input-hint" v-if="!!errors.first_name">
                        {{ errors.first_name }}
                      </p>
                    </div>
                    <div class="col-lg-4">
                      <label for="last_name" class="mb-1 mt-2">Last Name</label>
                      <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': !!errors.last_name }"
                        placeholder="ex. Doe"
                        v-model="user.last_name"
                        @blur="validate('last_name')"
                        @keypress="validate('last_name')"
                      />
                      <p class="form-input-hint" v-if="!!errors.last_name">
                        {{ errors.last_name }}
                      </p>
                    </div>
                    <div class="col-lg-4">
                      <label for="user_name" class="mb-1 mt-2">User Name</label>
                      <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': !!errors.user_name }"
                        placeholder="ex. john01"
                        v-model="user.user_name"
                        @blur="validate('user_name')"
                        @keypress="validate('user_name')"
                      />
                      <p class="form-input-hint" v-if="!!errors.user_name">
                        {{ errors.user_name }}
                      </p>
                    </div>
                    <div class="col-lg-4">
                      <label for="email" class="mb-1 mt-2">Email</label>
                      <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': !!errors.email }"
                        placeholder="ex. johndoe@mail.com"
                        v-model="user.email"
                        @blur="validate('email')"
                        @keypress="validate('email')"
                      />
                      <p class="form-input-hint" v-if="!!errors.email">
                        {{ errors.email }}
                      </p>
                    </div>
                    <div class="col-lg-4">
                      <label for="phone_number" class="mb-1 mt-2"
                        >Phone Number</label
                      >
                      <input
                        type="number"
                        class="form-control"
                        :class="{ 'is-invalid': !!errors.phone_number }"
                        placeholder="ex. XXX-XXX-XXXX"
                        v-model="user.phone_number"
                        @blur="validate('phone_number')"
                        @keypress="validate('phone_number')"
                      />
                      <p class="form-input-hint" v-if="!!errors.phone_number">
                        {{ errors.phone_number }}
                      </p>
                    </div>
                    <div class="col-lg-4">
                      <label for="address" class="mb-1 mt-2">Address</label>
                      <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': !!errors.address }"
                        placeholder="ex. Alabama, USA"
                        v-model="user.address"
                        @blur="validate('address')"
                        @keypress="validate('address')"
                      />
                      <p class="form-input-hint" v-if="!!errors.address">
                        {{ errors.address }}
                      </p>
                    </div>
                    <div class="col-lg-4">
                      <label for="new_password" class="mb-1 mt-2"
                        >Password</label
                      >
                      <input
                        type="password"
                        class="form-control"
                        :class="{ 'is-invalid': !!errors.new_password }"
                        placeholder="ex. XXX-XXX-XXXX"
                        v-model="user.new_password"
                        @blur="validate('new_password')"
                        @keypress="validate('new_password')"
                      />
                      <p class="form-input-hint" v-if="!!errors.new_password">
                        {{ errors.new_password }}
                      </p>
                    </div>
                    <div class="col-lg-4">
                      <label for="confirm_password" class="mb-1 mt-2"
                        >Confirm Password</label
                      >
                      <input
                        type="password"
                        class="form-control"
                        :class="{ 'is-invalid': !!errors.confirm_password }"
                        placeholder="ex. XXX-XXX-XXXX"
                        v-model="user.confirm_password"
                        @blur="validate('confirm_password')"
                        @keypress="validate('confirm_password')"
                      />
                      <p
                        class="form-input-hint"
                        v-if="!!errors.confirm_password"
                      >
                        {{ errors.confirm_password }}
                      </p>
                    </div>
                  </div>
                </Form>
                <!-- 1st Section -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!---Container Fluid-->
  </div>
</template>


<script>
import { Form } from 'vee-validate';
import { object, string } from 'yup';
import { createToast } from 'mosha-vue-toastify';
import userAPI from '../../../services/user.API';
export default {
  name: 'CaseCreateForm',
  components: {
    Form,
  },
  data() {
    const schema = object().shape({
      first_name: string()
        .min(3, 'Should be at least 3 characters')
        .max(50, 'Should be at most 50 characters')
        .required('First Name is required'),
      last_name: string()
        .min(3, 'Should be at least 3 characters')
        .max(50, 'Should be at most 50 characters')
        .required('Last Name is required'),
      user_name: string()
        .min(6, 'Should be at least 6 characters')
        .max(20, 'Should be at most 20 characters')
        .required('User Name is required'),
      email: string().email('Email is not valid').required('Email is required'),
      phone_number: string()
        .required('Phone Number is required')
        .matches(
          /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
          'Phone Number is not valid',
        ),
      address: string()
        .max(255, 'Should be at most 255 characters')
        .required('Address is required'),
      new_password: string()
        .min(10, 'should be at least 10 characters')
        .max(20, 'Should be at most 20 characters')
        .required('Password is required')
        .matches(
          /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{5,}$/,
          'must contain at least 1 lowercase & uppercase letter, 2 digits and 1 special character',
        ),

      confirm_password: string()
        .min(10, 'should be at least 10 characters')
        .max(20, 'Should be at most 20 characters')
        .required('Confirm Password is required')
        .matches(
          /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{5,}$/,
          'must contain at least 1 lowercase & uppercase letter, 2 digits and 1 special character',
        ),
    });
    return {
      schema,
      imgPath: '',
      user: {
        first_name: '',
        last_name: '',
        user_name: '',
        email: '',
        phone_number: '',
        address: '',
        new_password: '',
        confirm_password: '',
      },
      errors: {
        first_name: '',
        last_name: '',
        user_name: '',
        email: '',
        phone_number: '',
        address: '',
        new_password: '',
        confirm_password: '',
      },
    };
  },
  methods: {
    onSubmit() {
      if (this.user.first_name === '') {
        this.errors.first_name = 'First Name is required';
      }
      if (this.user.last_name === '') {
        this.errors.last_name = 'Last Name is required';
      }
      if (this.user.user_name === '') {
        this.errors.user_name = 'User Name is required';
      }
      if (this.user.email === '') {
        this.errors.email = 'Email is required';
      }
      if (this.user.phone_number === '') {
        this.errors.phone_number = 'Phone Number is required';
      }
      if (this.user.address === '') {
        this.errors.address = 'Address is required';
      }
      if (this.user.new_password === '') {
        this.errors.new_password = 'Password is required';
      }
      if (this.user.confirm_password === '') {
        this.errors.confirm_password = 'Confirm Password is required';
      }
      if (this.user.new_password !== this.user.confirm_password) {
        this.errors.confirm_password = 'Password does not match';
      }
      // if matches all terms -> submit form
      if (
        this.user.first_name && // if first name is not empty
        this.user.last_name && // if last name is not empty
        this.user.user_name && // if user name is not empty
        this.user.email && // if email is not empty
        this.user.phone_number && // if phone number is not empty
        this.user.address && // if address is not empty
        this.user.new_password && // if password is not empty
        this.user.confirm_password && // if confirm password is not empty
        this.user.new_password === this.user.confirm_password // if password and confirm password match
      ) {
        let userData = {
          user_type: 2,
          first_name: this.user.first_name,
          last_name: this.user.last_name,
          user_name: this.user.user_name,
          email: this.user.email,
          phone_number: this.user.phone_number,
          address: this.user.address,
          password: this.user.new_password,
          confirm_password: this.user.confirm_password,
        };
        userAPI.createAdmin(userData).then(
          response => {
            if (response.data.success === true) {
              createToast(response.data.message, {
                type: 'success',
                showIcon: true,
                position: 'top-right',
                duration: 3000,
              });
              this.$router.push({
                name: 'AdminsCpanelSA',
              });
            } else {
              createToast(response.data.message, {
                type: 'danger',
                showIcon: true,
                position: 'top-right',
                duration: 3000,
              });
            }
          },
          err => {
            createToast(err.response.data.message, {
              type: 'danger',
              showIcon: true,
              position: 'top-right',
              duration: 3000,
            });
          },
        );
      }
    },
    // validation
    validate(field) {
      this.schema
        .validateAt(field, this.user)
        .then(() => {
          this.errors[field] = '';
        })
        .catch(err => {
          this.errors[field] = err.message;
        });
    },
  },
};
</script>


<style scoped>
.form-input-hint {
  color: red;
  margin: 5px;
}
.form-control:focus {
  color: #4e5154;
  background-color: #fff;
  border-color: #1f9d57;
  outline: 0;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.15);
}
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
.backBtn {
  padding: 10px 20px;
  background: #ffcc3f;
  border: 1px solid #ffcc3f;
  color: #123c3d;
  box-shadow: none;
  border-radius: 5px;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  font-family: poppins;
  opacity: 1;
  cursor: pointer;
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

.TextInput .help-message {
  font-size: 12px;
  margin: 5px 0px 0px 5px;
}

textarea.form-control {
  border: 1px solid #c1c1c1;
  border-radius: 10px;
  margin: 5px 0;
}
</style>