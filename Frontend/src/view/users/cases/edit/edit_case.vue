<template>
  <div>
    <!-- Container Fluid-->
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="col-lg-9 content-wrapper">
        <div class="row">
          <div class="col-lg-6 col-sm-12 d-flex">
            <router-link
              :to="{ path: '/case/' + case_id, params: { case_id: case_id } }"
            >
              <button class="backBtn">
                <i class="fa fa-chevron-left"></i>
              </button>
            </router-link>
            <h1 class="text-bold-700 mb-0 headerTXT pl-1">Case Settings</h1>
          </div>
          <div class="col-lg-6 col-sm-12 text-right">
            <button class="createBtn" form="saveForm">
              <i class="fa fa-check"></i>
              Confirm
            </button>
          </div>
          <div class="col-12">
            <hr />
          </div>
        </div>

        <div class="content-body caseFiles">
          <div class="col-lg-6">
            <CaseEditForm :caseInfo="this.caseDetails" :case_id="case_id" />
          </div>
          <div class="col-lg-12 my-2"><hr /></div>
          <div class="col-lg-12">
            <button
              class="deleteBtn"
              data-bs-toggle="modal"
              data-bs-target="#removeFile"
              aria-controls="removeFile"
            >
              <i class="fa fa-exclamation-triangle mr-1"></i>Delete Case
            </button>
          </div>
          <!-- Alert/MODAL confirmation for Delete -->
          <div
            class="modal fade"
            id="removeFile"
            aria-hidden="true"
            aria-labelledby="removeFile"
            tabindex="-1"
          >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <p class="serviceDetails">
                  Are you sure you want to delete the case :
                </p>
                <div class="modal-body">
                  <table class="ct">
                    <th class="caseTxt" width="100px">Case ID</th>
                    <th class="patientTxt">Patient Name</th>
                    <tbody>
                      <td class="caseTotal">{{caseDetails.case_id}}</td>
                      <td class="patientName">{{caseDetails.patient_name}}</td>
                    </tbody>
                  </table>
                </div>
                <div class="modal-footer d-flex flex-nowrap">
                  <button
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    Cancel
                  </button>
                  <button
                    class="btn-delete-request"
                    data-bs-dismiss="modal"
                    @click="removeCase(case_id)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Alert END -->
        </div>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import { createToast } from 'mosha-vue-toastify';
import caseAPI from '../../../../services/case.API';
import CaseEditForm from './case_edit_form.vue';
export default {
  name: 'CaseEdit',
  components: {
    CaseEditForm,
  },
  data() {
    return {
      case_id: this.$route.params.case_id,
      caseDetails: {},
    };
  },
  mounted() {
    // get case details
    this.getCaseDetails();
  },
  methods: {
    // get case details
    getCaseDetails() {
      if (this.case_id) {
        caseAPI.getCaseDetails(this.case_id).then(response => {
          this.caseDetails = {
            id: response.data.data.id,
            case_id: response.data.data.case_id,
            patient_name: response.data.data.patient_name,
            patient_age: response.data.data.patient_age,
            patient_address: response.data.data.patient_address,
            status: response.data.data.status,
            case_progress_status: response.data.data.case_progress_status,
            created_by: response.data.data.created_by,
            userAccessRole: response.data.data.userAccessRole,
          };
        });
      }
      console.log(this.caseDetails);
    },

    // remove case
    removeCase(caseID) {
      caseAPI.deleteCase(caseID).then(
        response => {
          if (response.data.success === true) {
            this.$router.push('/cases/all');
            createToast(response.data.message, {
              type: 'success',
              position: 'top-right',
              showIcon: true,
              duration: 2000,
            });
          } else {
            createToast(response.data.message, {
              type: 'danger',
              position: 'top-right',
              showIcon: true,
              duration: 2000,
            });
          }
        },
        error => {
          if (error.response.data.success === false) {
            createToast(error.response.data.message, {
              type: 'danger',
              position: 'top-right',
              showIcon: true,
              duration: 2000,
            });
          }
        },
      );
    },
  },
};
</script>

<style scoped>
.createBtn {
  background: #ffd700;
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
  background: #123c3d;
  border: 1px solid #123c3d;
  border-radius: 10px;
  padding: 10px 15px;
  color: white;
}
.resetBtn {
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  color: red;
  padding: 15px 25px;
  margin: 0 5px;
}
.deleteBtn {
  background: #ff0000;
  border: 1px solid #ff0000;
  border-radius: 10px;
  color: #fff;
  padding: 15px 25px;
}
/* Delete Modal CSS */
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
</style>