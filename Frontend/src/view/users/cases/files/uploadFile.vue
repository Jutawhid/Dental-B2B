<template>
  <div class="caseFiles">
    <!-- Upload Part -->
    <div class="col-12 px-0 uploadBorder">
      <div
        class="row justify-content-between"
        v-if="role === 3 || role === 4 || role === 5 || role === 6"
      >
        <div class="col-lg-9 col-md-9 col-6 uploadPart m-auto">
          <label class="uploadLabelTxt">Upload files here</label>
        </div>
        <div class="col-lg-3 col-md-3 col-6 text-lg-right">
          <input
            id="fileUpload"
            type="file"
            ref="file"
            accept="application/stl"
            hidden
          />
          <button
            class="uploadBtn"
            @click.prevent="uploadFile(this.caseDetails.id)"
          >
            Upload File <span class="round-loading" v-if="loading2"></span>
          </button>
        </div>
      </div>
    </div>
    <div class="col-xl-12" v-show="loading">
      <div class="row">
        <div class="col-xl-12">
          <div class="placeholder wave">
            <div class="line"><br /></div>
            <div class="line"><br /></div>
            <div class="line"><br /></div>
          </div>
        </div>
        <div class="col-xl-12">
          <div class="placeholder wave">
            <div class="line"><br /></div>
            <div class="line"><br /></div>
            <div class="line"><br /></div>
          </div>
        </div>
        <div class="col-xl-12">
          <div class="placeholder wave">
            <div class="line"><br /></div>
            <div class="line"><br /></div>
            <div class="line"><br /></div>
          </div>
        </div>
      </div>
    </div>
    <!-- Files List & Action -->
    <table
      class="col-12 table-responsive-sm"
      v-if="!loading && this.caseFiles.length > 0"
    >
      <tbody>
        <tr v-for="(file, index) in caseFiles" :key="index">
          <td class="filename">{{ file.file_original_name }}</td>
          <td class="uploadedBy">
            uploaded by <b class="text-capitalize"> {{ file.uploaded_by }}</b>
          </td>
          <td class="action">
            <button
              v-if="
                Number(userData.user_id) === file.created_by ||
                Number(userData?.role?.role_id) === 3
              "
              type="button"
              class="btn-action"
              data-bs-toggle="modal"
              data-bs-target="#removeFile"
              aria-controls="removeFile"
              @click.prevent="selectedFile(file.id, file.file_original_name)"
            >
              <img
                src="../../../../assets/images/icons/common/delete.svg"
                alt="delete_icon"
              />
            </button>
            <a
              :href="file.url"
              class="btn-action"
              @click.prevent="downloadFile(file.id, file.file_original_name)"
            >
              <img
                src="../../../../assets/images/icons/common/download.svg"
                alt="download_icon"
              />
            </a>
          </td>
        </tr>
      </tbody>
    </table>
    <p
      class="alert alert-info mt-1"
      v-if="!loading && this.caseFiles.length === 0"
    >
      No files uploaded yet
    </p>
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
            Are you sure you want to delete the file
            <b class="red text-capitalize">{{ selectedFileName }}</b> for the
            following case :
          </p>
          <div class="modal-body">
            <table class="ct">
              <th class="caseTxt" width="100px">Case ID</th>
              <th class="patientTxt">Patient Name</th>
              <tbody>
                <tr>
                  <td class="caseTotal">{{ caseDetails.case_id }}</td>
                  <td class="patientName">{{ caseDetails.patient_name }}</td>
                </tr>
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
              @click.prevent="removeFile"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Alert END -->
  </div>
</template>

<script type="javascript">
import { createToast } from 'mosha-vue-toastify';
import caseAPI from '../../../../services/case.API';
import profileService from '../../../../services/profile.service';
export default {
  name: 'UploadCaseFiles',
  mounted() {
    // profileService.getUser().then(res => {
    //   this.role = res.role.role_id;
    // });
    this.role = this.userRole;
    //store case data
    setTimeout(() => {
      this.profileService();
      this.getPropsData();
    }, 1000);
  },
  data() {
    return {
      caseFiles: [],
      caseDetails: {},
      selectedFileId: '',
      selectedFileName: '',
      userData: {},
      role: '',
      loading: true,
      loading2: false,
    };
  },
  methods: {
    // user data
    profileService() {
      profileService.getUser().then(response => {
        this.userData = response;
        // console.log(this.userData);
      });
    },
    //store case files
    getPropsData() {
      this.caseFiles = this.caseFileList;
      this.caseDetails = this.caseInfo;
      // this.caseID = this.caseInfo.id;
      // console.log(this.caseInfo.id);
      this.loading = false;
    },
    // upload file
    uploadFile(id) {
      const fileUpload = document.getElementById('fileUpload');
      // console.log(fileUpload);
      fileUpload.click();
      fileUpload.onchange = () => {
        this.loading2 = true;
        const mainfile = this.$refs.file.files.item(0);
        //
        console.log(mainfile.size);
        const mainfileName = this.$refs.file.files.item(0).name;
        const mainfileType = this.$refs.file.files
          .item(0)
          .name.split('.')
          .pop();
        if (mainfileType === 'stl' && mainfile.size <= 20120000) {
          var partsFile = [new Blob([mainfile], { type: 'application/stl' })];
          // bind file
          var file = new File(partsFile, mainfileName, {
            // lastModified: new Date(0), // optional - default = now
            type: 'application/stl', // optional - default = ''
          });
          const fReader = new FileReader();
          fReader.onload = () => {
            file = fReader.result;
          };
          fReader.readAsDataURL(file);
          //
          console.log(file);
        } else {
          createToast('Upload Valid STL File & Max File size limit 20MB', {
            type: 'danger',
            showIcon: true,
          });
          this.loading2 = false;
          setTimeout(() => {
            location.reload();
            }, 4000);
        }

        // bind file to fileData
        if ((id, file)) {
          const fileData = new FormData();
          fileData.append('id', this.caseInfo.id);
          fileData.append('file', file);

          // send data to server
          caseAPI.uploadCaseFile(fileData).then(
            response => {
              this.loading2 = false;
              // if success
              if (response.data.status === 201) {
                // set file data
                caseAPI.getCaseDetails().then(response => {
                  // if success
                  if (response.data.status === true) {
                    this.caseFiles = response.data.data.case_files;
                    this.caseDetails = response.data.data.case_details;
                  }
                });
                // show success message
                createToast(response.data.message, {
                  type: 'success',
                  showIcon: true,
                  position: 'top-right',
                });
                // file list update
                if (Number(this.caseInfo.id)) {
                  caseAPI
                    .getCaseDetails(Number(this.caseInfo.id))
                    .then(response => {
                      console.log(response);
                      // if success
                      if (response.data.success === true) {
                        // this.caseFiles.lastIndexOf(id);
                        // console
                        this.caseFiles = response.data.data.caseFileList;
                        console.log(this.caseFiles);
                        this.loading = false;
                        // this.caseDetails = response.data.data.case_details;
                      }
                    });
                }
                // setTimeout(() => {
                //   location.reload();
                //   }, 1000);
              } else {
                // if error
                createToast(response.data.message, {
                  type: 'danger',
                  showIcon: true,
                });
                this.loading = false;
                setTimeout(() => {
                  // location.reload();
                }, 4000);
              }
            },
            // if server error
            err => {
              if (err.response.data.success === false) {
                createToast(err.response.data.message, {
                  type: 'danger',
                  showIcon: true,
                });
              }
            },
          );
        }
      };
    },
    // selected file for delete
    selectedFile(id, filename) {
      this.selectedFileId = id;
      this.selectedFileName = filename;
    },

    // download file
    downloadFile(id, filename) {
      // console.log(id, filename);
      if (id) {
        caseAPI.downloadCaseFile(id).then(
          response => {
            // console.log(response);
            // console.log(response.data.type);
            // console.log(JSON.stringify(response));
            if (response.data.type === 'application/json') {
              createToast('File Not Found', {
                type: 'danger',
                showIcon: true,
                position: 'top-right',
              });
            } else {
              const blob = new Blob([response.data], {
                type: 'application/stl',
              });
              // create a link to download the file
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              // set file name
              link.setAttribute('download', filename);
              document.body.appendChild(link);
              // download file
              link.click();
              URL.revokeObjectURL(link.href);
            }
          },
          err => {
            console.log(err.response);
            createToast(err.response.data.message, {
              type: 'danger',
              showIcon: true,
              position: 'top-right',
            });
          },
        );
      }
    },
    // remove file
    removeFile() {
      if (this.selectedFileId) {
        caseAPI.removeCaseFile(this.selectedFileId).then(
          response => {
            if (response.data.success === true) {
              this.caseFiles.filter(file => {
                if (file.id === this.selectedFileId) {
                  this.caseFiles.splice(this.caseFiles.indexOf(file), 1);
                }
              });
              //  success alert
              createToast(response.data.message, {
                type: 'success',
                position: 'top-right',
              });
            } else {
              // error alert
              createToast(response.data.message, {
                type: 'danger',
                position: 'top-right',
              });
            }
          },
          error => {
            if (error.response.data.success === false) {
              // API error alert
              createToast(error.response.data.message, {
                type: 'danger',
                position: 'top-right',
              });
            }
          },
        );
      }
    },
  },
  props: {
    caseFileList: { type: Array, required: true },
    caseInfo: { type: Object, required: true },
    caseID: { type: Number, required: true },
    userRole: { type: Number, required: true },
  },
};
</script>

<style type="text/css" scoped>
.round-loading::after {
  content: '';
  border: 1px solid #123c3d;
  position: absolute;
  width: 10px;
  border-top-color: transparent;
  height: 10px;
  border-radius: 50%;
  top: 45%;
  left: 36%;
  transform: translate(-50%, -50%);
  -webkit-animation: loading 1s infinite linear;
  animation: loading 1s infinite linear;
}
/* *********************************** */
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
/* .caseFiles .uploadBorder {
  margin-top: -23px;
} */
</style>
