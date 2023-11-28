<template>
  <div>
    <!-- BEGIN: Main Menu-->
    <div class="navbar-header">
      <ul class="nav navbar-nav flex-row">
        <li class="nav-item mr-auto">
          <router-link class="navbar-brand" to="/">
            <div class="brand-logo"></div>
            <!--<h2 class="brand-text mb-0">Easyfi</h2>-->
          </router-link>
        </li>

        <li class="nav-item nav-toggle">
          <a
            class="nav-link modern-nav-toggle pr-0"
            @click="this.$parent.openClose"
          >
            <i
              class="feather icon-x d-block d-xl-none font-medium-4 toggle-icon"
              style="color: #00ffff"
            ></i>
          </a>
        </li>
      </ul>
    </div>
    <div class="shadow-bottom"></div>
    <div class="main-menu-content easiLink" v-if="loading">
      <ul
        class="navigation navigation-main"
        id="main-menu-navigation"
        data-menu="menu-navigation"
      >
        <!-- Explore Link -->
        <!-- Active Bellow -->
        <li class="nav-item-active">
          <div class="placeholder wave flex-column">
            <div class="nav-menu"><br /></div>
          </div>
        </li>
        <li class="nav-item-active">
          <div class="placeholder wave flex-column">
            <div class="nav-menu"><br /></div>
          </div>
        </li>
        <li class="nav-item-active">
          <div class="placeholder wave flex-column">
            <div class="nav-menu"><br /></div>
          </div>
        </li>
        <li class="nav-item-active">
          <div class="placeholder wave flex-column">
            <div class="nav-menu"><br /></div>
          </div>
        </li>
        <li class="nav-item-active">
          <div class="placeholder wave flex-column">
            <div class="nav-menu"><br /></div>
          </div>
        </li>
      </ul>
    </div>
    <!-- For Super Admin -->
    <SuperAdminSideBar
      v-if="this.getUserProfileRole === 1"
      @click="this.$parent.openClose"
    />
    <!-- For Admin -->
    <AdminSideBar
      v-if="this.getUserProfileRole === 2"
      @click="this.$parent.openClose"
    />
    <!-- For User -->
    <UserSideBar
      v-if="
        this.getUserProfileRole === 3 ||
        this.getUserProfileRole === 4 ||
        this.getUserProfileRole === 5 ||
        this.getUserProfileRole === 6
      "
      @click="this.$parent.openClose"
    />
    <!-- END: Main Menu-->
  </div>
</template>

<script>
import AdminSideBar from './adminSideBar';
import SuperAdminSideBar from './superAdminSideBar.vue';
import UserSideBar from './usersSideBar';
// import profileService from '../../services/profile.service';
export default {
  name: 'leftSideBar',
  components: {
    AdminSideBar,
    UserSideBar,
    SuperAdminSideBar,
  },
  created() {
    setTimeout(() => {
      if (this.geCurrentUserRole) {
        this.loading = false;
      }
    }, 50);
    //   profileService.getUser().then(res => {
    //     this.profile = res;
    //     this.role = this.profile.role.role_id;
    //     console.log(this.profile.role.role_id);
    //     this.loading = false;
    //   });
  },
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    getUserProfileRole() {
      return this.$store.state.profile.role_id;
    },
    geCurrentUserRole() {
      return this.$store.state.auth.user.role.role_id;
    },
  },
};
</script>

<style type="text/css" scoped>
/* *********************************** */
.placeholder {
  margin: 15px 0;
  /* padding: 10px; */
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
.placeholder .nav-menu {
  height: 50px;
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
@media screen and (min-width: 1000px) and (max-width: 1199px) {
  i.feather.icon-x {
    visibility: hidden !important;
  }
}
</style>
