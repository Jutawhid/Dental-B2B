<template>
  <div class="app-content content">
    <div class="content-overlay"></div>
    <div class="header-navbar-shadow"></div>
    <div class="col-lg-12 content-wrapper">
      <div class="row">
        <div class="col-lg-6 col-sm-12">
          <h1 class="text-bold-700 mb-0 headerTXT">My Profile</h1>
        </div>
        <div
          class="col-lg-6 col-sm-12 d-flex justify-content-lg-end justify-content-center align-items-center"
        >
          <!-- <a href="/profile/dentist"> -->
          <router-link :to="{ name: 'DentistProfile' }">
            <button type="submit" class="update__btn clrRed">
              <i class="fa fa-backward"></i>
              Back
            </button>
          </router-link>
          <button class="ml-1 update__btn" @click="upload">Save Changes</button>
        </div>
        <div class="col-12">
          <hr />
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 col-lg-3">
          <div class="avatar-upload">
            <div class="avatar-edit">
              <input
                class="form-control"
                type="file"
                id="imageUpload"
                accept="image/jpg, image/jpeg, image/png, image/JPG, image/JPEG, image/PNG"
                ref="file"
                @change="selectImage"
              />
              <label for="imageUpload"></label>
            </div>
            <div class="avatar-preview">
              <div
                v-if="previewImage"
                id="imagePreview2"
                :style="{ backgroundImage: 'url(' + previewImage + ')' }"
                alt="photo"
              ></div>
              <div
                v-if="!previewImage"
                id="imagePreview"
                :style="{
                  backgroundImage: 'url(' + baseImg + ')',
                }"
                alt="photo"
              ></div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <!-- 1st Section -->
          <div class="card">
            <div class="row card-body">
              <!-- First Name-->
              <div class="form-group col-xl-6">
                <label for="first_name"
                  >First Name <span class="required-input">*</span>
                </label>
                <input
                  class="form-control"
                  name="first_name"
                  id="first_name"
                  type="text"
                  v-model="user.first_name"
                  @blur="validate('first_name')"
                  @keypress="validate('first_name')"
                />
                <p class="form-input-hint" v-if="!!errors.first_name">
                  {{ errors.first_name }}
                </p>
              </div>
              <!-- Last Name-->
              <div class="form-group col-xl-6">
                <label for="last_name"
                  >Last Name <span class="required-input">*</span></label
                >
                <input
                  class="form-control"
                  name="last_name"
                  id="last_name"
                  type="text"
                  v-model="user.last_name"
                  @blur="validate('last_name')"
                  @keypress="validate('last_name')"
                />
                <p class="form-input-hint" v-if="!!errors.last_name">
                  {{ errors.last_name }}
                </p>
              </div>
              <!-- User Name-->
              <div class="form-group col-xl-6">
                <label for="user_name">User Name</label>
                <input
                  class="form-control"
                  readonly
                  name="user_name"
                  id="user_name"
                  type="text"
                  v-model="user.user_name"
                />
              </div>
              <!-- 
              <div class="form-group col-xl-6">
                <label for="email">Email</label>
                <input
                  class="form-control"
                  name="email"
                  id="email"
                  type="text"
                  v-model="user.email"
                />
              </div> -->
              <!-- contact -->
              <div class="form-group col-xl-6">
                <label for="phone">Contact</label>
                <input
                  class="form-control"
                  name="phone"
                  id="phone"
                  type="text"
                  v-model="user.phone"
                  @blur="validate('phone')"
                  @keypress="validate('phone')"
                />
                <p class="form-input-hint" v-if="!!errors.phone">
                  {{ errors.phone }}
                </p>
              </div>
              <!-- license -->
              <div class="form-group col-xl-6">
                <label for="license">License Number</label>
                <input
                  class="form-control"
                  name="license"
                  id="license"
                  type="text"
                  v-model="user.license"
                  @blur="validate('license')"
                  @keypress="validate('license')"
                />
                <p class="form-input-hint" v-if="!!errors.license">
                  {{ errors.license }}
                </p>
              </div>
              <!-- npi_number -->
              <div class="form-group col-xl-6">
                <label for="npi_number">NPI Number </label>
                <input
                  class="form-control"
                  name="npi_number"
                  id="npi_number"
                  type="number"
                  v-model="user.npi_number"
                  readonly
                />
              </div>
              <!-- Fax -->
              <div class="form-group col-xl-6">
                <label for="fax">Fax </label>
                <input
                  class="form-control"
                  name="fax"
                  id="fax"
                  type="text"
                  v-model="user.fax"
                  @blur="validate('fax')"
                  @keypress="validate('fax')"
                />
                <p class="form-input-hint" v-if="!!errors.fax">
                  {{ errors.fax }}
                </p>
              </div>
              <!-- State -->
              <div class="form-group col-xl-6">
                <label for="state">State </label>
                <Select
                  class="form-control"
                  name="state"
                  id="state"
                  v-model="selectState"
                  @change="getCityList"
                  @blur="validate(selectState)"
                  @keypress="validate(selectState)"
                >
                  <option v-if="!selectState">Select State</option>
                  <option v-if="selectState" selected>
                    {{ user.state_name }}
                  </option>
                  <option v-for="e in stateList" :key="e.id" :value="e.id">
                    {{ e.name }}
                  </option>
                </Select>
                <p class="form-input-hint" v-if="!!errors.selectState">
                  {{ errors.selectState }}
                </p>
              </div>
              <!-- City -->
              <div class="form-group col-xl-6">
                <label for="fax">City </label>
                <Select
                  class="form-control"
                  name="city"
                  id="city"
                  v-model="selectCity"
                  @change="getZipList"
                  @blur="validate(selectCity)"
                  @keypress="validate(selectCity)"
                >
                  <option v-if="!selectCity">Select City</option>
                  <option v-if="selectCity" selected>
                    {{ user.city_name }}
                  </option>
                  <option
                    v-for="e in cityList"
                    :key="e.id"
                    :value="e.id"
                    :selected="e.id === selectCity"
                  >
                    {{ e.name }}
                  </option>
                </Select>
                <p class="form-input-hint" v-if="!!errors.selectCity">
                  {{ errors.selectCity }}
                </p>
              </div>
              <!-- Zip -->
              <div class="form-group col-xl-6">
                <label for="zipCode"> Zip Code </label>
                <input
                  readonly
                  class="form-control"
                  name="zipCode"
                  id="zipCode"
                  type="text"
                  :value="selectZip.code"
                />
              </div>
              <!-- Address -->
              <div class="form-group col-xl-12">
                <label for="address">Address </label>
                <input
                  class="form-control"
                  name="address"
                  id="address"
                  type="text"
                  v-model="user.address"
                  @blur="validate('address')"
                  @keypress="validate('address')"
                />
                <p class="form-input-hint" v-if="!!errors.address">
                  {{ errors.address }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createToast } from 'mosha-vue-toastify';
import profileService from '../../../../../services/profile.service';
import UploadProfile from '../../../../../services/uploadProfile';
// import { FileApi } from '../../../../../api/FileApi';
import userAPI from '../../../../../services/user.API';
import { object, string } from 'yup';

export default {
  name: 'DentistProfileUpdate',
  mounted() {
    // get user Data
    profileService.getUser().then(
      res => {
        // console.log(res);
        if (res) {
          this.user = res;
          this.selectState = res.state_id;
          this.selectCity = res.city_id;
          this.selectZip.code = res.zip_code;
          this.selectZip.id = res.zip_id;
          this.profileImg = res.profile_image;
          this.coverImage = res.cover_image;
          this.baseImg = res.imageFolderPath + '/' + res.profile_image;
        } else {
          this.user = {};
        }
      },
      error => {
        // console.log(error.response.data);
        if (error.response.data.message) {
          this.user = {};
          createToast({
            message: error.response.data.message,
            type: 'error',
            position: 'top-right',
            duration: 5000,
          });
        }
      },
    );

    // get state
    userAPI.getStateList().then(
      res => {
        console.log(res);
        if (res.data.data) {
          this.stateList = res.data.data;
        } else {
          this.stateList = [];
        }
      },
      error => {
        if (error.response.data.success === false) {
          this.stateList = [];
        }
      },
    );
  },
  data() {
    const schema = object().shape({
      // schema
      name: string()
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name must be less than 50 characters')
        .required('Name is required'),
      // email: string()
      //   .min(3, 'Email must be at least 3 characters')
      //   .max(50, 'Email must be less than 50 characters')
      //   .email('Email is invalid')
      //   .required('Email is required'),
      first_name: string()
        .min(3, 'First name must be at least 3 characters')
        .max(50, 'First name must be less than 50 characters')
        .required('First name is required'),
      last_name: string()
        .min(3, 'Last name must be at least 3 characters')
        .max(50, 'Last name must be less than 50 characters')
        .required('Last name is required'),
      // user_name: string()
      //   .min(3, 'User name must be at least 3 characters')
      //   .max(20, 'User name must be less than 20 characters')
      //   .required('User name is required'),
      phone: string()
        .matches(
          /^[\\+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s\\.]?[0-9]{4,6}$/im,
          'Phone number is invalid',
        )
        .required('Phone is required'),
      fax: string()
        .matches(/\+1[2-9][0-9]{9}/, 'Fax number is invalid')
        .required('Fax is required'),
      license: string()
        // .min(3, 'License number must be at least 3 characters')
        // .max(20, 'License number must be less than 20 characters')
        .required('License number is required'),
      selectState: string().required('State is required'),
      selectCity: string().required('City is required'),
      selectZip: string().required('Zip is required'),
      address: string()
        .min(3, 'Address must be at least 3 characters')
        .max(255, 'Address must be less than 255 characters')
        .required('Address is required'),
      description: string()
        .min(20, 'Bio must be at least 20 characters')
        .max(500, 'Bio must be less than 500 characters')
        .required('Bio is required'),
    });
    return {
      schema,
      user: {},
      profileImg: '',
      coverImage: '',
      previewImage: undefined,
      baseImg: '',
      progress: 0,
      message: '',
      stateList: [],
      selectState: [],
      cityList: [],
      selectCity: [],
      zipList: [],
      selectZip: [],
      // profile_image_path: "https://www.rayyforce.com/wp-content/uploads/2019/11/dummy-profile.jpg"
      errors: {
        first_name: '',
        last_name: '',
        address: '',
        description: '',
        name: '',
        user_name: '',
        email: '',
        phone: '',
        fax: '',
        license: '',
        role: {
          role_id: '',
        },
        selectState: '',
        selectCity: '',
        selectZip: '',
      },
    };
  },
  methods: {
    // validate
    validate(field) {
      this.schema
        .validateAt(field, this.user)
        .then(() => {
          this.errors[field] = '';
        })
        .catch(err => {
          this.errors[field] = err.message;
        });
      console.log(this.errors);
    },
    // get City
    getCityList(e) {
      this.selectState = e.target.value;
      this.selectCity = '';
      this.selectZip = '';
      console.log(this.selectState);
      if (this.selectState) {
        userAPI.getCityList(Number(this.selectState)).then(
          res => {
            console.log(res);
            if (res.data.data) {
              this.cityList = res.data.data;
            } else {
              this.cityList = [];
            }
          },
          error => {
            if (error.response.data.success === false) {
              this.cityList = [];
            }
          },
        );
      }
    },

    // get Zip
    getZipList(e) {
      this.selectCity = e.target.value;
      console.log(this.selectCity);
      if (this.selectCity) {
        userAPI.getZipCodeList(Number(this.selectCity)).then(
          res => {
            console.log(res);
            if (res.data.data) {
              this.zipList = res.data.data;
              this.selectZip = this.zipList[0];
            } else {
              this.zipList = [];
            }
          },
          error => {
            if (error.response.data.success === false) {
              this.zipList = [];
            }
          },
        );
      }
    },

    // select Image
    selectImage() {
      const file = this.$refs.file.files.item(0);
      console.log(file);
      if (file.size > 1000000) {
        // Notification.image_validation();
        this.$moshaToast('Photo size must be below 1MB', {
          position: 'top-right',
          showIcon: 'true',
          type: 'success',
          hideProgressBar: 'true',
          timeout: 5000,
          swipeClose: 'false',
        });
      } else {
        this.user.currentImage = file;
        this.previewImage = URL.createObjectURL(this.user.currentImage);
      }
      this.progress = 0;
      this.message = '';
      // console.log(this.user.currentImage);
      // console.log(this.previewImage);
    },

    // upload/submit
    upload() {
      if (this.errors.first_name === '') {
        console.log('Okay');
      } else {
        this.updateBtn = false;
      }

      this.progress = 0;
      // console.log(this.user?.currentImage);
      // console.log(this.user);
      let address = {
        state: Number(this.selectState),
        city: Number(this.selectCity),
        zip: Number(this.selectZip.id),
      };
      console.log(address);
      if (!this.user.first_name) {
        this.errors.first_name = 'First name is required';
      }
      if (!this.user.last_name) {
        this.errors.last_name = 'Last name is required';
      }
      if (!this.user.phone) {
        this.errors.phone = 'Contact is required';
      }
      if (!this.user.fax) {
        this.errors.fax = 'Fax is required';
      }
      if (!this.user.license) {
        this.errors.license = 'License number is required';
      }
      if (!this.user.address) {
        this.errors.address = 'Address is required';
      }
      if (!this.selectState) {
        this.errors.selectState = 'State is required';
      }
      if (!this.selectCity) {
        this.errors.selectCity = 'City is required';
      }
      if (!this.selectZip) {
        this.errors.selectZip = 'Zip is required';
      }

      if (
        (this.user.name || (this.user.first_name && this.user.last_name)) &&
        this.user.phone &&
        this.user.fax &&
        this.user.license &&
        this.user.address &&
        this.selectState &&
        this.selectCity &&
        this.selectZip
      ) {
        UploadProfile.dentistUpdate(this.user, address, event => {
          this.progress = Math.round((100 * event.loaded) / event.total);
        })
          .then(response => {
            if (response.data.success == true) {
              this.$store.dispatch('profile/loadUser');
              this.$store.dispatch('auth/reloadPhoto');
              // this.$router.push({ name: 'DentistProfile' });
              this.$router.push('/dentist/dentist ');
              // location.href = '/dentist/dentist';
              this.message = response.data.message;
              this.$moshaToast(this.message, {
                position: 'top-right',
                showIcon: 'true',
                type: 'success',
                hideProgressBar: 'false',
                timeout: 2000,
                swipeClose: 'false',
              });
            }
            // return UploadProfile.getFiles();
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
            /*this.$moshaToast(this.message, {
            position: "top-right",
            showIcon: "true",
            type: "danger",
            hideProgressBar: "false",
            timeout: 2000,
            swipeClose: "false",
          });*/
          });
      }
    },
  },
};
</script>

<style scoped>
@import url('https://unpkg.com/vue-next-select/dist/index.min.css');
.alert-warning {
  background: rgba(255, 159, 67, 0.2) !important;
  color: #c71010 !important;
}
.form-input-hint {
  color: red;
  font-size: 12px;
  margin: 0;
  position: absolute;
}
.form-group {
  margin-bottom: 2rem;
}
.required-input {
  color: red;
}
.card {
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 15px;
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
  right: -1rem;
  z-index: 1;
  top: 2rem;
}
.avatar-upload {
  position: relative;
  max-width: 200px;
  margin: 20px auto;
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
  background: #123c3d;
  box-shadow: none;
  border-radius: 5px;
  padding: 10px 40px;
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
.clrRed {
  padding: 10px 20px !important;
  background: red !important;
  border: 1px solid red !important;
  color: white !important;
  cursor: pointer;
}
.update__btn:hover {
  background: #ffcc3f;
  color: #123c3d;
  border: 1px solid #ffcc3f;
}
input {
  font-weight: 600;
  font-family: Poppins;
  color: #000000;
  font-size: 12px;
  display: block;
  box-sizing: border-box;
  width: 100%;
  bottom: 0px;
}
input {
  position: relative;
  border: 1px solid #bcbaba;
  height: 40px;
  padding-left: 12px;
  margin-top: 10px;
}
input:focus {
  outline: none;
}
.card {
  padding: 50px;
}
.card-body {
  padding: 0;
}
@media only screen and (max-width: 565px) {
  .headerTXT {
    text-align: center;
    margin: 10px !important;
  }
}
.dentist span {
  margin: 5px;
  color: red;
}
.dentist input {
  margin-bottom: 10px;
}

</style>
