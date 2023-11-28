<template>
  <div class="vld-parent">
    <!-- Container Fluid-->
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="content-wrapper">
        <div class="content-body">
          <div class="list-container" :class="caseSidebar ? 'active' : ''">
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
          <div id="user-profile">
            <section>
              <div class="row">
                <div class="col-lg-9">
                  <div class="row">
                    <div class="col-lg-12 p-0">
                      <div class="card-body">
                        <!-- Tab Start -->
                        <ul class="nav nav-tabs" role="tablist">
                          <li
                            class="nav-item"
                            v-if="role_id == 3 || role_id == 4"
                          >
                            <a
                              class="nav-link"
                              @click.prevent="setActive('lab')"
                              :class="{ active: isActive('lab') }"
                              href="#lab"
                            >
                              <h4 class="black font-weight-bold">Lab</h4></a
                            >
                          </li>
                          <li
                            class="nav-item"
                            v-if="role_id == 3 || role_id == 4 || role_id == 5"
                          >
                            <a
                              class="nav-link"
                              @click.prevent="setActive('tech')"
                              :class="{ active: isActive('tech') }"
                              href="#tech"
                              ><h4 class="black font-weight-bold">
                                Tech Companies
                              </h4></a
                            >
                          </li>
                          <li class="nav-item" v-if="role_id == 3">
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
                        </ul>
                        <!-- Tab Content Start -->
                        <div class="tab-content">
                          <div
                            class="tab-pane"
                            :class="{ 'active show': isActive('lab') }"
                            id="lab"
                          >
                            <!-- Explore Content -->
                            <Lab
                              v-if="this?.labs"
                              :labs="this?.labs"
                              :BASE_IMG="this?.BASE_IMG_LAB"
                              :getFavorites="getFavorites"
                            />
                            <!--End Explore Content -->
                          </div>
                          <!-- Service Tab End -->
                          <div
                            class="tab-pane"
                            :class="{ 'active show': isActive('tech') }"
                            id="tech"
                          >
                            <!-- Consultants Content -->
                            <TechCompanies
                              v-if="this?.techCompanies"
                              :techs="this?.techCompanies"
                              :BASE_IMG="this?.BASE_IMG_TECH"
                              :getFavorites="getFavorites"
                            />
                            <!-- End Consultants Content -->
                          </div>
                          <!-- Consultants Tab End -->
                          <div
                            class="tab-pane"
                            :class="{ 'active show': isActive('consultant') }"
                            id="consultant"
                          >
                            <!-- Labs Content -->
                            <Consultants
                              v-if="this?.consultantsData"
                              :consultants="this?.consultantsData"
                              :BASE_IMG="this?.BASE_IMG_CONSULTANT"
                              :getFavorites="getFavorites"
                            />
                            <!-- End Labs  Content -->
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 filter">
                  <!-- Filter Section -->
                  <div
                    class="filterContainer"
                    :class="caseSidebar ? 'menuOpen' : 'menuClose'"
                  >
                    <!-- <form> -->
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
                            v-for="(state, index) in filterData.location"
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
                      <div class="col-12 mb-1">
                        <star-rating
                          :rating="0"
                          v-model="ratingFilter"
                          @update:rating="setRating"
                          :star-size="26"
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
                          <option value="" disabled>Select Service</option>
                          <option
                            v-for="(service, index) in filterData.services"
                            :key="index"
                            :value="service.name"
                          >
                            {{ service.name }}
                          </option>
                        </select>
                      </div>
                    </div>

                    <div class="d-flex justify-content-lg-end">
                      <button class="resetBtn" @click.prevent="resetFilter">
                        Reset
                      </button>
                      <button class="applyBtn" @click.prevent="filterAction">
                        Apply
                      </button>
                    </div>
                    <!-- </form> -->
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
// import components
import Lab from './tabs/labs.vue';
import TechCompanies from './tabs/tech.vue';
import Consultants from './tabs/consultants.vue';
import profileService from '../../../services/profile.service';
import { createToast } from 'mosha-vue-toastify';

import StarRating from 'vue-star-rating';
import userAPI from '../../../services/user.API';

export default {
  name: 'favoriteList',
  components: {
    Lab,
    TechCompanies,
    Consultants,
    StarRating,
  },
  data() {
    return {
      caseSidebar: false,
      activeItem: '',
      // filter
      filterData: {
        services: [],
        location: [],
        cases_solved: [],
        // rating: [],
      },
      range: { min: '', max: '' },
      value: [100, 200],
      rating: 2,

      hasresults: false,
      hasdescription: false,
      starsize: 'lg', //[xs,lg,1x,2x,3x,4x,5x,6x,7x,8x,9x,10x],
      maxstars: 5,
      disabled: false,
      role_id: '',

      // component
      consultantsData: {},
      labs: {},
      techCompanies: {},
      BASE_IMG_CONSULTANT: '',
      BASE_IMG_LAB: '',
      BASE_IMG_TECH: '',
      ratingFilter: 0,
    };
  },
  methods: {
    isActive(menuItem) {
      return this.activeItem === menuItem;
    },
    setActive(menuItem) {
      this.activeItem = menuItem;
    },
    setRating(rating) {
      this.ratingFilter = rating;
    },
    filterAction() {
      // check if service is selected
      if (this.serviceName && !this.statename) {
        userAPI.getFavoriteList().then(
          res => {
            if (res.data.data.map(e => e.role_id === 4)) {
              this.consultantsData.data = res.data?.data
                ?.filter(e => e.role_id === 4)[0]
                .data.filter(item =>
                  item.service
                    .map(service => service.name.toLowerCase())
                    .includes(this.serviceName.toLowerCase()),
                );
            }

            if (res.data.data.map(e => e.role_id === 5)) {
              this.labs.data = res.data?.data
                ?.filter(e => e.role_id === 5)[0]
                .data.filter(item =>
                  item.service
                    .map(service => service.name.toLowerCase())
                    .includes(this.serviceName.toLowerCase()),
                );
            }

            if (res.data.data.map(e => e.role_id === 6)) {
              this.techCompanies.data = res.data?.data
                ?.filter(e => e.role_id === 6)[0]
                .data.filter(item =>
                  item.service
                    .map(service => service.name.toLowerCase())
                    .includes(this.serviceName.toLowerCase()),
                );
            }

            if (this.ratingFilter > 0) {
              this.labs.data = this.labs.data.filter(item =>
                item.profileData
                  .map(e => e.ratings)
                  .includes(this.ratingFilter),
              );
              this.consultantsData.data = this.consultantsData.data.filter(
                item =>
                  item.profileData
                    .map(e => e.ratings)
                    .includes(this.ratingFilter),
              );
              this.techCompanies.data = this.techCompanies.data.filter(item =>
                item.profileData
                  .map(e => e.ratings)
                  .includes(this.ratingFilter),
              );
            }
          },
          err => {
            console.log(err);
          },
        );
      }
      // check if state is selected
      else if (!this.serviceName && this.statename) {
        userAPI.getFavoriteList().then(
          res => {
            if (res.data.data.map(e => e.role_id === 4)) {
              this.consultantsData.data = res.data?.data
                ?.filter(e => e.role_id === 4)[0]
                .data.filter(item =>
                  item.profileData
                    .map(PD => PD.zip_info.state_name.toLowerCase())
                    .includes(this.statename.toLowerCase()),
                );
            }

            if (res.data.data.map(e => e.role_id === 5)) {
              this.labs.data = res.data?.data
                ?.filter(e => e.role_id === 5)[0]
                .data.filter(item =>
                  item.profileData
                    .map(PD => PD.zip_info.state_name.toLowerCase())
                    .includes(this.statename.toLowerCase()),
                );
            }

            if (res.data.data.map(e => e.role_id === 5)) {
              this.techCompanies.data = res.data?.data
                ?.filter(e => e.role_id === 5)[0]
                .data.filter(item =>
                  item.profileData
                    .map(PD => PD.zip_info.state_name.toLowerCase())
                    .includes(this.statename.toLowerCase()),
                );
            }

            if (this.ratingFilter > 0) {
              this.labs.data = this.labs.data.filter(item =>
                item.profileData
                  .map(e => e.ratings)
                  .includes(this.ratingFilter),
              );
              this.consultantsData.data = this.consultantsData.data.filter(
                item =>
                  item.profileData
                    .map(e => e.ratings)
                    .includes(this.ratingFilter),
              );
              this.techCompanies.data = this.techCompanies.data.filter(item =>
                item.profileData
                  .map(e => e.ratings)
                  .includes(this.ratingFilter),
              );
            }
          },
          err => {
            console.log(err);
          },
        );
      }
      // check if both are selected
      else if (this.serviceName && this.statename) {
        userAPI.getFavoriteList().then(
          res => {
            if (res.data.data.map(e => e.role_id === 4)) {
              this.consultantsData.data = res.data?.data
                ?.filter(e => e.role_id === 4)[0]
                .data.filter(
                  item =>
                    item.profileData
                      .map(PD => PD.zip_info.state_name.toLowerCase())
                      .includes(this.statename.toLowerCase()) &&
                    item.service
                      .map(service => service.name.toLowerCase())
                      .includes(this.serviceName.toLowerCase()),
                );
            }
            if (res.data.data.map(e => e.role_id === 5)) {
              this.labs.data = res.data?.data
                ?.filter(e => e.role_id === 5)[0]
                .data.filter(
                  item =>
                    item.profileData
                      .map(PD => PD.zip_info.state_name.toLowerCase())
                      .includes(this.statename.toLowerCase()) &&
                    item.service
                      .map(service => service.name.toLowerCase())
                      .includes(this.serviceName.toLowerCase()),
                );
            }
            if (res.data.data.map(e => e.role_id === 6)) {
              this.techCompanies.data = res.data?.data
                ?.filter(e => e.role_id === 6)[0]
                .data.filter(
                  item =>
                    item.profileData
                      .map(PD => PD.zip_info.state_name.toLowerCase())
                      .includes(this.statename.toLowerCase()) &&
                    item.service
                      .map(service => service.name.toLowerCase())
                      .includes(this.serviceName.toLowerCase()),
                );
            }
            if (this.ratingFilter > 0) {
              this.labs.data = this.labs.data.filter(item =>
                item.profileData
                  .map(e => e.ratings)
                  .includes(this.ratingFilter),
              );
              this.consultantsData.data = this.consultantsData.data.filter(
                item =>
                  item.profileData
                    .map(e => e.ratings)
                    .includes(this.ratingFilter),
              );
              this.techCompanies.data = this.techCompanies.data.filter(item =>
                item.profileData
                  .map(e => e.ratings)
                  .includes(this.ratingFilter),
              );
            }
          },
          err => {
            console.log(err);
          },
        );
      }
      // only rating selected
      else if (!this.serviceName && !this.stateName && this.ratingFilter > 0) {
        userAPI.getFavoriteList().then(
          res => {
            if (res.data.data.map(e => e.role_id === 4)) {
              this.consultantsData.data = res.data?.data
                ?.filter(e => e.role_id === 4)[0]
                .data.filter(item =>
                  item.profileData
                    .map(PD => PD.ratings)
                    .includes(this.ratingFilter),
                );
            }

            if (res.data.data.map(e => e.role_id === 5)) {
              this.labs.data = res.data?.data
                ?.filter(e => e.role_id === 5)[0]
                .data.filter(item =>
                  item.profileData
                    .map(PD => PD.ratings)
                    .includes(this.ratingFilter),
                );
            }

            if (res.data.data.map(e => e.role_id === 6)) {
              this.techCompanies.data = res.data?.data
                ?.filter(e => e.role_id === 6)[0]
                .data.filter(item =>
                  item.profileData
                    .map(PD => PD.ratings)
                    .includes(this.ratingFilter),
                );
            }
          },
          err => {
            console.log(err);
          },
        );
      } else {
        console.log('no filter selected');
      }
      this.caseSidebar = !this.caseSidebar;
    },
    caseShow() {
      this.caseSidebar = !this.caseSidebar;
    },
    getFavorites() {
      userAPI.getFavoriteList().then(
        res => {
          if (res.data.data.map(e => e.role_id === 4)) {
            this.consultantsData = res.data?.data?.filter(
              e => e.role_id === 4,
            )[0];
            this.BASE_IMG_CONSULTANT =
              this.consultantsData && this.consultantsData.imageFolderPath;
          }

          if (res.data.data.map(e => e.role_id === 5)) {
            this.labs = res.data?.data?.filter(e => e.role_id === 5)[0];
            this.BASE_IMG_LAB = this.labs && this.labs.imageFolderPath;
          }

          if (res.data.data.map(e => e.role_id === 6)) {
            this.techCompanies = res.data?.data?.filter(
              e => e.role_id === 6,
            )[0];
            this.BASE_IMG_TECH =
              this.techCompanies && this.techCompanies.imageFolderPath;
          }

          let locationFromAPI = res?.data?.data
            ?.map(e => e?.data?.map(pData => pData).map(e => e))
            .map(e => e.map(e => e.profileData[0].zip_info.state_name));

          this.filterData.location = [...new Set(locationFromAPI.flat())];

          // console.log(res?.data?.data?.map(e => e?.data?.map(pData => pData).map(e => e)).map(e => e.map(e => e.profileData[0].zip_info.state_name)));
        },
        error => {
          console.log(error.response.data.message);
        },
      );
    },
    resetFilter() {
      this.getFavorites();
      this.ratingFilter = 0;
    },
  },
  mounted() {
    userAPI.getServiceTypes().then(res => {
      if (res.data.success) {
        this.filterData.services = res.data.data.map(item => item);
      }
    });

    // get user role
    profileService.getUser().then(res => {
      if (res.role.role_id) {
        // storing user role
        this.role_id = res.role.role_id;

        // set active tab based on ROLE
        if (this.role_id == 3) {
          this.setActive('lab');
        } else if (this.role_id == 4) {
          this.setActive('lab');
        } else if (this.role_id == 5) {
          this.setActive('tech');
        } else {
          this.$router.push('/');
          createToast('You have no access to view this page', {
            position: 'top-right',
            type: 'danger',
            transition: 'bounce',
            showIcon: 'true',
            timeout: 2000,
          });
        }
      }
    });

    // get user favorite List
    this.getFavorites();
  },
  computed: {
    selectedNames() {
      return this.filterData.services
        .filter(service => service.selected)
        .map(service => service.name);
    },
  },
};
</script>

<style type="text/css" scoped>
@media screen and (max-width: 991px) {
  .filterContainer.menuOpen {
    min-width: 300px;
  }
}
.proPic img {
  max-width: 100%;
  max-height: 100%;
  height: 50px;
  width: 50px;
  display: block;
  border-radius: 15px;
  box-shadow: 0px 3px 6px #00000029;
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
  padding: 0px 25px 20px;
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

ul.nav.nav-tabs {
  margin: 0 0px 30px !important;
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

  #user-profile .nav.nav-tabs .nav-item .nav-link {
    padding: 15px 20px;
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
  margin: 10px 0px;
  height: 89%;
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
  padding: 5px 0 15px;
}
.stars path:hover {
  fill: gold !important;
}
.filter select {
  background: #f0f1f1;
  border-radius: 10px;
  height: auto;
  margin-bottom: 10px;
}
.filter .form-control:focus {
  color: #4e5154;
  background-color: #fff;
  border-color: #123c3d9e;
  outline: 0;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.15);
}
@media only screen and (min-width: 1000px) and (max-width: 1450px) {
  .filterContainer {
    background: #b9d0d2;
    border-radius: 10px;
    width: 19%;
    padding: 20px 15px;
    margin: 0px 0px;
    height: 88%;
    position: fixed;
    top: 70px;
  }
}

@media screen and (max-width: 767px) {
  .nav-tabs .nav-item a h4 {
    font-size: 1rem;
  }
}
@media screen and (min-width: 1000px) and (max-width: 1199px) {
  .filterContainer.menuClose {
    margin-left: -25px !important;
  }
}
</style>
