<template>
  <div class="col-12">
    <!-- Start -->
    <div class="row">
      <div class="col-lg-6">
        <h4 class="font-weight-bolder">Basic Information</h4>
        <div class="row ml-0">
          <div class="col-12 left-border">
            <div class="tab-info-group">
              <div class="label">Name</div>
              <div class="detail">{{ userData.user_name }}</div>
            </div>
            <div class="tab-info-group">
              <div class="label">User name</div>
              <div class="detail">{{ userData.name }}</div>
            </div>
            <div class="tab-info-group">
              <div class="label">Email</div>
              <div class="detail">{{ userData.email }}</div>
            </div>

            <div class="tab-info-group">
              <div class="label">Phone</div>
              <div class="detail">{{ userData.phone }}</div>
            </div>

            <div class="tab-info-group">
              <div class="label">Fax</div>
              <div class="detail">{{ userData.fax }}</div>
            </div>
            <div class="tab-info-group">
              <div class="label">Address</div>
              <div class="detail">{{ userData.address }}</div>
            </div>
            <!-- <div class="tab-info-group">
              <div class="label">Password</div>
              <div class="detail">{{ userData.password }}</div>
              <a class="btn btn-dark" href="/password/change"
                >Change Password</a
              >
            </div> -->
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <h4 class="font-weight-bolder">Payment Information</h4>
        <div class="row ml-0">
          <div class="col-12 left-border">
            <div class="tab-info-group">
              <div class="label">Credit Card</div>
              <div class="detail">{{ userData.credit_card }}</div>
            </div>
          </div>
        </div>
      </div>
      <!---End -->
    </div>
  </div>
</template>

<script type="javascript">
export default {
  name: 'viewInformation',
  mounted() {
    if (this.user_details) {
      this.userData = this.user_details;
    }
  },
  data() {
    return {
      userData: {},
      // user: {},
      isEditProfile: false,
    };
  },
  methods: {
    EditAction() {
      this.isEditProfile = true;
    },
  },
  props: ['user_details'],
};
</script>

<style type="text/css" scoped></style>
