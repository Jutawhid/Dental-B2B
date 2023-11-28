<template>
  <div>
    <!-- Container Fluid-->
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="content-wrapper">
        <div class="content-body">
          <div id="user-profile">
            <section id="">
              <div class="row">
                <!-- Breadcrumb -->
                <!-- Body Part -->
                <div class="col-lg-12">
                  <div class="card-body">
                    <!-- Tab Start -->
                    <ul class="col-lg-9 nav nav-tabs" role="tablist">
                      <li class="nav-item">
                        <a
                          class="nav-link"
                          @click.prevent="setActive('Dentist')"
                          :class="{ active: isActive('Dentist') }"
                          href="#Dentist"
                        >
                          <h4 class="black font-weight-bold">Dentist</h4></a
                        >
                      </li>
                      <li class="nav-item">
                        <a
                          class="nav-link"
                          @click.prevent="setActive('Lab')"
                          :class="{ active: isActive('Lab') }"
                          href="#Lab"
                          ><h4 class="black font-weight-bold">Labs</h4></a
                        >
                      </li>

                      <li class="nav-item">
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
                      <li class="nav-item">
                        <a
                          class="nav-link"
                          @click.prevent="setActive('consultants')"
                          :class="{ active: isActive('consultants') }"
                          href="#consultants"
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
                        :class="{ 'active show': isActive('Dentist') }"
                        id="Dentist"
                      >
                        <!-- Service Content -->
                        <Dentists />
                        <!--End Service Content -->
                      </div>
                      <!-- Service Tab End -->
                      <div
                        class="tab-pane"
                        :class="{ 'active show': isActive('Lab') }"
                        id="Lab"
                      >
                        <!-- LAB Content -->
                        <Labs />
                        <!-- End LAB Content -->
                      </div>
                      <!-- Tech Company Tab End -->
                      <div
                        class="tab-pane"
                        :class="{ 'active show': isActive('tech') }"
                        id="tech"
                      >
                        <!-- Tech Company's Content -->
                        <TechCompanies />
                        <!-- End Tech Company's  Content -->
                      </div>
                      <!-- Tech Company's Tab End -->

                      <!-- Consultants -->
                      <div
                        class="tab-pane"
                        :class="{ 'active show': isActive('consultants') }"
                        id="consultants"
                      >
                        <!-- Consultants Content -->
                        <Consultants />
                        <!-- End Consultants  Content -->
                      </div>
                      <!-- Consultants End -->
                    </div>
                  </div>
                </div>
                <div class="col-lg-2">
                  <!-- Filter Part -->
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
import Dentists from './tabs/dentistList.vue';
import Labs from './tabs/labs.vue';
import TechCompanies from './tabs/techCompanies.vue';
import Consultants from './tabs/consultants.vue';

export default {
  name: 'userCpanelSA',
  components: {
    Dentists,
    Labs,
    TechCompanies,
    Consultants,
  },

  data() {
    return {
      user: {},
      activeItem: 'Dentist',
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
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
body {
  font-family: 'Poppins';
}

#user-profile .nav.nav-tabs .nav-item .nav-link {
  padding: 0px 25px 25px;
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

tr.TR.odd,
tr.TR.even {
  background: #ffffff;
  box-shadow: 0px 2px 3px #00000029;
  border-radius: 9px;
  margin: 15px 0;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
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

/* brdCrumb Starts */
.brdCrumb .brd-container {
  background: #f3f3f3;
  border: 1px solid #dfdfdf;
  opacity: 1;
  padding: 10px;
  width: 100%;
}
.brdCrumb .brd-icon {
  background: var(--unnamed-color-ffffff);
  background: #ffffff;
  box-shadow: 0px 3px 6px #0000000d;
  border: 1px solid #cfcfcf;
  border-radius: 10px;
  padding: 8px 10px;
}
.brdCrumb h2 {
  color: #071c1d;
  font-size: 18px;
  font-weight: bold;
  margin: 10px 15px;
}

/* brdCrumb Ends */
</style>
