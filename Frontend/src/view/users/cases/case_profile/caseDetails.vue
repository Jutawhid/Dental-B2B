<template>
  <!-- 1st Section -->
  <div class="row" id="sec" v-if="!loading && caseInfo">
    <div class="col-lg-12 mt-2" v-if="this.userData.roleID === 3">
      <div class="row caseStatus mx-0">
        <div class="col-5">
          <p class="caseStatusLabel">Case Status</p>
        </div>
        <div class="col-7">
          <select
            class="form-control serviceStatusOption"
            v-model="caseStatus"
            @change="setStatus"
          >
            <option
              selected
              v-if="selectedStatus == 1"
              :value="caseStatus"
              disabled
            >
              To Do
            </option>
            <option
              v-if="selectedStatus == 2"
              :value="caseStatus"
              selected
              disabled
            >
              In Progress
            </option>
            <option
              v-if="selectedStatus == 3"
              selected
              :value="caseStatus"
              disabled
            >
              Completed
            </option>

            <option
              v-for="(status, index) in statuses"
              :value="status.id"
              :key="index"
              v-show="status.id !== selectedStatus"
            >
              {{ status.name ? status.name : 'No Data Found' }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="col-lg-6 col-sm-6">
      <label>Case ID</label>
      <p align="center" class="text-lg-center text-left">
        {{ caseInfo.case_id ? caseInfo.case_id : 'N/A' }}
      </p>
    </div>
    <div class="col-lg-6 col-sm-6">
      <label>Case Type</label>
      <p align="center" class="text-lg-center text-left">
        {{ caseInfo.case_type ? caseInfo.case_type : 'N/A' }}
      </p>
    </div>

    <div class="col-lg-8" v-if="this.userData?.roleID === 3">
      <label>Patient Name</label>
      <p align="center" class="text-left">
        {{ caseInfo.patient_name ? caseInfo.patient_name : 'N/A' }}
      </p>
    </div>
    <div class="col-lg-4 col-sm-6" v-if="this.userData?.roleID === 3">
      <label>Patient Age</label>
      <p align="center" class="text-lg-center text-left">
        {{ caseInfo.patient_age ? caseInfo.patient_age : 'N/A' }}
      </p>
    </div>

    <div class="col-lg-12" v-if="this.userData?.roleID === 3">
      <label>Patient Address</label>
      <p align="center" class="text-left">
        {{ caseInfo.patient_address ? caseInfo.patient_address : 'N/A' }}
      </p>
    </div>
    <div class="col-lg-8" v-if="this.userData?.roleID !== 3">
      <label>Case Status</label>
      <p align="center" class="text-left caseStatusOther">
        {{ selectedStatus === 1 ? 'To Do' : '' }}
        {{ selectedStatus === 2 ? 'In Progress' : '' }}
        {{ selectedStatus === 3 ? 'Completed' : '' }}
      </p>
    </div>
  </div>

  <!-- loader starts -->
  <div class="col-xl-12" v-show="loading">
    <div class="row">
      <div class="col-xl-12">
        <div class="placeholder wave">
          <div class="line"><br /></div>
          <div class="line"><br /></div>
          <div class="line"><br /></div>
        </div>
      </div>
      <div class="col-xl-4">
        <div class="placeholder wave">
          <div class="line"><br /></div>
          <div class="line"><br /></div>
          <div class="line"><br /></div>
        </div>
      </div>
      <div class="col-xl-4">
        <div class="placeholder wave">
          <div class="line"><br /></div>
          <div class="line"><br /></div>
          <div class="line"><br /></div>
        </div>
      </div>
      <div class="col-xl-4">
        <div class="placeholder wave">
          <div class="line"><br /></div>
          <div class="line"><br /></div>
          <div class="line"><br /></div>
        </div>
      </div>
      <div class="col-xl-6">
        <div class="placeholder wave">
          <div class="line"><br /></div>
          <div class="line"><br /></div>
          <div class="line"><br /></div>
        </div>
      </div>
      <div class="col-xl-6">
        <div class="placeholder wave">
          <div class="line"><br /></div>
          <div class="line"><br /></div>
          <div class="line"><br /></div>
        </div>
      </div>
    </div>
  </div>

  <!---Container Fluid-->
</template>

<script>
import { createToast } from 'mosha-vue-toastify';
import caseAPI from '../../../../services/case.API';
// import USERS_API from '../../../../services/user.API';
export default {
  name: 'CaseDetails',

  mounted() {
    this.userData.roleID = this.userRole;
    // USERS_API.getUserProfile().then(
    //   response => {
    //     if (response.data.data) {
    //       this.userData = response.data.data;
    //       this.userData.roleID = this.userData?.role?.role_id;
    //       // console.log(this.userData);
    //     }
    //   },
    //   error => {
    //     this.user =
    //       (error.response &&
    //         error.response.data &&
    //         error.response.data.message) ||
    //       error.message ||
    //       error.toString();
    //   },
    // );
    setTimeout(() => {
      this.getCaseInfo();
      this.loading = false;
    }, 1000);
  },
  data() {
    return {
      loading: true,
      imgPath: '',
      userData: {
        roleID: '',
      },
      statuses: [
        {
          id: 1,
          name: 'To Do',
        },
        {
          id: 2,
          name: 'In Progress',
        },
        {
          id: 3,
          name: 'Completed',
        },
      ],
      selectedStatus: '',
    };
  },
  methods: {
    getCaseInfo() {
      // console.log(this.caseInfo);
      this.selectedStatus = Number(this.caseInfo.case_progress_status);
      this.caseStatus = [Number(this.caseInfo.case_progress_status)];
      // console.log(this.caseInfo.patient_age);
      // console.log(this.selectedStatus);
    },
    setStatus(e) {
      this.selectedStatus = e.target.value;
      // console.log(this.selectedStatus, e.target.value);

      if (this.selectedStatus) {
        let data = {
          id: this.caseInfo.id,
          status: Number(this.selectedStatus),
        };
        caseAPI.changeCaseStatus(data).then(
          res => {
            if (res.data.success === true) {
              // this.statuses.filter(status => status.id !== this.selectedStatus)
              createToast(res.data.message, {
                type: 'success',
                showIcon: true,
                position: 'top-right',
                duration: 2000,
              });
            } else {
              createToast(res.data.message, {
                type: 'danger',
                showIcon: true,
                position: 'top-right',
                duration: 2000,
              });
            }
          },
          err => {
            if (err.response.data.success === false) {
              createToast(err.response.data.message, {
                type: 'danger',
                showIcon: true,
                position: 'top-right',
                duration: 2000,
              });
            }
          },
        );
      }
    },
  },
  props: ['caseInfo', 'userRole'],
};
</script>

<style scoped>
p {
  background: #e9e9e9;
  border-radius: 10px;
  padding: 15px 20px;
  color: #000000;
  height: auto;
  margin: 5px 0 20px 0;
}
.caseStatus {
  background: #ffffff;
  border: 1px solid #e1e1e2;
  border-radius: 15px;
  height: 60px;
  margin-bottom: 20px;
}
.caseStatusOther {
  border: 1px solid #ffd700;
  background: #ffffff;
}
select.form-control:not([multiple='multiple']),
.form-control:focus {
  margin: 13px 0 0 0;
  border: none;
  box-shadow: none;
  font-size: 1rem;
  font-weight: bold;
  color: #000000;
}
.caseStatus p {
  width: 100%;
  background: transparent;
  height: auto;
  padding: 10px 0px 5px;
  margin: 9px;
}
select.form-control:not([multiple='multiple']) {
  background-position: calc(100% - 10px) 15px, calc(100% - 20px) 10px, 100% 0;
  background-size: 15px 15px, 10px 10px;
}
.form-control {
  color: black;
}
.caseStatusLabel {
  color: #707070;
  font-size: 14px;
  font-weight: 500;
}
.caseStatus select.form-control:not([multiple='multiple']),
.caseStatus .form-control:focus {
  margin: 7px 0 0 0;
}
/* * *********************************** */
.placeholder {
  margin: 5px 0;
  padding: 0px;
  display: flex;
  background-color: #e3e3e3;
}
.placeholder.pulse div {
  animation: pulse 1s infinite ease-in-out;
  -webkit-animation: pulse 1s infinite ease-in-out;
}
.placeholder.wave div {
  animation: wave 1s infinite linear forwards;
  -webkit-animation: wave 1s infinite linear forwards;
  background: #f6f7f8;
  background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
  background-size: 800px 104px;
}
.placeholder div {
  background: #e8e8e8;
}
.placeholder .square {
  float: left;
  width: 30px;
  height: 30px;
  margin: 0 0 10px;
}
.placeholder .rectangle {
  float: left;
  width: 40px;
  height: 30px;
  margin: 0 0 10px;
}
.placeholder .line {
  height: 12px;
  margin: 25px auto;
  width: 10%;
}
.placeholder .circle {
  float: left;
  width: 40px;
  height: 40px;
  margin: 0 15px 10px 0;
  border-radius: 40px;
}

@keyframes pulse {
  0% {
    background-color: rgba(165, 165, 165, 0.1);
  }
  50% {
    background-color: rgba(165, 165, 165, 0.8);
  }
  100% {
    background-color: rgba(165, 165, 165, 0.1);
  }
}
@-webkit-keyframes pulse {
  0% {
    background-color: rgba(165, 165, 165, 0.1);
  }
  50% {
    background-color: rgba(165, 165, 165, 0.8);
  }
  100% {
    background-color: rgba(165, 165, 165, 0.1);
  }
}
@keyframes wave {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}
@-webkit-keyframes wave {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}
</style>
