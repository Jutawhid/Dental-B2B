<template>
  <div>
    <!-- Container Fluid-->

    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="content-wrapper">
        <div class="content-body">
          <div id="user-profile">
            <!-- Start Profile Top Section -->
            <profileDetals :profileInfo="userData" />
            <!-- End Profile top section -->

            <!-- Start Profile buttom Section -->
            <section id="profile-info">
              <div class="row">
                <div class="profile-photo-wrapper"></div>
                <div class="profile-detail-wrapper pl-lg-0">
                  <div class="card top-m">
                    <div class="card-body indvPrfl">
                      <!-- Tab Start -->
                      <ul class="nav nav-tabs" role="tablist">
                        <li class="nav-item">
                          <a
                            class="nav-link"
                            href="#serviceDetails"
                            @click.prevent="setActive('serviceDetails')"
                            :class="{ active: isActive('serviceDetails') }"
                          >
                            <h4 class="black font-weight-bolder">
                              My Services
                            </h4></a
                          >
                        </li>
                        <li
                          class="nav-item"
                          v-if="
                            userData.role?.role_id == 5 ||
                            userData.role?.role_id == 6
                          "
                        >
                          <a
                            class="nav-link"
                            href="#trainingDetails"
                            @click.prevent="setActive('trainingDetails')"
                            :class="{ active: isActive('trainingDetails') }"
                            ><h4 class="black font-weight-bolder">
                              Training
                            </h4></a
                          >
                        </li>
                        <li class="nav-item">
                          <a
                            class="nav-link"
                            href="#about"
                            @click.prevent="setActive('about')"
                            :class="{ active: isActive('about') }"
                            ><h4 class="black font-weight-bolder">
                              My Information
                            </h4></a
                          >
                        </li>
                      </ul>
                      <!-- Tab Content Start -->
                      <div class="tab-content">
                        <div
                          class="tab-pane"
                          :class="{ 'active show': isActive('serviceDetails') }"
                          id="serviceDetails"
                        >
                          <!-- Service Content -->
                          <serviceDetails />
                          <!--End Service Content -->
                        </div>
                        <!-- Service Tab End -->
                        <div
                          v-if="
                            userData?.role?.role_id == 5 ||
                            userData?.role?.role_id == 6
                          "
                          class="tab-pane"
                          :class="{
                            'active show': isActive('trainingDetails'),
                          }"
                          id="trainingDetails"
                        >
                          <!-- Training Content -->
                          <trainingDetals />
                          <!-- End Training Content -->
                        </div>
                        <!-- Training Tab End -->
                        <div
                          class="tab-pane"
                          :class="{ 'active show': isActive('about') }"
                          id="about"
                        >
                          <!-- About Content -->
                          <about :user="userData" />
                          <!-- End About  Content -->
                        </div>
                        <!-- Training Tab End -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <!-- End Profile buttom Section -->
          </div>
        </div>
      </div>
    </div>

    <!---Container Fluid-->
  </div>
</template>

<script type="javascript">
import profileDetals from './profileDetails';
import serviceDetails from './service/serviceDetails';
import trainingDetals from './training/trainingDetails';
import about from './about';
import USERS_API from '../../../../services/user.API';
export default {
  name: 'userProfile',
  components: {
    profileDetals,
    serviceDetails,
    trainingDetals,
    about,
  },
  mounted() {
    USERS_API.getUserProfile().then(
      response => {
        if (response?.data?.data) {
          this.userData = response.data.data;
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
      userData: {},
      user: {},
      activeItem: 'serviceDetails',
    };
  },
  methods: {
    isActive(menuItem) {
      return this.activeItem === menuItem;
    },
    setActive(menuItem) {
      this.activeItem = menuItem;
    },
  },
};
</script>

<style type="text/css" scoped>
.profile-photo-wrapper {
  width: 20%;
}

.profile-detail-wrapper {
  width: 80%;
}
#user-profile .nav.nav-tabs .nav-item .nav-link {
  padding: 0px 50px 25px;
  color: #000;
  opacity: 0.5;
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
  width: 55% !important;
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
  border-radius: 15px;
  margin-left: 15px;
}

.bg-cover {
  border-radius: 25px;
}
.card {
  padding: 30px;
}
@media (max-width: 1440px) {
  #user-profile .nav.nav-tabs .nav-item .nav-link {
    padding: 0px 30px 15px;
  }
  #profile-info .top-m {
    margin-top: -5rem;
  }
  .card {
    padding: 15px;
  }
  /* #user-profile .service-card-title h2 {
    width: 50%;
  } */
  .service-card-title .mbl_res {
    width: 50%;
  }
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
    margin-left: 0px;
  }

  #profile-info {
    padding-right: 0px;
  }

  #user-profile #profile-info .nav.nav-tabs .nav-item .nav-link {
    padding: 15px 10px;
  }
  .profile-photo-wrapper {
    width: 0%;
  }
  .profile-detail-wrapper {
    width: 100%;
  }
}

@media only screen and (max-width: 991px) and (min-width: 768px) {
  #user-profile .profile-header-nav .navbar .nav-item {
    padding-left: 1.5rem !important;
    padding-right: 1.5rem !important;
  }
}
.indvPrfl ul.nav.nav-tabs {
  margin: 0 0px 30px !important;
}
.indvPrfl .nav-link {
  font-size: 15px;
  text-transform: uppercase;
}
.indvPrfl .nav.nav-tabs .nav-item .nav-link {
  padding: 0 50px 20px;
}
</style>
