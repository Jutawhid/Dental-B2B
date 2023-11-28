<template>
  <div class="card">
    <div class="card-body">
      <label class="col-lg-3">
        <input
          class="search"
          type="text"
          placeholder="Search by Invoice ID..."
          @keyup.enter="searchUser"
          :value="searchText"
        />
        <i @click="reset" class="fa fa-times" v-if="searchOn"></i>
        <i @click="reset" class="fa fa-search" v-if="!searchOn"></i>
      </label>
      <table class="table tableBorder table-responsive-sm" id="datatable">
        <thead>
          <tr>
            <th class="pic">Case ID</th>
            <th class="action">Service Name</th>
            <th class="case">Service Status</th>
            <th class="case">Create Date</th>
            <th class="action">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="caseCancel in caseCancelList" :key="caseCancel.id">
            <td class="tableFont">
              <router-link :to="'/case/' + caseCancel.id">
                {{ caseCancel.CaseId }}
              </router-link>
            </td>
            <td class="tableFont">
              {{ caseCancel.services_name }}
            </td>
            <td class="tableFont">
              <span v-if="caseCancel.service_status === 1">To Do</span>
              <span v-if="caseCancel.service_status === 2">In Progress</span>
              <span v-if="caseCancel.service_status === 3">Complete</span>
            </td>

            <td class="tableFont">
              <span>
                {{
                  moment(caseCancel.services_created_at).format('MMMM Do YYYY')
                }}</span
              >
            </td>
            <td class="tableFont">
              <span> ${{ caseCancel.amount }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
// import Swal from 'sweetalert2';
// import { createToast } from 'mosha-vue-toastify';
import caseAPI from '../../../../../services/case.API';
import moment from 'moment';

export default {
  mounted() {
    this.moment = moment;
    this.getAllTransactions();
  },
  data: function () {
    return {
      caseCancelList: [],
      searchText: '',
      searchOn: false,
    };
  },
  methods: {
    getAllTransactions() {
      caseAPI.getCaseCancelList().then(response => {
        if (response.data.status === 200 && response.data.success === true) {
          console.log(response.data.data);
          this.caseCancelList = response.data.data.map(item => {
            return {
              id: item.id,
              CaseId: item.case_id_no,
              service_status: item.service_status,
              services_name: item.services_name,
              services_created_at: item.created_at,
              amount: item.amount,
            };
          });
        }
        setTimeout(() => {
          $('#datatable').DataTable({
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
            bOrder: [[2, 'desc']],
            bSort: false,
            bInfo: true,
            bLengthChange: false,
            // searching: true,
          });
        });
      });
    },
    searchUser(e) {
      this.searchText = e.target.value;
      this.searchOn = true;
      $('#datatable').DataTable().column(0).search(this.searchText).draw();
    },
    reset() {
      this.searchText = '';
      this.searchOn = false;
      $('#datatable').DataTable().column(0).search('').draw();
    },
  },
};
</script>

<style scoped>
.status-in {
  color: green;
}
.status-out {
  color: red;
}
.tableFont {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0px;
  color: #000000;
  border: none;
  border-top: 1px solid #b9b3b3 !important;
  padding: 15px 0;
}
.tableBorder {
  background: #ffffff;
  border-radius: 15px;
  opacity: 1;
}
.tableHeader {
  font: normal normal bold 13px/20px Poppins;
  letter-spacing: 0px;
  color: #000000;
  opacity: 1;
}
table.datatable thead th,
table.datatable thead td {
  text-align: center;
}
.table th,
.table td {
  text-align: center;
}
input.search {
  background: #ffffff;
  border: 1px solid #c8c8c8;
  border-radius: 10px;
  height: 40px;
  width: 100%;
  padding: 10px 20px;
  margin-bottom: 20px;
}
.fa-times {
  position: absolute;
  right: 30px;
  /* width: 30px; */
  /* height: 30px; */
  font-size: 20px;
  top: 10px;
  color: #123c3d;
  cursor: pointer;
}
.fa-search {
  position: absolute;
  right: 30px;
  /* width: 30px; */
  /* height: 30px; */
  font-size: 20px;
  top: 10px;
  color: #123c3d;
  cursor: pointer;
}
</style>
