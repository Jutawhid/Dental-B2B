<template>
  <div class="main-menu-content easiLink" id="admin">
    <div style="height: 90%">
      <ul
        class="navigation navigation-main cScroll"
        id="main-menu-navigation2"
        data-menu="menu-navigation"
      >
        <!-- Explore Link -->
        <!-- Active Bellow -->
        <li class="nav-item-active" v-if="this.$route.path === '/cpanel/users'">
          <router-link class="nav-link" to="#">
            <i class="feather icon-users"></i>
            <span class="menu-title">All Users</span>
          </router-link>
        </li>
        <li class="nav-item" v-if="this.$route.path !== '/cpanel/users'">
          <router-link class="nav-link" to="/cpanel/users">
            <i class="feather icon-users"></i>
            <span class="menu-title" data-i18n="Dashboard">All Users</span>
          </router-link>
        </li>
        <!-- Cases Link -->
        <li class="nav-item" v-if="this.$route.path !== '/cpanel/cases'">
          <router-link class="nav-link" to="/cpanel/cases">
            <i class="feather icon-file-text"></i>
            <span class="menu-title" data-i18n="Dashboard">All Cases</span>
          </router-link>
        </li>
        <!-- Active Bellow -->
        <li class="nav-item-active" v-if="this.$route.path === '/cpanel/cases'">
          <router-link class="nav-link" to="#">
            <i class="feather icon-file-text"></i>
            <span class="menu-title" data-i18n="Dashboard">All Cases</span>
          </router-link>
        </li>
        <!-- Favorite -->
        <li class="nav-item" v-if="this.$route.path !== '/admins'">
          <router-link class="nav-link" to="/admins">
            <i class="feather icon-user"></i>
            <span data-i18n="Email" class="menu-title">Other Admins</span>
          </router-link>
        </li>
        <!-- Active Bellow -->
        <li class="nav-item-active" v-if="this.$route.path === '/admins'">
          <router-link class="nav-link" to="#">
            <i class="feather icon-user"></i>
            <span data-i18n="Email" class="menu-title">Other Admins</span>
          </router-link>
        </li>
        <!-- Feature List -->
        <li class="nav-item" v-if="this.$route.path !== '/feature/list'">
          <router-link class="nav-link" to="/feature/list">
            <i class="feather icon-layers"></i>
            <span data-i18n="Email" class="menu-title">Featured List</span>
          </router-link>
        </li>
        <!-- Active Bellow -->
        <li class="nav-item-active" v-if="this.$route.path === '/feature/list'">
          <router-link class="nav-link" to="#">
            <i class="feather icon-layers"></i>
            <span data-i18n="Email" class="menu-title">Featured List</span>
          </router-link>
        </li>
        <!-- Service Types -->
        <li class="nav-item" v-if="this.$route.path !== '/service/list'">
          <router-link class="nav-link" to="/service/list">
            <i class="feather icon-briefcase"></i>
            <span data-i18n="Email" class="menu-title">Service Types</span>
          </router-link>
        </li>
        <!-- Active Bellow -->
        <li class="nav-item-active" v-if="this.$route.path === '/service/list'">
          <router-link class="nav-link" to="#">
            <i class="feather icon-briefcase"></i>
            <span data-i18n="Email" class="menu-title">Service Types</span>
          </router-link>
        </li>
        <!-- Service Types -->
        <li class="nav-item" v-if="this.$route.path !== '/admin/payments'">
          <router-link class="nav-link" to="/admin/payments">
            <i class="feather icon-dollar-sign"></i>
            <span data-i18n="Email" class="menu-title">Payment</span>
          </router-link>
        </li>
        <!-- Active Bellow -->
        <li
          class="nav-item-active"
          v-if="this.$route.path === '/admin/payments'"
        >
          <router-link class="nav-link" to="#">
            <i class="feather icon-dollar-sign"></i>
            <span data-i18n="Email" class="menu-title">Payment</span>
          </router-link>
        </li>

        <!-- Requests -->
        <li class="nav-item" v-if="this.$route.path !== '/messages/all'">
          <router-link class="nav-link" to="/messages/all">
            <i class="feather icon-file-text"></i>
            <span data-i18n="Email" class="menu-title">Messages</span>
          </router-link>
        </li>
        <!-- Active Bellow -->
        <li class="nav-item-active" v-if="this.$route.path === '/messages/all'">
          <router-link class="nav-link" to="#">
            <i class="feather icon-file-text"></i>
            <span data-i18n="Email" class="menu-title">Messages</span>
          </router-link>
        </li>
        <!-- Payment -->
        <!-- <li class="nav-item" v-if="this.$route.path !== '/cpanel/payment'">
        <router-link class="nav-link" to="/cpanel/payment">
          <i class="feather icon-file-text"></i>
          <span data-i18n="Email" class="menu-title">Payment Info</span>
        </router-link>
      </li>-->
        <!-- Active Bellow -->
        <!-- <li class="nav-item-active" v-if="this.$route.path === '/cpanel/payment'">
        <router-link class="nav-link" to="#">
          <i class="feather icon-file-text"></i>
          <span data-i18n="Email" class="menu-title">Payment Info</span>
        </router-link>
      </li> -->
        <!-- Trash -->
        <!-- <li
          class="nav-item nav-bottom trash"
          v-if="this.$route.path !== '/cpanel/trash'"
        >
          <router-link
            class="d-flex nav-link align-items-center"
            to="/cpanel/trash"
          >
            <i class="feather icon-trash-2"></i>
            <div class="col-12 p-0">
              <span data-i18n="Email" class="menu-title req">Trash</span>
              <p class="text">Deleted within 30 days</p>
            </div>
          </router-link>
        </li>
        <li class="nav-item-active nav-bottom trash" v-else>
          <router-link
            class="d-flex nav-link align-items-center"
            to="/cpanel/trash"
          >
            <i class="feather icon-trash-2"></i>
            <div class="col-12 p-0 mLeft">
              <span data-i18n="Email" class="menu-title req">Trash</span>
              <p class="text">Deleted within 30 days</p>
            </div>
          </router-link>
        </li> -->
        <!-- Log out -->
        <!-- <li class="nav-item nav-bottom">
          <a class="nav-link btn-logout" @click.prevent="logOut">
            <img
              src="../../assets/images/icons/common/logout.svg"
              alt="message_icon"
              style="margin-right: 15px"
            />
            <span data-i18n="Email" class="menu-title">Logout</span>
          </a>
        </li> -->
      </ul>
    </div>
    <ul
      class="navigation navigation-main"
      id="main-menu-navigation2"
      data-menu="menu-navigation"
    >
      <li
        class="nav-item nav-bottom trash"
        v-if="this.$route.path !== '/cpanel/trash'"
      >
        <router-link
          class="d-flex nav-link align-items-center"
          to="/cpanel/trash"
        >
          <i class="feather icon-trash-2"></i>
          <div class="col-12 p-0">
            <span data-i18n="Email" class="menu-title req">Trash</span>
            <!-- <hr /> -->
            <p class="text">Deleted within 30 days</p>
          </div>
        </router-link>
      </li>
      <li class="nav-item-active nav-bottom trash" v-else>
        <router-link
          class="d-flex nav-link align-items-center"
          to="/cpanel/trash"
        >
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
            style="margin-right: 15px"
          />
          <span data-i18n="Email" class="menu-title">Logout</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import userAPI from '../../services/user.API';
export default {
  name: 'adminSideBar',
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
