<template>
  <div>
    <!-- Container Fluid-->
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="content-wrapper">
        <div class="content-body">
          <div class="row">
            <!-- create case button -->
            <div
              class="col-lg-9 text-center my-1"
              v-if="this.user?.role?.role_id === 3"
            >
              <!-- <button class="createCase" @click.prevent="createCase">
                + Create New Case
              </button> -->
              <router-link :to="{ name: 'CaseCreate' }" v-if="acountStatus">
                <button class="createCase">+ Create New Case</button>
              </router-link>
              <router-link :to="{ name: 'payment' }" v-if="!acountStatus">
                <button class="createCase" @click="addAcAlert">
                  + Create New Case
                </button>
              </router-link>
              <div class="list-container" :class="caseSidebar ? 'active' : ''">
                <button
                  class="more-button"
                  aria-label="Menu Button"
                  @click.prevent="caseShow()"
                >
                  <div class="menu-icon-wrapper">
                    <div class="menu-icon-line half first"></div>
                    <div class="menu-icon-line"></div>
                    <div class="menu-icon-line half last"></div>
                  </div>
                </button>
              </div>
            </div>

            <!-- data table / case list -->
            <div class="col-lg-9">
              <table
                id="datatable2"
                v-if="this.caseList?.length > 0"
                style="width: 100%"
              >
                <thead>
                  <tr
                    class="d-md-flex justify-content-md-between d-lg-flex justify-content-lg-between"
                  >
                    <th align="center">Case ID</th>
                    <th align="center">Start Date</th>
                    <th align="center" class="text-lg-right mr-lg-5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    class="d-lg-flex d-md-flex justify-content-between"
                    @click="goToCase(item.id)"
                    v-for="item in this.caseList"
                    :key="item.id"
                  >
                    <td align="center" aria-label="Case ID">
                      <span>
                        <b>{{ item.case_id }}</b>
                      </span>
                    </td>

                    <td align="center" aria-label="Date">
                      {{ moment(item.created_at).format('MMMM Do YYYY') }}
                    </td>

                    <td
                      class="justify_end mr-lg-4"
                      align="center"
                      aria-label="Status"
                    >
                      <span
                        class="badge rounded-pill bg-primary"
                        v-if="item.case_progress_status === 1"
                        >To Do</span
                      >
                      <span
                        class="badge rounded-pill bg-info text-dark"
                        v-else-if="item.case_progress_status === 2"
                        >In Progress</span
                      >
                      <span class="badge rounded-pill bg-success" v-else
                        >Complete</span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- <p class="alert alert-info" v-else>
                <i class="feather icon-info"></i> No case found.
              </p> -->
            </div>
            <div class="col-xl-9" v-if="loading">
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
            <div class="col-xl-9">
              <p class="alert alert-info" v-if="this.caseList.length <= 0">
                <i class="feather icon-info"></i> No case found.
              </p>
            </div>
            <!-- Filter Section -->
            <div class="col-lg-3 filter">
              <div
                class="filterContainer"
                :class="caseSidebar ? 'menuOpen' : 'menuClose'"
              >
                <form>
                  <div class="col-12 py-1 px-0">
                    <i class="feather icon-filter"></i>
                    <label>Filter</label>
                  </div>
                  <div class="box">
                    <p>Search</p>
                    <div class="col-12 px-0">
                      <input
                        type="text"
                        id="search"
                        class="form-control"
                        placeholder="Enter Case ID"
                        v-model="search"
                      />
                    </div>
                  </div>

                  <!-- <div class="box">
                  <p>Service</p>
                  <div class="col-12 px-0">
                    <select name="service" id="service" class="form-control">
                      <option value="volvo">Service Name</option>
                      <option value="saab">Service Name</option>
                      <option value="mercedes">Service Name</option>
                      <option value="audi">Service Name</option>
                    </select>
                  </div>
                </div> -->

                  <div class="box">
                    <p>Status</p>
                    <div class="col-12 px-0">
                      <select
                        name="service"
                        v-model="serviceStatus"
                        id="service"
                        class="form-control"
                      >
                        <option value="" selected disabled>
                          Select Status
                        </option>
                        <option
                          v-for="(item, index) in statusList"
                          :key="index"
                          :value="
                            item == 1
                              ? 'To Do'
                              : item == 2
                              ? 'In Progress'
                              : item == 3
                              ? 'Complete'
                              : ''
                          "
                        >
                          {{ item === 1 ? 'To Do' : '' }}
                          {{ item === 2 ? 'In Progress' : '' }}
                          {{ item === 3 ? 'Complete' : '' }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div class="d-flex justify-content-lg-end">
                    <button class="resetBtn" @click.prevent="resetSearch">
                      Reset
                    </button>
                    <button class="applyBtn" @click.prevent="caseFilter">
                      Apply
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <!-- Filter Section End -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import 'jquery/dist/jquery.min.js';
// import 'datatables.net-dt/js/dataTables.dataTables';
import $ from 'jquery';
import caseAPI from '../../../services/case.API';
import moment from 'moment';
import { createToast } from 'mosha-vue-toastify';
import userAPI from '../../../services/user.API';
import paymentAPI from '../../../services/payment.API';

export default {
  name: 'CasesCpanel',
  mounted() {
    paymentAPI.getAccountStatus().then(response => {
      if (response.data.status === 200 && response.data.success === true) {
        if (response.data.account_status === 'completed') {
          this.acountStatus = true;
        }
      }
    });
    caseAPI.getCaseList().then(
      res => {
        // set -> case list
        this.caseList = res.data.data.filter(item => item.status === 1);
        this.loading = false;
        console.log(this.caseList.length);

        // data table
        if (res.data.success) {
          // console.log(res.data.data);
          var serStatus = res.data.data.map(item => {
            return item.case_progress_status;
          });
          // console.log([...new Set(serList)]);
          this.statusList = [...new Set(serStatus)];
          setTimeout(() => {
            $('#datatable2').DataTable({
              lengthMenu: [
                [5, 10, 25, 50, -1],
                [5, 10, 25, 50, 'All'],
              ],
              pageLength: 10,
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
              // targets: 'no-sort',
              bSort: false,
              bInfo: true,
              bLengthChange: false,
              // searching: false,
            });
          });
        }
      },
      err => {
        if (err.response.data.success === false) {
          createToast(err.response.data.message, {
            type: 'danger',
            showIcon: true,
            position: 'top-right',
            duration: 3000,
          });
        }
      },
    );
    // role check
    userAPI.getUsers().then(
      res => {
        if (res.data.success === true) {
          this.role = res?.role?.role_id;
          if (this.role === 1 || this.role === 2) {
            this.$router.push('/cpanel/cases');
          }
        } else {
          this.$router.push('/cpanel/cases');
        }
      },
      err => {
        if (err.response.data.success === false) {
          // createToast(err.response.data.message, {
          //   type: 'danger',
          //   showIcon: true,
          //   position: 'top-right',
          //   duration: 3000,
          // });
          if (this.role === 1 || this.role === 2) {
            this.$router.push('/cpanel/cases');
          }
        }
      },
    );
  },
  data: function () {
    return {
      caseList: [],
      searchCaseID: '',
      serviceStatus: '',
      search: '',
      statusList: [],
      role: '',
      loading: true,
      caseSidebar: false,
      addCase: false,
      acountStatus: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
  },
  created() {
    this.moment = moment;
  },
  methods: {
    // view case details
    goToCase(case_id) {
      this.$router.push({
        path: '/case/' + case_id,
        params: { case_id: case_id },
      });
    },
    addAcAlert() {
      createToast('Please Add Your Account', {
        type: 'danger',
        showIcon: true,
        position: 'top-right',
        timeout: 2000,
      });
    },
    createCase() {
      if (this.acountStatus == true) {
        this.$router.push({
          path: '/case/create',
        });
      } else {
        createToast('Please Account', {
          type: 'danger',
          position: 'top-right',
          duration: 2000,
          showIcon: true,
        });
      }
    },

    // search by case id
    searchByCaseID(e) {
      console.log(e.target.value);
      $('#caseTables').DataTable().column(0).search(e.target.value).draw();
      // }
    },

    // reset search
    resetSearch() {
      this.serviceStatus = '';
      this.search = '';
      $('#datatable2').DataTable().column(0).search('').draw();
      $('#datatable2').DataTable().column(2).search('').draw();
    },

    // search by status
    searchByStatus(serviceStatus) {
      // let value = event.target.value;
      console.log(serviceStatus);
      $('#datatable2').DataTable().column(2).search(serviceStatus).draw();
    },
    caseFilter() {
      console.log(this.serviceStatus);
      console.log(this.search);
      let status = this.serviceStatus;
      let search = this.search.toUpperCase();
      if (status) {
        $('#datatable2').DataTable().column(2).search(status).draw();
      }

      if (search) {
        $('#datatable2').DataTable().column(0).search(search).draw();
      }
      this.caseSidebar = !this.caseSidebar;
    },
    caseShow() {
      this.caseSidebar = !this.caseSidebar;
    },
    date: function (date) {
      return moment(date).format('MMMM Do YYYY, h:mm:ss a');
    },
  },
};
</script>

<style scoped>
@media screen and (max-width: 991px) {
  .filterContainer.menuOpen {
    min-width: 300px;
  }
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
#datatable2 th {
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
a.TR.d-flex.justify-content-between {
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
a.TR.d-flex.justify-content-between td,
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

@media only screen and (max-width: 768px) {
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
  color: black !important;
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

/* For display in CodePen */
body {
  padding: 20px;
}
table {
  border-collapse: collapse;
}
</style>
