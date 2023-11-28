<template>
  <div class="col-12">
    <!-- Start -->
    <div
      :key="training.id"
      v-for="training in userServices"
      class="trainings-wrapper"
    >
      <h5 class="font-weight-bolder" style="opacity: 0.5"></h5>
      <div class="card">
        <div class="card-content">
          <div class="card-body">
            <div class="service-card-title">
              <div class="title_feild">
                <h2
                  class="col-lg-10 font-weight-bolder px-0 text-capitalize"
                  v-show="!training.edit"
                >
                  {{ training.title }}
                </h2>
                <input
                  type="text"
                  class="form-control font-weight-bolder"
                  v-model="training.title"
                  v-show="training.edit"
                />
                <label class="hide_file" v-show="training.edit">
                  Choose File
                  <input
                    class="form-control hide_file"
                    type="file"
                    id="imageUpload"
                    accept="image/jpg, images/png, images/jpeg, application/pdf"
                    ref="files"
                    @change="selectImage"
                  />
                </label>
              </div>
              <div class="mbl_res">
                <button
                  class="btn btn-edit"
                  v-show="!training.edit"
                  v-on:click="enableEdit(training)"
                >
                  <i class="feather icon-edit-1 mr-50"></i>Edit
                </button>
                <div class="d-flex" v-show="training.edit">
                  <button
                    class="btn btn-cancel"
                    v-show="training.edit"
                    v-on:click="cancelEdit(training)"
                  >
                    <i class="feather icon-x mr-50"></i>Cancel
                  </button>
                  <button
                    class="btn btn-update"
                    v-show="training.edit"
                    v-on:click="updateAction(training)"
                  >
                    <i class="feather icon-check mr-50"></i>Update
                  </button>
                  <button
                    class="btn btn-danger"
                    v-show="training.delete"
                    v-on:click="removeAction(training)"
                  >
                    <i class="feather icon-delete mr-50"></i>Delete
                  </button>
                </div>
              </div>
            </div>
            <p class="card-text my-2" v-show="!training.delete">
              {{ training.description }}
            </p>
            <div class="col-12 d-flex flex-wrap px-0">
              <div
                class="card-text train"
                v-for="(file, index) in training.document"
                :key="index"
                v-show="!training.edit"
              >
                <img
                  class="my-2"
                  v-if="!file.file_temp_name.includes('pdf', 'PDF')"
                  :src="basePath + '/' + file.file_temp_name"
                  :alt="file.file_original_name"
                />
                <a
                  class="d-flex justify-content-center align-items-center btn btn-download"
                  v-if="file.file_temp_name.includes('pdf', 'PDF')"
                  :href="basePath + '/' + file.file_temp_name"
                  :name="file.file_original_name"
                  target="_blank"
                >
                  <i class="feather icon-download mr-50"></i> Download
                </a>
              </div>
            </div>
            <textarea
              class="form-control detail"
              v-model="training.description"
              v-show="training.edit"
            >
              { training.description }</textarea
            >
          </div>
        </div>
      </div>
    </div>
    <router-link :to="{ name: 'addTraining' }">
      <button class="add-new">+ Add New Training</button>
    </router-link>
    <!---End -->
  </div>
</template>

<script type="javascript">
import trainingAPI from '../../../../../services/training.API';
import Swal from 'sweetalert2';
import { createToast } from 'mosha-vue-toastify';

export default {
  name: 'trainingDetails',
  async created() {
    await trainingAPI.getTrainingList().then(res => {
      if (res.data.success === true) {
        this.options = res.data.data;
        console.log(this.options.length);
      }
    });
    await trainingAPI.getTrainingList().then(res => {
      if (res.data.success === true) {
        this.userServices = res.data.data;
        this.basePath = res.data.folder;
        console.log(this.userServices);
      }
    });
  },
  data() {
    return {
      trainingList: [],
      options: [],
      selectedFile: null,
      userServices: [
        {
          edit: false,
          delete: false,
        },
      ],
      message: '',
      basePath: '',
      filePreview: '',
    };
  },
  computed: {
    services2: function () {
      var _services = [];
      for (var i = 0, trainings; (trainings = this.userServices[i]); i++) {
        trainings.edit = false;
        _services.push(trainings);
        console.log(this.userServices);
      }
      return _services;
    },
  },
  mounted() {
    console.log(this.userServices);
  },
  methods: {
    selectImage(trainings) {
      console.log(trainings.target.files.item(0));
      let file = trainings.target.files.item(0);
      if (file) {
        this.selectedFile = file;
        console.log(this.selectedFile);
      }
    },
    // enable edit method
    enableEdit: function (trainings) {
      this._orginalTrainings = Object.assign({}, trainings);
      trainings.edit = true;
      trainings.delete = true;
    },

    // cancel edit method
    cancelEdit: function (trainings) {
      Object.assign(trainings, this._orginalTrainings);
      trainings.edit = false;
      trainings.delete = false;
    },

    // update action method
    updateAction: function (trainings) {
      let file = this.selectedFile;

      trainingAPI
        .trainingUpdate(trainings, file, event => {
          this.progress = Math.round((100 * event.loaded) / event.total);
        })
        .then(
          response => {
            // preview file
            if (this.selectedFile) {
              this.filePreview = URL.createObjectURL(this.selectedFile);
            } else {
              this.filePreview = '';
            }
            if (response.data.status === 200) {
              trainings.edit = false;
              trainings.delete = false;
              // reset array
              if (trainings.document.length > 0) {
                trainingAPI.getTrainingList().then(
                  res => {
                    if (res.data.success === true) {
                      let filterDocument = res.data.data.findIndex(
                        item => item.id === trainings.id,
                      );
                      let document = res.data.data[filterDocument].document;
                      if (filterDocument > -1) {
                        trainings.document = document;
                      }
                      this.basePath = res.data.folder;
                    }
                  },
                  err => {
                    console.log(err.response.data.message);
                  },
                );
              }
              createToast(response.data.message, {
                position: 'top-right',
                showIcon: 'true',
                type: 'success',
                hideProgressBar: 'false',
                timeout: 2000,
                swipeClose: 'false',
              });
            } else {
              createToast(response.data.message, {
                position: 'top-right',
                showIcon: 'true',
                type: 'error',
                hideProgressBar: 'false',
                timeout: 2000,
                swipeClose: 'false',
              });
            }
          },
          err => {
            createToast(err.response.data.message, {
              position: 'top-right',
              showIcon: 'true',
              type: 'danger',
              hideProgressBar: 'false',
              timeout: 2000,
              swipeClose: 'false',
            });
          },
        );
      // .catch(err => {
      //   // this.progress = 0;
      //   if (err.response.data.success == false) {
      //     createToast(err.response.data.message, {
      //       position: 'top-right',
      //       type: 'danger',
      //       transition: 'bounce',
      //       showIcon: 'true',
      //       timeout: 2000,
      //     });
      //   }
      //   // this.currentImage = undefined;
      // });
    },

    // remove action method
    removeAction: function (trainings) {
      if (trainings.id) {
        Swal.fire({
          title: 'Do you want to Delete this?',
          icon: 'warning',
          showDenyButton: true,
          // showCancelButton: true,
          confirmButtonText: 'Yes, Delete it',
          denyButtonText: `Cancel`,
          confirmButtonColor: 'red',
          denyButtonColor: '#123c3d',
        }).then(result => {
          if (result.isConfirmed) {
            trainingAPI.trainingDelete(trainings.id).then(
              res => {
                if (res.data.success) {
                  this.userServices.splice(
                    this.userServices.indexOf(trainings),
                    1,
                  );
                  createToast(res.data.message, {
                    icon: 'success',
                    showIcon: 'true',
                    position: 'top-right',
                    type: 'success',
                    hideProgressBar: 'false',
                    timeout: 2000,
                    swipeToClose: 'false',
                  });
                }
              },
              error => {
                createToast(error.response.data.message, {
                  position: 'top-right',
                  type: 'danger',
                  hideProgressBar: 'false',
                  timeout: 2000,
                  swipeToClose: 'false',
                });
              },
            );
          }
        });
      }
    },
  },
};
</script>

<style type="text/css" scoped>
.btn-download {
  font-size: 15px;
  background: #123c3d;
  border: 1px solid #123c3d;
  color: white;
  border-radius: 5px;
  border: 5px;
  padding: 10px 15px;
}
.btn-download:hover {
  background: #123c3d;
  color: white;
}
.train img {
  height: 150px;
  border-radius: 5px;
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
  background: #123c3d;
  color: #ffffff;
  margin: 0 10px 30px !important;
  padding: 10px 20px;
}
.btn-update {
  background: #ffd700;
  color: #000000;
  margin: 0 10px 30px !important;
  padding: 10px 20px;
}
.btn-danger {
  margin: 0 10px 30px !important;
  padding: 10px 20px;
}
.btn {
  font-weight: 600;
  font-family: 'Poppins';
  box-shadow: 0px 3px 6px #00000029;
  height: 40px;
}
.btn-edit {
  position: absolute;
  background: #ffd700;
  color: #000000;
  font-weight: 600;
  font-family: 'Poppins';
  box-shadow: 0px 3px 6px #00000029;
  right: 20px;
}
.btn-with-price {
  display: initial;
  width: auto;
  background-color: #f2f2f2;
  color: #123c3d;
  font-weight: 800;
  padding: 5px 10px;
  border-radius: 10px;
}
.add-new {
  background-color: #00e2f2;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 15px;
  font-size: 10px;
  font-weight: 800;
  margin-top: 15px;
}
.service-card-title .mbl_res {
  width: 45%;
}
input.font-weight-bolder {
  margin-right: 10px;
}
input[type='file'] {
  display: none;
}
.hide_file {
  padding: 10px;
  background: gold;
  display: table;
  color: #123c3d;
  height: 40px;
  margin: 20px 0;
  border-radius: 5px;
  cursor: pointer;
}
.title_feild {
  display: flex;
  width: 55%;
  flex-flow: column;
}
@media (max-width: 1440px) {
  #user-profile .nav.nav-tabs .nav-item .nav-link {
    padding: 0px 30px 15px;
  }
  #profile-info .top-m {
    margin-top: -5rem;
  }
  .card {
    padding: 15px;
  }
  /* #user-profile .service-card-title h2 {
    width: 50%;
  } */
  .service-card-title .mbl_res {
    width: 50%;
  }
  .btn {
    padding: 5px 10px;
  }
}
@media (max-width: 767.98px) {
  .card-body {
    padding: 0rem;
  }
  .service-card-title {
    flex-flow: column-reverse;
  }
  .service-card-title .mbl_res {
    display: flex;
    flex-flow: row;
    width: 45%;
  }
  #user-profile .service-card-title h2 {
    width: 100%;
    margin: 20px 0 0;
  }
  .btn {
    margin: 0 5px 10px !important;
    padding: 10px 10px;
  }
}
</style>
