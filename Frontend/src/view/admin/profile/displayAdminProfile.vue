<template>
  <div>
    <!-- Container Fluid-->
    <div class="d-lg-flex">
      <div class="col-sm-12 col-lg-auto">
        <div class="my-lg-5 mx-lg-2 avatar-upload">
          <div class="avatar-preview">
            <div
              v-if="user.profile_image"
              id="imagePreview"
              :style="{ backgroundImage: 'url(' + userImg + ')' }"
              alt="photo"
              @error="replaceByDefault"
            ></div>
            <div
              v-if="!user.profile_image"
              id="imagePreview"
              style="
                background-image: url(https://www.rayyforce.com/wp-content/uploads/2019/11/dummy-user.jpg);
              "
              alt="photo"
              @error="replaceByDefault"
            ></div>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-lg-9">
        <!-- Upper Section -->
        <div class="card mt-5">
          <div class="row card-body">
            <div class="col-12">
              <!-- Start -->
              <div class="row">
                <div class="col-lg-12">
                  <h4 class="font-weight-bolder">Basic Information</h4>
                  <div class="row ml-0">
                    <div class="col-lg-6 left-border">
                      <div class="tab-info-group">
                        <div class="label">Role Name</div>
                        <div class="detail">
                          <p v-if="user.role?.role_id === 2">Admin</p>
                          <p v-else>Super Admin</p>
                        </div>
                      </div>
                      <div class="tab-info-group">
                        <div class="label">Role ID</div>
                        <div class="detail">
                          {{
                            user.role?.role_id
                              ? user.role?.role_id
                              : 'Not available'
                          }}
                        </div>
                      </div>
                      <div class="tab-info-group">
                        <div class="label">First Name</div>
                        <div class="detail">
                          {{
                            user.first_name ? user.first_name : 'Not available'
                          }}
                        </div>
                      </div>
                      <div class="tab-info-group">
                        <div class="label">Last Name</div>
                        <div class="detail">
                          {{
                            user.last_name ? user.last_name : 'Not available'
                          }}
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-6 left-border">
                      <div class="tab-info-group">
                        <div class="label">User Name</div>
                        <div class="detail">
                          {{
                            this.$store.state.auth.user.user_name
                              ? this.$store.state.auth.user.user_name
                              : 'Not available'
                          }}
                        </div>
                      </div>

                      <div class="tab-info-group">
                        <div class="label">Email</div>
                        <div class="detail">
                          {{ user.email ? user.email : 'Not available' }}
                        </div>
                      </div>

                      <div class="tab-info-group">
                        <div class="label">Phone</div>
                        <div class="detail">
                          {{ user.phone ? user.phone : 'Not available' }}
                        </div>
                      </div>

                      <div class="tab-info-group">
                        <div class="label">Address</div>
                        <div class="detail">
                          {{ user.address ? user.address : 'Not available' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!---End -->
          </div>
        </div>
        <!-- End Section -->
      </div>
    </div>
    <!---Container Fluid-->
  </div>
</template>

<script>
import profileService from '../../../services/profile.service';
import proImg from '../../../assets/images/profile/no-user.png';
export default {
  name: 'AdminProfileView',
  mounted() {
    profileService.getUser().then(
      response => {
        // console.log(response)
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
  },

  data() {
    return {
      image: '',
      user: {},
      userImg: '',
    };
  },
  methods: {
    replaceByDefault(e) {
      e.target.style.backgroundImage = proImg;
    },
  },
};
</script>

<style scoped>
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
</style>
