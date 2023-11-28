<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-lg-3">
          <input
            class="search"
            type="text"
            placeholder="Search by Invoice ID..."
            @keyup.enter="searchUser"
            :value="searchText"
          />
          <i @click="reset" class="fa fa-times" v-if="searchOn"></i>
          <i @click="reset" class="fa fa-search" v-if="!searchOn"></i>
        </div>
        <div class="col-lg-9 text-lg-right text-center">
          <button
            class="credit"
            :class="isIn ? 'active' : ''"
            @click.prevent="onCreditAction"
          >
            + in
          </button>
          <button
            class="debit"
            :class="isOut ? 'active' : ''"
            @click.prevent="onDebitAction"
          >
            - out
          </button>
        </div>
      </div>
      <table class="table tableBorder table-responsive-sm" id="datatable">
        <thead>
          <tr>
            <th class="pic">Invoice ID</th>
            <th class="case">Transition Reson</th>
            <th class="action">Date</th>
            <th class="action">Status</th>
            <th class="action">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td class="tableFont">{{ transaction.id }}</td>
            <td class="tableFont">
              {{
                transaction.reason === ' '
                  ? 'No Reason Founded'
                  : transaction.reason
              }}
            </td>
            <td class="tableFont">
              {{ moment(transaction.date).format('MMMM Do YYYY') }}
            </td>
            <td class="tableFont">
              <span
                :class="[
                  transaction.status === 'Credit' ? 'status-in' : 'status-out',
                ]"
                >{{ transaction.status }}</span
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
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import paymentAPI from '../../../../../services/payment.API';
import moment from 'moment';

export default {
  mounted() {
    this.moment = moment;
    this.getAllTransactions();
  },
  data: function () {
    return {
      transactions: [],
      searchText: '',
      searchOn: false,
      isIn: false,
      isOut: false,
    };
  },
  methods: {
    onCreditAction() {
      this.isIn = true;
      this.isOut = false;

      // filter by credit
      $('#datatable').DataTable().column(3).search('Credit').draw();
    },
    onDebitAction() {
      this.isIn = false;
      this.isOut = true;

      // filter by debit
      $('#datatable').DataTable().column(3).search('Debit').draw();
    },
    getAllTransactions() {
      paymentAPI.getUserTransactionList().then(response => {
        if (response.data.status === 200 && response.data.success === true) {
          console.log(response.data.data);
          this.transactions = response.data.data.map(item => {
            return {
              id: '#INV' + item.id,
              reason: item.reason,
              status: item.transaction_type === 1 ? 'Credit' : 'Debit',
              date: item.created_at,
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
button.credit {
  background: #ffffff;
  border: 1px solid #009f06;
  border-radius: 10px;
  color: #009f06;
  text-transform: uppercase;
  font-size: 15px;
  padding: 10px;
  min-width: 80px;
  margin: 0 5px;
  font-weight: 600;
}
button.debit {
  background: #ffffff;
  border: 1px solid #ff0000;
  border-radius: 10px;
  color: #ff0000;
  text-transform: uppercase;
  font-size: 15px;
  padding: 10px;
  margin: 0 5px;
  font-weight: 600;
  min-width: 80px;
}
button.credit.active {
  background: #009f06;
  color: #fff;
}
button.debit.active {
  background: #ff0000;
  color: #fff;
}
</style>
