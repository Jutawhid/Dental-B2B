<template>
  <!-- BEGIN: Main Menu-->
  <div class="main-menu-content easiLink">
    <ul
      class="navigation navigation-main"
      id="main-menu-navigation"
      data-menu="menu-navigation"
    >
      <!-- Explore Link -->
      <!-- Active Bellow -->
      <li class="nav-item-active" v-if="this.$route.path === '/explore'">
        <router-link class="nav-link" to="">
          <i class="feather icon-compass"></i>
          <span class="menu-title" data-i18n="Dashboard">Explore</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="this.$route.path !== '/explore'">
        <router-link class="nav-link" to="/explore">
          <i class="feather icon-compass"></i>
          <span class="menu-title" data-i18n="Dashboard">Explore</span>
        </router-link>
      </li>
      <!-- Cases Link -->
      <li class="nav-item" v-if="this.$route.path !== '/cases/all'">
        <router-link class="nav-link" to="/cases/all">
          <img
            class="tooth-icon"
            src="../../assets/images/icons/common/tooth.svg"
            alt="message_icon"
            style="margin-right: 1.38rem"
          />
          <span class="menu-title" data-i18n="Dashboard">All Cases</span>
        </router-link>
      </li>
      <!-- Active Bellow -->
      <li class="nav-item-active" v-if="this.$route.path === '/cases/all'">
        <router-link class="nav-link" to="">
          <img
            class="tooth-icon"
            src="../../assets/images/icons/common/tooth.svg"
            alt="message_icon"
            style="margin-right: 1.38rem"
          />
          <span class="menu-title" data-i18n="Dashboard">All Cases</span>
        </router-link>
      </li>
      <!-- Favorite -->
      <li
        class="nav-item"
        v-if="
          this.$route.path !== '/favorites/list' &&
          this.getUserProfileRole !== 6
        "
      >
        <router-link class="nav-link" to="/favorites/list">
          <i class="feather icon-heart"></i>
          <span data-i18n="Email" class="menu-title">Favorite List</span>
        </router-link>
      </li>
      <!-- Active Bellow -->
      <li
        class="nav-item-active"
        v-if="
          this.$route.path === '/favorites/list' &&
          this.getUserProfileRole !== 6
        "
      >
        <router-link class="nav-link" to="">
          <i class="feather icon-heart"></i>
          <span data-i18n="Email" class="menu-title">Favorite List</span>
        </router-link>
      </li>
      <!-- Messages -->
      <li class="nav-item" v-if="this.$route.path !== '/messages/all'">
        <router-link class="nav-link" to="/messages/all">
          <i class="feather icon-message-circle"></i>
          <span data-i18n="Email" class="menu-title">Messages</span>
        </router-link>
      </li>
      <!-- Active Bellow -->
      <li class="nav-item-active" v-if="this.$route.path === '/messages/all'">
        <router-link class="nav-link" to="">
          <i class="feather icon-message-circle"></i>
          <span data-i18n="Email" class="menu-title">Messages</span>
        </router-link>
      </li>
      <!-- Requests -->
      <li class="nav-item" v-if="this.$route.path !== '/requests'">
        <router-link class="nav-link" to="/requests">
          <img
            src="../../assets/images/icons/common/playlist-add.svg"
            alt="message_icon"
            style="margin-right: 1.38rem"
          />
          <span data-i18n="Email" class="menu-title">Requests</span>
        </router-link>
      </li>
      <!-- Active Bellow -->
      <li class="nav-item-active" v-if="this.$route.path === '/requests'">
        <router-link class="nav-link" to="">
          <img
            src="../../assets/images/icons/common/playlist-add.svg"
            alt="message_icon"
            style="margin-right: 1.38rem"
          />
          <span data-i18n="Email" class="menu-title">Requests</span>
        </router-link>
      </li>
      <!-- Trash -->
      <li
        class="nav-item nav-bottom trash"
        v-if="this.$route.path !== '/trash'"
      >
        <router-link class="d-flex nav-link align-items-center" to="/trash">
          <i class="feather icon-trash-2"></i>
          <div class="col-12 p-0">
            <span data-i18n="Email" class="menu-title req">Trash</span>
            <!-- <hr /> -->
            <p class="text">Deleted within 30 days</p>
          </div>
        </router-link>
      </li>
      <li
        class="nav-item-active nav-bottom trash"
        v-if="this.$route.path === '/trash'"
      >
        <router-link class="d-flex nav-link align-items-center" to="">
          <i class="feather icon-trash-2"></i>
          <div class="col-12 p-0 mLeft">
            <span data-i18n="Email" class="menu-title req">Trash</span>
            <!-- <hr /> -->
            <p class="text">Deleted within 30 days</p>
          </div>
        </router-link>
      </li>
      <!-- Log out -->
      <li class="nav-item nav-bottom">
        <a class="nav-link btn-logout" @click.prevent="logOut">
          <img
            src="../../assets/images/icons/common/logout.svg"
            alt="message_icon"
            style="margin-right: 1.38rem"
          />
          <span data-i18n="Email" class="menu-title menu-title-logout"
            >Logout</span
          >
        </a>
      </li>
    </ul>
  </div>
  <!-- END: Main Menu-->
</template>

<script>
// import io from 'socket.io-client';
import userAPI from '../../services/user.API';
// import SOCKET_URL from '../../../src/api/SocketURL.js';
export default {
  name: 'userSideBar',
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    openClose() {
      this.isOpen = !this.isOpen;
    },
    logOut() {
      userAPI.logMeout().then(res => {
        // console.log(res);
        if (res.data.status === 200) {
          this.$store.dispatch('auth/logout');
          this.$store.dispatch('profile/logout');
          this.$store.dispatch('notification/logout');
          this.$router.push('/login');
          this.$moshaToast('Log out successful', {
            position: 'top-right',
            type: 'success',
            transition: 'bounce',
            showIcon: 'true',
            timeout: 2000,
          });
        } else {
          this.$moshaToast('Log out failed', {
            position: 'top-right',
            type: 'error',
            transition: 'bounce',
            showIcon: 'true',
            timeout: 2000,
          });
        }
      });
    },
    // getRole() {
    //   userAPI.getUserProfile().then(res => {
    //     if (res.data.data) {
    //       this.role = res.data.data.role.role_id;
    //     }
    //   });
    // },
  },
  computed: {
    getUserProfileRole() {
      return this.$store.state.profile.role_id;
    },
  },
};
</script>

<style type="text/css" scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap');
/* @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap'); */
li.nav-item.nav-bottom.trash,
li.nav-item-active.nav-bottom.trash {
  bottom: 80px;
  width: 220px;
  position: fixed;
}
.easiLink .nav-item-active {
  background: #ffd700;
  transition: 0.5s ease 0s !important;
}
.ratings-box i.text-positive {
  -webkit-text-stroke: 1px black;
  -webkit-text-fill-color: #ffd700;
}

.ratings-box i.text-negative {
  color: #000000;
  -webkit-text-stroke: 1px black;
  -webkit-text-fill-color: #fff;
}

html body {
  font-family: 'Poppins', sans-serif;
}

p {
  font-size: 15px;
  font-family: 'Poppins';
  color: #4a4a4a;
}

.card {
  border-radius: 20px;
}

.btn-edit {
  /* min-width: 120px; */
  background: #ffd700;
  color: #000000 !important;
  font-weight: 600;
  font-family: 'Poppins';
  box-shadow: 0px 3px 6px #00000029;
  height: 40px;
}

.nav.nav-tabs .nav-item .nav-link {
  padding: 0px 50px 25px;
  color: #000;
  opacity: 0.5;
}

.nav.nav-tabs .nav-item .nav-link.active,
.nav-tabs .nav-item.show .nav-link {
  color: #123c3d;
  opacity: 1;
}

.nav.nav-tabs .nav-item .nav-link.active:after {
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

.nav.nav-tabs {
  border-bottom: 1px solid #cfcfcf;
}

.main-menu.menu-light .navigation li a.btn-logout {
  background: #123c3d;
  border-radius: 10px;
  padding: 15px 30px;
  text-align: center;
  color: #ffffff;
  width: 220px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Poppins';
}
.main-menu.menu-light .navigation li.trash a {
  color: #123c3d;
  padding: 10px 15px;
  line-height: 1.45;
  transition: padding 0.35s ease 0s !important;
  font-family: Poppins;
  font-weight: 500;
}
.navigation-main li.nav-item:active {
  background: #ffd700;
  color: #123c3d;
  padding: 0;
  margin: 10px 20px;
}

li.nav-item.nav-bottom {
  position: fixed;
  bottom: 0px;
}

li.nav-item.nav-bottom i {
  margin-right: 10px;
}

/* New */

.error-feedback {
  color: #b91515;
  font-size: 12px;
  margin-left: 10px;
}

.header-navbar .navbar-container ul.nav li.dropdown .dropdown-menu {
  top: 60px;
  left: auto;
  right: 0;
  padding-top: 0;
}
.dropdown .dropdown-menu::before {
  background: #017a7c;
}
.trash .text {
  color: #000000;
  opacity: 0.7;
  font-size: 10px;
  border-top: 1px solid gray;
  padding: 0;
  margin: 0;
  width: 80%;
}
.trash .req {
  color: #000000;
  opacity: 0.7;
  font-size: 12px;
  font-weight: bold;
}
i.feather {
  font-size: 18px;
}
li.nav-item-active .mLeft {
  margin-left: -9px;
}
li.nav-item.nav-bottom.trash {
  background: #f8f8f9;
}
li.nav-item.nav-bottom.trash:hover {
  background: #e8e8e8;
}
span.menu-title {
  font-size: 13px;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
}
.main-menu.menu-light .navigation > li {
  padding: 0;
  margin: 5px 20px;
}
</style>
