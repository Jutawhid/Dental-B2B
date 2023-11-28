<template>
  <div>
    <!-- Container Fluid-->

    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="col-lg-9 content-wrapper">
        <div class="row">
          <div class="col-lg-6 col-sm-12 d-flex">
            <router-link :to="{ name: 'userProfile' }">
              <button class="backBtn">
                <i class="fa fa-chevron-left"></i>
              </button>
            </router-link>
            <h1 class="text-bold-700 mb-0 headerTXT pl-1">Add New Service</h1>
          </div>
          <div class="col-lg-6 col-sm-12 text-right">
            <!-- <a href="/dentist/profile"> -->
            <button class="createBtn" @click="onSubmit">
              <i class="fa fa-check"></i>
              Create
            </button>
            <!-- </a> -->
          </div>
          <div class="col-12">
            <hr />
          </div>
        </div>
        <div class="col-sm-12 col-lg-12">
          <Form :validation-schema="schema" id="saveUpdatedProfile">
            <div class="row">
              <div class="col-6">
                <label for="service">Select Service</label>
                <Field
                  name="selected_service"
                  as="select"
                  v-model="service.selected_service"
                >
                  <option value="" disabled>Select Service</option>
                  <option v-for="list in options" :value="list" :key="list.id">
                    {{ list.name }}
                  </option>
                </Field>
                <ErrorMessage name="selected_service" />
              </div>
              <div class="col-6">
                <label for="price">Price (in USD)</label>
                <Field name="price" type="text" v-model="service.price"></Field>
                <ErrorMessage name="price" />
              </div>
              <div class="col-12 ds mt-2">
                <label for="description">Description</label><br />
                <Field
                  name="description"
                  type="text"
                  class="descriptionField"
                  v-model="service.description"
                ></Field>
                <ErrorMessage name="description" />
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>

    <!---Container Fluid-->
  </div>
</template>

<script>
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import UserServiceList from '../../../services/user.service';
export default {
  name: 'UpdateProfileService',
  components: {
    Form,
    Field,
  },
  setup() {
    // Using yup to generate a validation schema
    const schema = Yup.object().shape({
      description: Yup.string().max(180).required(),
      selectedService: Yup.string().required(),
      price: Yup.string().required('This is required field'),
    });

    return {
      schema,
    };
  },
  created() {
    UserServiceList.getUserServiceList().then(res => {
      // console.log(res.data);
      if (res.data.success === true) {
        this.options = res.data.data['service-list'];
        // console.log(this.options);
      }
    });
  },
  data() {
    return {
      options: [],
      service: {
        selectedService: null,
        price: null,
        description: null,
      },
    };
  },
  methods: {
    onSubmit() {
      // alert('hi');
      UserServiceList.addService(this.service, event => {
        this.progress = Math.round((100 * event.loaded) / event.total);
      })
        .then(res => {
          console.log(res.data);
          if (res.success === true) {
            this.$router.push({ name: 'userProfile' });
          }
        })
        .then(response => {
          console.log(response);
        });
      // console.log(service);
    },
  },
};
</script>

<style scoped>
/* .form-control {
  height: calc(2.25em + 1.4rem + 1px) !important;
} */
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
