<template>
  <div>
    <!-- Container Fluid-->
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="content-wrapper">
        <div class="row">
          <div class="col-12 col-sm-12">
            <h1 class="text-bold-700 mb-0 headerTXT">My Devices</h1>
          </div>
          <div class="col-12">
            <hr />
          </div>
        </div>

        <!-- Body Part -->
        <div class="col-12">
          <p>
            You're currently signed in to your Easifi account on these devices
          </p>
        </div>

        <!-- Device List -->
        <div class="row">
          <div
            class="col-sm-12 col-lg-4 pr-lg-0 pt-3"
            v-for="(device, index) in this.deviceList"
            :key="index"
          >
            <div class="customDiv">
              <div class="col-lg-9 px-0">
                <div class="d-lg-flex justify-content-start">
                  <img
                    v-if="device.user_device_info['os-name'] === 'Windows'"
                    src="../../../assets/images/icons/device/windows.svg"
                    alt="windows"
                  />
                  <img
                    v-else-if="
                      device.user_device_info['client-name'] ===
                      'Postman Desktop'
                    "
                    src="../../../assets/images/icons/device/postman.png"
                    alt="postman"
                    class="postman"
                  />
                  <!-- <img
                    v-else
                    src="../../../assets/images/profile/no-user.png"
                    alt="postman"
                    class="postman"
                  /> -->
                  <icon v-else class="feather icon-help-circle"></icon>
                  <table>
                    <tbody>
                      <tr v-if="device.user_device_info['os-name']">
                        <td>OS</td>
                        <td>
                          <b>{{ device.user_device_info['os-name'] }}</b>
                        </td>
                      </tr>

                      <tr v-if="device.user_device_info['device-id']">
                        <td>Device ID</td>
                        <td>{{ device.user_device_info['device-id'] }}</td>
                      </tr>
                      <tr v-if="device.user_device_info['device-type']">
                        <td>Device Type</td>
                        <td>{{ device.user_device_info['device-type'] }}</td>
                      </tr>
                      <tr v-if="device.user_device_info['device-brand']">
                        <td>Brand</td>
                        <td>{{ device.user_device_info['device-brand'] }}</td>
                      </tr>
                      <tr v-if="device.user_device_info['device-model']">
                        <td>Model</td>
                        <td>{{ device.user_device_info['device-model'] }}</td>
                      </tr>
                      <tr v-if="device.user_device_info['client-name']">
                        <td>Client</td>
                        <td>{{ device.user_device_info['client-name'] }}</td>
                      </tr>
                      <tr v-if="!device.user_device_info['os-name']">
                        <td>Agent</td>
                        <td>
                          <b>{{ device.user_device_info['useragent'] }}</b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="col-lg-3">
                <div class="d-flex flex-wrap">
                  <button
                    class="signOutSelf"
                    v-if="device.isCurrentLogging === true"
                    disabled
                  >
                    This Device
                  </button>
                  <button
                    class="signOutOther"
                    @click="signOutAction(device.id)"
                    v-if="device.isCurrentLogging === false"
                  >
                    Sign Out
                  </button>
                  <b class="active" v-if="device.isCurrentLogging"
                    >Active Now</b
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Body END -->
      </div>
    </div>
    <!---Container Fluid-->
  </div>
</template>

<script type="javascript">
import userAPI from '../../../services/user.API';
import { createToast } from 'mosha-vue-toastify';
export default {
  name: 'OtherDeviceList',
  mounted() {
    userAPI.otherDevices().then(
      res => {
        console.log(res.data);
        if (res.data.success == true) {
          if (res.data.data) {
            this.deviceList = res.data.data;
          }
        } else {
          this.deviceList = [];
        }
      },
      error => {
        console.log(error.response.data);
      },
    );
  },
  methods: {
    signOutAction(id) {
      let userID = id;
      console.log(userID);
      if (userID) {
        userAPI.otherDeviceLogout(userID).then(
          res => {
            if (res.data.success === true) {
              // location.reload();
              let removingData = this.deviceList.findIndex(
                e => e.id === userID,
              );
              if (removingData > -1) {
                // if its false, it means that there's no such id
                this.deviceList.splice(removingData, 1);
              }
              createToast(res.data.message, {
                position: 'top-right',
                type: 'success',
                transition: 'bounce',
                showIcon: 'true',
                timeout: 2000,
              });
            }
          },
          error => {
            if (error.response.data.success == false) {
              createToast(error.response.data.message, {
                position: 'top-right',
                type: 'danger',
                transition: 'bounce',
                showIcon: 'true',
                timeout: 2000,
              });
            }
          },
        );
      }
    },
  },
  data() {
    return {
      deviceList: [],
    };
  },
};
</script>

<style type="text/css" scoped>
.customDiv {
  background: #ffffff;
  border: 1px solid #d5d5d5;
  border-radius: 20px;
  padding: 20px 30px;
  justify-content: space-between;
  display: flex;
  margin: 0 0 10px 0;
  width: 100%;
}
.customDiv img {
  margin: 10px 20px 10px 0;
}
.customDiv table {
  min-width: 150px;
  /* margin: auto 30px; */
}
.customDiv td {
  color: #000;
  font-size: 14px;
  padding: 5px 40px 0 0px;
}

@media only screen and (max-width: 768px) {
  .customDiv td {
    color: #000;
    font-size: 14px;
    padding: 15px 0 0 10px;
  }
}
.customDiv .signOutSelf {
  background: #ffffff;
  border: 1px solid #d5d5d5;
  border-radius: 10px;
  font-size: 14px;
  text-align: center;
  height: 40px;
  color: grey;
  min-width: 120px;
}
.customDiv .signOutOther {
  background: #123c3d;
  border: 1px solid #123c3d;
  border-radius: 10px;
  font-size: 14px;
  text-align: center;
  height: 40px;
  min-width: 120px;
  color: white;
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
.customDiv b.active {
  position: relative;
  color: green;
  margin-top: 10px;
}
img.postman {
  width: 35px;
  height: 35px;
  margin: 10px 20px 10px 0;
}
icon.feather.icon-help-circle {
  font-size: 35px;
  margin: 10px 20px 10px 0;
}
@media only screen and (min-width: 1000px) and (max-width: 1900px) {
  .col-sm-12.col-lg-4.pr-lg-0.pt-3 {
    min-width: 550px;
  }
  .customDiv {
    background: #ffffff;
    border: 1px solid #d5d5d5;
    border-radius: 20px;
    padding: 20px 20px;
    justify-content: space-between;
    display: flex;
    margin: 0 0 10px 0;
    width: 100%;
  }
}
</style>
