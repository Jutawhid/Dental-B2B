<template>
  <div>
    <!-- Container Fluid-->
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="content-wrapper">
        <div class="content-body" id="req">
          <div id="user-profile">
            <section id="">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card-body">
                    <!-- Tab Start -->
                    <ul class="col-lg-9 nav nav-tabs" role="tablist">
                      <li class="nav-item" v-if="role === 3 || role === 5">
                        <a
                          class="nav-link"
                          @click.prevent="setActive('sentRequest')"
                          :class="{ active: isActive('sentRequest') }"
                          href="#sentRequest"
                          ><div class="tab-title black font-weight-bold">
                            Sent Requests
                          </div></a
                        >
                      </li>
                      <li
                        class="nav-item"
                        v-if="role === 4 || role === 5 || role === 6"
                      >
                        <a
                          class="nav-link"
                          @click.prevent="setActive('receivedRequest')"
                          :class="{ active: isActive('receivedRequest') }"
                          href="#receivedRequest"
                          ><div class="tab-title black font-weight-bold">
                            Received Requests
                          </div></a
                        >
                      </li>
                      <li class="nav-item" v-if="role === 3">
                        <a
                          class="nav-link"
                          @click.prevent="setActive('recommendation')"
                          :class="{ active: isActive('recommendation') }"
                          href="#recommendation"
                        >
                          <div class="tab-title black font-weight-bold">
                            Recommendations
                          </div></a
                        >
                      </li>
                      <li class="nav-item" v-if="role === 4">
                        <a
                          class="nav-link"
                          @click.prevent="setActive('myRecommendations')"
                          :class="{ active: isActive('myRecommendations') }"
                          href="#myRecommendations"
                          ><div class="tab-title black font-weight-bold">
                            My Recommendations
                          </div></a
                        >
                      </li>
                    </ul>
                    <!-- Tab Content Start -->
                    <div class="tab-content mtSR">
                      <!-- Sent request START -->
                      <div
                        v-if="role === 3 || role === 5"
                        class="tab-pane"
                        :class="{ 'active show': isActive('sentRequest') }"
                        id="sentRequest"
                      >
                        <SentRequest />
                      </div>
                      <!-- Sent Request END -->
                      <!-- Received Request -->
                      <div
                        v-if="role === 4 || role === 5 || role === 6"
                        class="tab-pane"
                        :class="{ 'active show': isActive('receivedRequest') }"
                        id="receivedRequest"
                      >
                        <ReceivedRequest />
                      </div>
                      <!-- Received Request End -->
                      <!-- recommendation tab START-->
                      <div
                        v-if="role === 3"
                        class="tab-pane"
                        :class="{ 'active show': isActive('recommendation') }"
                        id="recommendation"
                      >
                        <DentistRecommendations />
                      </div>
                      <!-- recommendation tab END-->

                      <!-- My Recommendation START -->
                      <div
                        v-if="role === 4"
                        class="tab-pane"
                        :class="{
                          'active show': isActive('myRecommendations'),
                        }"
                        id="myRecommendations"
                      >
                        <MyRecommendations />
                      </div>
                      <!-- My Recommendation END -->
                    </div>
                  </div>
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

<script type="text/javascript">
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import { createToast } from 'mosha-vue-toastify';
// import profileService from '../../../services/profile.service';
import DentistRecommendations from './tab/dentistRecommendation.vue';
import SentRequest from './tab/sentRequests.vue';
import ReceivedRequest from './tab/receivedRequests.vue';
import MyRecommendations from './tab/myRecommendList.vue';

export default {
  name: 'RequestsList',
  components: {
    DentistRecommendations,
    SentRequest,
    ReceivedRequest,
    MyRecommendations,
  },
  data() {
    return {
      user: {},
      activeItem: 'recommendation',
      role: '',
    };
  },
  mounted() {
    this.role = this.getCurrentUserRole.role.role_id;
    // set tab
    if (this.role == 3) {
      this.setActive('sentRequest');
    } else if (this.role === 4) {
      this.setActive('receivedRequest');
    } else if (this.role === 5) {
      this.setActive('sentRequest');
    } else if (this.role === 6) {
      this.setActive('receivedRequest');
    } else {
      this.$router.push('/');
      createToast('You are not authorized to view this page', {
        type: 'danger',
        position: 'top-center',
        showIcon: true,
        timeout: 2000,
      });
    }
  },
  methods: {
    isActive(menuItem) {
      return this.activeItem === menuItem;
    },
    setActive(menuItem) {
      this.activeItem = menuItem;
    },
    // getUserRole() {
    //   profileService.getUser().then(response => {
    //     console.log(response);
    //     if (response) {
    //       console.log(response);
    //       this.role = response.role.role_id;
    //     }
    //   });
    // },
  },
  computed: {
    getCurrentUserRole() {
      return this.$store.state.auth.user;
    },
  },
};
</script>

<style type="text/css" scoped>
.tab-title {
  font-size: 1.1rem;
}
#req #profile-info {
  padding-right: 0 !important;
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
}
#user-profile .nav.nav-tabs {
  margin: 0 0 0 20px !important;
  border: none;
}
@media only screen and (min-width: 992px) {
  #user-profile .profile-header-nav .navbar .nav-item {
    padding-left: 2.25rem !important;
    padding-right: 2.25rem !important;
  }
}

@media only screen and (max-width: 992px) {
  .tab-title {
    font-size: 1rem;
  }
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
  .card-body {
    padding: 0px;
  }
  .rejectBtn {
    margin-left: 0px;
    padding: 5px;
  }
}

@media only screen and (max-width: 768px) {
  #user-profile .profile-header-nav .navbar .nav-item {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
  .rejectBtn {
    margin-left: 0px;
    padding: 5px;
  }
}
.tab-content.mtSR {
  border-radius: 10px;
  margin-top: 0px;
}
</style>
