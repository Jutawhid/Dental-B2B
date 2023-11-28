<template>
  <div v-if="currentUser">
    <nav
      class="header-navbar navbar-expand-lg navbar navbar-with-menu floating-nav navbar-dark navbar-shadow"
    >
      <div class="navbar-wrapper">
        <div class="navbar-container content">
          <div class="navbar-collapse" id="navbar-mobile">
            <div
              class="m-auto float-left bookmark-wrapper d-flex align-items-center"
            >
              <ul class="nav navbar-nav">
                <li class="nav-item mobile-menu d-xl-none mr-auto">
                  <a
                    class="nav-link nav-menu-main menu-toggle hidden-xs"
                    @click="this.$parent.openClose"
                  >
                    <i class="ficon feather icon-menu"></i>
                  </a>
                </li>
              </ul>
              <ul class="nav navbar-nav bookmark-icons search_header">
                <li
                  class="nav-item d-none d-lg-block nav__search"
                  v-if="role === 3 || role === 4 || role === 5 || role === 6"
                >
                  <div class="bookmark-input-icon">
                    <i
                      class="feather icon-search"
                      @click.prevent="searchExplore"
                    ></i>
                  </div>
                  <input
                    class="form-control input search-input-field"
                    v-model="searchText"
                    type="text"
                    placeholder="Search"
                    tabindex="0"
                    data-search="template-list"
                    v-on:keyup.enter="searchExplore"
                  />
                </li>
              </ul>
            </div>

            <ul class="nav navbar-nav float-right">
              <li class="nav-item mobile-none">
                <span style="color: #fff" v-if="this.getUserProfileRole === 1"
                  >SuperAdmin</span
                >
                <span style="color: #fff" v-if="this.getUserProfileRole === 2"
                  >Admin [ {{ profile.user_name }} ] {{ profile.user_id }}</span
                >
                <span style="color: #fff" v-if="this.getUserProfileRole === 3"
                  >Dentist [ {{ profile.user_name }} ] {{ profile.user_id }}
                </span>
                <span style="color: #fff" v-if="this.getUserProfileRole === 4"
                  >Consultant [ {{ profile.user_name }} ]
                  {{ profile.user_id }}</span
                >
                <span style="color: #fff" v-if="this.getUserProfileRole === 5"
                  >Lab [ {{ profile.user_name }} ] {{ profile.user_id }}</span
                >
                <span style="color: #fff" v-if="this.getUserProfileRole === 6"
                  >Tech [ {{ profile.user_name }} {{ profile.user_id }}</span
                >
              </li>

              <li class="dropdown dropdown-notification nav-item">
                <a
                  class="nav-link nav-link-label"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  @click.prevent="notiList"
                >
                  <img
                    src="../../assets/images/icons/common/notifications.svg"
                    alt="message_icon"
                  />
                  <span
                    class="badge badge-pill badge-primary badge-up"
                    v-if="notiCount"
                    >{{ notiCount }}</span
                  >
                </a>
                <ul
                  class="dropdown-menu dropdown-menu-media overflow-auto"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li class="dropdown-menu-header">
                    <div class="dropdown-header m-0">
                      <h4 class="white">{{ notiCount }}</h4>
                      <span class="notification-title"
                        >Unseen Notifications</span
                      >
                    </div>
                  </li>
                  <li
                    class="scrollable-container media-list"
                    v-for="notification in notificationLists?.slice(0, 10)"
                    :key="notification.id"
                  >
                    <a
                      class="d-flex justify-content-between"
                      id="seenUnseen"
                      :href="notification.url"
                      @click="
                        notiRead(
                          notification.id,
                          notification.url,
                          notification.is_seen,
                        )
                      "
                    >
                      <div class="media d-flex align-items-start">
                        <div class="media-left" id="noti-list">
                          <i
                            v-if="notification.is_seen === 0"
                            class="feather icon-eye-off font-medium-5 primary"
                          ></i>
                          <i
                            v-if="notification.is_seen === 1"
                            class="feather icon-eye font-medium-5 primary"
                          ></i>
                        </div>
                        <div class="media-body">
                          <h6
                            class="primary media-heading"
                            :class="
                              notification.is_seen === 0 ? 'unseen' : 'seen'
                            "
                          >
                            {{ notification.title }}
                            <!-- {{ notification.is_seen === 0 ? 0 : 1 }} -->
                          </h6>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li class="dropdown-menu-footer">
                    <router-link :to="{ name: 'allNotifications' }">
                      <p class="dropdown-item text-center mb-0">
                        See all notifications
                      </p>
                    </router-link>
                  </li>
                </ul>
              </li>
              <li class="dropdown dropdown-user nav-item">
                <a
                  class="dropdown-toggle nav-link dropdown-user-link"
                  type="button"
                  id="profileDropDown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span>
                    <img
                      class="semi-round"
                      :src="
                        this.currentUser.imageFolderPath +
                        '/' +
                        this.currentUser.profile.profile_image
                      "
                      alt="avatar"
                      height="40"
                      width="40"
                      @error="replaceByDefaultProImage"
                    />
                  </span>
                </a>
                <div
                  class="dropdown-menu dropdown-menu-right"
                  aria-labelledby="profileDropDown"
                >
                  <!-- Admin Profile Start-->
                  <router-link
                    v-if="
                      this.getUserProfileRole === 2 ||
                      this.getUserProfileRole === 1
                    "
                    class="dropdown-item"
                    :to="{ name: 'adminProfile' }"
                  >
                    <i class="feather icon-user"></i> Profile
                  </router-link>
                  <!-- Admin Profile End-->
                  <!-- Lab Profile Start-->
                  <router-link
                    v-if="this.getUserProfileRole === 5"
                    class="dropdown-item"
                    :to="{
                      name: 'userProfile',
                      params: { rating: this.rating },
                    }"
                  >
                    <i class="feather icon-user"></i> Profile
                  </router-link>
                  <!-- Lab Profile End-->

                  <!-- Dentist Profile Start-->
                  <router-link
                    v-if="this.getUserProfileRole === 3"
                    class="dropdown-item"
                    :to="{ path: '/dentist/' + currentUser.user_name }"
                  >
                    <i class="feather icon-user"></i> Profile
                  </router-link>
                  <!-- Dentist Profile End-->

                  <!-- Tech Profile Start-->
                  <router-link
                    v-if="this.getUserProfileRole === 6"
                    class="dropdown-item"
                    :to="{ name: 'userProfile' }"
                  >
                    <i class="feather icon-user"></i> Profile
                  </router-link>
                  <!-- Tech Profile End-->

                  <!-- Consultant Profile Start-->
                  <router-link
                    v-if="this.getUserProfileRole === 4"
                    class="dropdown-item"
                    :to="{ name: 'userProfile' }"
                  >
                    <i class="feather icon-user"></i> Profile
                  </router-link>
                  <!-- Consultant Profile End-->

                  <!-- Change Password START -->
                  <router-link
                    class="dropdown-item"
                    :to="{ name: 'SecurityList' }"
                  >
                    <i class="feather icon-settings"></i> Security
                  </router-link>
                  <!-- Change Password END -->

                  <div
                    class="dropdown-divider"
                    v-if="role == 3 || role === 4 || role === 5 || role === 6"
                  ></div>
                  <router-link
                    class="dropdown-item"
                    v-if="role == 3 || role === 4 || role === 5 || role === 6"
                    :to="{ name: 'payment' }"
                  >
                    <i class="feather icon-credit-card"></i> Payment
                  </router-link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>

import profileService from '../../services/profile.service';
import defaultPicture from '../../assets/images/portrait/pp.jpg';
import { createToast } from 'mosha-vue-toastify';
import proImg from '../../assets/images/profile/no-user.png';
import SOCKET_URL from '../../../src/api/SocketURL.js';
import userAPI from '../../services/user.API';
export default {
  name: 'TopHeader',
  mounted() {
    profileService
      .getUser()
      .then(
        res => {
          this.rating = res.ratings;
          this.profile = res;
          this.profileImage =
            this.profile.imageFolderPath + '/' + this.profile.profile_image;
          // this.getUserProfileRole = this.profile.role.role_id;
        },
        err => {
          if (
            (err.response.data.status === 400 &&
              err.response.data.message ===
                'Unauthorize Request. Login Fast') ||
            err.response.data.message === 'Timeout Login Fast' ||
            err.response.data.message ===
              'Unauthorize Request. User not found, please login again.'
          ) {
            this.$store.dispatch('auth/logout');
            this.$store.dispatch('profile/logout');
            this.$store.dispatch('notification/logout');
            this.$router.push('/login');
          } else if (err.response.data.success === false) {
            createToast(err.response.data.message, {
              type: 'danger',
              position: 'top-right',
              showIcon: true,
              duration: 5000,
            });
          }
        },
      )
      .catch(error => {
        // console.log(error);
        if (error) {
          this.$router.push('/login');
          this.$store.dispatch('auth/logout');
          this.$store.dispatch('profile/logout');
          this.$store.dispatch('notification/logout');
        }
      });

    this.$store.dispatch('profile/loadUser');
    // console.log(SOCKET_URL.id);
    SOCKET_URL.on('notification', data => {
      // setTimeout(() => {
      if (data.isReceiveAll === 0 && this.currentUser !== null) {
        if (data.receiverId === this.profile?.user_id) {
          // console.log('A');

          this.$store.commit('PUSH_NOTIFICATION', {
            id: '2',
            title: data.title,
            url: data.url,
          });
          this.$store.dispatch('notification/addNotiCount');
          this.$moshaToast(data.notification, {
            type: 'default',
            position: 'top-right',
            showIcon: true,
            transition: 'slide',
            hideProgressBar: true,
          });
        }
      } else {
        // console.log(this.currentUser.role.role_id);

        if (
          data.receiverType === this.currentUser.role.role_id &&
          this.currentUser !== null
        ) {
          this.$store.commit('PUSH_NOTIFICATION', {
            id: 0,
            title: data.title,
            url: data.url,
          });
          this.$store.dispatch('notification/addNotiCount');
          this.$moshaToast(data.notification, {
            type: 'default',
            position: 'top-right',
            showIcon: true,
            transition: 'slide',
            hideProgressBar: true,
          });
        }
      }
      // },1000);
    });

    if (this.loggedIn === true) {
      this.$store.dispatch('profile/loadUser');
      this.$store.dispatch('notification/notiCount');
      this.rating = this.currentUser.ratings;
      this.profile = this.currentUser;
      this.role = this.profile.role.role_id;
    } else {
      this.$store.dispatch('auth/logout');
      this.$store.dispatch('profile/logout');
      this.$store.dispatch('notification/logout');
      this.$router.push('/login');
    }

    // Notification;
    // console.log(this.$route.query.q);
    if (this.$route.query.q) {
      this.searchText = this.$route.query.q;
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    getUserProfileRole() {
      return this.$store.state.profile.role_id;
    },
    notificationLists() {
      return this.$store.state.notification.notifications;
    },
    notiCount() {
      // console.log(this.$store.state);
      return this.$store.state.notification.count;
    },
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
    getUserProfile() {
      return this.$store.state.profile.user;
    },
  },
  data() {
    return {
      notification: [],
      rating: 0,
      user: '',
      profileImage: '',
      profile: {},
      role: null,
      defaultPicture: defaultPicture,
      notificationAll: [],
      searchText: '',
      searchBox: false,
      BASE_URL: location.origin,
    };
  },
  methods: {
    replaceByDefaultProImage(e) {
      e.target.src = proImg;
    },
    notiRead(id, url, isSeen) {
      // check if seen/unseen
      if (isSeen === 0) {
        // mark as read
        userAPI.seenNotification(id).then(res => {
          console.log(res);
          this.$store.dispatch('notification/removeNotiCount');
        });
      }
    },
    searchExplore() {
      if (this.searchText.length > 0) {
        location.href = this.BASE_URL + '/explore/search?q=' + this.searchText;
        // this.searchText = '';
        this.searchBox = !this.searchBox;
      }
    },
    notiList() {
      this.$store.dispatch('notification/notiList');
    },
    popSearchBox() {
      this.searchBox = !this.searchBox;
    },
  },
};
</script>

<style type="text/css" scoped>
.media-list h6 {
  font-size: 0.9rem;
  margin-bottom: 0;
}
.media-body {
  flex: 1;
  max-height: 2.2rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: unset;
}
.seen {
  color: #5e606e !important;
  font-weight: 400;
}
.unseen {
  color: #000 !important;
  font-weight: 600;
}
@media screen and (max-width: 565px) {
  .header-navbar .navbar-container ul.nav li.dropdown .dropdown-menu {
    margin-right: 0px !important;
    max-width: 300px;
  }
}
.header-navbar
  .navbar-container
  ul.nav
  li.nav-item
  #noti-list
  i.feather.icon-eye-off,
.header-navbar
  .navbar-container
  ul.nav
  li.nav-item
  #noti-list
  i.feather.icon-eye {
  color: #123c3d !important;
}
@media screen and (min-width: 1000px) and (max-width: 1199px) {
  i.ficon.feather.icon-menu {
    visibility: hidden !important;
  }
  ul.nav.navbar-nav.bookmark-icons.search_header {
    margin-left: 150px;
  }
}
</style>
