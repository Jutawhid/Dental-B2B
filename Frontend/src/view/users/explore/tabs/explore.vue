<template>
  <div class="row tab">
    <!-- Consultants -->
    <div class="col-xl-12" v-if="loadingCon">
      <div class="row">
        <div class="col-xl-4">
          <div class="row">
            <div class="col-xl-12">
              <div class="placeholder wave">
                <div class="main-slide"><br /></div>
              </div>
            </div>
            <div class="col-xl-12">
              <div class="placeholder wave flex-column">
                <div class="nav-slide-text"><br /></div>
                <div class="nav-slide-text"><br /></div>
                <div class="nav-slide-text"><br /></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-4">
          <div class="row">
            <div class="col-xl-12">
              <div class="placeholder wave">
                <div class="main-slide"><br /></div>
              </div>
            </div>
            <div class="col-xl-12">
              <div class="placeholder wave flex-column">
                <div class="nav-slide-text"><br /></div>
                <div class="nav-slide-text"><br /></div>
                <div class="nav-slide-text"><br /></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-4">
          <div class="row">
            <div class="col-xl-12">
              <div class="placeholder wave">
                <div class="main-slide"><br /></div>
              </div>
            </div>
            <div class="col-xl-12">
              <div class="placeholder wave flex-column">
                <div class="nav-slide-text"><br /></div>
                <div class="nav-slide-text"><br /></div>
                <div class="nav-slide-text"><br /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="col-12 d-flex flex-wrap border-bottom-accent-1 pb-2"
      v-if="this.getUserProfileRole === 3 || this.getUserProfileRole === 4"
    >
      <div
        class="col-12 text-lg-left text-center"
        v-if="this.consultants?.length >= 0"
      >
        <h2 class="pl-2">Consultants</h2>
      </div>

      <div
        v-for="(consultant, index) in this.consultants?.slice(0, 5)"
        :key="index"
        class="col-lg-4 col-md-4 my-1"
      >
        <!-- <a href="http://localhost:3000/user/60"> -->
        <div class="cardBody explore profile-cont">
          <!-- <div
            class="cover"
            :style="{
              backgroundImage:
                'url(' + BASE_IMG + '/' + consultant.cover_image + ')',
            }"
          > -->
          <img
            class="cover"
            :src="BASE_IMG + '/' + consultant.cover_image"
            @error="replaceByDefaultCoverImage"
            alt="noPic"
          />
          <!-- adding profile pic -->
          <div class="proPic">
            <img
              v-if="!consultant.profile_image"
              src="../../../../assets/images/explore/no-preview.png"
              alt="noPic"
            />
            <img
              v-if="consultant.profile_image"
              @error="replaceByDefaultProImage"
              :src="BASE_IMG + '/' + consultant.profile_image"
              alt="noPic"
            />
          </div>
          <!-- </div> -->

          <div class="col-12 px-0">
            <!-- adding lab name & ratings -->
            <div class="row my-1 mx-0 labName-cont">
              <div class="col-lg-8 col-md-8 labName text-capitalize">
                <h5>
                  <router-link :to="'/user/' + consultant.user_id">
                    {{ consultant.first_name + ' ' + consultant.last_name }}
                  </router-link>
                </h5>
              </div>
              <div
                class="col-lg-4 col-md-4 d-flex justify-content-end cardStar"
              >
                <star-rating
                  read-only
                  :rating="consultant.ratings"
                  :star-size="starSize"
                  :show-rating="false"
                  :border-width="2"
                  :rounded-corners="true"
                  :padding="2"
                ></star-rating>
              </div>
            </div>
            <!-- adding description -->
            <div class="row" v-if="consultant.description">
              <div class="col-12 px-2 mb-2">
                <div class="desc">
                  {{ consultant.description }}
                </div>
              </div>
            </div>
            <div
              class="d-flex flex-wrap"
              v-if="consultant?.service?.length > 0"
            >
              <div
                class="serviceBtn"
                v-for="i in consultant.service"
                :key="i.id"
              >
                {{ i.name }}
              </div>
            </div>
          </div>
        </div>
        <!-- </a> -->
      </div>
      <!-- view more button -->
      <div class="col-lg-4 col-md-4 my-1" v-if="this.consultants?.length > 5">
        <div class="cardBody">
          <div
            class="viewMore text-center d-flex justify-content-center"
            @click.prevent="viewMore('consultant')"
          >
            <span> View More</span>
          </div>
        </div>
      </div>
      <!-- Consultants -->
      <div class="col-12" v-if="this.consultants.length === 0">
        <p class="alert alert-info">Sorry, no consultants found</p>
      </div>
    </div>
    <!-- LABS -->

    <div class="col-xl-12" v-if="loadingLab">
      <div class="row">
        <div class="col-xl-4">
          <div class="row">
            <div class="col-xl-12">
              <div class="placeholder wave">
                <div class="main-slide"><br /></div>
              </div>
            </div>
            <div class="col-xl-12">
              <div class="placeholder wave flex-column">
                <div class="nav-slide-text"><br /></div>
                <div class="nav-slide-text"><br /></div>
                <div class="nav-slide-text"><br /></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-4">
          <div class="row">
            <div class="col-xl-12">
              <div class="placeholder wave">
                <div class="main-slide"><br /></div>
              </div>
            </div>
            <div class="col-xl-12">
              <div class="placeholder wave flex-column">
                <div class="nav-slide-text"><br /></div>
                <div class="nav-slide-text"><br /></div>
                <div class="nav-slide-text"><br /></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-4">
          <div class="row">
            <div class="col-xl-12">
              <div class="placeholder wave">
                <div class="main-slide"><br /></div>
              </div>
            </div>
            <div class="col-xl-12">
              <div class="placeholder wave flex-column">
                <div class="nav-slide-text"><br /></div>
                <div class="nav-slide-text"><br /></div>
                <div class="nav-slide-text"><br /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="col-12 d-flex flex-wrap border-bottom-accent-1 py-2"
      v-if="
        this.getUserProfileRole === 3 ||
        this.getUserProfileRole === 4 ||
        this.getUserProfileRole === 5
      "
    >
      <div
        class="mt-2 col-12 text-lg-left text-center d-lg-flex"
        v-if="this.labs?.length >= 0"
      >
        <h2 class="pl-2">Labs</h2>
      </div>

      <div
        v-for="(lab, index) in this.labs?.slice(0, 5)"
        :key="index"
        class="col-lg-4 col-md-4 my-1"
      >
        <div class="cardBody explore profile-cont">
          <!-- <div
            class="cover"
            :style="{
              backgroundImage: 'url(' + BASE_IMG + '/' + lab.cover_image + ')',
            }"
          > -->
          <img
            class="cover"
            :src="BASE_IMG + '/' + lab.cover_image"
            @error="replaceByDefaultCoverImage"
            alt="noPic"
          />
          <!-- adding profile pic -->
          <div class="proPic">
            <img
              v-if="!lab.profile_image"
              src="../../../../assets/images/explore/no-preview.png"
              alt="noPic"
            />
            <img
              v-if="lab.profile_image"
              :src="BASE_IMG + '/' + lab.profile_image"
              alt="noPic"
              @error="replaceByDefaultProImage"
            />
          </div>
          <!-- </div> -->
          <div class="col-12 px-0">
            <!-- adding lab name & ratings -->
            <div class="row my-1 mx-0 labName-cont">
              <div class="col-lg-8 col-md-8 labName text-capitalize">
                <h5>
                  <router-link :to="'/user/' + lab.user_id">
                    {{ lab.name }}
                  </router-link>
                </h5>
              </div>
              <div
                class="col-lg-4 col-md-4 d-flex justify-content-end cardStar"
              >
                <star-rating
                  read-only
                  :rating="lab.ratings"
                  :star-size="starSize"
                  :show-rating="false"
                  :border-width="2"
                  :rounded-corners="true"
                  :padding="2"
                ></star-rating>
              </div>
            </div>
            <!-- adding description -->
            <div class="row" v-if="lab.description">
              <div class="col-12 px-2 mb-1">
                <div class="desc">
                  {{ lab.description }}
                </div>
              </div>
            </div>
            <div class="d-flex flex-wrap" v-if="lab?.service?.length > 0">
              <div class="serviceBtn" v-for="i in lab.service" :key="i.id">
                {{ i.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- view more button -->
      <div class="col-lg-4 col-md-4 my-1" v-if="this.labs?.length > 5">
        <div class="cardBody">
          <div
            class="viewMore text-center d-flex justify-content-center"
            @click.prevent="viewMore('lab')"
          >
            <span> View More</span>
          </div>
        </div>
      </div>
      <div class="col-12" v-if="this.labs.length === 0">
        <p class="alert alert-info">Sorry, no lab found</p>
      </div>
    </div>
    <!-- Tech -->

    <div class="col-xl-12" v-if="loadingTech">
      <div class="row">
        <div class="col-xl-4">
          <div class="row">
            <div class="col-xl-12">
              <div class="placeholder wave">
                <div class="main-slide"><br /></div>
              </div>
            </div>
            <div class="col-xl-12">
              <div class="placeholder wave flex-column">
                <div class="nav-slide-text"><br /></div>
                <div class="nav-slide-text"><br /></div>
                <div class="nav-slide-text"><br /></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-4">
          <div class="row">
            <div class="col-xl-12">
              <div class="placeholder wave">
                <div class="main-slide"><br /></div>
              </div>
            </div>
            <div class="col-xl-12">
              <div class="placeholder wave flex-column">
                <div class="nav-slide-text"><br /></div>
                <div class="nav-slide-text"><br /></div>
                <div class="nav-slide-text"><br /></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-4">
          <div class="row">
            <div class="col-xl-12">
              <div class="placeholder wave">
                <div class="main-slide"><br /></div>
              </div>
            </div>
            <div class="col-xl-12">
              <div class="placeholder wave flex-column">
                <div class="nav-slide-text"><br /></div>
                <div class="nav-slide-text"><br /></div>
                <div class="nav-slide-text"><br /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end Loading -->
    <div
      class="col-12 d-flex flex-wrap border-bottom-accent-1 py-2"
      v-if="
        this.getUserProfileRole === 3 ||
        this.getUserProfileRole === 4 ||
        this.getUserProfileRole === 5 ||
        this.getUserProfileRole === 6
      "
    >
      <div
        class="mt-2 col-12 text-lg-left text-center d-lg-flex"
        v-if="this.techs?.length >= 0"
      >
        <h2>Tech Companies</h2>
      </div>
      <div
        v-for="(tech, index) in this.techs?.slice(0, 5)"
        :key="index"
        class="col-lg-4 col-md-4 my-1"
      >
        <div class="cardBody explore profile-cont">
          <!-- <div
            class="cover"
            :style="{
              backgroundImage: 'url(' + BASE_IMG + '/' + tech.cover_image + ')',
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
              on-error="this.src='../../../../assets/images/explore/no-preview.png'"
              :src="BASE_IMG + '/' + tech.profile_image"
              alt="noPic"
              @error="replaceByDefaultProImage"
            />
          </div>
          <!-- </div> -->
          <div class="col-12 px-0">
            <!-- adding lab name & ratings -->
            <div class="row my-1 mx-0 labName-cont">
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
              <div class="col-12 px-2 mb-1">
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
      </div>
      <!-- view more button -->
      <div class="col-lg-4 col-md-4 my-1" v-if="this.techs?.length > 5">
        <div class="cardBody">
          <div
            class="viewMore text-center d-flex justify-content-center"
            @click.prevent="viewMore('tech')"
          >
            <span> View More</span>
          </div>
        </div>
      </div>
      <div class="col-12" v-if="this.techs?.length === 0">
        <p class="alert alert-info">Sorry, no Tech Company found</p>
      </div>
    </div>
  </div>
</template>

<script>
// import vue3starRatings from 'vue3-star-ratings';
// import userAPI from '../../../../services/user.API';
import proImg from '../../../../assets/images/profile/no-user.png';
import coverImg from '../../../../assets/images/profile/defult_cover.jpg';
import StarRating from 'vue-star-rating';

export default {
  name: 'explore',
  components: {
    StarRating,
  },
  data() {
    return {
      value: '',
      dentist: [],
      lab: [],
      tech: [],
      // BASE_IMG: '',
      Show: 5,
      // role: '',
      starSize: 12,
      controlSize: '0',
      loadingCon: true,
      loadingTech: true,
      loadingLab: true,
      noTech: false,
    };
  },
  mounted() {
    if (this.techs) {
      setTimeout(() => {
        this.loadingTech = false;
      }, 1000);
    }

    if (this.consultants) {
      setTimeout(() => {
        this.loadingCon = false;
      }, 1000);
    }

    if (this.labs) {
      setTimeout(() => {
        this.loadingLab = false;
      }, 1000);
    }
  },
  computed: {
    getUserProfileRole() {
      return this.$store.state.profile.role_id;
    },
  },
  methods: {
    replaceByDefaultProImage(e) {
      e.target.src = proImg;
    },
    replaceByDefaultCoverImage(e) {
      e.target.src = coverImg;
    },
    viewMore(data) {
      this.setTab(data);
    },
  },
  props: {
    // dentists: { type: Array, required: true },
    consultants: { type: Array, required: true },
    labs: { type: Array, required: true },
    techs: { type: Array, required: true },
    setTab: { type: Function, required: true },
    BASE_IMG: { type: String, required: true },
  },
};
</script>

<style scoped>
@import url('./common.css');
/* *********************************** */
.placeholder {
  margin: 15px 0;
  /* padding: 10px; */
  border-radius: 5px;
  display: flex;
  background-color: #f8f8f8;
  border-radius: 20px;
}
.placeholder.pulse div {
  animation: pulse 1s infinite ease-in-out;
  -webkit-animation: pulse 1s infinite ease-in-out;
}
.placeholder.wave div {
  animation: wave 1s infinite linear forwards;
  -webkit-animation: wave 1s infinite linear forwards;
  background: #f6f7f8;
  background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
  background-size: 800px 104px;
}
.placeholder div {
  background: #e8e8e8;
}
.placeholder .square {
  float: left;
  width: 30px;
  height: 30px;
  margin: 0 0 10px;
}
.placeholder .rectangle {
  float: left;
  width: 40px;
  height: 30px;
  margin: 0 0 10px;
}
.placeholder .main-slide {
  height: 200px;
  margin: auto;
  width: 100%;
}
.placeholder .nav-slide-img {
  height: 60px;
  margin: auto;
  width: 100%;
}
.placeholder .nav-slide-text {
  height: 20px;
  margin: 5px auto;
  width: 100%;
}
.placeholder .circle {
  float: left;
  width: 40px;
  height: 40px;
  margin: 0 15px 10px 0;
  border-radius: 40px;
}
.labName-cont {
  margin-bottom: 10px !important;
}

@keyframes pulse {
  0% {
    background-color: rgba(165, 165, 165, 0.1);
  }
  50% {
    background-color: rgba(165, 165, 165, 0.8);
  }
  100% {
    background-color: rgba(165, 165, 165, 0.1);
  }
}
@-webkit-keyframes pulse {
  0% {
    background-color: rgba(165, 165, 165, 0.1);
  }
  50% {
    background-color: rgba(165, 165, 165, 0.8);
  }
  100% {
    background-color: rgba(165, 165, 165, 0.1);
  }
}
@keyframes wave {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}
@-webkit-keyframes wave {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}
@media screen and (min-width: 1000px) and (max-width: 1199px) {
  .col-lg-4.col-md-4.my-1 {
    min-width: 50%;
  }
  .filterContainer.menuClose {
    margin-left: -20px !important;
  }
}
</style>
