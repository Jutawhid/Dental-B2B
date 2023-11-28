<template>
  <div>
    <!-- Container Fluid-->
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="content-wrapper">
        <div class="row">
          <div class="col-lg-4 my-1">
            <h1 class="text-bold-700 mb-0 headerTXT">Create New Gateway</h1>
          </div>
          <div class="col-lg-4 col-sm-12 text-right">
            <router-link :to="{ name: 'allGateway' }">
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
          <p>You can create a new Gateway here.</p>
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
                    <label for="state">Gateway Name</label>
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
                    <label for="priority">Select Image</label>
                    <input
                      class="form-control"
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      ref="file"
                      @change="selectImage"
                    />
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
// import userAPI from '../../../services/user.API';
import { createToast } from 'mosha-vue-toastify';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as Yup from 'yup';
// import Multiselect from '@vueform/multiselect';
import uploadProfile from '../../../services/uploadProfile';
export default {
  name: 'serviceTypeCpanel',

  components: {
    Form,
    Field,
    ErrorMessage,
    // Multiselect,
  },

  data() {
    // generate a validation schema
    const schema = Yup.object().shape({
      name: Yup.string()
        .min(2, 'Too short!')
        .max(50, 'Exceeded max length!')
        .required('Name is required'),
    });

    return {
      schema,
      progress: '',
      userData: {
        name: '',
        currentImage: null,
      },
    };
  },

  methods: {
    // form Submit action
    onSubmit(values) {
      let userData = {
        name: values.name,
        currentImage: this.userData.currentImage,
      };
      // console.log(userData);
      // if (userData) {
      //   userAPI.createServiceType(userData).then(
      //     res => {
      //       if (res.data.success == true) {
      //         // redirect
      //         this.$router.push('/cpanel/services');

      //         // show success alert
      //         createToast(res.data.message, {
      //           position: 'top-right',
      //           type: 'success',
      //           transition: 'bounce',
      //           showIcon: 'true',
      //           timeout: 2000,
      //         });
      //       } else {
      //         createToast(res.data.message, {
      //           position: 'top-right',
      //           type: 'error',
      //           transition: 'bounce',
      //           showIcon: 'true',
      //           timeout: 2000,
      //         });
      //       }
      //     },
      //     error => {
      //       if (error.response.data.success == false) {
      //         createToast(error.response.data.message, {
      //           position: 'top-right',
      //           type: 'danger',
      //           transition: 'bounce',
      //           showIcon: 'true',
      //           timeout: 2000,
      //         });
      //       }
      //     },
      //   );
      // }
      this.progress = 0;
      uploadProfile
        .createGateway(userData, event => {
          this.progress = Math.round((100 * event.loaded) / event.total);
        })
        .then(response => {
          if (response.data.success == true) {
            this.$router.push({ name: 'allGateway' });
            createToast(response.data.message, {
              position: 'top-right',
              type: 'success',
              transition: 'bounce',
              showIcon: 'true',
              timeout: 2000,
            });
          } else {
            createToast(response.data.message, {
              position: 'top-right',
              type: 'danger',
              transition: 'bounce',
              showIcon: 'true',
              timeout: 2000,
            });
          }
        })
        .then(images => {
          this.imageInfos = images.data;
        })
        .catch(err => {
          this.progress = 0;
          if (err.response.data.success == false) {
            createToast(err.response.data.message, {
              position: 'top-right',
              type: 'danger',
              transition: 'bounce',
              showIcon: 'true',
              timeout: 2000,
            });

            this.message = err.response.data.message;
          }
          this.currentImage = undefined;
        });
    },

    // select Image action
    selectImage() {
      const file = this.$refs.file.files.item(0);

      if (file.size > 348770) {
        Notification.image_validation();
      } else {
        this.userData.currentImage = file;
        this.previewImage = URL.createObjectURL(this.user.currentImage);
      }
      this.progress = 0;
      // this.message = '';
    },

    upload() {
      this.progress = 0;
      uploadProfile
        .createGateway(this.userData, event => {
          this.progress = Math.round((100 * event.loaded) / event.total);
        })
        .then(response => {
          this.$router.push({ name: 'allGateway' });
          // this.message = response.data.message;
          createToast(response.data.message, {
            position: 'top-right',
            showIcon: 'true',
            type: 'success',
            hideProgressBar: 'false',
            timeout: 2000,
            swipeClose: 'false',
          });
        })
        .then(images => {
          this.imageInfos = images.data;
        })
        .catch(err => {
          this.progress = 0;
          if (err.response.data.success == false) {
            createToast(err.response.data.message, {
              position: 'top-right',
              type: 'danger',
              transition: 'bounce',
              showIcon: 'true',
              timeout: 2000,
            });

            this.message = err.response.data.message;
          }
          this.currentImage = undefined;
        });
    },
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
  background: #123c3d ;
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
