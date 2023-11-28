<template>
  <div class="row tab">
    <!-- Tech -->
    <div
      class="col-12 d-flex flex-wrap p-0"
      v-if="
        this.getUserProfileRole === 3 ||
        this.getUserProfileRole === 4 ||
        this.getUserProfileRole === 5 ||
        this.getUserProfileRole === 6
      "
    >
      <div
        class="col-12 text-lg-left text-center d-lg-flex"
        v-if="this.techs?.length > 0"
      >
        <h2
          class="pl-2"
          v-if="
            this.getUserProfileRole === 3 ||
            this.getUserProfileRole === 4 ||
            this.getUserProfileRole === 5
          "
        >
          Tech Companies
        </h2>
      </div>
      <div
        v-for="(tech, index) in this.techs"
        :key="index"
        class="col-lg-4 col-md-4 my-1"
      >
        <router-link :to="'/user/' + tech.user_id">
          <div class="cardBody explore profile-cont">
            <!-- <div
              class="cover"
              :style="{
                backgroundImage:
                  'url(' + BASE_IMG + '/' + tech.cover_image + ')',
              }"
            > -->
            <img
              class="cover"
              :src="BASE_IMG + '/' + tech.cover_image"
              @error="replaceByDefaultCoverImage"
              alt="noPic"
            />
            <!-- adding profile pic -->
            <div class="proPic">
              <img
                v-if="!tech.profile_image"
                src="../../../../assets/images/explore/no-preview.png"
                alt="noPic"
              />
              <img
                v-if="tech.profile_image"
                @error="replaceByDefaultProImage"
                :src="BASE_IMG + '/' + tech.profile_image"
                alt="noPic"
              />
            </div>
            <!-- </div> -->
            <div class="col-12 px-0">
              <!-- adding lab name & ratings -->
              <div class="row my-1 mx-0">
                <div class="col-lg-8 col-md-8 labName text-capitalize">
                  <h5>
                    <router-link :to="'/user/' + tech.user_id">
                      {{ tech.name }}
                    </router-link>
                  </h5>
                </div>
                <div
                  class="col-lg-4 col-md-4 d-flex justify-content-end cardStar"
                >
                  <star-rating
                    read-only
                    :rating="tech.ratings"
                    :star-size="starSize"
                    :show-rating="false"
                    :border-width="2"
                    :rounded-corners="true"
                    :padding="2"
                  ></star-rating>
                </div>
              </div>
              <!-- adding description -->
              <div class="row" v-if="tech.description">
                <div class="col-12 px-2 mb-2">
                  <div class="desc">
                    {{ tech.description }}
                  </div>
                </div>
              </div>
              <div class="d-flex flex-wrap" v-if="tech?.service?.length > 0">
                <div class="serviceBtn" v-for="i in tech.service" :key="i.id">
                  {{ i.name }}
                </div>
              </div>
            </div>
          </div>
        </router-link>
      </div>
      <div class="col-12" v-if="this.techs?.length === 0">
        <p class="alert alert-info">Sorry, no Tech Company found</p>
      </div>
    </div>
  </div>
</template>

<script>
import StarRating from 'vue-star-rating';
// import userAPI from '../../../../services/user.API';
import proImg from '../../../../assets/images/profile/no-user.png';
import coverImg from '../../../../assets/images/profile/defult_cover.jpg';

export default {
  name: 'explore',
  components: {
    StarRating,
  },
  data() {
    return {
      value: 2,
      // BASE_IMG: '',
      Show: 5,
      starSize: 12,
      controlSize: '0',
    };
  },
  methods: {
    replaceByDefaultCoverImage(e) {
      e.target.src = coverImg;
    },
    replaceByDefaultProImage(e) {
      e.target.src = proImg;
    },
  },
  computed: {
    getUserProfileRole() {
      return this.$store.state.profile.role_id;
    },
  },
  props: {
    techs: { type: Array, required: true },
    BASE_IMG: { type: String, required: true },
  },
};
</script>

<style scoped>
@import url('./common.css');
</style>
