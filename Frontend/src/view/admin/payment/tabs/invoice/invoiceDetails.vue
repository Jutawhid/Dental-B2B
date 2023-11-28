<template>
  <div>
    <!-- Container Fluid-->
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="content-wrapper">
        <div class="row">
          <div class="col-12 col-sm-12">
            <h3 class="text-bold-700 mb-0 headerTXT">
              Invoice Details - {{ '#INV' + invoiceId }}
            </h3>
          </div>
          <div class="col-12">
            <hr />
          </div>
        </div>

        <!-- Body Part -->
        <div class="row text-center">
          <div class="col-lg-8">
            <div class="d-lg-flex justify-content-lg-end">
              <div class="col-lg-9 p-0">
                <div class="inv-body">
                  <!-- header title/logo -->
                  <div class="inv-header">
                    <span class="inv-title">Invoice No.</span>
                    <img
                      src="../../../../../assets/images/logo/easyfi__logo.png"
                      alt="logo"
                      style="width: 100px !important"
                    />
                  </div>
                  <!-- table -->
                  <div class="mh">
                    <table class="inv-tbl my-2">
                      <thead>
                        <tr>
                          <th>
                            <span class="inv-title">Service No.</span>
                          </th>
                          <th>
                            <span class="inv-title">Details</span>
                          </th>

                          <th>
                            <span class="inv-title">Total</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in items" :key="index">
                          <td>
                            <span class="inv-title">{{ item.serviceNo }}</span>
                          </td>
                          <td>
                            <span class="inv-title">{{ item.details }}</span>
                          </td>

                          <td>
                            <span class="inv-title">{{ item.total }}</span>
                          </td>
                        </tr>
                        <tr class="final">
                          <td>
                            <span class="inv-title">Note :</span>
                            <span class="inv-title"> 1</span>
                          </td>
                          <td></td>

                          <td>
                            <span class="inv-title">Total: </span>
                            <span class="inv-title">
                              {{ items.map(e => e.total).toString() }}</span
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!-- header title/logo -->
                  <div class="inv-header final p-0">
                    <div class="d-flex col-12 px-0">
                      <div class="col-4">
                        <p class="footer-title mb-3"></p>
                        <p class="footer-title">Signed By</p>
                      </div>
                      <div class="col-4 py-1">
                        <p class="date my-0">
                          {{
                            moment(
                              items.map(e => e.created_at).toString(),
                            ).format('DD MMMM')
                          }}
                        </p>
                        <p class="date my-0">
                          {{
                            moment(
                              items.map(e => e.created_at).toString(),
                            ).format('dddd yyyy')
                          }}
                        </p>
                        <p class="date my-0">Date</p>
                      </div>
                      <div
                        class="col-4 totalDiv d-flex align-items-center flex-wrap"
                      >
                        <p class="w-100 inv-title" align="center">Total</p>
                        <p class="w-100 inv-title2">
                          {{ items.map(e => e.total).toString() }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="d-lg-flex justify-content-lg-start">
              <div class="col-lg-auto">
                <button
                  class="btn btn-primary btn-md-sm ml-1"
                  @click="downloadWithCSS"
                >
                  <icon class="feather icon-download"></icon>
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Body END -->
      </div>
    </div>
    <!---Container Fluid-->
  </div>
</template>

<script type="javascript">
import jsPDF from 'jspdf';
import paymentAPI from '../../../../../services/payment.API';
import { createToast } from 'mosha-vue-toastify';
import moment from 'moment';

export default {
  name: 'InvoiceDetails',
  components: {},
  data() {
    return {
      invoiceId: '',
      items: [],
    };
  },
  created() {
    this.moment = moment;
  },
  mounted() {
    // get invoice details
    this.invoiceId = Number(this.$route.params.id);
    // console.log(this.invoiceId);
    setTimeout(() => {
      this.getInvoiceDetails();
    }, 1000);
  },
  methods: {
    // get invoice details
    getInvoiceDetails() {
      // console.log(this.invoiceId);
      if (this.invoiceId) {
        paymentAPI.getAdminInvoiceDetails(this.invoiceId).then(
          response => {
            console.log(response);
            if (response.data.data) {
              this.items = response.data.data.map(e => {
                return {
                  serviceNo: 'D-' + e.service.id,
                  details: e.service_name,
                  sender: e.sender_name,
                  receiver: e.receiver_name,
                  total: '$ ' + e.amount,
                  created_at: e.created_at,
                };
              });
            } else {
              createToast('Invoice not found', {
                type: 'danger',
                position: 'top-right',
                showIcon: true,
                duration: 2000,
              });
            }
          },
          err => {
            if (err.response.data.success === false) {
              createToast('Invoice not found', {
                type: 'danger',
                position: 'top-right',
                showIcon: true,
                duration: 2000,
              });
            }
          },
        );
      }
    },

    downloadWithCSS() {
      const columns = [
        { title: 'Service No.', dataKey: 'serviceNo' },
        { title: 'Details', dataKey: 'details' },
        { title: 'Total', dataKey: 'total' },
      ];
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter',
      });
      require('jspdf-autotable');
      // text is placed using x, y coordinates
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16).text('Invoice : #INV' + this.invoiceId, 0.5, 0.7);

      // add logo
      doc.setFontSize(16).text('EASIFI', 20, 11, null, null, 'right');

      doc.autoTable({
        columns,
        body: this.items,
        margin: { left: 0.5, top: 1.25 },
      });
      //

      // Creating footer and saving file
      doc.save(`${this.heading}.pdf`);
    },
  },
};
</script>
<style type="text/css" scoped>
.inv-body {
  min-width: 300px;
  min-height: 600px;
  background: #ffffff;
  box-shadow: 0px 3px 6px #00000069;
  padding: 25px;
}
.inv-header {
  width: 100%;
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #efefef;
  border: 1px solid #efefef;
  padding: 15px;
}
.inv-title {
  color: #071c1d;
  font-size: 14px;
  font-weight: 500;
}
.inv-tbl {
  width: 100%;
  /* border: 1px solid #ded8d8; */
  /* height: 300px; */
}
.inv-tbl th,
.inv-tbl td {
  border: 1px solid #ded8d8;
  padding: 5px;
}
.inv-tbl tr.final td {
  border: 1px solid transparent;
  text-align: left;
}
.inv-tbl thead .inv-title {
  color: #071c1d;
  font-size: 14px;
  font-weight: 500;
}
tbody tr.final .inv-title {
  font-size: 12px;
  font-weight: 500;
}
.mh {
  height: 300px;
  overflow-y: auto;
}
.inv-header.final {
  position: absolute;
  bottom: 25px;
  width: 92%;
  min-height: 110px;
}
.inv-header .footer-title {
  color: #071c1d;
  font-size: 14px;
}
.inv-header .date {
  color: #071c1d;
  font-size: 14px;
}
.inv-header .totalDiv {
  background: #61c6c1;
  border: 1px solid #61c6c1;
}
.inv-header .totalDiv p.inv-title2 {
  font-size: 24px;
  color: #071c1d;
}
</style>
