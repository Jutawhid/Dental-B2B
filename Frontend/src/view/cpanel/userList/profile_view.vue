<template>
  <div>
    <!-- Consultant View START-->
    <Consultant v-if="role_id == 4" :user_details="this.user_details" />
    <!-- Consultant View END -->

    <!-- Dentist View START -->
    <Dentist v-if="role_id == 3" :user_details="this.user_details" />
    <!-- Dentist View END -->

    <!-- LAB View START -->
    <LAB v-if="role_id == 5" :user_details="this.user_details" />
    <!-- LAB View END -->

    <!-- TECH View START -->
    <TECH v-if="role_id == 6" :user_details="this.user_details" />
    <!-- TECH View END -->
  </div>
</template>

<script>
import userAPI from '../../../services/user.API';
import Consultant from '../userList/consultant/consultantProfile.vue';
import Dentist from '../userList/dentist/dentistProfile.vue';
import LAB from '../userList/lab/labProfile.vue';
import TECH from '../userList/lab/labProfile.vue';
export default {
  name: 'ListProfileView',
  components: {
    Consultant,
    Dentist,
    LAB,
    TECH,
  },
  data() {
    return {
      role_id: 0,
      user_id: 0,
      user_details: [],
    };
  },
  mounted() {
    // set USER ID
    if (this.$route.params.user_id) {
      this.user_id = this.$route.params.user_id;
    }

    // set ROLE ID
    if (this.user_id) {
      userAPI.getUserDetails(this.user_id).then(response => {
        if (response.data.data) {
          this.user_details = response.data.data;
          if (this.user_details.role_id) {
            this.role_id = this.user_details.role_id;
            console.log('role_id', this.role_id);
          }
        }
        // console.log(this.role_id, this.user_details, this.user_id);
      });
    }
  },
};
</script>

<style scoped>
</style>