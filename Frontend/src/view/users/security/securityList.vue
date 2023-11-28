<template>
  <div>
    <!-- Container Fluid-->
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="col-lg-8 content-wrapper">
        <div class="row">
          <div class="col-12 col-sm-12">
            <h1 class="text-bold-700 mb-0 headerTXT">Security</h1>
          </div>
          <div class="col-12">
            <hr />
          </div>
        </div>

        <!-- Body Part -->

        <!-- Change Password Route -->
        <div class="col-sm-12 col-lg-6 px-0 pt-3">
          <router-link :to="{ name: 'ChangePassword' }">
            <div class="customDiv">
              <span>
                <img
                  src="../../../assets/images/icons/common/key.svg"
                  alt="key"
                />
                Change Password
              </span>
              <i class="feather icon-chevron-right"></i>
            </div>
          </router-link>
        </div>
        <!-- Change Email Route -->
        <div class="col-sm-12 col-lg-6 px-0">
          <router-link :to="'/email-change-request'">
            <div class="customDiv" v-if="role && role !== 1">
              <span>
                <i class="feather icon-at-sign"></i>
                Change Email
              </span>
              <i class="feather icon-chevron-right"></i>
            </div>
          </router-link>
        </div>

        <!-- Other Device Route -->
        <div class="col-sm-12 col-lg-6 px-0">
          <router-link :to="{ name: 'OtherDeviceList' }">
            <div class="customDiv">
              <span>
                <img
                  src="../../../assets/images/icons/common/devices.svg"
                  alt="key"
                />
                My Devices
              </span>
              <i class="feather icon-chevron-right"></i>
            </div>
          </router-link>
        </div>

        <!-- Body END -->
      </div>
    </div>
    <!---Container Fluid-->
  </div>
</template>

<script type="javascript">
import profileService from '../../../services/profile.service';
export default {
  name: 'securityList',
  data() {
    return {
      role: '',
    };
  },
  mounted() {
    profileService.getUser().then(response => {
      // console.log(response);
      this.role = response.role.role_id;
    });
  },
};
</script>

<style type="text/css" scoped>
.customDiv {
  background: #ffffff;
  border: 1px solid #d5d5d5;
  border-radius: 20px;
  padding: 25px;
  justify-content: space-between;
  display: flex;
  margin: 0 0 10px 0;
  width: 100%;
}
.customDiv img,
.customDiv i {
  margin-right: 10px;
}
.customDiv span {
  font-size: 14px;
  font-weight: bold;
  color: #000000;
}
.customDiv i.feather.icon-chevron-right {
  font-size: 20px;
  font-weight: 600;
}
</style>
