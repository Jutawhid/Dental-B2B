<template>
  <div>
    <!-- Container Fluid-->
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="content-wrapper">
        <div class="row">
          <div class="col-lg-4 my-1">
            <h1 class="text-bold-700 mb-0 headerTXT">Edit Service Type</h1>
          </div>
          <div class="col-lg-4 col-sm-12 text-right">
            <router-link :to="{ name: 'allServiceTypes' }">
              <button type="submit" class="backBtn">
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
                    <label for="state">Service Type</label>
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      class="form-control"
                      placeholder="e.g.: Treatment Planning"
                      v-model="userData.name"
                      required
                    />
                    <ErrorMessage name="name" class="error-feedback" />
                  </div>
                </div>

                <div class="col-lg-6">
                  <div class="form-group">
                    <label for="state">Priority Order</label>
                    <Field
                      id="priority"
                      name="priority"
                      type="text"
                      class="form-control"
                      placeholder="e.g.: 10"
                      v-model="userData.priority"
                      required
                    />
                    <ErrorMessage name="priority" class="error-feedback" />
                  </div>
                </div>

                <div class="col-lg-6">
                  <div class="form-group">
                    <label for="state">Select Role</label>

                    <Multiselect
                      v-model="example9.value"
                      v-bind="example9"
                      @change="updateRole(example9.value)"
                    >
                      <template
                        v-slot:tag="{ option, handleTagRemove, disabled }"
                      >
                        <div class="multiselect-tag is-user">
                          {{ option.name }}
                          <i
                            v-if="!disabled"
                            class="feather icon-x"
                            @click.prevent
                            @mousedown.prevent.stop="
                              handleTagRemove(option, $event)
                            "
                          ></i>
                        </div>
                      </template>

                      <template v-slot:option="{ option }">
                        {{ option.name }}
                      </template>
                    </Multiselect>
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
import userAPI from '../../../services/user.API';
import { createToast } from 'mosha-vue-toastify';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as Yup from 'yup';
import Multiselect from '@vueform/multiselect';
export default {
  name: 'serviceTypeCpanel',

  components: {
    Form,
    Field,
    ErrorMessage,
    Multiselect,
  },

  data() {
    // generate a validation schema
    const schema = Yup.object().shape({
      name: Yup.string()
        .min(2, 'Too short!')
        .max(50, 'Exceeded max length!')
        .required('Type is required'),
      priority: Yup.string()
        .min(1, 'Too short!')
        .max(10, 'Exceeded max length!')
        .required('Priority order is required'),
    });

    return {
      schema,
      service_id: this.$route.params.id,
      serviceDetails: {},
      userData: {
        name: '',
        priority: '',
      },
      selected_role: [],
      example9: {
        mode: 'tags',
        value: [],
        placeholder: 'Select Role',
        search: true,
        trackBy: 'name',
        label: 'name',
        options: [
          // {
          //   value: 1,
          //   name: 'Super Admin',
          // },
          // {
          //   value: 2,
          //   name: 'Admin',
          // },
          // {
          //   value: 3,
          //   name: 'Dentist',
          // },
          {
            value: 4,
            name: 'Consultant',
          },
          {
            value: 5,
            name: 'Lab',
          },
          {
            value: 6,
            name: 'Tech Company',
          },
        ],
      },
    };
  },

  methods: {
    onSubmit(values) {
      let userData = {
        id: this.service_id,
        name: values.name,
        priority: Number(values.priority),
        role_id: this.example9.value,
      };
      console.log(userData);
      if (userData) {
        userAPI.editServiceType(userData).then(
          res => {
            if (res.data.success == true) {
              // redirect
              this.$router.push('/cpanel/services');

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
                type: 'error',
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
    // console.log(this.$route.query);
    // console.log(this.$route.params);
    if (this.service_id) {
      userAPI.getServiceDetails(this.service_id).then(res => {
        if (res.data.success == true) {
          this.serviceDetails = res.data.data;
          // storing role id in array
          if (this.serviceDetails.roleType) {
            let userData = this.serviceDetails.roleType.map(item => {
              return item.id;
            });
            console.log(userData);
            this.example9.value = userData;
            // this.example9.value = this.serviceDetails.roleType;
          }
          // storing user data
          this.userData.name = this.serviceDetails.name;
          this.userData.priority = this.serviceDetails.priority;
          console.log(this.serviceDetails);
          console.log(this.example9.value);
        } else {
          createToast(res.data.message, {
            position: 'top-right',
            type: 'error',
            transition: 'bounce',
            showIcon: 'true',
            timeout: 2000,
          });
        }
      });
    }
  },
};
</script>

<style scoped>
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
