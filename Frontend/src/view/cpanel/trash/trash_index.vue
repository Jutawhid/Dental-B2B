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
              <div class="row mb-2">
                <div class="col-12 col-sm-12">
                  <h1 class="text-bold-700 mb-0 headerTXT">
                    <i class="feather icon-trash-2 mr-1"></i>Trash
                  </h1>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <div class="card-body px-0">
                    <!-- Tab Content Start -->
                    <div class="tab-content">
                      <div
                        class="tab-pane"
                        :class="{ 'active show': isActive('deletedFiles') }"
                        id="deletedFiles"
                      >
                        <DeletedFiles />
                      </div>
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
import DeletedFiles from './tabs/deletedFiles.vue';

export default {
  name: 'trashList',
  components: {
    DeletedFiles,
  },
  data() {
    return {
      user: {},
      activeItem: 'deletedFiles',
      role: '',
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
body {
  font-family: 'Poppins';
}
.nav.nav-tabs.hr {
  border-bottom: 1px solid #cfcfcf !important;
  width: 98% !important;
  margin: 0 10px !important;
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

#req .tab-content {
  border-radius: 10px;
  margin-top: 0px;
}
</style>
