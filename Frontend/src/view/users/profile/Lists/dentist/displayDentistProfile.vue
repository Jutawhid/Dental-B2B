<template>
  <!-- <div class="col-lg-9"> -->
  <!-- Container Fluid-->
  <div class="row">
    <div class="col-sm-12 col-lg-auto pr-2">
      <div class="mt-2 avatar-upload">
        <!-- <div class="avatar-preview">
          <div
            v-if="user.profile_image"
            id="imagePreview"
            :style="{
              backgroundImage:
                'url(' + user.imageFolderPath + '/' + user.profile_image + ')',
            }"
            alt="photo"
            @error="replaceByDefaultProfileImage"
          ></div>
          <div
            v-if="!user.profile_image"
            id="imagePreview"
            :style="{
              backgroundImage:
                'url(' + require('@/assets/images/profile/no-user.png') + ')',
            }"
            alt="photo"
          ></div>
        </div> -->
        <div class="profile-img-container d-flex">
          <img
            v-if="!user.profile_image"
            src="../../../../../assets/images/profile/no-user.png"
            class="box-shadow-1"
            alt="Card image"
          />
          <img
            v-if="user.profile_image"
            :src="user.imageFolderPath + '/' + user.profile_image"
            class="box-shadow-1"
            alt="Card image"
            @error="replaceByDefaultProImage"
          />
        </div>
      </div>
    </div>
    <div class="col-sm-12 col-lg-7">
      <!-- Upper Section -->
      <div class="card mt-2">
        <div class="row card-body">
          <div class="col-12">
            <!-- Start -->
            <div class="row">
              <div class="col-lg-6">
                <h4 class="font-weight-bolder">My Information</h4>
                <div class="row ml-0">
                  <div class="col-12 left-border">
                    <div class="tab-info-group">
                      <div class="label">Name</div>
                      <div class="detail text-capitalize">
                        {{
                          user.first_name
                            ? user.first_name + ' ' + user.last_name
                            : 'Not available'
                        }}
                      </div>
                    </div>

                    <!-- <div class="tab-info-group">
                      <div class="label">User Name</div>
                      <div class="detail">
                        {{ user.user_name ? user.user_name : 'Not available' }}
                      </div>
                    </div> -->

                    <!-- <div class="tab-info-group">
                      <div class="label">Email</div>
                      <div class="detail">
                        {{ user.email ? user.email : 'Not available' }}
                      </div>
                    </div> -->

                    <!-- <div class="tab-info-group">
                      <div class="label">Phone</div>
                      <div class="detail">
                        {{ user.phone ? user.phone : 'Not available' }}
                      </div>
                    </div>

                    <div class="tab-info-group">
                      <div class="label">Fax</div>
                      <div class="detail">
                        {{ user.fax ? user.fax : 'Not available' }}
                      </div>
                    </div>

                    <div class="tab-info-group">
                      <div class="label">Address</div>
                      <div class="detail">
                        {{ user.address ? user.address : 'Not available' }}
                      </div>
                    </div>

                    <div class="tab-info-group">
                      <div class="label">State, City, Zip Code</div>
                      <div class="detail">
                        {{
                          user.state_name
                            ? user.state_name
                            : 'No State available'
                        }}
                        {{ user.city_name ? ', ' + user.city_name : '' }}
                        {{ user.zip_code ? ', ' + user.zip_code : '' }}
                      </div>
                    </div> -->
                  </div>
                </div>
              </div>
              <!-- <div class="col-lg-6">
                <h4 class="font-weight-bolder">Payment Information</h4>
                <div class="row ml-0">
                  <div class="col-12 left-border">
                    <div class="tab-info-group">
                      <div class="label">Bank Location</div>
                      <div class="detail">United States</div>
                    </div>
                    <div class="tab-info-group">
                      <div class="label">Account Holder's Name</div>
                      <div class="detail">John Doe</div>
                    </div>
                    <div class="tab-info-group">
                      <div class="label">A/C Number</div>
                      <div class="detail">123587469</div>
                    </div>
                    <div class="tab-info-group">
                      <div class="label">9 Digit Routing Number</div>
                      <div class="detail">123456987</div>
                    </div>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
          <!---End -->
        </div>
      </div>
      <!-- End Section -->
    </div>
  </div>
  <!-- -Container Fluid-->
  <!-- </div> -->
</template>

<script>
// import { createToast } from 'mosha-vue-toastify';
import proImg from '../../../../../assets/images/profile/no-user.png';

export default {
  name: 'DentistProfileView',
  mounted() {
    // profileService.getUser().then(
    //   res => {
    //     console.log(res);
    //     if (res) {
    //       this.user = res;
    //     } else {
    //       this.user = {};
    //     }
    //   },
    //   error => {
    //     // console.log(error.response.data);
    //     if (error.response.data.message) {
    //       this.user = {};
    //       createToast({
    //         message: error.response.data.message,
    //         type: 'error',
    //         position: 'top-right',
    //         duration: 5000,
    //       });
    //     }
    //   },
    // );
    if (this.user_details) {
      this.user = this.user_details;
    }
    console.log(this.user);
  },
  data() {
    return {
      user: {},
      pp: '',
    };
  },
  methods: {
    replaceByDefaultProImage(e) {
      e.target.src = proImg;
    },
  },
  props: ['user_details'],
};
</script>

<style scoped>
.profile-img-container {
  position: relative;
  /* top: -10rem; */
  padding: 0px 20px;
}

.profile-img-container img {
  border: 0.3rem solid #fff;
  height: 200px;
  width: 200px;
  border-radius: 20px;

  box-shadow: 0px 3px 6px #00000029;
}

.card.mt-5 {
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 15px;
}
.profile-card .chip-cat-add {
  background-color: #00e2f2;
  border-radius: 10px;
  padding: 10px 20px;
  font-weight: 600;
}
.profile-card .chip-cat {
  margin-right: 5px;
  border-radius: 10px;
  padding: 10px 20px;
  font-weight: 600;
}
.chip {
  background-color: #e2e2e2;
  font-size: 0.8rem;
  border-radius: 1.428rem;
  display: inline-flex;
  padding: 0 10px;
  margin-bottom: 5px;
  vertical-align: middle;
  justify-content: center;
}
.card {
  padding: 50px;
}
.card-body {
  padding: 0;
}
.dentist {
  min-height: 50px;
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
.avatar-upload {
  position: relative;
  max-width: 200px;
  margin: 10px auto;
  margin-top: 30px;
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
button,
.update__btn {
  margin-left: 5px;
  background: #123c3d;
  box-shadow: none;
  border-radius: 5px;
  padding: 10px 30px;
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
.update__btn:hover {
  background: #ffcc3f;
  color: #123c3d;
  border: 1px solid #ffcc3f;
}
div.label {
  text-transform: uppercase;
}
</style>
