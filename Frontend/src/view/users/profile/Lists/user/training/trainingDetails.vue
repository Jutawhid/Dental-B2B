<template>
  <div>
    <!-- Start -->
    <p class="alert alert-info" v-if="userData.training?.length == 0">
      No Training Available
    </p>
    <div
      v-for="user in userData.training"
      :key="user.id"
      class="trainings-wrapper"
    >
      <div class="card training-card">
        <div class="card-content">
          <div class="card-body py-0 px-2">
            <div class="d-flex user-card-title">
              <!-- {{ user.id }} -->
              <h2 class="font-weight-bolder">
                {{ user.title }}
              </h2>
            </div>
            <p class="card-text my-2">{{ user.description }}</p>
            <div v-for="file in user.document" :key="file.id">
              <a :href="basePath + '/' + file.file_temp_name" target="_blank">
                <img
                  :src="basePath + '/' + file.file_temp_name"
                  class="img-fluid"
                  style="max-width: 100px"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!---End -->
  </div>
</template>

<script type="javascript">
export default {
  name: 'trainingDetals',
  data() {
    return {
      userData: {},
      basePath: '',
    };
  },

  mounted() {
    if (this.user_details) {
      this.userData = this.user_details;
      this.basePath = this.user_details.document_folder_path;
      console.log(this.userData);
    }
  },
  props: ['user_details'],
};
</script>

<style type="text/css" scoped>
.custom-file-label {
  width: 300px;
  margin-right: 40px;
  position: relative;
}
.trainings-wrapper {
}
.trainings-wrapper .name {
  font-size: 1.74rem;
  font-weight: bolder;
  opacity: 0.7;
  width: 70%;
  margin: 0px 30px 30px 0px;
}
.trainings-wrapper .detail {
  min-height: 150px;
  margin-bottom: 30px;
  font-size: 16px;
  color: #123c3d;
  font-weight: 400;
}
.trainings-wrapper .price {
  width: 20%;
  background: #e5eaea;
  font-size: 20px;
  color: #123c3d;
  font-weight: 600;
  opacity: 0.7;
}
.btn-cancel {
  margin: 0 10px 30px !important;
  padding: 10px 20px;
}

.user-card-title h2 {
  width: 80%;
}
.training-card {
  margin-bottom: 10px;
  padding: 20px 0;
}
</style>
