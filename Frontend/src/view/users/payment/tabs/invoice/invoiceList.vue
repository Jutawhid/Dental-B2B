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
      <table class="table tableBorder table-responsive-sm" id="datatable2">
        <thead>
          <tr>
            <th class="pic">Invoice ID</th>
            <th class="case">Payment to</th>
            <th class="action">Date</th>
            <th class="action">Status</th>
            <th class="action">Amount</th>
            <th class="action">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td class="tableFont">{{ transaction.id }}</td>
            <td class="tableFont">
              {{
                transaction.to === ' ' ? 'No Reason Founded' : transaction.to
              }}
            </td>
            <td class="tableFont">
              {{ moment(transaction.date).format('MMMM Do YYYY') }}
            </td>
            <td class="tableFont">
              <span
                :class="[transaction.status === 1 ? 'status-in' : 'status-out']"
                >Paid</span
              >
            </td>

            <td class="tableFont">
              <span
                :class="[
                  transaction.status === 'Credit' ? 'status-in' : 'status-out',
                ]"
              >
                {{ transaction.status === 'Credit' ? '+' : '-' }} ${{
                  transaction.amount
                }}</span
              >
            </td>
            <td class="tableFont">
              <router-link
                :to="'/invoice/' + transaction.org_id"
                class="btn btn-primary btn-sm"
                >View Details
              </router-link>
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
import { createToast } from 'mosha-vue-toastify';
import paymentAPI from '../../../../../services/payment.API';
import moment from 'moment';

export default {
  mounted() {
    this.$store.dispatch('profile/loadUser');
    this.moment = moment;
    setTimeout(() => {
      this.getAllTransactions();
    }, 1000);
  },
  data: function () {
    return {
      transactions: [],
      searchText: '',
      searchOn: false,
    };
  },
  methods: {
    getAllTransactions() {
      if (this.profile.role.role_id === 1 || this.profile.role.role_id === 2) {
        paymentAPI.getInvoiceListForAdmins().then(response => {
          if (response.data.status === 200 && response.data.success === true) {
            console.log(response.data.data);
            this.transactions = response.data.data.map(item => {
              return {
                org_id: item.id,
                id: '#INV' + item.id,
                to: item.receiver_name,
                status: 1,
                date: item.created_at,
                amount: item.amount,
              };
            });
          }
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
              bOrder: [[2, 'desc']],
              bSort: false,
              bInfo: true,
              bLengthChange: false,
              // searching: true,
            });
          });
        });
      } else {
        paymentAPI.getInvoiceList().then(response => {
          if (response.data.status === 200 && response.data.success === true) {
            console.log(response.data.data);
            this.transactions = response.data.data.map(item => {
              return {
                org_id: item.id,
                id: '#INV' + item.id,
                to: item.receiver_name,
                status: 1,
                date: item.created_at,
                amount: item.amount,
              };
            });
          }
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
              bOrder: [[2, 'desc']],
              bSort: false,
              bInfo: true,
              bLengthChange: false,
              // searching: true,
            });
          });
        });
      }
    },
    // view case details
    goInvoice(id) {
      if (this.acountStatus == true) {
        this.$router.push({
          path: '/case/' + id,
          params: { id: id },
        });
      } else {
        this.$router.push({
          path: '/payments',
        });
        createToast('Please Add Your Account', {
          type: 'danger',
          showIcon: true,
          position: 'top-right',
          duration: 1000,
        });
      }
    },
    searchUser(e) {
      this.searchText = e.target.value;
      this.searchOn = true;
      $('#datatable2').DataTable().column(0).search(this.searchText).draw();
    },
    reset() {
      this.searchText = '';
      this.searchOn = false;
      $('#datatable2').DataTable().column(0).search('').draw();
    },
  },
  computed: {
    profile() {
      return this.$store.state.profile.user;
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
table.datatable2 thead th,
table.datatable2 thead td {
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
