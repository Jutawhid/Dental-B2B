<template>
  <div class="col-12">
    <!-- Start -->
    <div class="row">
      <div class="col-lg-6">
        <h4 class="font-weight-bolder">Basic Information</h4>
        <div class="row ml-0">
          <div class="col-12 left-border">
            <div class="tab-info-group" v-if="this.profile?.role?.role_id === 5">
              <div class="label">Full Name</div>
              <div class="detail text-capitalize">{{ this.user.name }}</div>
            </div>
            <div class="tab-info-group" v-if="this.profile?.role?.role_id === 6">
              <div class="label">Full Name</div>
              <div class="detail">{{ this.user.name }}</div>
            </div>
            <div class="tab-info-group" v-if="this.profile?.role?.role_id === 4">
              <div class="label">First Name</div>
              <div class="detail">{{ this.user.first_name }}</div>
            </div>
            <div class="tab-info-group" v-if="this.profile?.role?.role_id === 4">
              <div class="label">Last Name</div>
              <div class="detail">{{ this.user.last_name }}</div>
            </div>
            <div class="tab-info-group">
              <div class="label">User name</div>
              <div class="detail">{{ this.user.user_name }}</div>
            </div>
            <!-- <div class="tab-info-group">
              <div class="label">Email</div>
              <div class="detail">{{ this.user.email }}</div>
            </div> -->
            <div class="tab-info-group">
              <div class="label">Phone</div>
              <div class="detail">{{ this.user.phone }}</div>
            </div>

            <div class="tab-info-group">
              <div class="label">Fax</div>
              <div class="detail">{{ this.user.fax }}</div>
            </div>
             <div class="tab-info-group">
              <div class="label">Address</div>
              <div class="detail">{{ this.user.address }}</div>
            </div>
            <div class="tab-info-group">
              <div class="label">State, City, Zip Code</div>
              <div class="detail">
                {{ this.user.state_name }}, {{ this.user.city_name }},
                {{ this.user.zip_code }} {{ this.user.address }}
              </div>
            </div>
            <div class="tab-info-group">
              <div class="label">Password</div>
              <div class="detail">{{ this.user.password }}</div>
              <router-link to="/security">
                <button class="btn btn-dark">Change Password</button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <!---End -->
    </div>
  </div>
</template>

<script type="javascript">
// import USERS_API from "../../../../services/user.API";
export default {
  name: "viewInformation",
  mounted() {
    // console.log(this.$store.state.profile.user);
    setTimeout(() => {
      this.user;
    }, 100);
    // USERS_API.getUserProfile().then(
    //   (response) => {
    //     if (response.data.success == true) {
    //       this.user = response.data.data;
    //       console.log(response.data);
    //     }
    //   },
    //   (error) => {
    //     this.user =
    //       (error.response &&
    //         error.response.data &&
    //         error.response.data.message) ||
    //       error.message ||
    //       error.toString();
    //   }
    // );
  },
  computed: {
    profile() {
      return this.$store.state.profile.user;
    },
  },
  data() {
    return {
      // userData: {},
      // user: {},
      isEditProfile: false,
    };
  },
  methods: {
    EditAction() {
      this.isEditProfile = true;
    },
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style type="text/css" scoped></style>
