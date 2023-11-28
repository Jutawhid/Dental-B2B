<template>
  <div class="app-content content">
    <div class="content-overlay"></div>
    <div class="header-navbar-shadow"></div>
    <div class="content-wrapper">
      <div id="user-profile">
        <ConsultantProfileView :user_details="user_details" />
      </div>
      <section id="profile-info">
        <div class="row">
          <div class="col-lg-9 offset-lg-3">
            <div class="card top-m">
              <div class="card-body">
                <!-- Tab Start -->
                <ul class="nav nav-tabs" role="tablist">
                  <li class="nav-item">
                    <a
                      class="nav-link px-2"
                      href="#servicesDetals"
                      @click.prevent="setActive('servicesDetals')"
                      :class="{ active: isActive('servicesDetals') }"
                    >
                      <h4 class="black font-weight-bolder">Services</h4></a
                    >
                  </li>

                  <li class="nav-item">
                    <a
                      class="nav-link px-2"
                      href="#about"
                      @click.prevent="setActive('about')"
                      :class="{ active: isActive('about') }"
                      ><h4 class="black font-weight-bolder">About</h4></a
                    >
                  </li>
                </ul>
                <!-- Tab Content Start -->
                <div class="tab-content">
                  <div
                    class="tab-pane"
                    :class="{ 'active show': isActive('servicesDetals') }"
                    id="servicesDetals"
                  >
                    <!-- Service Content -->
                    <servicesDetals :serviceDetails="user_details.service" />
                    <!--End Service Content -->
                  </div>
                  <!-- Service Tab End -->

                  <div
                    class="tab-pane"
                    :class="{ 'active show': isActive('about') }"
                    id="about"
                  >
                    <!-- About Content -->
                    <about :user_details="user_details" />
                    <!-- End About  Content -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
// import EditConsultantProfile from "./edit/EditConsultantProfile.vue";
import ConsultantProfileView from './displayConsultantProfile.vue';
import servicesDetals from './service/serveiceDetails.vue';
import about from './about.vue';

export default {
  name: 'Consultant',
  components: {
    // EditConsultantProfile,
    ConsultantProfileView,
    servicesDetals,
    about,
  },
  data() {
    return {
      user: {},
      isEditProfile: false,
      activeItem: 'servicesDetals',
    };
  },
  methods: {
    isActive(menuItem) {
      return this.activeItem === menuItem;
    },
    setActive(menuItem) {
      this.activeItem = menuItem;
    },
    EditAction() {
      this.isEditProfile = true;
    },
    backToProfile() {
      this.isEditProfile = false;
    },
  },
  mounted() {
    // console.log("details", this.user_details);
  },
  props: ['user_details'],
};
</script>

<style scoped>
#user-profile .nav.nav-tabs .nav-item .nav-link {
  padding: 0px 50px 25px !important;
  color: #000;
  opacity: 0.5;
}
/* #user-profile ul.nav.nav-tabs li.nav-item a.nav-link {
  padding: 10px 30px;
} */

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
    padding-left: 1.5rem !important;
    padding-right: 1.5rem !important;
  }
}
</style>
