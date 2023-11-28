<template>
  <div class="app-content content">
    <div class="content-overlay"></div>
    <div class="header-navbar-shadow"></div>
    <div class="col-lg-12 content-wrapper">
      <div class="row">
        <div class="col-lg-5 col-sm-12">
          <h1 class="text-bold-700 mb-0 headerTXT">My Profile</h1>
        </div>
        <div
          class="col-lg-5 col-sm-12 d-flex justify-content-lg-end justify-content-center align-items-center"
        >
          <!-- <a href="/profile/dentist"> -->
          <router-link :to="{ name: 'adminProfile' }">
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
        <div class="col-xl-12" v-if="message">
          <div
            class="alert alert-warning alert-dismissible fade show"
            :class="successful ? 'alert-success' : 'alert-warning'"
            role="alert"
          >
            <strong>{{ message }}</strong>
            <button
              type="button"
              class="close"
              data-dismiss="alert"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-sm-12 col-lg-3 mb-2">
          <div class="avatar-upload">
            <div class="avatar-edit">
              <input
                class="form-control"
                type="file"
                id="imageUpload"
                accept="image/*"
                ref="file"
                @change="selectImage"
              />
              <label for="imageUpload"></label>
            </div>
            <div class="avatar-preview">
              <!-- <div
                v-if="previewImage"
                id="imagePreview2"
                :style="{ backgroundImage: 'url(' + previewImage + ')' }"
                @error="replaceImage"
                alt="photo"
              ></div> -->
              <div class="profile-img-container d-flex">
                <img
                  v-if="previewImage"
                  id="imagePreview2"
                  :src="previewImage"
                  @error="replaceImage"
                  alt="photo"
                />
                <img
                  v-if="!previewImage"
                  id="imagePreview"
                  :src="userImg"
                  @error="replaceImage"
                  alt="photo"
                />
              </div>
              <!-- <div
                v-if="!previewImage"
                id="imagePreview"
                :style="{ backgroundImage: 'url(' + userImg + ')' }"
                alt="photo"
              ></div> -->
            </div>
          </div>
        </div>
        <div class="col-lg-7">
          <!-- 1st Section -->
          <div class="card">
            <div class="row card-body">
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
              <!-- email -->
              <div class="form-group col-xl-6">
                <label for="email">Email</label>
                <input
                  class="form-control"
                  name="email"
                  id="email"
                  type="text"
                  v-model="user.email"
                  required
                />
              </div>
              <!-- first Name-->
              <div class="form-group col-xl-6">
                <label for="first_name">First Name </label>
                <input
                  class="form-control"
                  name="first_name"
                  id="first_name"
                  type="text"
                  v-model="user.first_name"
                />
              </div>
              <!-- Last Name-->
              <div class="form-group col-xl-6">
                <label for="last_name">Last Name </label>
                <input
                  class="form-control"
                  name="last_name"
                  id="last_name"
                  type="text"
                  v-model="user.last_name"
                />
              </div>
              <!-- contact -->
              <div class="form-group col-xl-6">
                <label for="phone">Phone</label>
                <input
                  class="form-control"
                  name="phone"
                  id="phone"
                  type="text"
                  v-model="user.phone"
                />
              </div>

              <div class="form-group col-xl-6">
                <label for="address">Address</label>
                <input
                  class="form-control"
                  name="address"
                  id="address"
                  type="text"
                  v-model="user.address"
                />
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
import profileService from '../../../services/profile.service';
import UploadProfile from '../../../services/uploadProfile';
import proImg from '../../../assets/images/profile/no-user.png';
export default {
  name: 'UpdateAdminProfile',
  mounted() {
    profileService.getUser().then(
      response => {
        if (response) {
          this.user = response;
          this.userImg =
            this.user.imageFolderPath + '/' + this.user.profile_image;
        } else {
          this.user = {};
        }
      },
      error => {
        this.user =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      },
    );
    this.$store.dispatch('profile/loadUser');
  },

  data() {
    return {
      user: {
        currentImage: undefined,
        full_name: '',
        user_name: '',
        email: '',
        contact: '',
      },
      previewImage: undefined,
      progress: 0,
      message: '',
      userImg: '',
    };
  },
  methods: {
    replaceImage(e) {
      e.target.src = proImg;
    },
    selectImage() {
      const file = this.$refs.file.files.item(0);

      if (file.size > 348770) {
        Notification.image_validation();
      } else {
        this.user.currentImage = file;
        this.previewImage = URL.createObjectURL(this.user.currentImage);
      }
      this.progress = 0;
      this.message = '';
    },

    upload() {
      this.progress = 0;
      if (this.user) {
        UploadProfile.adminProfileUpdate(this.user, event => {
          this.progress = Math.round((100 * event.loaded) / event.total);
        })
          .then(response => {
            this.$router.push('/profile/admin');
            if (response.data.success == true) {
              createToast(response.data.message, {
                position: 'top-right',
                type: 'success',
                transition: 'bounce',
                showIcon: 'true',
                timeout: 2000,
              });
            }
          })
          .then(images => {
            this.imageInfos = images.data;
          })
          .catch(error => {
            this.progress = 0;
            this.currentImage = undefined;
            if (error.response.data.success == false) {
              createToast(error.response.data.message, {
                position: 'top-right',
                type: 'danger',
                transition: 'bounce',
                showIcon: 'true',
                timeout: 2000,
              });
            }
          });
      }
    },

    submit() {
      this.upload();
    },
  },
};
</script>

<style scoped>
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
  margin: auto;
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
  .headerTXT {
    text-align: center;
    margin: 30px !important;
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
