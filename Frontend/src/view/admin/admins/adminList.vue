<template>
  <div>
    <!-- Container Fluid-->
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="content-wrapper">
        <div class="content-body">
          <div id="user-case">
            <div
              class="col-lg-12 text-lg-right text-center my-1"
              v-if="role_id === 1"
            >
              <router-link :to="{ name: 'createAdmin' }">
                <button class="createCase">+ Add New</button>
              </router-link>
            </div>
            <div class="col-12">
              <table id="adminDataTable" v-if="users?.length > 0">
                <thead>
                  <tr>
                    <th>Case ID</th>
                    <th>Patient</th>
                    <th>Dentist</th>
                    <th>Options</th>
                  </tr>
                </thead>
                <tbody class="d-flex flex-wrap admin">
                  <tr
                    class="TR d-flex justify-content-between text-center"
                    v-for="user in users"
                    :key="user.user_id"
                  >
                    <td class="mt-2">
                      <img
                        v-if="!user.profile_image"
                        class="img"
                        src="data:image/png;base64,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"
                        alt=""
                      />
                      <img
                        v-if="user.profile_image"
                        @error="replaceByDefaultProImage"
                        class="img"
                        :src="imgpath + '/' + user.profile_image"
                        alt=""
                      />
                    </td>
                    <td class="name text-center pb-1 mt-0">
                      <span>{{ user.first_name + ' ' + user.last_name }}</span>
                    </td>
                    <td class="pb-1">
                      <!-- <div class="tdRow">
                        <div class="d-flex">
                          <span class="col-4"> Username : </span>
                          <span class="col"> {{ user.user_name }} </span>
                        </div>
                      </div> -->

                      <div class="tdRow">
                        <div class="d-flex">
                          <span class="col-4"> Contact : </span>
                          <span class="col"> {{ user.phone }} </span>
                        </div>
                      </div>

                      <div class="w-100 tdRow">
                        <div class="row m-0">
                          <span class="col-4"> Mail : </span>
                          <span class="col">{{ user.email }}</span>
                        </div>
                      </div>

                      <div class="w-100 tdRow">
                        <div class="row m-0">
                          <span class="col-4"> Address : </span>
                          <span class="col flex-wrap">{{ user.address }} </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div class="justify-content-center d-flex options">
                        <router-link
                          :to="'/messages/' + user.user_id"
                          tag="button"
                        >
                          <button class="chatIcon">
                            <i class="feather icon-message-circle"></i>
                          </button>
                        </router-link>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p
                class="alert alert-info"
                v-if="!loading && users?.length === 0"
              >
                No admin found
              </p>
            </div>
            <div class="col-xl-12" v-show="loading">
              <div class="row">
                <div class="col-xl-3">
                  <div class="placeholder wave">
                    <div class="line"><br /></div>
                    <div class="line"><br /></div>
                    <div class="line"><br /></div>
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="placeholder wave">
                    <div class="line"><br /></div>
                    <div class="line"><br /></div>
                    <div class="line"><br /></div>
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="placeholder wave">
                    <div class="line"><br /></div>
                    <div class="line"><br /></div>
                    <div class="line"><br /></div>
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="placeholder wave">
                    <div class="line"><br /></div>
                    <div class="line"><br /></div>
                    <div class="line"><br /></div>
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="placeholder wave">
                    <div class="line"><br /></div>
                    <div class="line"><br /></div>
                    <div class="line"><br /></div>
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="placeholder wave">
                    <div class="line"><br /></div>
                    <div class="line"><br /></div>
                    <div class="line"><br /></div>
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="placeholder wave">
                    <div class="line"><br /></div>
                    <div class="line"><br /></div>
                    <div class="line"><br /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!---Container Fluid-->
  </div>
</template>

<script>
import 'jquery/dist/jquery.min.js';
import 'datatables.net-dt/js/dataTables.dataTables';
import $ from 'jquery';
import userAPI from '../../../services/user.API';
import { createToast } from 'mosha-vue-toastify';
import Swal from 'sweetalert2';
import profileService from '../../../services/profile.service';
import proImg from '../../../assets/images/profile/no-user.png';

export default {
  name: 'AdminsCpanelSA',
  mounted() {
    // get admin list
    userAPI.getAdminList().then(res => {
      // console.log(res);
      if (res.data.data) {
        this.users = res.data.data;
        this.loading = false;
        setTimeout(() => {
          $('#adminDataTable').DataTable({
            lengthChange: false,
            searching: false,
            info: false,
            paging: false,
            lengthMenu: [
              [5, 10, 25, 50, -1],
              [5, 10, 25, 50, 'All'],
            ],
            pageLength: 10,
          });
        });
      }
      if (res.data.imageFolderPath) {
        this.imgpath = res.data.imageFolderPath;
      }
    });

    // get user role
    profileService.getUser().then(res => {
      // console.log(res.role.role_id);
      if (res.role.role_id) {
        this.role_id = res.role.role_id;
      }
    });
  },
  data: function () {
    return {
      users: [],
      imgpath: '',
      role_id: '',
      loading: true,
    };
  },
  methods: {
    replaceByDefaultProImage(e) {
      e.target.src = proImg;
    },
    // change admin status method
    changeStatus(userID) {
      if (userID) {
        Swal.fire({
          title: 'Do you want to change Active Status?',
          icon: 'warning',
          showDenyButton: true,
          // showCancelButton: true,
          confirmButtonText: 'Yes, Change it',
          denyButtonText: `Cancel`,
          confirmButtonColor: 'red',
          denyButtonColor: '#123c3d',
        }).then(result => {
          if (result.isConfirmed) {
            userAPI.changeAdminStatus(userID).then(
              res => {
                if (res.data.success == true) {
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
          } else if (result.isDenied) {
            this.$router.push('/sa/admins');
            // createToast('Reset canceled', {
            //   position: 'top-right',
            //   type: 'danger',
            //   transition: 'bounce',
            //   showIcon: 'true',
            //   timeout: 2000,
            // });
          }
        });
      }
    },

    // Reset admin password method
    resetPassword(userID) {
      if (userID) {
        Swal.fire({
          title: 'Do you want to Reset Password?',
          icon: 'warning',
          showDenyButton: true,
          // showCancelButton: true,
          confirmButtonText: 'Save',
          denyButtonText: `Don't save`,
          confirmButtonColor: 'red',
          denyButtonColor: '#123c3d',
        }).then(result => {
          if (result.isConfirmed) {
            userAPI.resetAdminPassword(userID).then(
              res => {
                if (res.data.success == true) {
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
          } else if (result.isDenied) {
            createToast('Reset canceled', {
              position: 'top-right',
              type: 'danger',
              transition: 'bounce',
              showIcon: 'true',
              timeout: 2000,
            });
          }
        });
      }
    },
  },
};
</script>

<style scoped>
@media screen and (min-width: 768px) and (max-width: 1000px) {
  tr.TR.odd,
  tr.TR.even {
    width: 45% !important;
  }
}
@media screen and (min-width: 1001px) and (max-width: 1200px) {
  tr.TR.odd,
  tr.TR.even {
    width: 45% !important;
  }
}
.admin col {
  text-align: left;
}
thead,
tr {
  border-color: inherit;
  border-style: solid;
  border-width: 0;
  display: inline-block;
  width: 100%;
}
thead {
  width: 100%;
  display: none;
}
tr.TR.odd,
tr.TR.even {
  background: #ffffff;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 20px;
  margin: 15px;
  display: flex;
  flex-wrap: wrap;
  width: 22%;
  text-align: center;
  /* padding: 15px; */
}
@media screen and (max-width: 767px) {
  tr.TR.odd,
  tr.TR.even {
    width: 100% !important;
  }
}
table#adminDataTable {
  border-bottom: none;
  border: none;
}
img.imgAvatar {
  width: 50px;
  height: 50px;
  border-radius: 9px;
  /* padding: 5px; */
  background: #ffffff;
  box-shadow: 0px 3px 6px #00000029;
}
/* #adminDataTable thead { */
/* display: none; */
/* } */
#adminDataTable td {
  border-radius: 20px;
  align-items: center;
  border: none;
  width: 100%;
  padding: 0px 25px 25px 25px;
  margin: 10px 0 0px;
}
#adminDataTable .admin span {
  color: #131313;
  font-size: 10px;
  margin: 0;
  padding: 0px;
}
.chatIcon {
  background: #123c3d;
  border-radius: 50%;
  color: white;
  height: 35px;
  width: 35px;
  cursor: pointer;
}
td.justify_end {
  justify-content: end;
}
td.center {
  justify-content: center;
}
#adminDataTable .icon-message-circle {
  content: '\e890';
  font-size: 20px;
  margin-top: 6px;
  position: absolute;
  margin-left: 8px;
}
.chatIcon:hover {
  background: #ffd700;
  color: #123c3d;
}

.custom-control-input:checked ~ .custom-control-label::before {
  color: #ffd700;
  border-color: #184b4c;
  background-color: #bebebe;
}
.custom-switch .custom-control-input:checked ~ .custom-control-label::after {
  background-color: #123c3d;
}
.dataTables_wrapper .dataTables_filter input:focus-visible {
  outline: none;
}

.dataTables_wrapper .dataTables_paginate .paginate_button.current,
.dataTables_wrapper .dataTables_paginate .paginate_button.current:hover {
  color: #333 !important;
  border: 1px solid #979797;
  background-color: white;
  background: linear-gradient(to bottom, #e11313 0%, #901c1c 100%);
}
.admin .img {
  border: 5px solid #123c3d;
  border-radius: 35px;
  opacity: 1;
  width: 115px;
  height: 115px;
  display: block;
  margin: auto;
  object-fit: cover;
}
.admin .name {
  color: #131313;
  font-size: 25px;
  font-weight: bold;
}
#adminDataTable .admin .name span.designation {
  color: #131313;
  font-size: 14px;
  font-weight: normal;
}
.admin .tdRow {
  background: #dbe2e2;
  border-radius: 10px;
  margin: 5px 0;
  padding: 10px 15px;
  width: 100%;
}
.admin .details-btn {
  background: #00e2f2;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 10px 0px 0px 10px;
  color: #141414;
  padding: 15px;
  text-align: center;
  width: 100%;
}
.admin .msg-btn {
  background: #123c3d;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 0px 10px 10px 0px;
  color: #fff;
  padding: 15px;
  text-align: center;
  width: 100%;
}
#adminDataTable .admin td.name span {
  color: #131313;
  font-size: 18px;
  font-weight: bold;
  margin-left: 0;
  width: 100%;
  text-transform: capitalize;
}
#adminDataTable .admin span {
  color: #131313;
  font-size: 13px;
  margin: 0;
  padding: 0px;
}
.options .chatIcon {
  background: #123c3d;
  border: 1px solid #123c3d;
  border-radius: 50%;
  cursor: pointer;
  /* padding: 10px 13px; */
  color: white !important;
  height: auto;
  width: auto;
  margin: 0 5px;
  height: auto;
  width: auto;
  padding: 5px;
}
#adminDataTable .options .icon-message-circle {
  content: '\e890';
  font-size: 20px;
  margin-top: auto;
  position: static;
  margin-left: auto;
}
.tdRow span.col {
  word-break: break-word;
}
@media screen and (max-width: 567px) {
  tr.TR.odd,
  tr.TR.even {
    margin: 10px 0;
  }
}
@media screen and (min-width: 1200px) {
  button.createCase {
    margin-right: 80px;
  }
}
.custom-control.custom-switch.custom-control-inline.enDisable {
  /* background: #123c3d; */
  padding: 4px 3px;
  border-radius: 20px;
}
.custom-switch .custom-control-label:after {
  background-color: #f00;
}
.custom-switch .custom-control-label::before {
  background-color: #d99191;
}
.createCase {
  background: #00e2f2;
  border: 1px solid #00e2f2;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 10px;
  padding: 12px 50px;
  color: #123c3d;
  font-size: 15px;
  font-weight: bold;
}
/* *********************************** */
.placeholder {
  margin: 15px;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  background-color: #e3e3e3;
  border-radius: 20px;
  min-height: 350px;
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
.placeholder .line {
  height: 12px;
  margin: 25px auto;
  width: 10%;
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
@media only screen and (min-width: 1000px) and (max-width: 1450px) {
  tr.TR.d-flex.justify-content-between.text-center {
    min-width: 270px;
  }
}
</style>
