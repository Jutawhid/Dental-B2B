<template>
  <div>
    <!-- Top Lab/Tech company Profile details-->
    <div class="row">
      <div class="col-lg-12">
        <div class="profile-header d-flex">
          <div class="cover-container">
            <img
              v-if="userData.cover_image"
              class="img-fluid bg-cover w-100"
              :src="this.BASE_IMG + '/' + userData.cover_image"
              alt="User Profile Image"
              style="border-radius: 20px"
              @error="replaceCoverImage"
            />
            <img
              v-if="!userData.cover_image"
              class="img-fluid bg-cover w-100"
              src="../../../../assets/images/explore/cover_img.jpg"
              alt="User Cover Image"
              style="border-radius: 20px"
            />
          </div>
        </div>
      </div>
      <div class="col-lg-3">
        <div class="profile-img-container d-flex">
          <img
            v-if="!userData.profile_image"
            src="../../../../assets/images/profile/no-user.png"
            class="box-shadow-1"
            alt="Card image"
          />
          <img
            v-if="userData.profile_image"
            :src="this.BASE_IMG + '/' + userData.profile_image"
            class="box-shadow-1"
            alt="Card image"
            @error="replaceProfileImage"
          />
        </div>
      </div>
      <div class="col-lg-9 pl-lg-0">
        <div class="card profile-card">
          <div class="card-body">
            <div class="row">
              <div class="col-lg-10">
                <div class="profile-card-head">
                  <div class="profile-card-title d-flex">
                    <h2 class="font-weight-bolder text-capitalize">
                      {{ userData.name }}
                    </h2>

                    <!-- <a href="#"><i class="feather icon-heart"></i></a> -->
                  </div>
                </div>
              </div>
              <div class="col-lg-2" v-if="role === 2">
                <router-link :to="'/messages/' + userData.user_id" tag="button">
                  <button class="btn msg-btn btn-edit waves-effect waves-light">
                    <i class="feather icon-message-circle mr-50"></i>Message
                  </button>
                </router-link>
              </div>
              <!-- <vue3starRatings
                v-model="value"
                :starSize="starSize"
                :disableClick="true"
                :showControl="false"
                :controlSize="controlSize"
                :numberOfStars="5"
                :step="0.5"
                class=""
              />
              <span class="col-lg-8 ml-0 font-weight-500 pl-0"
                >({{
                  userData.total_case
                    ? userData.total_case + ' cases'
                    : 'No case found'
                }})</span
              > -->
              <div class="col-lg-12">
                <div class="ratings-box d-flex flex-wrap">
                  <!-- <span class="font-medium-3" style="letter-spacing: 3px"> -->
                  <star-rating
                    read-only
                    :rating="userData.ratings"
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
                      userData.total_case > 0
                        ? userData.total_case + 'cases'
                        : 'No case found'
                    }}
                    )</span
                  >
                </div>
              </div>
              <div class="col-lg-12 my-2">
                <p>
                  {{ userData.bio }}
                </p>
              </div>
              <div
                class="w-auto d-flex align-items-center"
                v-if="userData?.service?.length >= 0"
              >
                <h4 class="black font-weight-bolder">Services</h4>
              </div>
              <div class="col-lg-10">
                <div
                  class="chip chip-cat"
                  v-for="service in userData.service"
                  :key="service.id"
                >
                  <div class="chip-body">
                    <div class="chip-text">
                      {{ service.name ? service.name : 'No service available' }}
                    </div>
                  </div>
                </div>
                <div
                  class="chip chip-cat"
                  v-if="userData?.service?.length == 0"
                >
                  <div class="chip-body">
                    <div class="chip-text">No service available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!---Top Lab/Tech company Profile details-->
  </div>
</template>

<script type="javascript">
//Star rating
import StarRating from 'vue-star-rating';

import profileService from '../../../../services/profile.service';
import proImg from '../../../../assets/images/profile/no-user.png';
import cover_image from '../../../../assets/images/explore/cover_img.jpg';
export default {
  name: 'profileDetals',
  components: {
    StarRating,
  },
  mounted() {
    if (this.user_details) {
      this.userData = this.user_details;
      this.BASE_IMG = this.user_details.image_folder_path;
    }
    profileService.getUser().then(response => {
      this.role = response.role.role_id;
    });
  },
  data() {
    return {
      userData: {},
      user: {},
      activeItem: 'servicesDetals',
      BASE_IMG: '',
      role: '',
      value: this.user_details.ratings.toString(),
      // starSize: '18',
      // controlSize: '0',
    };
  },
  methods: {
    replaceProfileImage(e) {
      e.target.src = proImg;
    },
    replaceCoverImage(e) {
      e.target.src = cover_image;
    },
  },
  props: ['user_details'],
};
</script>

<style type="text/css" scoped>
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
}
.vue3-star-ratings__wrapper {
  display: block;
  margin: -2px 0px 0 5px;
  text-align: center;
  padding: 0;
  max-width: 150px;
}
</style>
