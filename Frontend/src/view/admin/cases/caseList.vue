<template>
  <div>
    <!-- Container Fluid-->
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="content-wrapper">
        <div class="content-body">
          <div id="user-case" class="row">
            <div class="col-lg-9">
              <table id="datatable">
                <thead>
                  <tr>
                    <th>Case ID</th>
                    <th>Patient</th>
                    <th>Dentist</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    class="TR d-flex justify-content-between"
                    v-for="user in users"
                    :key="user.id"
                  >
                    <td>
                      <span>
                        <b>#{{ user.id }}</b>
                      </span>
                    </td>

                    <td>{{ user.patient_name }}</td>
                    <td><b>Dentist Name Goes Here</b></td>
                    <td v-if="user.status_id === 2">Pending</td>
                    <td v-if="user.status_id === 3">In Progress</td>
                    <td v-if="user.status_id === 4">Completed</td>
                    <td v-if="user.status_id === 5">Canceled</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- filter -->
            <div class="col-lg-3 filter">
              <div class="filterContainer">
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
                      placeholder="search here ..."
                    />
                  </div>
                </div>

                <div class="box">
                  <p>Service</p>
                  <div class="col-12 px-0">
                    <select name="service" id="service" class="form-control">
                      <option value="volvo">Service Name</option>
                      <option value="saab">Service Name</option>
                      <option value="mercedes">Service Name</option>
                      <option value="audi">Service Name</option>
                    </select>
                  </div>
                </div>

                <div class="box">
                  <p>Status</p>
                  <div class="col-12 px-0">
                    <select name="service" id="service" class="form-control">
                      <option value="volvo">In progress</option>
                      <option value="saab">Complete</option>
                    </select>
                  </div>
                </div>

                <div class="d-flex justify-content-lg-end">
                  <button class="resetBtn">Reset</button>
                  <button class="applyBtn">Apply</button>
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

export default {
  name: 'caseCpanel',
  mounted() {
    // fetch("https://jsonplaceholder.typicode.com/users")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     this.users = data;
    //     setTimeout(() => {
    //       $("#datatable").DataTable({
    //         ordering: false,
    //         lengthChange: false,
    //         searching: false,
    //         info: false,
    //         paging: false,
    //         lengthMenu: [
    //           [5, 10, 25, 50, -1],
    //           [5, 10, 25, 50, "All"],
    //         ],
    //         pageLength: 10,
    //       });
    //     });
    //   });

    userAPI.getCaseList().then(res => {
      console.log(res);
      if (res.data.data) {
        this.users = res.data.data.val.data;
        setTimeout(() => {
          $('#datatable').DataTable({
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
    });
  },
  data: function () {
    return {
      users: [],
    };
  },
};
</script>

<style scoped>
thead,
tr {
  border-color: inherit;
  border-style: solid;
  border-width: 0;
  display: inline-block;
  width: 100%;
}
thead td {
  width: 100%;
}
tr.TR.odd,
tr.TR.even {
  background: #ffffff;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 20px;
  margin: 5px 0;
  /* display: flex;
  flex-wrap: wrap; */
  width: 100%;
  /* padding: 15px; */
}
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
/* #datatable thead { */
/* display: none; */
/* } */
#datatable td {
  border-radius: 20px;
  align-items: center;
  display: flex;
  width: 100%;
  padding: 25px;
}
#datatable span {
  color: #131313;
  font-size: 16px;
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
td.justify_end {
  justify-content: end;
}
td.center {
  justify-content: center;
}
#datatable .icon-message-circle {
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
  padding: 10px 20px;
  margin: -15px 0px;
  height: 89%;
  position: fixed;
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
</style>
