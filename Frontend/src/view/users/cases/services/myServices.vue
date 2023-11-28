<template>
  <div class="">
    <div class="col-12" v-for="(service, index) in myServiceCom" :key="index">
      <div
        v-for="member in service?.caseMember"
        :key="member.id"
        class="row justify-content-between px-0 border-bottom-accent-1"
      >
        <div class="col-lg-9 col-md-9 col-6 uploadPart m-auto">
          <p class="ServiceTxt">
            <!-- {{ service.caseMember.map(e => e.id).toString() }} - -->
            <!-- {{ currentId.toString() }} - -->
            {{ member?.service?.name }}
            <!-- {{ service.service.id }} -->
          </p>
        </div>
        <div class="col-lg-3 col-md-3 col-6 d-flex justify-content-end">
          <!-- <span class="comStatus" v-if="service.caseMemberLenth > 1">
            Completed ({{ service.caseMemberLenth }})</span
          > -->
          <span class="comStatus"> Completed</span>
        </div>
      </div>
    </div>
    <!-- Upload Part -->
    <div class="col-12" v-for="(service, index) in myService" :key="index">
      <div
        class="row justify-content-between px-0"
        v-if="service.caseMember.map(e => e.user_id).toString().length > 0"
      >
        <div class="col-lg-9 col-md-9 col-6 uploadPart m-auto">
          <p class="ServiceTxt">
            <!-- {{ service.caseMember.map(e => e.id).toString() }} - -->
            <!-- {{ currentId.toString() }} - -->
            {{ service.service.name }}
            <!-- {{ service.service.id }} -->
          </p>
        </div>
        <div class="col-lg-3 col-md-3 col-6 d-flex justify-content-end">
          <select
            class="form-control serviceStatusOption"
            v-model="service.caseMember.service_status"
            @change="
              changeStatus(
                service.caseMember.service_status,
                Number(service.caseMember.map(e => e.id).toString()),
              )
            "
          >
            <option
              v-if="service.caseMember.map(e => e.service_status).toString()"
              :value="selectedStatus"
              selected
              disabled
            >
              {{
                service.caseMember.map(e => e.service_status).toString() == '1'
                  ? 'To Do'
                  : ''
              }}
              {{
                service.caseMember.map(e => e.service_status).toString() == '2'
                  ? 'In Progress'
                  : ''
              }}
              {{
                service.caseMember.map(e => e.service_status).toString() == '3'
                  ? 'Completed'
                  : ''
              }}
            </option>
            <option
              v-for="(status, index) in status"
              v-bind:value="status.id"
              v-bind:key="index"
              v-show="
                status.id.toString() !==
                service.caseMember.map(e => e.service_status).toString()
              "
            >
              {{ status.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <!-- Files List & Action -->
  </div>
</template>

<script type="javascript">
// import { createToast } from 'mosha-vue-toastify';
import caseAPI from '../../../../services/case.API';
import Swal from 'sweetalert2';
import profileService from '../../../../services/profile.service';
import { createToast } from 'mosha-vue-toastify';
export default {
  name: 'MyServices',
  mounted() {
    this.status.selected = true;
    //store case data
    setTimeout(() => {
      this.profileService();
    }, 1000);
  },
  data() {
    return {
      caseMemberId: null,
      caseServiceStatus: null,
      userData: {},
      myService: [],
      myServiceCom: [],
      currentId: '',
      status: [
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
    };
  },
  methods: {
    // user data
    profileService() {
      profileService.getUser().then(response => {
        this.userData = response;
        this.currentId = this.userData.user_id;
        // console.log(this.userData.user_id);
        this.myService = this.caseServiceList.map(e => {
          return {
            caseMember: e.caseMember.filter(
              member =>
                member.user_id === this.currentId &&
                member.service_status !== 3,
            ),
            service: e.service,
          };
        });
        // console.log(
        //   // this.caseServiceList.map(e => {
        //     if(e.caseMember.filter(member => member.user_id === this.currentId && member.service_status !== 3).length > 0){
        //       return console.log(e.caseMember.filter(member => member.user_id === this.currentId && member.service_status !== 3));

        //    }
        //   // }),
        // );
        this.myServiceCom = this.caseServiceList.map(e => {
          return {
            caseMember: e.caseMember.filter(
              member =>
                member.user_id === this.currentId &&
                member.service_status === 3,
            ),
            caseMemberLenth: e.caseMember.filter(
              member =>
                member.user_id === this.currentId &&
                member.service_status === 3,
            ).length,
            service: e.service,
          };
        });
        if (this.myService.length > 0) {
          console.log(this.myServiceCom);

          // console.log(
          this.myServiceCom = this.myServiceCom.map(e => {
            return {
              caseMember: e.caseMember.map(ef => {
                return {
                  ...ef, // spread operator
                  service: e.service,
                };
              }),
              caseMemberLenth: e.caseMemberLenth,
              service: e.service,
            };
          });
          // );
        }
      });
      // console.log(this.myServiceCom);

      // this.myService = this.caseServiceList.filter(e =>
      //   e.caseMember.map(e => e.user_id).toString(),
      // );
      this.caseMemberId = this.myService
        .map(e => e.caseMember.map(e => e.id))
        .toString();
      this.caseServiceStatus = this.myService
        .map(e => e.caseMember.map(e => e.id))
        .toString();
    },
    changeStatus(actionValue, caseMemberId) {
      console.log(this.caseMemberId);
      if (actionValue) {
        Swal.fire({
          title: 'Do you want to change your status?',
          icon: 'warning',
          // showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Yes, I want!',
          // denyButtonText: `Don't save`,
          confirmButtonColor: '#123c3d',
          denyButtonColor: '#123c3d',
          cancelButtonColor: 'red',
        }).then(result => {
          if (result.isConfirmed) {
            caseAPI.changeStatus(caseMemberId, actionValue).then(
              res => {
                console.log(res);
                if (res.data.success === true) {
                  createToast('Successfully Changed!', {
                    position: 'top-right',
                    type: 'success',
                    transition: 'bounce',
                    showIcon: 'true',
                    timeout: 2000,
                  });
                  location.reload();
                  this.getCaseDetails(this.caseID);
                } else {
                  createToast(res.data.message, {
                    position: 'top-right',
                    type: 'danger',
                    transition: 'bounce',
                    showIcon: 'true',
                    timeout: 2000,
                  });
                }
              },
              err => {
                if (err.response.data.success === false) {
                  createToast(err.response.data.message, {
                    position: 'top-right',
                    type: 'danger',
                    transition: 'bounce',
                    showIcon: 'true',
                    timeout: 2000,
                  });
                }
              },
            );
          } else if (result.isDenied) {
            // this.getCaseDetails(this.caseID);
            createToast('Status Change canceled', {
              position: 'top-right',
              type: 'danger',
              transition: 'bounce',
              showIcon: 'true',
              timeout: 2000,
            });
          }
        });
      }
    },
  },
  props: {
    caseServiceList: { type: Array, required: true },
    caseInfo: { type: Object, required: true },
    caseID: { type: Number, required: true },
    getCaseDetails: { type: Function, required: true },
  },
};
</script>

<style type="text/css" scoped>
.caseFiles .filename {
  width: 40%;
  color: #000000;
  font-size: 15px;
  font-weight: 700;
}
.caseFiles .uploadedBy {
  width: 45%;
  text-align: right;
  color: #959595;
  font-size: 13px;
}
.caseFiles .action {
  width: 15%;
  text-align: center;
}
.caseFiles .action img {
  margin: 0 10px;
}
.caseFiles .action i {
  color: #000000;
  margin: 0 10px;
  font-size: 15px;
  font-weight: 700;
}
.caseFiles tr {
  border: 1px solid #e1dbdb;
}
.caseFiles td {
  padding: 20px;
}
.caseFiles {
  /* margin-top: -23px; */
}
.caseFiles .uploadLabelTxt {
  color: #000000;
  opacity: 0.5;
  font-size: 13px;
}
.caseFiles .uploadBtn {
  width: 70%;
  color: #123c3d;
  padding: 20px;
  background: #00e2f2;
  border: 1px solid #00e2f2;
  border-radius: 0px 15px 0px 0px;
  height: 61px;
  font-weight: 600;
}
.ServiceTxt {
  padding: 20px;
  margin-bottom: 0;
  color: #000000;
}
.serviceStatusOption {
  width: 150px;
  height: 40px;
  background-color: #e1e1e2;
  margin: 10px;
  border-radius: 25px;
}
.caseFiles .uploadBorder {
  border-bottom: 1px solid #e1e1e2;
  /* border-radius: 15px 15px 0px 0px; */
  opacity: 1;
  /* background-color: #fff; */
}
.caseFiles .uploadPart {
  padding: 0 30px;
}
.caseFiles .btn-action {
  background: transparent;
  border: none;
}
/* Modal Delete */
.caseFiles .modal-footer {
  padding: 0;
}
.caseFiles .modal-body {
  background: #dbdbdb;
  border-radius: 5px;
  margin: 10px 0;
  padding: 15px 20px;
}
.caseFiles .modal-body td {
  padding: 0;
}
.caseFiles .modal-content {
  padding: 20px;
}
.caseFiles .modal-body .caseTxt,
.caseFiles .modal-body .patientTxt {
  color: #000000;
  text-transform: uppercase;
  font-weight: 400;
  word-break: break-word;
  padding: 0px 0 10px 0;
}
.caseFiles .caseTotal,
.caseFiles .patientName {
  color: #ff0000;
  text-transform: uppercase;
  font-weight: bold;
  word-break: break-word;
  margin: 10px 0 0 0;
}
.caseFiles b.red {
  color: #f00;
  font-weight: bold;
}
.btn-delete-request {
  background: #ff0000;
  border: 1px solid #ff0000;
  color: #ffffff;
  font-size: 14px;
  font-weight: 400;
  height: 52px;
  width: 100%;
  border-radius: 5px;
}
.caseFiles .btn-close {
  background: #fff;
  border: 1px solid #fff;
  color: #000000;
  font-size: 14px;
  font-weight: 400;
  height: 52px;
  width: 100%;
  opacity: 1;
}
.caseFiles {
  border: 1px solid #e1e1e2;
  border-radius: 15px 15px 0px 0px;
  opacity: 1;
  background-color: #fff;
  /* margin-top: -23px; */
}
.comStatus {
  width: 150px;
  height: 40px;
  background-color: #28c76f;
  color: #fff;
  margin: 10px;
  border-radius: 25px;
  padding: 10px;
  text-align: center;
}
</style>
