<template>
  <div>
    <!-- BEGIN: Header-->
    <TopHeader v-if="currentUser" />
    <!-- END: Header-->

    <!-- Sidebar -->
    <div
      class="main-menu menu-fixed menu-light menu-accordion"
      v-bind:class="isOpen ? 'mobileMenu' : ''"
    >
      <SideBar v-if="currentUser" />
    </div>
    <!-- END -->

    <!-- BEGIN: Content-->
    <router-view></router-view>
    <!-- END: Content-->

    <div
      class="sidenav-overlay"
      v-bind:class="{ dblock: isOpen }"
      @click="openClose"
    ></div>
    <!-- <div class="drag-target"></div> -->
  </div>
</template>

<script type="javascript">
// import { IMG_URL } from '../api/BaseURL';
import SideBar from './layout/sideBar.vue';
import EventBus from '../common/EventBus';
import TopHeader from './layout/top_header_nav.vue';
// import profileService from '../services/profile.service';

export default {
  components: {
    TopHeader,
    SideBar,
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    // this.URL = IMG_URL;

    EventBus.on('logout', () => {
      this.logOut();
    });
  },

  data() {
    return {
      user: '',
      userId: '',
      URL: '',
      isOpen: false,
    };
  },
  methods: {
    openClose() {
      this.isOpen = !this.isOpen;
    },
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    },
  },
  beforeUnmount() {
    EventBus.remove('logout');
  },
};
</script>
<style>
body {
  font-family: 'Poppins';
}
.header-navbar .navbar-container ul.nav li.dropdown .dropdown-menu {
  top: 60px;
  left: auto;
  right: 0;
  padding-top: 0;
  max-height: 45rem;
}
.nav.navbar-nav.float-right
  .dropdown.dropdown-notification
  .dropdown-menu::before {
  background: #017a7c;
  z-index: -1;
}
.nav.navbar-nav.float-right .dropdown.dropdown-user .dropdown-menu::before {
  background: #fff;
  z-index: -1;
}
.error-feedback {
  color: red;
  font-size: 12px;
}
</style>
