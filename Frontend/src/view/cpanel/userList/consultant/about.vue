<template>
  <div>
    <!-- Start -->
    <div class="about-tab">
      <div class="row">
        <div class="col-lg-12">
          <viewInformation :user_details="this.user_details" />
        </div>
      </div>
    </div>
    <!---End -->
  </div>
</template>

<script type="javascript">
import viewInformation from "./viewInformation.vue";

export default {
  components: {
    viewInformation,
  },
  data() {
    return {
      // user: {},
    };
  },
  mounted() {
    // if (this.user_details) {
    //   this.user = this.user_details;
    // }
  },
  props: ["user_details"],
};
</script>

<style type="text/css" scoped></style>
