<template>
  <div>
    <!-- Container Fluid-->

    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="col-lg-9 content-wrapper">
        <div class="row">
          <div class="col-lg-6 col-sm-12 d-flex">
            <h1 class="text-bold-700 mb-0 headerTXT pl-1">Add New Training</h1>
          </div>
          <div class="col-lg-6 col-sm-12 text-right">
            <router-link :to="{ name: 'userProfile', params: { id: id } }">
              <button type="submit" class="update__btn clrRed mr-2">
                <i class="fa fa-backward"></i>
                Back
              </button>
            </router-link>
            <button class="createBtn" @click="onSubmit">
              <i class="fa fa-check"></i>
              Create
            </button>
          </div>
          <div class="col-12">
            <hr />
          </div>
        </div>
        <div class="col-sm-12 col-lg-12">
          <form id="saveUpdatedProfile">
            <div class="row">
              <div class="col-6">
                <label for="service_id">Title</label>
                <span class="required" data-v-2d91736a=""> *</span>
                <input
                  type="text"
                  class="form-control"
                  id="title"
                  placeholder="Title"
                  v-model="training.title"
                  @blur="validate('title')"
                  @keypress="validate('title')"
                />
                <p class="form-input-hint" v-if="!!errors.title">
                  {{ errors.title }}
                </p>
              </div>
              <div class="col-6">
                <label for="document">File</label>
                <input
                  type="file"
                  class="form-control file-upload"
                  id="document"
                  placeholder="File"
                  ref="file"
                  @change="selectImage()"
                  @blur="validate('document')"
                  @keypress="validate('document')"
                />
                <p class="form-input-hint" v-if="!!errors.document">
                  {{ errors.document }}
                </p>
              </div>
              <div class="col-12 ds mt-2">
                <label for="description">Description</label>
                <span class="required" data-v-2d91736a=""> *</span>
                <br />
                <textarea
                  type="text"
                  class="form-control"
                  id="description"
                  placeholder="Description"
                  v-model="training.description"
                  @blur="validate('description')"
                  @keypress="validate('description')"
                >
                </textarea>
                <p class="form-input-hint" v-if="!!errors.description">
                  {{ errors.description }}
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!---Container Fluid-->
  </div>
</template>

<script>
import profileService from '../../../services/profile.service';
import trainingAPI from '../../../services/training.API';
import { createToast } from 'mosha-vue-toastify';
import { object, string, mixed } from 'yup';

export default {
  name: 'AddProfileTraining',
  data() {
    const schema = object().shape({
      // schema
      title: string()
        .required('Title is required')
        .min(2, 'Title must be at least 2 characters')
        .max(50, 'Title must be less than 50 characters'),
      description: string()
        .required('Description is required')
        .min(20, 'Description must be at least 20 characters')
        .max(500, 'Description must be less than 500 characters'),
      document: mixed()
        .test('type', 'The file must be in pdf/jpg/jpeg/png format', value => {
          return (
            value &&
            (value.type === 'image/jpeg' ||
              value.type === 'image/png' ||
              value.type === 'image/jpg' ||
              value.type === 'application/pdf')
          );
        })
        .default(null),
    });

    return {
      schema,
      id: '',
      training: {
        title: '',
        description: '',
        document: '',
      },
      errors: {
        title: null,
        description: null,
        document: null,
      },
    };
  },
  methods: {
    // validate
    validate(field) {
      this.schema
        .validateAt(field, this.training)
        .then(() => {
          this.errors[field] = '';
        })
        .catch(err => {
          this.errors[field] = err.message;
        });
    },

    // selectImage
    selectImage() {
      const file = this.$refs.file.files.item(0);
      console.log(file.type);
      this.training.document = file;
    },
    onSubmit() {
      if (this.training.title === '') {
        this.errors.title = 'Title is required';
      }
      if (this.training.description === '') {
        this.errors.description = 'Description is required';
      }
      if (this.training.title && this.training.description) {
        trainingAPI.trainingAdd(this.training).then(
          res => {
            if (res.data.success == true) {
              this.$router.push('/profile/user');
              createToast(res.data.message, {
                position: 'top-right',
                type: 'success',
                transition: 'bounce',
                showIcon: 'true',
                timeout: 2000,
              });
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
          error => {
            if (error.response.data.success == false) {
              createToast(error.response.data.message, {
                position: 'top-right',
                type: 'danger',
                transition: 'bounce',
                showIcon: 'true',
                timeout: 2000,
              });
            }
          },
        );
      } else {
        createToast('Please fill all the fields', {
          position: 'top-right',
          type: 'danger',
          transition: 'bounce',
          showIcon: 'true',
          timeout: 2000,
        });
      }
    },
  },
  mounted() {
    // get user id
    profileService.getUser().then(res => {
      if (res.role) {
        this.role_id = res.role.role_id;
      }
    });
  },
};
</script>

<style scoped>
.form-input-hint {
  color: red;
  margin: 5px;
}
.dentist p {
  margin-top: 3px;
  margin-left: 3px;
  font-size: 15px;
  font: normal normal bold 15px/30px Poppins;
  letter-spacing: 0px;
  color: #000000;
}
.dentist h6 {
  font-size: 12px !important;
  font: normal normal small 10px/15px Poppins;
  color: #707070;
}
@media only screen and (max-width: 2100px) and (min-width: 1650px) {
  .avatar-upload .avatar-edit input + label {
    display: inline-block;
    width: 34px;
    height: 34px;
    margin-bottom: 0;
    margin-top: -5px;
    border-radius: 100%;
    background: #123c3d;
    border: 1px solid transparent;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
    cursor: pointer;
    font-weight: normal;
    transition: all 0.2s ease-in-out;
  }
  .avatar-upload .avatar-edit input + label:after {
    content: '\F030';
    font-family: 'FontAwesome';
    color: #fff;
    position: absolute;
    top: 5px;
    left: 0;
    right: 0;
    text-align: center;
    margin: auto;
  }
  .avatar-upload .avatar-edit {
    position: absolute;
    right: -5px;
    z-index: 1;
    top: 25px;
  }
}
@media only screen and (max-width: 1649px) and (min-width: 768px) {
  .avatar-upload .avatar-edit input + label {
    display: inline-block;
    width: 35px;
    height: 35px;
    margin-bottom: 0;
    margin-top: -5px;
    border-radius: 100%;
    background: #123c3d;
    border: 1px solid transparent;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
    cursor: pointer;
    font-weight: normal;
    transition: all 0.2s ease-in-out;
  }
  .avatar-upload .avatar-edit input + label:after {
    content: '\F030';
    font-family: 'FontAwesome';
    color: #fff;
    position: absolute;
    top: 5px;
    left: 0;
    right: 0;
    text-align: center;
    margin: auto;
  }
  .avatar-upload .avatar-edit {
    position: absolute;
    right: -5px;
    z-index: 1;
    top: 30px;
  }
}

.avatar-upload {
  position: relative;
  max-width: 200px;
  margin: 10px auto;
  margin-top: 30px;
}

.avatar-upload .avatar-edit input {
  display: none;
}
.avatar-upload .avatar-preview {
  width: 192px;
  height: 192px;
  position: relative;
  border-radius: 20px;
  border: 0px solid #ececec;
  box-shadow: 0px 2px 10px 3px rgb(0 0 0 / 10%);
}

.avatar-upload .avatar-preview > div {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.update__btn {
  margin-left: 5px;
  background: #123c3d ;
  box-shadow: none;
  border-radius: 5px;
  padding: 10px 20px;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  font-family: poppins;
  letter-spacing: 0px;
  color: #ffffff;
  opacity: 1;
  border: 1px solid #123c3d;
  cursor: pointer;
}
.backBtn {
  padding: 15px 20px;
  background: #00797b;
  border: 1px solid #00797b;
  color: #00e2f2;
  box-shadow: none;
  border-radius: 5px;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  font-family: poppins;
  opacity: 1;
  cursor: pointer;
}
.backBtn:hover {
  background: #ffcc3f;
  color: #123c3d;
  border: 1px solid #ffcc3f;
}
.update__btn:hover {
  background: #ffcc3f;
  color: #123c3d;
  border: 1px solid #ffcc3f;
}
.inputFocus {
  font-size: 15px;
  font: normal normal bold 15px/30px Poppins;
  color: #000000;
  border: none;
  margin-top: 20px;
  font-size: 16px;
  display: block;
  box-sizing: border-box;
  width: 100%;
  bottom: 0px;
}
.inputFocus {
  margin-left: 10px;
  position: relative;
  border: 1px solid #bcbaba;
  height: 40px;
  padding-left: 12px;
  margin-top: 10px;
}
.inputFocus:focus {
  height: 50px !important;
  outline: none;
}
/* .card {
  padding: 20px;
} */
/* .card-body {
  padding: 20px;
} */
@media only screen and (max-width: 565px) {
  .headerTXT {
    text-align: center;
    margin: 30px !important;
  }
}

* {
  box-sizing: border-box;
}

:root {
  --primary-color: #0071fe;
  --error-color: #f23648;
  --error-bg-color: #fddfe2;
  --success-color: #21a67a;
  --success-bg-color: #e0eee4;
}

html,
body {
  width: 100%;
  height: 100%;
}

#EditDentistProfile {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;

  width: 100%;
  height: 100%;
}

form {
  /* width: 300px; */
  margin: 0px auto;
  /* padding-bottom: 60px; */
}

.submit-btn {
  background: var(--primary-color);
  outline: none;
  border: none;
  color: #fff;
  font-size: 18px;
  padding: 10px 15px;
  display: block;
  width: 100%;
  border-radius: 7px;
  margin-top: 40px;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
}

.submit-btn:hover {
  transform: scale(1.1);
}
.text-right {
  float: right;
}
p.help-message {
  color: red !important;
}

.backBtn {
  background: #123c3d ;
  border-radius: 10px;
  padding: 10px 15px;
}

div#vs11-combobox {
  position: relative;
  background: #ffffff ;
  border: 1px solid #c1c1c1;
  border-radius: 10px;
  height: 30px;
  padding-left: 12px;
  margin-top: 10px;
  width: 100%;
}
.ds input.descriptionField {
  width: 100%;
  min-height: 130px;
}
input {
  position: relative;
  background: #ffffff ;
  border: 1px solid #c1c1c1;
  border-radius: 10px;
  height: 50px;
  padding-left: 12px;
  margin-top: 10px;
  width: 100%;
}
input:focus,
input:active {
  border: 1px solid #c1c1c1;
}
label {
  text-align: left;
  font-family: Poppins;
  letter-spacing: 0px;
  color: #707070;
}

.headerTXT {
  margin: 3px 0 !important;
}
.createBtn {
  background: #ffd700 ;
  border: 1px solid #ffd700;
  border-radius: 10px;
  text-align: center;
  padding: 10px 30px;
  color: #000000;
  font-size: 14px;
  font-weight: bold;
}

select {
  position: relative;
  background: #ffffff ;
  border: 1px solid #c1c1c1;
  border-radius: 10px;
  height: 50px;
  padding-left: 12px;
  margin-top: 10px;
  width: 100%;
}
</style>
