<template>
  <div>
    <!-- Container Fluid-->
    <div class="row">
      <div class="col-lg-12">
        <div class="profile-header d-flex">
          <div class="cover-container">
            <img
              @error="replaceCoverImg"
              v-if="user.cover_image"
              class="img-fluid bg-cover w-100"
              :src="this.BASE_IMG + user.cover_image"
              alt="User Profile Image"
              style="border-radius: 20px"
            />
            <img
              v-if="!user.cover_image"
              class="bg-cover w-100"
              src="../../../../assets/images/explore/cover_img.jpg"
              alt="User Profile Image"
              style="border-radius: 20px"
            />
          </div>
        </div>
      </div>
      <div class="col-lg-3">
        <div class="profile-img-container d-flex">
          <img
            v-if="user.profile_image"
            @error="replaceProfileImg"
            :src="this.BASE_IMG + '/' + user.profile_image"
            alt="no-profile-pic"
          />
          <img
            v-if="!user.profile_image"
            src="../../../../assets/images/explore/cover_img.jpg"
            alt="no-profile-pic"
          />
        </div>
      </div>
      <div class="col-sm-12 col-lg-9 pl-lg-0 pt-0">
        <!-- 1st Section -->

        <!-- End -->
        <div class="card profile-card">
          <div class="card-body">
            <div class="row">
              <div class="col-lg-10">
                <div class="profile-card-head">
                  <div class="profile-card-title d-flex">
                    <h2 class="font-weight-bolder">
                      {{ user.first_name + ' ' + user.last_name }}
                    </h2>
                  </div>
                </div>
              </div>
              <div class="col-lg-2" v-if="role === 2">
                <router-link :to="'/messages/' + user.user_id">
                  <button class="btn msg-btn btn-edit waves-effect waves-light">
                    <i class="feather icon-edit-1 mr-50"></i>Message
                  </button>
                </router-link>
              </div>
              <div class="col-lg-12">
                <div class="ratings-box d-flex flex-wrap">
                  <!-- <span class="font-medium-3" style="letter-spacing: 3px"> -->
                  <!-- <vue3starRatings
                    v-model="value"
                    :starSize="starSize"
                    :disableClick="true"
                    :showControl="false"
                    :controlSize="controlSize"
                    :numberOfStars="5"
                    :step="0.5"
                  /> -->
                  <star-rating
                    read-only
                    :rating="user.ratings"
                    :star-size="20"
                    :show-rating="false"
                    :border-width="2"
                    :rounded-corners="true"
                    :padding="4"
                  ></star-rating>
                  <!-- </span> -->
                  <span class="ml-75 font-weight-bolder"
                    >(
                    {{
                      user.total_case > 0
                        ? user.total_case + 'cases'
                        : 'No case found'
                    }}
                    )</span
                  >
                </div>
              </div>
              <div class="col-lg-12 my-2">
                <p>
                  {{ user.bio }}
                </p>
              </div>
              <div class="col-lg-2 d-flex align-items-center">
                <h4 class="black font-weight-bolder">Services</h4>
              </div>
              <div class="col-lg-10">
                <div
                  class="chip chip-cat-add"
                  v-for="service in user.service"
                  :key="service.id"
                >
                  <div class="chip-body">
                    <div class="chip-text">{{ service.name }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2nd Section -->
      <!-- <div class="col-sm-12 col-lg-9 offset-lg-3 pl-lg-0 userDetails mt150">
        <div class="card">
          <div class="row card-body">
            <div class="col-12">
              <div class="row">
                <div class="col-lg-6">
                  <h4 class="font-weight-bolder">Basic Information</h4>
                  <div class="row ml-0">
                    <div class="col-12 left-border">
                      <div class="tab-info-group">
                        <div class="label">Name</div>
                        <div class="detail text-capitalize">
                          {{ user.first_name + ' ' + user.last_name }}
                        </div>
                      </div>
                      <div class="tab-info-group">
                        <div class="label">User name</div>
                        <div class="detail">{{ user.user_name }}</div>
                      </div>
                      <div class="tab-info-group">
                        <div class="label">Email</div>
                        <div class="detail">{{ user.email }}</div>
                      </div>

                      <div class="tab-info-group">
                        <div class="label">Phone</div>
                        <div class="detail">{{ user.phone }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="row ml-0 mt-1">
                    <div class="col-12 left-border">
                      <div class="tab-info-group">
                        <div class="label">Fax</div>
                        <div class="detail">{{ user.fax }}</div>
                      </div>
                      <div class="tab-info-group">
                        <div class="label">Address</div>
                        <div class="detail">{{ user.address }}</div>
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </div>
    <!-- </div>
    </div> -->

    <!---Container Fluid-->
  </div>
</template>

<script>
//Star rating
import StarRating from 'vue-star-rating';
import profileService from '../../../../services/profile.service';
import coverImg from '../../../../assets/images/explore/cover_img.jpg';
import proPic from '../../../../assets/images/profile/no-user.png';

export default {
  name: 'ConsultantProfileView',
  components: {
    StarRating,
  },
  data() {
    return {
      user: {},
      BASE_IMG: '',
      role: '',
      value: this.user_details.ratings.toString(),
      starSize: '18',
      controlSize: '0',
    };
  },
  mounted() {
    if (this.user_details) {
      this.user = this.user_details;
      this.BASE_IMG = this.user_details.image_folder_path;
    }
    profileService.getUser().then(response => {
      this.role = response.role.role_id;
    });
  },
  methods: {
    replaceCoverImg(e) {
      e.target.src = coverImg;
    },
    replaceProfileImg(e) {
      e.target.src = proPic;
    },
  },
  props: ['user_details'],
};
</script>

<style scoped>
.cover-container img {
  width: 100%;
  max-height: 350px;
}
#user-profile .cover-edit-button {
  position: absolute;
  top: 1rem;
  left: 5%;
}

#user-profile .cover-edit-button .btn-edit {
  background: #ffffffba;
  color: #000000;
  font-weight: 600;
  font-family: 'Poppins';
  box-shadow: 0px 3px 6px #00000029;
  margin: 0px 0px 20px;
}

#user-profile .cover-edit-button .btn-edit:hover {
  background: #ffd700;
  color: #000000;
}

#user-profile .cover-edit-button i {
  font-weight: 600;
  margin-right: 15px;
}

#user-profile .profile-card .btn-edit {
  background: #ffd700;
  color: #000000;
  font-weight: 600;
  font-family: 'Poppins';
  box-shadow: 0px 3px 6px #00000029;
  float: right;
  border-radius: 20px;
}

#user-profile .card.profile-card {
  border-radius: 15px;
  margin-right: 50px;
  top: -10rem;
}

#user-profile .card.profile-card p {
  font-size: 12px;
}

#user-profile .profile-card .btn-edit:hover {
  background: #ffd700;
  color: #000000;
}

#user-profile .profile-card i {
  font-weight: 600;
}

#user-profile .profile-card .chip-cat {
  margin-right: 5px;
  border-radius: 10px;
  padding: 10px 20px;
  font-weight: 600;
}

#user-profile .profile-card .chip-cat-add {
  background-color: #00e2f2;
  border-radius: 10px;
  padding: 10px 20px;
  font-weight: 600;
}

#user-profile .profile-img-container {
  position: relative;
  top: -10rem;
  padding: 0px 50px;
}

#user-profile .profile-img-container img {
  /* border: 0.3rem solid #fff; */
  height: 200px;
  width: 200px;
  border-radius: 20px;

  box-shadow: 0px 1px 2px #00000029;
}

#user-profile .profile-header {
  flex-flow: column;
  /*margin-bottom: -10rem;*/
}

#user-profile .profile-header .icon-heart {
  font-size: 24px;
  line-height: 1.2;
  margin: 0px 20px;
}

#user-profile .profile-header .icon-heart {
  font-size: 24px;
  line-height: 1.2;
  margin: 0px 20px;
}

#user-profile .profile-card-title a {
  color: #000000;
  font-size: 20px;
  margin-left: 20px;
}

@media (max-width: 767.98px) {
  #user-profile .profile-img-container {
    flex-flow: column;
    top: -4rem;
    padding: 0px;
    align-items: center;
  }
  .p-mobile-0 {
    padding-left: 0px;
    padding-right: 0px;
  }

  #user-profile .profile-img-container img {
    /* border: 0.2rem solid #fff; */
    height: 150px;
    width: 150px;
    border-radius: 10px;
    margin-bottom: 20px;
  }

  #user-profile .cover-edit-button .btn-edit {
    margin: 0px 5px;
    padding: 5px;
  }
  #user-profile .cover-edit-button .btn-edit > span {
    display: none;
  }
  #user-profile .cover-edit-button i {
    font-weight: 600;
    margin-right: 0px;
  }

  #user-profile .card.profile-card {
    margin-left: 0px;
    padding: 0px;
  }

  #user-profile .profile-card .btn-edit {
    margin: 10px 0px 20px;
    float: left;
  }

  #user-profile .profile-card .chip-cat {
    width: 100%;
  }

  #profile-info .card {
    margin-top: -5rem;
  }
  .mt150 {
    margin-top: -8rem !important;
    margin-right: 3.5rem !important;
    border-radius: 15px !important;
  }
  .col-sm-12.col-lg-9.offset-lg-3.pl-lg-0.userDetails.mt150F {
    margin-top: -150px;
  }
}
img.img-fluid.bg-cover.w-100 {
  max-height: 500px;
}
.vue3-star-ratings__wrapper {
  display: block;
  margin: -2px 0px 0 5px;
  text-align: center;
  padding: 0;
  max-width: 150px;
}
</style>
