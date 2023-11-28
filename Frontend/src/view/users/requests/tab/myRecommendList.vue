<template>
  <div class="row">
    <div class="col-lg-9 px-0 px-lg-auto pr-lg-2 full">
      <table
        class="table tableBorder"
        style="width: 100%"
        id="dentistSentRequest"
      >
        <thead>
          <tr>
            <th class="tableHeader" align="center">Case ID</th>
            <!-- <th class="tableHeader" align="center">Patient</th> -->
            <th class="tableHeader" align="center">Service Provider</th>
            <th class="tableHeader" align="center">Service</th>
            <th class="tableHeader" align="center">Status</th>
            <th class="tableHeader" align="center">Actions</th>
          </tr>
        </thead>
        <tbody class="mx-lg-2">
          <tr v-for="(item, index) in recommendedData" :key="index">
            <td class="normalFont" align="center" aria-label="Case ID">
              <router-link :to="'/case/' + item.case_id"
                ><span class="blueFont">{{ item.case_no }}</span></router-link
              >
            </td>
            <!-- <td class="normalFont" align="center">
              {{ item.patient_name }}
            </td> -->
            <td class="normalFont" align="center" aria-label="Request From">
              {{
                item.service_provider_info.name
                  ? item.service_provider_info.name
                  : item.service_provider_info.first_name +
                    ' ' +
                    item.service_provider_info.last_name
              }}
            </td>
            <td class="normalFont" align="center" aria-label="Service">
              {{ item.service_name }}
            </td>
            <td class="normalFont" align="center" aria-label="Status">
              <span class="text-dark font-weight-bold">
                {{ item.request_status === 1 ? 'Accepted' : '' }}
              </span>
              <span class="text-danger font-weight-bold">
                {{ item.request_status === 2 ? 'Rejected' : '' }}
              </span>
              <span class="text-dark font-weight-bold">
                {{ item.request_status === 4 ? 'Auto Canceled' : '' }}
              </span>
              <span
                v-if="
                  item.request_status === 3 &&
                  Math.round(
                    moment
                      .duration(moment(item.expired_at).diff(moment()))
                      .asHours(),
                  ) >= 0
                "
                class="text-dark font-weight-bold"
              >
                Pending <br />
                {{
                  '(Auto Cancel ' +
                  moment(moment(item.expired_at).add(6, 'hours'))
                    .endOf('hours')
                    .fromNow() +
                  ')'
                }}
              </span>
              <span
                v-if="
                  item.request_status === 3 &&
                  Math.round(
                    moment
                      .duration(moment(item.expired_at).diff(moment()))
                      .asHours(),
                  ) < 0
                "
                class="text-danger font-weight-bold"
              >
                Auto Canceled
              </span>
            </td>
            <td class="normalFont" align="center" aria-label="Action">
              <button
                class="rejectBtn"
                @click.prevent="cancelRequest(item.id)"
                v-if="
                  item.service_provider_response === 3 &&
                  Math.round(
                    moment
                      .duration(moment(item.expired_at).diff(moment()))
                      .asHours(),
                  ) >= 0
                "
              >
                <i class="feather icon-x"></i> Cancel
              </button>
              <span
                class="text-danger"
                v-if="
                  item.service_provider_response === 3 &&
                  Math.round(
                    moment
                      .duration(moment(item.expired_at).diff(moment()))
                      .asHours(),
                  ) < 0
                "
              >
                Time Expired
              </span>
              <span
                class="text-success"
                v-if="item.service_provider_response === 1"
              >
                Approved
              </span>
              <span
                class="text-danger"
                v-if="item.service_provider_response === 2"
              >
                Rejected
              </span>
              <span
                class="text-danger"
                v-if="item.service_provider_response === 4"
              >
                Time Over
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Filter Section -->
    <div class="col-lg-3 filter">
      <div class="filterContainer">
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

          <div class="box">
            <p>Service</p>
            <div class="col-12 px-0">
              <select
                name="service"
                id="service"
                class="form-control"
                v-model="serviceType"
              >
                <option value="" selected disabled>Select Service Type</option>
                <option
                  v-for="(item, index) in serviceList"
                  :key="index"
                  :value="item"
                >
                  {{ item }}
                </option>
              </select>
            </div>
          </div>

          <div class="box">
            <p>Status</p>
            <div class="col-12 px-0">
              <select
                name="service"
                v-model="serviceStatus"
                id="service"
                class="form-control"
              >
                <option value="" selected disabled>Select Status</option>
                <option
                  v-for="(item, index) in statusList"
                  :key="index"
                  :value="
                    item == 1
                      ? 'Accepted'
                      : item == 2
                      ? 'Rejected'
                      : item == 3
                      ? 'Pending'
                      : item == 4
                      ? 'Canceled'
                      : ''
                  "
                >
                  {{ item === 1 ? 'Accepted' : '' }}
                  {{ item === 2 ? 'Rejected' : '' }}
                  {{ item === 3 ? 'Pending' : '' }}
                  {{ item === 4 ? 'Auto Canceled' : '' }}
                </option>
              </select>
            </div>
          </div>

          <div class="d-flex justify-content-lg-end">
            <button class="resetBtn" @click.prevent="resetSearch">Reset</button>
            <button class="applyBtn" @click.prevent="caseRecFilter">
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Filter Section End -->
  </div>
</template>

<script>
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import { createToast } from 'mosha-vue-toastify';
import moment from 'moment';
import requestsAPI from '../../../../services/requests.API';

export default {
  mounted() {
    requestsAPI.getSendRecommendationList().then(
      response => {
        if (response.data.data) {
          this.recommendedData = response.data.data;
          var serList = response.data.data.map(item => {
            return item.service_name.toString();
          });
          var serStatus = response.data.data.map(item => {
            return item.service_provider_response;
          });
          // console.log([...new Set(serList)]);
          this.serviceList = [...new Set(serList)];
          this.statusList = [...new Set(serStatus)];
          setTimeout(() => {
            $('#dentistSentRequest').DataTable({
              lengthMenu: [
                [10, 25, 50, -1],
                [10, 25, 50, 'All'],
              ],
              targets: 'no-sort',
              bSort: false,
              order: [],
              bInfo: false,
              bLengthChange: false,
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
              pageLength: 10,
            });
          });
        }
      },
      error => {
        if (error.response.data.success === false) {
          createToast(error.response.data.message, {
            type: 'danger',
            showIcon: true,
            position: 'top-right',
            duration: 2000,
          });
        }
      },
    );
  },
  data: function () {
    return {
      recommendedData: [],
      searchCaseID: '',
      serviceStatus: '',
      search: '',
      serviceType: '',
      statusList: [
        {
          id: 1,
          name: 'Accepted',
        },
        {
          id: 2,
          name: 'Canceled',
        },
        {
          id: 3,
          name: 'Pending',
        },
        {
          id: 4,
          name: 'Auto Canceled',
        },
      ],
      serviceList: [
        {
          id: 1,
          name: 'Treatment Planning Software',
        },
        {
          id: 2,
          name: 'Aligner Fabrication',
        },
        {
          id: 3,
          name: 'Case Advisor / Concierge',
        },
      ],
    };
  },
  created() {
    this.moment = moment;
  },
  methods: {
    // cancel Request
    cancelRequest(id) {
      requestsAPI.cancelSentRecommendRequest(id).then(
        response => {
          if (response.data.success === true) {
            // this.getSentRequestList();
            this.recommendedData = this.recommendedData.filter(
              item => item.id !== id,
            );
            createToast(response.data.message, {
              type: 'success',
              showIcon: true,
              position: 'top-right',
              duration: 2000,
            });
          } else {
            createToast(response.data.message, {
              type: 'danger',
              showIcon: true,
              position: 'top-right',
              duration: 2000,
            });
          }
        },
        error => {
          if (error.response.data.success === false) {
            createToast(error.response.data.message, {
              type: 'danger',
              showIcon: true,
              position: 'top-right',
              duration: 2000,
            });
          }
        },
      );
    },
    // reset search
    resetSearch() {
      this.serviceStatus = '';
      this.search = '';
      this.serviceType = '';
      $('#dentistSentRequest').DataTable().column(0).search('').draw();
      $('#dentistSentRequest').DataTable().column(2).search('').draw();
      $('#dentistSentRequest').DataTable().column(3).search('').draw();
    },

    // case filter
    caseRecFilter() {
      let search = this.search.toUpperCase();
      let serviceType = this.serviceType;
      console.log(serviceType);
      if (this.serviceStatus) {
        $('#dentistSentRequest')
          .DataTable()
          .column(3)
          .search(this.serviceStatus)
          .draw();
      }
      if (this.serviceType) {
        $('#dentistSentRequest')
          .DataTable()
          .column(2)
          .search(serviceType)
          .draw();
      }
      if (this.search) {
        $('#dentistSentRequest').DataTable().column(0).search(search).draw();
      }
    },
  },
};
</script>
<style scoped>
#user-profile .nav.nav-tabs {
  margin: 0 0 0 20px !important;
  border: none;
}
span.badge {
  padding: 8px 10px;
  font-size: 11px;
}
table.dataTable thead tr {
  background-color: #ffffff;
  padding-top: 50px;
  padding-bottom: 30px;
}
.tableBorder {
  padding-top: 20px !important;
  padding: 10px 0;
  background: #ffffff;
  border: 1px solid #bebebe;
  border-radius: 15px;
  opacity: 1;
}
.tableHeader {
  font: normal normal bold 13px/20px Poppins;
  letter-spacing: 0px;
  color: #000000;
  opacity: 1;
  /* min-width: 150px; */
}
.blueFont {
  font-size: 13px;
  color: #1492e6;
  font-weight: 600;
}
.normalFont {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0px;
  color: #000000;
  border: none;
  border-top: 1px solid #b9b3b3 !important;
  padding: 15px 0;
}
table.dataTable thead th,
table.dataTable thead td {
  border-bottom: none !important;
  text-align: center;
}
/* tr {
  height: 80px;
} */
table.dataTable thead .sorting:before,
table.dataTable thead .sorting_asc:before,
table.dataTable thead .sorting_desc:before {
  display: none;
}
table.dataTable thead .sorting:after,
table.dataTable thead .sorting_asc:after,
table.dataTable thead .sorting_desc:after {
  font-family: 'feather';
  content: '\e842';
  font-size: 1rem;
  margin-left: 5px;
}
table.dataTable thead .sorting {
  /* display: none !important; */
  background-image: none !important;
}
th.tableHeader.sorting {
  text-align: center;
  padding-bottom: 20px;
}
/* Right Side Filter */
.filterContainer {
  background: #b9d0d2;
  border-radius: 10px;
  width: 20.5%;
  padding: 20px 30px;
  margin: 0px 0px;
  height: 90%;
  position: fixed;
  top: 75px;
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
tr {
  border-color: inherit;
  border-style: solid;
  border-width: 0;
  border-top: 1px solid gray;
  border-bottom: none;
}
table.dataTable.no-footer {
  border-bottom: 1px solid #bfbebe;
}
table.dataTable {
  margin-top: 0px !important;
}
@media only screen and (max-width: 1050px) {
  .filterContainer {
    display: none;
  }
}

span.small {
  color: #414141;
}
/*  */

table {
  width: 100%;
}
table thead tr {
  background: #dcd5c5 url('/Global/Images/parchment-bkg.jpg') repeat;
}
table thead tr.Vertical {
  background-image: url('/Global/Images/parchment-bkg-rotated.jpg');
}
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

@media only screen and (max-width: 599px) {
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
button.chatIcon {
  background: #123c3d;
  border: 1px solid #123c3d;
  border-radius: 50%;
  color: white;
  height: 2rem;
  width: 2rem;
  cursor: pointer;
  margin: 0 0.5rem 0 1rem;
  padding: 0px;
}
i.pl-1.feather.icon-message-circle {
  font-size: 15px;
  margin-left: -15px;
}
@media only screen and (max-width: 768px) {
  .tableBorder {
    padding-top: 10px !important;
    padding: 10px 10px;
  }
  button.chatIcon {
    display: none;
  }
}
@media screen and (min-width: 1000px) and (max-width: 1199px) {
  .col-lg-9.px-0.px-lg-auto.pr-lg-2.full {
    min-width: 100%;
  }
}
</style>
