<template>
  <div>
    <!-- Container Fluid-->
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="content-wrapper">
        <div class="content-body">
          <div class="row">
            <div
              class="col-lg-12 text-center text-lg-right my-1"
              v-if="role_id === 1"
            >
              <router-link :to="{ name: 'createGateway' }">
                <button class="createCase">+ Add New</button>
              </router-link>
            </div>
            <div class="col-lg-12 table-responsive">
              <table id="gatewayDatatable">
                <thead>
                  <tr>
                    <td class="img">Image</td>
                    <td class="justify-content-lg-center">Name</td>
                    <td class="justify-content-lg-center">Action</td>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    class="TR d-flex justify-content-start"
                    v-for="gateway in gatewayList"
                    :key="gateway.id"
                  >
                    <td class="img">
                      <img
                        v-if="!gateway.image"
                        class="imgAvatar"
                        src="https://i.pinimg.com/736x/b9/cf/b8/b9cfb82fb98e5805d62c07bf8c707330.jpg"
                        alt="img"
                      />
                      <img
                        v-if="gateway.image"
                        class="imgAvatar"
                        :src="imgPath + '/' + gateway.image"
                        alt="img"
                      />
                    </td>
                    <td class="justify-content-lg-center">
                      <span class="text-capitalize">
                        <b>{{ gateway.name }}</b>
                      </span>
                    </td>

                    <td class="justify-content-lg-center">
                      <!-- <div class="chatIcon">
                        <i class="feather icon-eye"></i>
                      </div> -->
                      <button
                        @click="deleteGateway(gateway.id)"
                        class="chatIcon"
                      >
                        <i class="feather icon-trash-2"></i>
                      </button>

                      <router-link
                        :to="{
                          path: '/gateway/edit/' + gateway.id,
                          params: gateway.id,
                        }"
                      >
                        <div class="chatIcon edit">
                          <img
                            src="../../../assets/images/icons/common/edit.svg"
                          />
                        </div>
                      </router-link>

                      <div class="mx-1">
                        <div
                          class="custom-control custom-switch custom-control-inline"
                        >
                          <input
                            v-if="gateway.active_status === 1"
                            type="checkbox"
                            class="custom-control-input"
                            checked
                            :id="gateway.id"
                            @input="changeServiceStatus(gateway.id)"
                          />
                          <input
                            v-if="gateway.active_status === 0"
                            type="checkbox"
                            class="custom-control-input"
                            :id="gateway.id"
                            @input="changeServiceStatus(gateway.id)"
                          />
                          <label
                            class="custom-control-label mr-1"
                            :for="gateway.id"
                          ></label>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'jquery/dist/jquery.min.js';
import 'datatables.net-dt/js/dataTables.dataTables';
import $ from 'jquery';
import userAPI from '../../../services/user.API';
import Swal from 'sweetalert2';
import { createToast } from 'mosha-vue-toastify';
import profileService from '../../../services/profile.service';

export default {
  mounted() {
    // get user role
    profileService.getUser().then(res => {
      if (res.role.role_id) {
        this.role_id = res.role.role_id;
      }
    });
    // gateway list
    userAPI.getPaymentGatewayList().then(res => {
      console.log(res);
      if (res.data.success) {
        this.gatewayList = res.data.data;
        this.imgPath = res.data['image-path'];
        setTimeout(() => {
          $('#gatewayDatatable').DataTable({
            lengthMenu: [
              [5, 10, 25, 50, -1],
              [5, 10, 25, 50, 'All'],
            ],
            pageLength: 5,
            info: false,
            language: {
              paginate: {
                next: '<i class="fa fa-angle-right  btn-primary btn-sm"></i>',
                previous:
                  '<i class="fa fa-angle-left btn btn-primary btn-sm"></i>',
                last: '<i class="fa fa-angle-double-right  btn-primary btn-sm"></i>',
                first:
                  '<i class="fa fa-angle-double-left  btn-primary btn-sm"></i>',
              },
            },
            targets: 'no-sort',
            bSort: false,
            order: [],
            bFilter: false,
            bInfo: false,
            bLengthChange: false,
          });
        });
      }
    });
  },
  data: function () {
    return {
      gatewayList: [],
      role_id: '',
      imgPath: null,
    };
  },
  methods: {
    // enable-disable
    changeServiceStatus(id) {
      // console.log(id);
      if (id) {
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
            userAPI.changePaymentGatewayStatus(id).then(
              res => {
                console.log(res);
                if (res.data.success) {
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
            location.reload();
          }
        });
      }
    },

    // delete
    deleteGateway(id) {
      // console.log(id);
      if (id) {
        Swal.fire({
          title: 'Do you want to Delete this?',
          icon: 'warning',
          showDenyButton: true,
          // showCancelButton: true,
          confirmButtonText: 'Yes, Delete it',
          denyButtonText: `Cancel`,
          confirmButtonColor: 'red',
          denyButtonColor: '#123c3d',
        }).then(result => {
          if (result.isConfirmed) {
            console.log(id);
            userAPI.removePaymentGateway(id).then(
              res => {
                console.log(res);
                if (res.data.success === true) {
                  let removingData = this.gatewayList.findIndex(
                    e => e.id === id,
                  );
                  console.log(removingData);
                  if (removingData > -1) {
                    this.gatewayList.splice(removingData, 1);
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
                } else if (result.isDenied) {
                  console.log('cancel');
                }
              },
            );
          }
        });
      }
    },
  },
};
</script>

<style scoped>
tbody td.img,
thead td.img {
  min-width: 45px !important;
}
thead td {
  font-size: 17px !important;
  font-weight: 600;
  color: #123c3d;
}
thead tr {
  border-bottom: 2px solid #123c3d !important;
}
tbody td {
  padding: 25px 20px !important;
  margin: 0;
}
thead tr {
  display: flex;
}
table#gatewayDatatable {
  width: 100% !important;
}
tr.TR.odd,
tr.TR.even {
  background: #ffffff;
  box-shadow: 0px 2px 3px #00000029;
  border-radius: 9px;
  margin: 15px 0;
  flex-wrap: nowrap;
  width: 100%;
}
table#gatewayDatatable {
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
/* #gatewayDatatable thead {
  display: none;
} */
#gatewayDatatable td {
  align-items: center;
  display: flex;
  min-width: 42%;
}
#gatewayDatatable span {
  color: #131313;
  font-size: 16px;
  /* font-weight: bold; */
  margin-left: 20px;
}
.chatIcon {
  background: #123c3d;
  border: 1px solid #123c3d;
  border-radius: 50%;
  color: white;
  height: auto;
  width: auto;
  display: block;
  cursor: pointer;
  padding: 7px 7px 5px 8px;
}
td.justify_end {
  justify-content: end;
}
td.center {
  justify-content: center;
}
#gatewayDatatable .feather {
  content: '\e890';
  font-size: 20px;
  /* margin-top: 6px; */
  /* position: absolute; */
  /* margin-left: 8px; */
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

.datatable_wrapper a.paginate_button.current {
  color: #fff !important;
  border: 1px solid #123c3d !important;
  background-color: #123c3d !important;
  background: linear-gradient(to bottom, #123c3d 0%, #123c3d 100%) !important;
  border-radius: 10px !important;
}

#datatable_wrapper input[type='search'] {
  background: #f8ffff !important;
  border-radius: 5px;
  box-shadow: 0px 3px 6px #00000029;
}
@media only screen and (max-width: 600px) {
  #gatewayDatatable td {
    align-items: center;
    display: flex;
    min-width: auto !important;
    flex-wrap: wrap !important;
  }
}
.chatIcon {
  margin: 0 5px;
}
.edit img {
  filter: invert(1);
  padding: 1px 2px 3px 1px;
  height: 16px;
}
.edit img:hover {
  filter: brightness(0.5) !important;
  /* padding: 3px; */
}
/* Right Side Filter */
.filterContainer {
  background: #b9d0d2;
  border-radius: 10px;
  width: 20%;
  padding: 10px 20px;
  margin: 0;
  height: 89%;
  position: fixed;
  margin-top: -20px;
  overflow-y: auto;
}
.filterContainer p {
  font-size: 12px;
  font-weight: bold;
  color: #000000;
  padding: 15px 0 0 0;
}
.filter input {
  background: #f0f1f1;
  border-radius: 10px;
  height: auto;
  margin-bottom: 10px;
}
/* .filter select.form-control:not([multiple="multiple"]){

} */
#service,
#status {
  background: #f0f1f1;
  border-radius: 10px;
  height: auto;
  margin-bottom: 10px;
}
.filterContainer .box {
  background: #ffffff;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 10px;
  padding: 5px 20px;
  width: 100%;
  margin-bottom: 10px;
  font-weight: normal;
}
.filterContainer .box label {
  font-size: 12px;
  letter-spacing: 0px;
  color: #000000;
  font-family: 'Poppins';
}
.resetBtn {
  background: #ffffff;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 10px;
  margin: 5px;
  padding: 5px 15px;
  font: normal normal normal 13px/20px Poppins;
  color: #ff0000;
  text-transform: uppercase;
  border: 1px solid #fff;
}
.applyBtn {
  background: #123c3d;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 10px;
  margin: 5px;
  padding: 5px 15px;
  font: normal normal medium 13px/20px Poppins;
  letter-spacing: 0px;
  color: #ffffff;
  text-transform: uppercase;
  border: 1px solid #123c3d;
}
input#search .form-control:focus {
  border-color: #c9d3d4 !important;
}
.filter input {
  background: #f0f1f1;
  border-radius: 10px;
  height: auto;
  margin-bottom: 10px;
}
.filterContainer .filterPart label {
  margin: 5px;
  font-weight: normal !important;
  width: 100% !important;
}
.filterContainer label {
  color: black;
  font-weight: bold;
}
i.feather.icon-filter {
  color: black;
  font-weight: bold;
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
</style>
