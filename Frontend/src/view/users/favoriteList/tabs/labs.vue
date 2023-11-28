<template>
  <div class="row tab">
    <!-- Labs -->
    <div
      v-for="lab in labs?.data?.slice(0, 10)"
      :key="lab.profileData[0].id"
      class="col-lg-4 col-md-6 my-1"
    >
      <div class="cardBody profile-cont">
        <div
          class="cover"
          :style="{
            backgroundImage:
              'url(' +
              this.BASE_IMG +
              '/' +
              lab.profileData[0].cover_image +
              ')',
          }"
        >
          <!-- adding profile pic -->
          <div class="proPic">
            <img
              v-if="lab.profileData[0].profile_image"
              :src="this.BASE_IMG + '/' + lab.profileData[0].profile_image"
              @error="replaceByDefaultProImage"
              alt="proPic"
            />
            <img
              v-if="!lab.profileData[0].profile_image"
              src="../../../../assets/images/explore/no-preview.png"
              alt="noProPic"
            />
          </div>
        </div>
        <div class="col-12 px-0">
          <!-- adding lab name & ratings -->
          <div class="row my-1 mx-0">
            <div class="col-lg-8 col-md-8 labName text-capitalize d-flex">
              <router-link
                :to="{
                  path: '/user/' + lab.favorite_user_id,
                  params: { user_id: lab.favorite_user_id },
                }"
              >
                <h5 class="name sp-name">
                  {{ lab.profileData[0].name }}
                </h5>
                <img
                  class="favorite favourite-btn"
                  src="../../../../assets/images/icons/common/heart.svg"
                  @click="removeAction(lab.favorite_user_id)"
                  alt="star"
                />
              </router-link>
            </div>
            <div class="col-lg-4 col-md-4 d-flex justify-content-end cardStar">
              <star-rating
                read-only
                :rating="lab.profileData[0].ratings"
                :star-size="starSize"
                :show-rating="false"
                :border-width="2"
                :rounded-corners="true"
                :padding="0"
              ></star-rating>
            </div>
          </div>
          <!-- adding description -->
          <div class="row" v-if="lab.profileData[0].description">
            <div class="col-12 px-2 mb-1">
              <div class="desc">
                {{ lab.profileData[0].description }}
              </div>
            </div>
          </div>
          <div class="d-flex flex-wrap" v-if="lab.service.length > 0">
            <div
              class="serviceBtn"
              v-for="service in lab.service"
              :key="service.service_id"
            >
              {{ service.name }}
            </div>
          </div>
          <div class="d-flex flex-wrap" v-if="lab.service.length == 0">
            <div class="serviceBtn">No Service Available</div>
          </div>
        </div>
      </div>
    </div>
    <div class="alert alert-info" v-if="labs?.data?.length == 0">
      Favorite list is empty!
    </div>
  </div>
</template>

<script>
import userAPI from '../../../../services/user.API';

import { createToast } from 'mosha-vue-toastify';
import Swal from 'sweetalert2';
import proPic from '../../../../assets/images/profile/no-user.png';
import StarRating from 'vue-star-rating';
export default {
  name: 'Labs',
  components: {
    StarRating,
  },
  data() {
    return {
      starSize: 12,
      controlSize: '0',
    };
  },
  methods: {
    replaceByDefaultProImage(e) {
      e.target.src = proPic;
    },
    removeAction(id) {
      // remove from favorite list
      if (id) {
        Swal.fire({
          title: 'Do you want to Remove from Favorite List?',
          icon: 'warning',
          showDenyButton: true,
          // showCancelButton: true,
          confirmButtonText: 'Yes, Remove it',
          denyButtonText: `Cancel`,
          confirmButtonColor: 'red',
          denyButtonColor: '#123c3d',
        }).then(result => {
          if (result.isConfirmed) {
            // check if confirm
            userAPI.removeFromFavorites(id).then(
              res => {
                if (res.data.success === true) {
                  // show Alart
                  createToast(res.data.message, {
                    position: 'top-right',
                    type: 'success',
                    transition: 'bounce',
                    showIcon: 'true',
                    timeout: 2000,
                  });

                  // get list
                  this.getFavorites();
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
          } else if (result.isDenied) {
            console.log('cancel');
          }
        });
      }
    },
  },
  props: {
    labs: {
      type: Object,
      required: true,
    },
    BASE_IMG: {
      type: String,
      required: true,
    },
    getFavorites: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style scoped>
.proPic img {
  width: 50px;
  height: 50px;
  border-radius: 15px;
  background-color: #fff;
}
.favorite {
  height: 13px;
  margin: 2px 5px 0 0;
  cursor: pointer;
}
.tab h2 {
  color: #123c3d;
  font-size: 20px;
  font-weight: bold;
}
.text-right {
  text-align: right;
}
.cardBody {
  width: 100%;
  /* height: 300px; */
  border-radius: 15px;
}
.cover {
  background: #c9d3d4;
  background-size: cover;
  border-radius: 20px;
  width: 100%;
  height: 130px;
  /* position: absolute; */
}
.proPic {
  width: 50px;
  height: 50px;
  background: #ffffff;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 15px;
  position: absolute;
  margin-top: 75px;
  margin-left: 5px;
}
.labName {
  font-family: Poppins;
  color: #000000;
}
.labName h5 {
  font-weight: bold;
  font-size: 12px;
}
.desc {
  width: 100%;
  font-family: Poppins;
  color: #707070;
  font-size: 10px;
  text-align: justify;
  font-size: 11px;
  max-height: 45px;
  height: auto;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  margin-bottom: unset;
}
.serviceBtn {
  font-weight: 600;
  font-size: 8px;
  width: auto;
  margin-left: 5px;
  margin-bottom: 5px;
  padding: 0.6rem 1rem;
  background: #e1e1e1;
  border-radius: 10px;
  font-family: Poppins;
  letter-spacing: 0px;
  color: #000000;
  text-transform: uppercase;
  text-align: center;
}
h5.name {
  text-transform: capitalize;
  font-size: 15px;
}

.cardStar .vue-star-rating {
  margin: -7px 0 0 10px;
}
@media screen and (min-width: 1000px) and (max-width: 1199px) {
  .col-lg-4.col-md-6.my-1 {
    min-width: 50%;
  }
  .labName a {
    width: 100%;
  }
}
</style>
