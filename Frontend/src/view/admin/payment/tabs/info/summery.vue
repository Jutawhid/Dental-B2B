<template>
  <div class="card p-0 p-lg-2">
    <div class="card-body">
      <div class="d-flex flex-wrap">
        <div class="summery-box">
          <div class="summery">
            <div class="summery-title">
              <i class="feather icon-dollar-sign"></i>
              {{ this.easifi_balance }}
            </div>
            <div class="summery-content">
              <span>Easifi Current Balance</span>
            </div>
          </div>
        </div>
        <div class="summery-box">
          <div class="summery">
            <div class="summery-title">
              <i class="feather icon-arrow-down"></i>
              {{ this.total_in_balance }}
            </div>
            <div class="summery-content">
              <span>Easifi IN Balance</span>
            </div>
          </div>
        </div>
        <div class="summery-box">
          <div class="summery">
            <div class="summery-title">
              <i class="feather icon-arrow-up"></i>
              {{ this.total_out_balance }}
            </div>
            <div class="summery-content">
              <span>Easifi OUT Balance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import paymentAPI from '../../../../../services/payment.API';
export default {
  name: 'summery',
  data() {
    return {
      easifi_balance: null,
      total_in_balance: null,
      total_out_balance: null,
    };
  },
  methods: {},
  mounted() {
    paymentAPI.getSummery().then(res => {
      // console.log(res.data.easifi_balance);
      if (res.data.status === 200 && res.data.success === true) {
        this.easifi_balance = res.data.easifi_balance;
        console.log(this.easifi_balance);
        this.total_in_balance = res.data.total_in_balance;
        this.total_out_balance = res.data.total_out_balance;
      }
    });
  },
};
</script>

<style scoped>
@import url('./paymentInfo.css');
@media screen and (max-width: 768px) {
  .summery-box {
    width: 100%;
    margin: 5px;
  }

}
i.feather.icon-arrow-up {
  color: red;
}
i.feather.icon-arrow-down {
  color: green;
}
i.feather.icon-dollar-sign {
  color: #123c3d;
}
</style>
