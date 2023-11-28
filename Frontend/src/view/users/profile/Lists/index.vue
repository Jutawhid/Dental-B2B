<template>
  <div>
    <!-- User View START-->
    <!-- if other user (not dentist) -->
    <User
      v-if="role_id == 4 || role_id == 5 || role_id == 6"
      :user_details="this.user_details"
    />
    <!-- if dentist -->
    <Dentist v-if="role_id == 3" :user_details="this.user_details" />
    <!-- User View END -->
  </div>
</template>

<script>
import { createToast } from 'mosha-vue-toastify';
import userAPI from '../../../../services/user.API';
import User from './user/profileView.vue';
import Dentist from './dentist/dentistProfile.vue';
export default {
  name: 'ListProfileView',
  components: {
    User,
    Dentist,
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
      console.log(Number(this.$route.params.user_id));
      this.user_id = Number(this.$route.params.user_id);
    }

    // set ROLE ID
    if (this.user_id) {
      userAPI.getUsers(this.user_id).then(
        response => {
          console.log(response);
          if (response.data.success == true) {
            this.user_details = response.data.data;
            if (response.data.data.role_id) {
              this.role_id = response.data.data.role_id;
            }
          }
          // if (response.data.success == false) {
          //   this.$router.push('/');
          //   createToast("You are not eligible to this route", {
          //     type: 'danger',
          //     position: 'top-right',
          //     duration: 5000,
          //     showIcon: true,
          //   });
          // }
        },
        err => {
          if (err.response.data.success == false) {
            this.$router.push('/');
            createToast('You are not eligible to this route', {
              type: 'danger',
              position: 'top-right',
              duration: 5000,
              showIcon: true,
            });
          }
        },
      );
    }
  },
};
</script>

<style scoped></style>
