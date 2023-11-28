<template>
  <div class="col-lg-12 px-0">
    <!-- 1st Section -->
    <Form @submit="onSubmit" id="saveForm">
      <div class="row">
        <div class="col-lg-6 col-sm-6">
          <label for="case_type" class="mb-1">Case Type</label>
          <select
            class="form-control"
            v-model="patient.case_type"
            :class="{ 'is-invalid': !!errors.case_type }"
            @blur="validate('case_type')"
            @keypress="validate('case_type')"
          >
            <option value="" disabled>Select Case Type</option>
            <option
              v-for="(caseID, index) in caseTypes"
              :value="caseID.id"
              :key="index"
            >
              {{ caseID.title }}
            </option>
          </select>
          <p class="form-input-hint" v-if="!!errors.case_type">
            {{ errors.case_type }}
          </p>
        </div>
        <div class="col-lg-6 col-sm-6">
          <label for="patient_name" class="mb-1">Patient Age</label>
          <input
            type="number"
            class="form-control"
            :class="{ 'is-invalid': !!errors.patient_age }"
            placeholder="ex. 25"
            v-model="patient.age"
            @blur="validate('age')"
            @keypress="validate('age')"
          />
          <p class="form-input-hint" v-if="!!errors.age">
            {{ errors.age }}
          </p>
        </div>
        <div class="col-lg-12 mt-2">
          <label for="patient_name" class="mb-1">Patient Name</label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': !!errors.patient_name }"
            placeholder="ex. John Doe"
            v-model="patient.name"
            @blur="validate('name')"
            @keypress="validate('name')"
          />
          <p class="form-input-hint" v-if="!!errors.name">
            {{ errors.name }}
          </p>
        </div>
        <div class="col-lg-12">
          <label for="patient_address" class="pt-2 mb-1">Patient Address</label>
          <textarea
            type="text"
            class="form-control"
            id="address"
            placeholder="Enter Patient Address"
            :class="{ 'is-invalid': !!errors.patient_address }"
            v-model="patient.address"
            @blur="validate('address')"
            @keypress="validate('address')"
          >
          </textarea>
          <p class="form-input-hint" v-if="!!errors.address">
            {{ errors.address }}
          </p>
        </div>
      </div>
    </Form>
  </div>

  <!---Container Fluid-->
</template>


<script>
import { Form } from 'vee-validate';
import { object, string } from 'yup';
import caseAPI from '../../../../services/case.API';
import { createToast } from 'mosha-vue-toastify';
export default {
  name: 'CaseEditForm',
  components: {
    Form,
  },
  data() {
    const schema = object().shape({
      case_type: string().required('Case ID is required'),
      age: string().required('Age is required'),
      name: string()
        .min(3, 'Minimum limit 3 characters')
        .max(160, 'Maximum limit 160 characters')
        .required('Patient Name is required field'),
      address: string()
        .max(500, 'Maximum limit is 500 characters')
        .required('Address is required'),
    });
    return {
      schema,
      imgPath: '',
      patient: {
        case_type: '',
        age: '',
        name: '',
        address: '',
      },
      caseTypes: [],
      errors: {
        case_type: '',
        age: '',
        name: '',
        address: '',
      },
    };
  },
  methods: {
    // get case types
    getCaseTypes() {
      caseAPI.getCaseTypes().then(response => {
        this.caseTypes = response.data.data.map(e => {
          return {
            id: e.id,
            title: e.type,
          };
        });
      });
    },

    // form submit
    onSubmit() {
      if (this.patient.age === '') {
        this.errors.age = 'Age is required';
      }
      if (this.patient.name === '') {
        this.errors.name = 'Name is required';
      }
      if (this.patient.address === '') {
        this.errors.address = 'Address is required';
      }
      if (this.patient.case_type === '') {
        this.errors.case_type = 'Case Type is required';
      }
      // if matches all terms -> submit form
      if (
        this.patient.age &&
        this.patient.name &&
        this.patient.address &&
        this.patient.case_type
      ) {
        let userData = {
          id: this.case_id,
          case_type: this.patient.case_type,
          patient_age: this.patient.age,
          patient_name: this.patient.name,
          patient_address: this.patient.address,
        };
        caseAPI.updateCase(userData).then(
          response => {
            if (response.data.success === true) {
              createToast(response.data.message, {
                type: 'success',
                showIcon: true,
                position: 'top-right',
                timeout: 2000,
              });
              this.$router.push('/case/' + this.case_id);
            } else {
              createToast(response.data.message, {
                type: 'danger',
                showIcon: true,
                position: 'top-right',
                timeout: 2000,
              });
            }
          },
          err => {
            createToast(err.response.data.message, {
              type: 'danger',
              showIcon: true,
              position: 'top-right',
              timeout: 2000,
            });
          },
        );
      }
    },
    // validation
    validate(field) {
      this.schema
        .validateAt(field, this.patient)
        .then(() => {
          this.errors[field] = '';
        })
        .catch(err => {
          this.errors[field] = err.message;
        });
    },
  },
  mounted() {
    if (this.case_id) {
      // get case types
      this.getCaseTypes();

      // get case data
      caseAPI.getCaseDetails(this.case_id).then(
        response => {
          if (response.data.success === true) {
            this.patient.case_type = response.data.data.case_type_id;
            this.patient.age = response.data.data.patient_age;
            this.patient.name = response.data.data.patient_name;
            this.patient.address = response.data.data.patient_address;
          } else {
            this.$router.push('/case/' + this.case_id);
            createToast(response.data.message, {
              type: 'danger',
              showIcon: true,
              position: 'top-right',
              timeout: 2000,
            });
          }
        },
        err => {
          this.$router.push('/case/' + this.case_id);
          createToast(err.response.data.message, {
            type: 'danger',
            showIcon: true,
            position: 'top-right',
            timeout: 2000,
          });
        },
      );
    }
  },
  props: ['case_id'],
};
</script>

<style scoped>
.form-input-hint {
  color: red;
  margin: 5px;
}
.form-control:focus {
  color: #4e5154;
  background-color: #fff;
  border-color: #1f9d57;
  outline: 0;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.15);
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

.update__btn {
  margin-left: 5px;
  background: #123c3d;
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
  padding: 10px 20px;
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

.TextInput .help-message {
  font-size: 12px;
  margin: 5px 0px 0px 5px;
}

textarea.form-control {
  border: 1px solid #c1c1c1;
  border-radius: 10px;
  margin: 5px 0;
}
</style>