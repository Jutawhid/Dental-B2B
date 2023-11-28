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
              <router-link :to="{ name: 'createServiceType' }">
                <button class="createCase">+ Add New</button>
              </router-link>
            </div>
            <div class="col-lg-12">
              <!-- <div class="table-responsive"> -->
              <table id="datatable" v-if="serviceTypes?.length > 0">
                <thead>
                  <tr class="d-md-flex justify-content-md-between d-lg-flex justify-content-lg-between">
                    <th align="center">Service Type</th>
                    <th align="center">User Role</th>
                    <th align="center" v-if="role_id === 1">Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    class="TR d-md-flex justify-content-md-between d-lg-flex justify-content-lg-between"
                    v-for="service in serviceTypes"
                    :key="service.id"
                  >
                    <td align="center" aria-label="Service Type">
                      <span class="text-capitalize">
                        <b>{{ service.name }}</b>
                      </span>
                    </td>
                    <td align="center" aria-label="Role">
                      <span
                        class="roleName"
                        v-for="role in service.roleType"
                        :key="role.id"
                      >
                        {{ role.title ? role.title : '' }}
                      </span>
                    </td>
                    <td
                      v-if="role_id === 1"
                      class="d-flex justify-content-center"
                      align="center"
                      aria-label="Action"
                    >
                      <button
                        @click="deleteServiceType(service.id)"
                        class="chatIcon"
                      >
                        <i class="feather icon-trash-2"></i>
                      </button>
                      <router-link
                        :to="{
                          path: '/service-type/edit/' + service.id,
                          params: service.id,
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
                            v-if="service.active_status === 1"
                            type="checkbox"
                            class="custom-control-input"
                            checked
                            :id="service.id"
                            @input="changeServiceStatus(service.id)"
                          />
                          <input
                            v-if="service.active_status === 0"
                            type="checkbox"
                            class="custom-control-input"
                            :id="service.id"
                            @input="changeServiceStatus(service.id)"
                          />
                          <label
                            class="custom-control-label mr-1"
                            :for="service.id"
                          ></label>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- </div> -->
              <div v-if="!loading && serviceTypes?.length === 0">
                <div class="noData">
                  <p class="alert alert-info">No Data Found</p>
                </div>
              </div>
              <!-- loader -->
              <div class="col-xl-12" v-show="loading">
                <div class="row">
                  <div class="col-xl-12">
                    <div class="placeholder wave">
                      <div class="line"><br /></div>
                      <div class="line"><br /></div>
                      <div class="line"><br /></div>
                    </div>
                  </div>
                  <div class="col-xl-12">
                    <div class="placeholder wave">
                      <div class="line"><br /></div>
                      <div class="line"><br /></div>
                      <div class="line"><br /></div>
                    </div>
                  </div>
                  <div class="col-xl-12">
                    <div class="placeholder wave">
                      <div class="line"><br /></div>
                      <div class="line"><br /></div>
                      <div class="line"><br /></div>
                    </div>
                  </div>
                  <div class="col-xl-12">
                    <div class="placeholder wave">
                      <div class="line"><br /></div>
                      <div class="line"><br /></div>
                      <div class="line"><br /></div>
                    </div>
                  </div>
                  <div class="col-xl-12">
                    <div class="placeholder wave">
                      <div class="line"><br /></div>
                      <div class="line"><br /></div>
                      <div class="line"><br /></div>
                    </div>
                  </div>
                  <div class="col-xl-12">
                    <div class="placeholder wave">
                      <div class="line"><br /></div>
                      <div class="line"><br /></div>
                      <div class="line"><br /></div>
                    </div>
                  </div>
                  <div class="col-xl-12">
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
    </div>
  </div>
</template>

<script>
import 'jquery/dist/jquery.min.js';
import 'datatables.net-dt/js/dataTables.dataTables';
import $ from 'jquery';
import { createToast } from 'mosha-vue-toastify';
import profileService from '../../../services/profile.service';
import Swal from 'sweetalert2';
import userAPI from '../../../services/user.API';

export default {
  name: 'serviceTypeCpanel',
  mounted() {
    // get service type
    userAPI.getServiceTypes().then(
      res => {
        if (res.data.success) {
          this.serviceTypes = res.data.data;
          this.loading = false;

          // if (this.serviceTypes) {
          setTimeout(() => {
            $('#datatable').DataTable({
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
          // }
        }
      },
      error => {
        console.log(error.response.data);
      },
    );
    // get user role
    profileService.getUser().then(res => {
      if (res.role.role_id) {
        this.role_id = res.role.role_id;
      }
    });
  },
  data: function () {
    return {
      serviceTypes: [],
      role_id: '',
      loading: true,
    };
  },
  methods: {
    // delete Service Type
    deleteServiceType(id) {
      console.log(id);
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
            userAPI.removeServiceType(id).then(
              res => {
                // console.log(res);
                if (res.data.success === true) {
                  let removingData = this.serviceTypes.findIndex(
                    e => e.id === id,
                  );
                  if (removingData > -1) {
                    this.serviceTypes.splice(removingData, 1);
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
          } else if (result.isDenied) {
            console.log('cancel');
          }
        });
      }
    },

    // enable-disable-serviceType
    changeServiceStatus(id) {
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
            userAPI.changeServiceTypeStatus(id).then(
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
  },
};
</script>

<style scoped>
.chatIcon {
  margin: 0 5px;
}
.edit img {
  filter: invert(1);
  padding: 1px 1px 3px 1px;
  height: 16px;
}
.edit img:hover {
  filter: brightness(0.5) !important;
  /* padding: 3px; */
}
table.dataTable tbody th,
table.dataTable tbody td {
  padding: 0;
}
/* thead tr {
  display: flex;
} */
table#datatable {
  width: 100% !important;
}
/* tr.TR.odd,
tr.TR.even {
  background: #ffffff;
  box-shadow: 0px 2px 3px #00000029;
  border-radius: 9px;
  margin: 15px 0;
  flex-wrap: nowrap;
  width: 100%;
} */
table#datatable {
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
/* #datatable thead {
  display: none;
} */
/* #datatable td.hash, th.hash {
  min-width: 10% !important;
} */
/* #datatable td {
  align-items: center;
  display: flex;
  min-width: 25%;
  flex-wrap: wrap;
  justify-content: center;
} */
thead td {
  font-size: 17px !important;
  font-weight: 600;
  color: #123c3d;
}
thead tr {
  border-bottom: 2px solid #123c3d !important;
}

/* #datatable span {
  color: #131313;
  font-size: 15px;
  margin-left: 20px;
} */
#datatable span.badge {
  font-size: 14px;
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
/* td.justify_end {
  justify-content: end;
}
td.center {
  justify-content: center;
} */
#datatable .feather {
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

#service,
#status {
  background: #f0f1f1;
  border-radius: 10px;
  height: auto;
  margin-bottom: 10px;
}

i.feather.icon-filter {
  color: black;
  font-weight: bold;
}
td span.roleName {
  background: #00cfe8;
  padding: 5px 10px;
  border: 1px solid #00cfe8;
  margin: 5px;
  color: #000000;
  font-size: 14px;
  font-weight: 600;
  border-radius: 10px;
  word-break: break-word;
  min-width: 50px;
  text-align: center;
}
.createNew {
  background: #00e2f2;
  border: 1px solid #00e2f2;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 10px;
  padding: 12px 50px;
  color: #123c3d;
  font-size: 15px;
  font-weight: bold;
}
.badge {
  padding: 10px 15px;
}
tbody a:hover {
  color: #123c3d;
  text-decoration: none;
}
table.dataTable thead th,
table.dataTable thead td,
table.dataTable tfoot th,
table.dataTable tfoot td {
  font-size: 1.2rem;
}
div.dataTables_wrapper div.dataTables_filter {
  display: none;
}
/* thead,
tr {
  border-color: inherit;
  border-style: solid;
  border-width: 0;
  display: inline-block;
  width: 100%;
} */

/* thead td {
  width: 100%;
} */
thead tr {
  border-radius: 0px;
  border-bottom: 2px solid #123c3d;
  box-shadow: none;
  background-color: transparent;
  padding-bottom: 10px;
  margin-bottom: 15px;
  color: #000;
}
#datatable th {
  text-align: inherit;
  /* width: 33%; */
  display: inline-block;
  padding: 5px 25px;
  font-size: 12px;
}

tr {
  cursor: pointer;
}
tr,
a.TR.d-lg-flex.justify-content-lg-between {
  background: #ffffff;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 20px;
  margin: 5px 0;
  /* display: flex;
  flex-wrap: wrap; */
  /* width: 100%; */
  padding: 15px;
}
table#caseTables {
  border-bottom: none;
  border: none;
  /* width: 100%; */
}
img.imgAvatar {
  width: 50px;
  height: 50px;
  border-radius: 9px;
  /* padding: 5px; */
  background: #ffffff;
  box-shadow: 0px 3px 6px #00000029;
}
/* #caseTable thead { */
/* display: none; */
/* } */
a.TR.d-lg-flex.justify-content-lg-between td,
td {
  border-radius: 20px;
  align-items: center;
  /* display: flex; */
  /* width: 100%; */
  padding: 5px 25px;
  margin: 5px 0;
}
span {
  color: #131313;
  font-size: 14px;
  /* font-weight: bold; */
  margin-left: 20px;
}
.chatIcon {
  background: #123c3d;
  border-radius: 50%;
  color: white;
  height: 35px;
  width: 35px;
  cursor: pointer;
}
@media screen and (min-width: 768px) {
  td.justify_end {
    justify-content: end;
  }
  td.center {
    justify-content: center;
  }
  td {
    align-content: center;
    display: flex;
  }
}

.icon-message-circle {
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
/* Right Side Filter */
.filterContainer {
  background: #b9d0d2;
  border-radius: 10px;
  width: 20%;
  padding: 20px 30px;
  margin: 0px 0px;
  height: 90%;
  position: fixed;
  top: 68px;
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

@media only screen and (max-width: 1000px) {
  thead {
    display: none;
  }
  #datatable td {
    justify-content: right;
  }
  #user-profile .nav.nav-tabs .nav-item .nav-link {
    padding: 15px;
  }
  .filterContainer {
    width: 100%;
    padding: 10px 20px;
    margin: 0px 0px;
  }
}

/* *********************************** */
.placeholder {
  margin: 15px;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  background-color: #e3e3e3;
  border-radius: 20px;
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

/*  */

table {
  width: 100%;
}
/* table thead tr {
  background: #dcd5c5 url('/Global/Images/parchment-bkg.jpg') repeat;
}
table thead tr.Vertical {
  background-image: url('/Global/Images/parchment-bkg-rotated.jpg');
} */
table thead tr h1,
table thead tr h2,
table thead tr .h1,
table thead tr .h2,
table thead tr h3,
table thead tr .h3,
table thead tr h4,
table thead tr .h4 {
  color: #151515;
}
table thead tr a {
  color: #0075b0;
}
table thead tr a:hover,
table thead tr a:focus {
  color: white;
}
table tbody tr:nth-of-type(even) {
  background: #e5ecec;
}
table td,
table th {
  /* padding: 8px 14px !important;
  text-align: right; */
  font-size: 0.9rem;
}
table td a,
table th a {
  font-weight: bold;
  color: #00918a !important;
}
table td a:hover,
table th a:hover,
table td a:focus,
table th a:focus {
  color: white !important;
}
table th {
  font-weight: 700;
  font-size: 0.8rem;
  line-height: 1.4;
  font-family: 'Gotham SSm A', 'Gotham SSm B', Helvetica, sans-serif;
  text-transform: uppercase;
  margin: 0;
  max-width: 800px;
  line-height: inherit;
  color: #151515;
}
table th.PrimaryFont {
  text-transform: none;
}

@media only screen and (max-width: 767px) {
  .filterContainer {
    display: none;
  }
  table td,
  table th {
    padding: 8px 14px !important;
    text-align: right;
    font-size: 0.9rem;
  }
  table th {
    display: none;
  }
  table td {
    position: relative;
    display: block;
    padding-left: 110px;
  }
  table td:before {
    position: absolute;
    top: 8px;
    left: 10px;
    display: block;
    content: attr(aria-label) ': ';
    font-weight: 700;
  }
  table tbody tr {
    padding: 20px 0;
    display: block;
  }
  table:nth-of-type(odd) {
    background: #f3f3f3;
  }
}

body {
  padding: 20px;
}
table {
  border-collapse: collapse;
}
</style>
