<template>
  <div>
    <!-- Container Fluid-->
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="content-wrapper">
        <div class="content-body">
          <div id="user-case">
            <div class="col-10">
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

                    <td>Patient Name Goes Here</td>
                    <td><b>Dentist Name Goes Here</b></td>
                    <td>In Progress</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!---Container Fluid-->
  </div>
</template>

<script>
import "jquery/dist/jquery.min.js";
import "datatables.net-dt/js/dataTables.dataTables";
import $ from "jquery";

export default {
  name: "caseCpanel",
  mounted() {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {
        this.users = data;
        setTimeout(() => {
          $("#datatable").DataTable({
            ordering: false,
            lengthChange: false,
            searching: false,
            info: false,
            paging: false,
            lengthMenu: [
              [5, 10, 25, 50, -1],
              [5, 10, 25, 50, "All"],
            ],
            pageLength: 10,
          });
        });
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
  background: #ffffff ;
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
  background: #ffffff ;
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
  background: #123c3d ;
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
  content: "\e890";
  font-size: 20px;
  margin-top: 6px;
  position: absolute;
  margin-left: 8px;
}
.chatIcon:hover {
  background: #ffd700 ;
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
</style>