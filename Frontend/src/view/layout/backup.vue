<!-- BEGIN: Main Menu-->
    <!-- v-if="currentUser" -->

    <div
      class="main-menu menu-fixed menu-light menu-accordion"
      v-if="currentUser"
      :v-if="this.user.role_id !== 1 || this.user.role_id !== 2"
    >
      <div class="navbar-header">
        <ul class="nav navbar-nav flex-row">
          <li class="nav-item mr-auto">
            <router-link class="navbar-brand" to="/home">
              <div class="brand-logo"></div>
              <!--<h2 class="brand-text mb-0">Easyfi</h2>-->
            </router-link>
          </li>
          <li class="nav-item nav-toggle">
            <a class="nav-link modern-nav-toggle pr-0" @click="menuHide">
              <i
                class="
                  feather
                  icon-x
                  d-block d-xl-none
                  font-medium-4
                  toggle-icon
                "
                style="color: #00ffff"
              ></i>
              <!--<i class="toggle-icon feather icon-disc font-medium-4 d-none d-xl-block collapse-toggle-icon"
                                                  data-ticon="icon-disc"></i>-->
            </a>
          </li>
        </ul>
      </div>
      <div class="shadow-bottom"></div>
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
              <i class="feather icon-file-text"></i>
              <span class="menu-title" data-i18n="Dashboard">All Cases</span>
            </router-link>
          </li>
          <!-- Active Bellow -->
          <li class="nav-item-active" v-if="this.$route.path === '/cases/all'">
            <router-link class="nav-link" to="">
              <i class="feather icon-file-text"></i>
              <span class="menu-title" data-i18n="Dashboard">All Cases</span>
            </router-link>
          </li>
          <!-- Favorite -->
          <li class="nav-item" v-if="this.$route.path !== '/favoriteList'">
            <router-link class="nav-link" to="/favoriteList">
              <i class="feather icon-heart"></i>
              <span data-i18n="Email" class="menu-title">Favorite List</span>
            </router-link>
          </li>
          <!-- Active Bellow -->
          <li
            class="nav-item-active"
            v-if="this.$route.path === '/favoriteList'"
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
          <li
            class="nav-item-active"
            v-if="this.$route.path === '/messages/all'"
          >
            <router-link class="nav-link" to="">
              <i class="feather icon-message-circle"></i>
              <span data-i18n="Email" class="menu-title">Messages</span>
            </router-link>
          </li>
          <!-- Requests -->
          <li class="nav-item" v-if="this.$route.path !== '/requests'">
            <router-link class="nav-link" to="/requests">
              <i class="feather icon-file-text"></i>
              <span data-i18n="Email" class="menu-title">Requests</span>
            </router-link>
          </li>
          <!-- Active Bellow -->
          <li class="nav-item-active" v-if="this.$route.path === '/requests'">
            <router-link class="nav-link" to="">
              <i class="feather icon-file-text"></i>
              <span data-i18n="Email" class="menu-title">Requests</span>
            </router-link>
          </li>
          <!-- Log out -->
          <li class="nav-item nav-bottom">
            <a class="nav-link btn-logout" @click.prevent="logOut">
              <i class="feather icon-log-out"></i>
              <span data-i18n="Email" class="menu-title">Logout</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <!-- END: Main Menu-->