<template>
  <div class="vld-parent">
    <!-- Container Fluid-->
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="content-wrapper">
        <div class="content-body">
          <div id="user-profile">
            <section>
              <div class="row">
                <div class="col-lg-9">
                  <div class="row">
                    <div class="col-xl-12" v-if="loading">
                      <div class="row">
                        <div class="col-xl-6">
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
                        <div class="col-xl-6">
                          <div class="row">
                            <div class="col-xl-3">
                              <div class="placeholder wave">
                                <div class="nav-slide-img"><br /></div>
                              </div>
                            </div>
                            <div class="col-xl-9">
                              <div class="placeholder wave flex-column">
                                <div class="nav-slide-text"><br /></div>
                                <div class="nav-slide-text"><br /></div>
                              </div>
                            </div>
                            <div class="col-xl-3">
                              <div class="placeholder wave">
                                <div class="nav-slide-img"><br /></div>
                              </div>
                            </div>
                            <div class="col-xl-9">
                              <div class="placeholder wave flex-column">
                                <div class="nav-slide-text"><br /></div>
                                <div class="nav-slide-text"><br /></div>
                              </div>
                            </div>
                            <div class="col-xl-3">
                              <div class="placeholder wave">
                                <div class="nav-slide-img"><br /></div>
                              </div>
                            </div>
                            <div class="col-xl-9">
                              <div class="placeholder wave flex-column">
                                <div class="nav-slide-text"><br /></div>
                                <div class="nav-slide-text"><br /></div>
                              </div>
                            </div>
                            <div class="col-xl-3">
                              <div class="placeholder wave">
                                <div class="nav-slide-img"><br /></div>
                              </div>
                            </div>
                            <div class="col-xl-9">
                              <div class="placeholder wave flex-column">
                                <div class="nav-slide-text"><br /></div>
                                <div class="nav-slide-text"><br /></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-12 p-0" v-if="!loading">
                      <div
                        class="list-container"
                        :class="caseSidebar ? 'active' : ''"
                      >
                        <button
                          class="more-button"
                          aria-label="Menu Button"
                          @click.prevent="caseShow()"
                        >
                          <div class="menu-icon-wrapper">
                            <div class="menu-icon-line half first"></div>
                            <div class="menu-icon-line"></div>
                            <div class="menu-icon-line half last"></div>
                          </div>
                        </button>
                      </div>
                      <!-- Slider -->
                      <!-- Example with auto slide and progressbar on top of the images-->
                      <carousel
                        v-if="this.carouselItem.length !== 0"
                        :slideClick="slideClick"
                        :starting-image="2"
                        :images="this.carouselItem"
                        :auto-slide-interval="3500"
                        :show-progress-bar="false"
                      ></carousel>
                      <!-- End Slider -->
                    </div>
                    <div
                      class="col-lg-12 p-0"
                      id="explore"
                      ref="explore"
                      v-if="users || !loaderTwo"
                    >
                      <div class="card-body">
                        <!-- Tab Start -->
                        <ul class="nav nav-tabs tab-nav" role="tablist">
                          <li
                            class="nav-item"
                            v-if="
                              this.getUserProfileRole === 3 ||
                              this.getUserProfileRole === 4 ||
                              this.getUserProfileRole === 5
                            "
                          >
                            <a
                              class="nav-link"
                              @click.prevent="setActive('explore')"
                              :class="{ active: isActive('explore') }"
                              href="#explore"
                            >
                              <h4 class="black font-weight-bold">Explore</h4></a
                            >
                          </li>
                          <li
                            class="nav-item"
                            v-if="
                              this.getUserProfileRole === 3 ||
                              this.getUserProfileRole === 4
                            "
                          >
                            <a
                              class="nav-link"
                              @click.prevent="setActive('consultant')"
                              :class="{ active: isActive('consultant') }"
                              href="#consultant"
                              ><h4 class="black font-weight-bold">
                                Consultants
                              </h4></a
                            >
                          </li>
                          <li
                            class="nav-item"
                            v-if="
                              this.getUserProfileRole === 3 ||
                              this.getUserProfileRole === 4 ||
                              this.getUserProfileRole === 5
                            "
                          >
                            <a
                              class="nav-link"
                              @click.prevent="setActive('lab')"
                              :class="{ active: isActive('lab') }"
                              href="#lab"
                              ><h4 class="black font-weight-bold">Labs</h4></a
                            >
                          </li>
                          <li
                            class="nav-item"
                            v-if="
                              this.getUserProfileRole === 3 ||
                              this.getUserProfileRole === 4 ||
                              this.getUserProfileRole === 5 ||
                              this.getUserProfileRole === 6
                            "
                          >
                            <a
                              class="nav-link"
                              @click.prevent="setActive('tech')"
                              :class="{ active: isActive('tech') }"
                              href="#tech"
                            >
                              <h4 class="black font-weight-bold">
                                Tech Companies
                              </h4>
                            </a>
                          </li>
                        </ul>
                        <!-- Tab Content Start -->
                        <div class="tab-content">
                          <div
                            class="tab-pane"
                            :class="{ 'active show': isActive('explore') }"
                            id="explore"
                            v-if="
                              this.getUserProfileRole === 3 ||
                              this.getUserProfileRole === 4 ||
                              this.getUserProfileRole === 5
                            "
                          >
                            <!-- Explore Content -->
                            <Explore
                              :consultants="this.consultants"
                              :labs="this.labs"
                              :techs="this.techs"
                              :setTab="setTab"
                              :BASE_IMG="basePath"
                            />
                          </div>
                          <!-- Service Tab End -->
                          <div
                            class="tab-pane"
                            :class="{ 'active show': isActive('consultant') }"
                            id="consultant"
                            v-if="
                              this.getUserProfileRole === 3 ||
                              this.getUserProfileRole === 4
                            "
                          >
                            <!-- Consultants Content -->
                            <Consultants
                              :consultants="this.consultants"
                              :BASE_IMG="basePath"
                            />
                            <!-- End Consultants Content -->
                          </div>
                          <!-- Consultants Tab End -->
                          <div
                            class="tab-pane"
                            :class="{ 'active show': isActive('lab') }"
                            id="lab"
                            v-if="
                              this.getUserProfileRole === 3 ||
                              this.getUserProfileRole === 4 ||
                              this.getUserProfileRole === 5
                            "
                          >
                            <!-- Labs Content -->
                            <Labs :labs="this.labs" :BASE_IMG="basePath" />
                            <!-- End Labs  Content -->
                          </div>
                          <div
                            class="tab-pane"
                            :class="{ 'active show': isActive('tech') }"
                            id="tech"
                            v-if="
                              this.getUserProfileRole === 3 ||
                              this.getUserProfileRole === 4 ||
                              this.getUserProfileRole === 5 ||
                              this.getUserProfileRole === 6
                            "
                          >
                            <!-- Labs Content -->
                            <TechCompanies
                              :techs="this.techs"
                              :BASE_IMG="basePath"
                            />
                            <!-- End Labs  Content -->
                          </div>
                          <!-- Consultants Tab End -->
                        </div>
                      </div>
                    </div>

                    <!-- loader starts -->
                    <div class="" v-show="loaderTwo">
                      <div class="row">
                        <div class="col-xl-4" v-for="i in 12" :key="i">
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
                    <!-- loader ends -->
                  </div>
                </div>
                <div class="col-lg-3 filter">
                  <!-- Filter Section -->
                  <div
                    class="filterContainer"
                    :class="caseSidebar ? 'menuOpen' : 'menuClose'"
                  >
                    <form>
                      <div class="col-12 py-1 px-0">
                        <i class="feather icon-filter"></i>
                        <label>Filter</label>
                      </div>

                      <div class="box">
                        <p>Location</p>
                        <div class="col-12 px-0">
                          <select
                            name="statename"
                            class="form-control"
                            v-model="statename"
                          >
                            <option value="" disabled>Select State</option>
                            <option
                              v-for="(state, index) in states"
                              :key="index"
                              :value="state"
                            >
                              {{ state }}
                            </option>
                          </select>
                        </div>
                      </div>

                      <div class="box">
                        <p>Rating</p>
                        <div class="col-12 mb-1 pl-0">
                          <star-rating
                            v-model:rating="ratingFilter"
                            @update:rating="setRating"
                            :star-size="25"
                            :show-rating="false"
                            :border-width="2"
                            :rounded-corners="true"
                            :padding="2"
                          ></star-rating>
                        </div>
                      </div>

                      <div class="box">
                        <p>Services</p>
                        <div class="col-12 filterPart px-0">
                          <select
                            name="serviceName"
                            class="form-control"
                            v-model="serviceName"
                          >
                            <option value="">Select Services</option>
                            <option
                              v-for="service in serviceTypes"
                              :key="service.id"
                              :value="service.name"
                            >
                              {{ service.name }}
                            </option>
                          </select>
                          <!-- <select
                            name="serviceName"
                            class="form-control"
                            v-model="serviceName"
                          >
                            <option value="" disabled>Select Service</option>
                            <option
                              v-for="(service, index) in services"
                              :key="index"
                              :value="service"
                            >
                              {{ service }}
                            </option>
                          </select> -->
                        </div>
                      </div>

                      <div class="d-flex justify-content-lg-end">
                        <button class="resetBtn" @click.prevent="resetFilter">
                          Reset
                        </button>
                        <button class="applyBtn" @click.prevent="profileFilter">
                          Apply
                        </button>
                      </div>
                    </form>
                  </div>
                  <!-- Filter End -->
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>

    <!---Container Fluid-->
  </div>
</template>

<script type="javascript">
// loader
// import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
//                     <PulseLoader />

// featured
import Carousel from './Carousel.vue';

//range slider
// import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';

//Star rating
// import Vue3StarRatings from 'vue3-star-ratings';
import StarRating from 'vue-star-rating';

// import tabs
import Explore from './tabs/explore';
import Consultants from './tabs/consultants';
import Labs from './tabs/labs';
import TechCompanies from './tabs/tech';
// import proImg from '../../../assets/images/profile/no-user.png';
// import coverImg from '../../../assets/images/profile/defult_cover.jpg';

// API
import userAPI from '../../../services/user.API';

export default {
  name: 'ExplorePage',
  components: {
    // PulseLoader,
    Explore,
    Consultants,
    Labs,
    TechCompanies,
    // Loading,
    // 'vue-slider': VueSlider,
    // 'star-ratings': Vue3StarRatings,
    StarRating,

    Carousel,
  },
  data() {
    return {
      slideClick: false,
      serviceTypes:[],
      loading: true,
      loaderTwo: true,
      ratingFilter: 0,
      users: [],
      // dentists: [],
      labs: [],
      lab: [],
      techs: [],
      tech: [],
      consultants: [],
      consultant: [],
      activeItem: 'explore',
      range: { min: '', max: '' },
      value: [100, 200],
      rating: 2,

      hasresults: false,
      hasdescription: false,
      starsize: 'lg', //[xs,lg,1x,2x,3x,4x,5x,6x,7x,8x,9x,10x],
      maxstars: 5,
      disabled: false,
      images: [
        {
          id: null,
          userId: null,
          thumb: null,
          title: null,
          description: null,
          big: null,
          status: 0,
        },
      ],
      carouselItem: [],
      states: [],
      statename: '',
      serviceName: '',
      role: '',
      basePath: '',
      caseSidebar: false,
    };
  },
  methods: {
    // setRating(rating){
    //   this.ratingFilter= rating;
    //   console.log(this.ratingFilter);
    // },
    setRating(rating) {
      this.ratingFilter = rating;
    },
    isActive(menuItem) {
      return this.activeItem === menuItem;
    },
    setActive(menuItem) {
      this.activeItem = menuItem;
    },
    profileFilter() {
      var element = this.$refs['explore'];
      var top = element.offsetTop;

      window.scrollTo(0, top);

      if (this.serviceName && !this.statename) {
        console.log('service');
        this.consultants = this.consultant.data.filter(item =>
          item.service
            .map(service => service.name.toLowerCase())
            .includes(this.serviceName.toLowerCase()),
        );
        this.labs = this.lab.data.filter(item =>
          item.service
            .map(service => service.name.toLowerCase())
            .includes(this.serviceName.toLowerCase()),
        );
        this.techs = this.tech.data.filter(item =>
          item.service
            .map(service => service.name.toLowerCase())
            .includes(this.serviceName.toLowerCase()),
        );
        // console.log(this.consultants);
        if (this.ratingFilter > 0) {
          this.consultants = this.consultants.filter(
            item => item.ratings == this.ratingFilter,
          );
          this.labs = this.labs.filter(
            item => item.ratings == this.ratingFilter,
          );
          this.techs = this.techs.filter(
            item => item.ratings == this.ratingFilter,
          );
        }
      } else if (!this.serviceName && this.statename) {
        console.log('State');
        this.consultants = this.consultant.data.filter(
          item =>
            item.state_name.toLowerCase() === this.statename.toLowerCase(),
        );
        this.labs = this.lab.data.filter(
          item =>
            item.state_name.toLowerCase() === this.statename.toLowerCase(),
        );
        this.techs = this.tech.data.filter(
          item =>
            item.state_name.toLowerCase() === this.statename.toLowerCase(),
        );
        if (this.ratingFilter > 0) {
          this.consultants = this.consultants.filter(
            item => item.ratings == this.ratingFilter,
          );
          this.labs = this.labs.filter(
            item => item.ratings == this.ratingFilter,
          );
          this.techs = this.techs.filter(
            item => item.ratings == this.ratingFilter,
          );
        }
      } else if (this.serviceName && this.statename) {
        console.log('State + Service');
        let consData = this.consultant.data.filter(
          item =>
            item.state_name.toLowerCase() === this.statename.toLowerCase(),
        );
        let labsData = this.lab.data.filter(
          item =>
            item.state_name.toLowerCase() === this.statename.toLowerCase(),
        );
        let techsData = this.consultant.data.filter(
          item =>
            item.state_name.toLowerCase() === this.statename.toLowerCase(),
        );
        this.consultants = consData.filter(service =>
          service.service
            .map(serv => serv.name.toLowerCase())
            .includes(this.serviceName.toLowerCase()),
        );
        this.labs = labsData.filter(service =>
          service.service
            .map(serv => serv.name.toLowerCase())
            .includes(this.serviceName.toLowerCase()),
        );
        this.techs = techsData.filter(service =>
          service.service
            .map(serv => serv.name.toLowerCase())
            .includes(this.serviceName.toLowerCase()),
        );
        if (this.ratingFilter > 0) {
          this.consultants = this.consultants.filter(
            item => item.ratings == this.ratingFilter,
          );
          this.labs = this.labs.filter(
            item => item.ratings == this.ratingFilter,
          );
          this.techs = this.techs.filter(
            item => item.ratings == this.ratingFilter,
          );
        }
      } else if (
        !this.serviceName &&
        !this.stateName &&
        this.ratingFilter > 0
      ) {
        this.consultants = this.consultant.data.filter(
          item => item.ratings === Number(this.ratingFilter),
        );
        this.labs = this.lab.data.filter(
          item => item.ratings === Number(this.ratingFilter),
        );
        this.techs = this.tech.data.filter(
          item => item.ratings === Number(this.ratingFilter),
        );
      } else {
        this.consultants = this.consultant.data;
        this.labs = this.lab.data;
        this.techs = this.tech.data;
      }
      this.caseSidebar = !this.caseSidebar;
    },
    resetFilter() {
      this.statename = '';
      this.serviceName = '';
      this.consultants = this.consultant.data;
      this.labs = this.lab.data;
      this.techs = this.tech.data;
      this.ratingFilter = '';
    },
    setTab(tab) {
      this.activeItem = tab;
    },
    getFeatureList() {
      userAPI.getFeatureList().then(res => {
        if (res.data.status === 200) {
          this.images = res.data.data.map(e => {
            return {
              id: e.id,
              userId: e.user_id,
              status: e.active_status,
              thumb:
                e.userProfileInfo.profileImageFolderPath +
                '/' +
                e.userProfileInfo.cover_image,
              big:
                e.userProfileInfo.profileImageFolderPath +
                '/' +
                e.userProfileInfo.cover_image,
              description: e.userProfileInfo.description,
              title: e.userProfileInfo.name,
            };
          });
          this.carouselItem = this.images.filter(item => item.status === 1);
          this.loading = false;
        }
      });
    },
    getExploreData() {
      userAPI.getExploreData().then(res => {
        if (res.data.data) {
          this.users = res.data.data.filter(item => item);
          this.loaderTwo = false;
          // console.log(this.users);
          this.consultant = res.data.data.filter(item => item.role_id === 4)[0];
          this.consultant.data = this.consultant?.data?.map(e => {
            return {
              id: e.id,
              user_id: e.user_id,
              role_id: e.role_id,
              first_name: e.first_name,
              last_name: e.last_name,
              email: e.email,
              phone: e.phone,
              fax: e.fax,
              address: e.address,
              city_name: e.city_name,
              city_id: e.city_id,
              completed_case: e.completed_case,
              cover_image: e.cover_image,
              description: e.description,
              is_favorite: e.is_favorite,
              license: e.license,
              npi_number: e.npi_number,
              zip_code: e.zip_code,
              zip_id: e.zip_id,
              state_id: e.state_id,
              state_name: e.state_name,
              status: e.status,
              profile_image: e.profile_image,
              ratings: Math.round(e.ratings),
              service: e.service,
            };
          });
          // console.log(this.consultant);
          this.lab = res.data.data.filter(item => item.role_id === 5)[0];
          this.lab.data = this.lab.data?.map(e => {
            return {
              id: e.id,
              user_id: e.user_id,
              role_id: e.role_id,
              name: e.name,
              email: e.email,
              phone: e.phone,
              fax: e.fax,
              address: e.address,
              city_name: e.city_name,
              city_id: e.city_id,
              completed_case: e.completed_case,
              cover_image: e.cover_image,
              description: e.description,
              is_favorite: e.is_favorite,
              license: e.license,
              npi_number: e.npi_number,
              zip_code: e.zip_code,
              zip_id: e.zip_id,
              state_id: e.state_id,
              state_name: e.state_name,
              status: e.status,
              profile_image: e.profile_image,
              ratings: Math.round(e.ratings),
              service: e.service,
            };
          });
          this.tech = res.data.data.filter(item => item.role_id === 6)[0];
          this.tech.data = this.tech.data?.map(e => {
            return {
              id: e.id,
              user_id: e.user_id,
              role_id: e.role_id,
              name: e.name,
              email: e.email,
              phone: e.phone,
              fax: e.fax,
              address: e.address,
              city_name: e.city_name,
              city_id: e.city_id,
              completed_case: e.completed_case,
              cover_image: e.cover_image,
              description: e.description,
              is_favorite: e.is_favorite,
              license: e.license,
              npi_number: e.npi_number,
              zip_code: e.zip_code,
              zip_id: e.zip_id,
              state_id: e.state_id,
              state_name: e.state_name,
              status: e.status,
              profile_image: e.profile_image,
              ratings: Math.round(e.ratings),
              service: e.service,
            };
          });
          let locationState = this.users.map(e =>
            e.data.map(i => i.state_name),
          );
          this.states = [...new Set(locationState.flat())];
          this.basePath =
            this.consultant.imageFolderPath ||
            this.lab.imageFolderPath ||
            this.tech.imageFolderPath;
          // }
          this.consultants = this.consultant.data;
          this.labs = this.lab.data;
          this.techs = this.tech.data;
          // console.log(this.services);
        }
      });
    },
    caseShow() {
      this.caseSidebar = !this.caseSidebar;
    },
  },
  mounted() {
    if (this.$store.state.auth.user.role.role_id === 6) {
      this.activeItem = 'tech';
    }
    setTimeout(() => {
      this.getFeatureList();
      this.getExploreData();
      this.isLoading = false;
    }, 1000);
    // this.getExploreData();
    // get service type
    userAPI.getServiceTypes().then(res => {
      if (res.data.success) {
        this.serviceTypes = res.data.data.map(item => item);
      }
    });
    this.isLoading = true;
    // this.getRole();
  },
  computed: {
    selectedNames() {
      return this.filterData.services
        .filter(service => service.selected)
        .map(service => service.name);
    },
    getUserProfileRole() {
      return this.$store.state.profile.role_id;
    },
  },
};
</script>

<style type="text/css" scoped>
.filter input {
  background: #f0f1f1;
  border-radius: 10px;
  height: auto;
  margin-bottom: 10px;
}
.filter select {
  background: #f0f1f1;
  border-radius: 10px;
  height: auto;
  margin-bottom: 10px;
}
#explore ul.nav.nav-tabs {
  margin: 0 10px 28px !important;
}
input#location.form-control:focus {
  border-color: #c9d3d4 !important;
}
.filter input {
  background: #f0f1f1;
  border-radius: 10px;
  height: auto;
  margin-bottom: 10px;
}
.filterContainer .filterPart label {
  margin: 5px;
  font-weight: normal !important;
  width: 100% !important;
}
.filterContainer label {
  color: black;
  font-weight: bold;
}
i.feather.icon-filter {
  color: black;
  font-weight: bold;
}

#user-profile .nav.nav-tabs .nav-item .nav-link {
  padding: 0px 30px 16px;
  color: #123c3d;
  opacity: 0.5;
}

.nav-link h4 {
  color: #123c3d !important;
}

#user-profile .nav.nav-tabs .nav-item .nav-link.active,
#user-profile .nav-tabs .nav-item.show .nav-link {
  color: #123c3d;
  opacity: 1;
}

#user-profile .nav.nav-tabs .nav-item .nav-link.active:after {
  content: attr(data-before);
  height: 5px;
  width: 100%;
  left: 0;
  position: absolute;
  bottom: 0;
  top: 90%;
  transform: translateY(0px);
  transition: all 0.2s linear;
  background: #123c3d;
  border-radius: 10px 10px 0px 0px;
  box-shadow: none !important;
}

#user-profile .nav.nav-tabs {
  border-bottom: 1px solid #cfcfcf;
}

#user-profile .service-card-title h2 {
  width: 88%;
}

.btn-with-price {
  background: #123c3d1c;
  font-size: 20px;
  color: #123c3d;
  font-weight: 600;
}

.left-border {
  border-left: 2px solid #ffd700;
  padding-left: 20px;
}

.label {
  line-height: 2;
}

.detail {
  font-weight: 600;
  color: #000;
  font-size: 18px;
}

.tab-info-group {
  margin: 15px 30px;
}

#profile-info {
  padding-right: 50px;
}

#profile-info .top-m {
  margin-top: -10rem;
}
.cover {
  border-radius: 15px;
}

@media only screen and (min-width: 992px) {
  #user-profile .profile-header-nav .navbar .nav-item {
    padding-left: 2.25rem !important;
    padding-right: 2.25rem !important;
  }
}

@media only screen and (max-width: 992px) {
  #user-profile .user-latest-img img {
    width: 100%;
  }

  #profile-info .top-m {
    margin-top: -5rem;
    padding: 0px;
  }

  #profile-info {
    padding-right: 0px;
  }

  #user-profile #profile-info .nav.nav-tabs .nav-item .nav-link {
    padding: 10px 10px;
  }
}

@media only screen and (max-width: 991px) and (min-width: 768px) {
  #user-profile .profile-header-nav .navbar .nav-item {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
}
/* Right Side Filter */
.filterContainer {
  background: #b9d0d2;
  border-radius: 10px;
  width: 20%;
  padding: 10px 20px;
  margin: 15px 0px;
  height: 90%;
  position: fixed;
}
.filterContainer p {
  font-size: 12px;
  font-weight: bold;
  color: #000000;
  padding: 15px 0 0 0;
}
.filterContainer .box {
  background: #ffffff;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 10px;
  padding: 5px 20px;
  width: 100%;
  margin-bottom: 10px;
  font-weight: normal;
}
.filterContainer .box label {
  font-size: 12px;
  letter-spacing: 0px;
  color: #000000;
  font-family: 'Poppins';
}
.resetBtn {
  background: #ffffff;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 10px;
  margin: 5px;
  padding: 5px 15px;
  font: normal normal normal 13px/20px Poppins;
  color: #ff0000;
  text-transform: uppercase;
  border: 1px solid #fff;
}
.applyBtn {
  background: #123c3d;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 10px;
  margin: 5px;
  padding: 5px 15px;
  font: normal normal medium 13px/20px Poppins;
  letter-spacing: 0px;
  color: #ffffff;
  text-transform: uppercase;
  border: 1px solid #123c3d;
}
.vue3-star-ratings__wrapper {
  display: block;
  margin: 0;
  text-align: center;
  padding: 10px 0 20px;
}
.stars path:hover {
  fill: gold !important;
}
/* Responsive */

@media only screen and (max-width: 768px) {
  .actions > span.prev {
    margin-left: -18px;
    padding: 8px 14px 8px 12px !important;
  }
  #user-profile .nav.nav-tabs .nav-item .nav-link {
    padding: 15px;
  }
  .filterContainer {
    width: 100% !important;
    padding: 10px 20px;
    margin: 0px 0px;
  }
}

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
.nav-link h4 {
  font-size: 15px;
  text-transform: uppercase;
}
@media only screen and (min-width: 1000px) and (max-width: 1450px) {
  .filterContainer {
    background: #b9d0d2;
    border-radius: 10px;
    width: 19%;
    padding: 10px 15px;
    margin: 5px 0px;
    height: 88%;
    position: fixed;
  }
}
@media screen and (min-width: 1000px) and (max-width: 1199px) {
  #user-profile .nav.nav-tabs .nav-item .nav-link[data-v-6d2f1f24] {
    padding: 0px 15px 10px;
  }
}
@media screen and (min-width: 1000px) and (max-width: 1100px) {
  .filterContainer .box[data-v-6d2f1f24] {
    padding: 5px 10px;
}
  .filterContainer.menuClose {
    width: 200px !important;
    right: 0px !important;
    padding: 0 10px !important;
  }
  .filterContainer.menuOpen {
    width: 200px !important;
    right: 0px !important;
    padding: 0 10px !important;
  }
}
</style>
