<template>
  <div class="app-content content">
    <div class="content-overlay"></div>
    <div class="header-navbar-shadow"></div>
    <div class="row content-wrapper">
      <div class="col-lg-12">
        <div class="row"></div>
        <h1 class="text-bold-700 mb-0 headerTXT">PAYMENTS</h1>
      </div>
      <div class="col-12">
        <hr />
      </div>
      <div class="col-lg-12">
        <!-- Tab Start -->
        <ul class="nav nav-tabs" role="tablist" id="payment">
          <li class="nav-item">
            <a
              class="nav-link"
              @click.prevent="setActive('PaymentInfo')"
              :class="{ active: isActive('PaymentInfo') }"
              href="#PaymentInfo"
            >
              <h4 class="black font-weight-bold">Payment Info</h4></a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              @click.prevent="setActive('TransactionHistory')"
              :class="{ active: isActive('TransactionHistory') }"
              href="#TransactionHistory"
            >
              <h4 class="black font-weight-bold">Cancellation List</h4></a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              @click.prevent="setActive('PaymentInvoice')"
              :class="{ active: isActive('PaymentInvoice') }"
              href="#PaymentInvoice"
              ><h4 class="black font-weight-bold">Invoice list</h4></a
            >
          </li>
        </ul>
        <!-- Tab Content Start -->
        <div class="tab-content">
          <div
            class="tab-pane"
            :class="{ 'active show': isActive('PaymentInfo') }"
            id="PaymentInfo"
          >
            <PaymentInfo />
          </div>
          <!-- Service Tab End -->
          <div
            class="tab-pane"
            :class="{ 'active show': isActive('TransactionHistory') }"
            id="TransactionHistory"
          >
            <CancellationList />
          </div>
          <!-- TransactionHistory Tab End -->
          <div
            class="tab-pane"
            :class="{ 'active show': isActive('PaymentInvoice') }"
            id="PaymentInvoice"
          >
            <!-- LAB Content -->
            <PaymentInvoice />
            <!-- End LAB Content -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { createToast } from 'mosha-vue-toastify';
// import profileService from '../../../../services/profile.service';
import PaymentInfo from './tabs/info/summery.vue';
import PaymentInvoice from '../../users/payment/tabs/invoice/invoiceList.vue';
import CancellationList from './tabs/cancellation/cancellationList.vue';
export default {
  name: 'paymentAdmin',
  components: {
    PaymentInfo,
    PaymentInvoice,
    CancellationList,
  },
  mounted() {},
  data() {
    return {
      user: {},
      activeItem: 'PaymentInfo',
    };
  },
  methods: {
    isActive(menuItem) {
      return this.activeItem === menuItem;
    },
    setActive(menuItem) {
      this.activeItem = menuItem;
    },
  },
};
</script>

<style scoped>
ul.nav.nav-tabs {
  margin: 0 !important;
}
.nav.nav-tabs {
  border: none;
  margin-bottom: 0;
  position: relative;
  border-radius: 0;
}
.tab-content {
  /* border: 1px solid #bcbcbc; */
  border-radius: 10px;
  margin-top: 3px;
}
.nav.nav-tabs .nav-item .nav-link {
  padding: 1rem 2rem;
  margin: 0 10px;
}
.nav.nav-tabs .nav-item .nav-link.active:after {
  background: linear-gradient(30deg, #00e2f2, #00e2f2) !important;
  box-shadow: 0 0 0 0 #00e2f2 !important;
}
.headerTXT {
  font-size: 20px;
}
@media screen and (max-width: 767px) {
  .nav.nav-tabs li.nav-item {
    max-width: 33%;
    text-align: left;
  }
  #payment a.nav-link {
    padding: 10px 0 !important;
    margin: 0 10px;
  }
  #payment .nav-link h4 {
    font-size: 12px;
    text-align: center;
  }
  ul#payment {
    display: flex;
    justify-content: space-between;
  }
}
#payment .nav-link h4 {
  font-size: 14px;
}
</style>
