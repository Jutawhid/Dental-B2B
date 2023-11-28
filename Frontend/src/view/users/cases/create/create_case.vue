<template>
  <div>
    <!-- Container Fluid-->
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="col-lg-9 content-wrapper">
        <div class="row">
          <div class="col-lg-6 col-sm-12 d-flex">
            <router-link :to="{ name: 'AllCase' }">
              <button class="backBtn mr-1">
                <i class="fa fa-chevron-left"></i>
              </button>
            </router-link>
            <h1 class="text-bold-700 mb-0 headerTXT">Add New Case</h1>
          </div>
          <div class="col-lg-6 col-sm-12 text-right">
            <!-- <router-link :to="{ name: 'AllCase' }"
              ><button class="resetBtn">
                <i class="fa fa-chevron-left"></i></button
            ></router-link> -->
            <button class="createBtn" form="saveForm">
              <i class="fa fa-check"></i>
              Confirm
            </button>
          </div>
          <div class="col-12">
            <hr />
          </div>
        </div>

        <div class="content-body">
          <div class="col-lg-12 mx-0 px-0">
            <CaseCreateForm />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import CaseCreateForm from './case_create_form.vue';
export default {
  name: 'CaseCreate',
  components: {
    CaseCreateForm,
  },
  methods: {
    onReset() {
      this.caseID = '';
      this.patientAge = '';
      this.patientName = '';
      this.patientAddress = '';
    },
  },
};
</script>

<style scoped>
.createBtn {
  background: #ffd700 ;
  border: 1px solid #ffd700;
  border-radius: 10px;
  text-align: center;
  padding: 15px 30px;
  color: #000000;
  font-size: 14px;
  font-weight: bold;
}
.headerTXT {
  margin: 3px 0 !important;
}
.backBtn {
  background: #123c3d ;
  border: 1px solid #123c3d;
  border-radius: 10px;
  padding: 10px 15px;
  color: white;
}
.resetBtn {
  background: #ffffff ;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  color: red;
  padding: 15px 25px;
  margin: 0 5px;
}
</style>