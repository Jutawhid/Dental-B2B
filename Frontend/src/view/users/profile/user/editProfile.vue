<template>
  <div>
    <div class="row">
      <div class="col-lg-6">
        <h4 class="font-weight-bolder">Basic Information</h4>
        <div class="row ml-0">
          <Form
            @submit="onSubmit"
            :validation-schema="schema"
            id="saveUpdatedProfile"
          >
            <div class="col-12 left-border">
              <div class="tab-info-group">
                <label for="full_name">Full Name</label>
                <Field
                  name="full_name"
                  type="text"
                  v-model="user.full_name"
                ></Field>
                <ErrorMessage name="full_name" />
              </div>
              <div class="tab-info-group">
                <label for="practice_name">Username</label>
                <Field
                  name="practice_name"
                  type="text"
                  v-model="user.practice_name"
                ></Field>
                <ErrorMessage name="practice_name" />
              </div>
              <div class="tab-info-group">
                <label for="email">Email</label>
                <Field name="email" type="email" v-model="user.email"></Field>
                <ErrorMessage name="email" />
              </div>
              <div class="tab-info-group">
                <label for="contact">Phone <small>(starts with 01)</small></label>
                <Field name="contact" type="text" v-model="user.contact"></Field>
                <ErrorMessage name="contact" />
              </div>
              <div class="tab-info-group">
                <label for="fax">Fax</label>
                <Field name="fax" type="text" v-model="user.fax"></Field>
                <ErrorMessage name="fax" />
              </div>
              <div class="tab-info-group">
                <label for="practice_address">Address</label>
                <Field
                  name="practice_address"
                  type="text"
                  v-model="user.practice_address"
                ></Field>
                <ErrorMessage name="practice_address" />
              </div>
            </div>
          </Form>
        </div>
      </div>
      <div class="col-lg-6">
        <h4 class="font-weight-bolder">Payment Information</h4>
        <div class="row ml-0">
          <div class="col-12 left-border">
            <div class="tab-info-group">
              <div class="label">Credit Card</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
// import axios from "axios";
import userService from "../../../../services/user.service";
import userAPI from "../../../../services/user.API";
export default {
  name: "editLabProfile",
  components: {
    Form,
    Field,
    ErrorMessage: ErrorMessage,
  },
  created() {
    userService.getUserBoard().then(
      (response) => {
        if (response.data.data.professional_profile) {
          this.user = response.data.data.professional_profile;
          console.log(this.user);
        } else {
          this.user = {};
        }
      },
      (error) => {
        this.user =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      }
    );

    // this.user = response.data.data[0];

    // console.log(response.data.data[0]);
  },
  data() {
    const schema = yup.object({
      email: yup.string().required().email(),
      fullname: yup
        .string()
        .required()
        .min(3, "Must be atleast 3 characters")
        .max(100, "Not greater than 100 characters"),
      username: yup
        .string()
        .required()
        .min(3, "Must be atleast 3 characters")
        .max(16, "Not greater than 16 characters"),
      phone: yup
        .string()
        .required()
        .min(11, "Must be 11 digits")
        .max(11, "Must be 11 digits"),
      address: yup.string().required("Address is required field"),
      fax: yup
        .string()
        .required()
        .min(11, "Not less than 11 digits")
        .max(16, "Not greater than 16 digits"),
    });
    return {
      user: {},
      schema,
      isEditProfile: true,
    };
  },
  methods: {
    onSubmit(values) {
      // axios
      //   .post(
      //     "userprofile/update",
      //     {
      //       username: values.username,
      //       name: values.fullname,
      //       email: values.email,
      //       phone: values.phone,
      //       fax: values.fax,
      //       address: values.address,
      //     },
      //     {
      //       headers: {
      //         Authorization: "Bearer " + localStorage.getItem("token"),
      //       },
      //     }
      //   )
      //   .then((response) => {
      //     if (response.data.status === "error") {
      //       this.$swal({
      //         icon: "error",
      //         title: "Failed to update, Please Try again !",
      //       });
      //     } else {
      //       this.$swal({
      //         icon: "success",
      //         title: "Successfully Updated !",
      //       });
      //     }
      //   })
      //   .catch((e) => {
      //     console.log(e);
      //   });
      userAPI
        .updateUserProfile(values)
        .then((res) => {
          // console.log(res);
          if (res.data.success) {
            this.$moshaToast("Successfully updated !", {
              position: "top-right",
              showIcon: "true",
              hideProgressBar: "false",
              timeout: 2000,
              swipeClose: "false",
            });
          } else if (!res.data.success) {
            this.$moshaToast("Failed, Please try again", {
              position: "top-right",
              showIcon: "true",
              hideProgressBar: "false",
              timeout: 2000,
              swipeClose: "false",
            });
          }
        })
        .catch((error) => {
          // console.log(error.response);
          if (!error.response.data.success) {
            this.$moshaToast("Failed, Please try again", {
              position: "top-right",
              showIcon: "true",
              hideProgressBar: "false",
              timeout: 2000,
              swipeClose: "false",
            });
          }
        });
    },
  },
};
</script>

<style type="text/css" scoped>
.TextInput {
  position: relative;
  margin-bottom: calc(1em * 1.5);
  width: 100%;
}

label {
  display: block;
  margin-bottom: 4px;
  width: 100%;
}

input {
  border-radius: 5px;
  border: 2px solid transparent;
  padding: 15px 10px;
  outline: none;
  background-color: #f2f5f7;
  width: 100%;
  transition: border-color 0.3s ease-in-out, color 0.3s ease-in-out,
    background-color 0.3s ease-in-out;
}

input:focus {
  border-color: black;
}

.help-message {
  /* position: absolute; */
  bottom: calc(-1.5 * 1em);
  left: 0;
  margin: 0;
  font-size: 14px;
}

.TextInput.has-error input {
  border-color: red;
  background-color: var(--error-bg-color);
  color: red;
}

.TextInput.has-error input:focus {
  border-color: red;
}

.TextInput.has-error .help-message {
  color: red;
}

.TextInput.success input {
  border-color: var(--success-color);
  background-color: var(--success-bg-color);
  color: var(--success-color);
}

.TextInput.success input:focus {
  border-color: var(--success-color);
}

.TextInput.success .help-message {
  color: var(--success-color);
  margin-bottom: 10px;
}
.tab-info-group span {
  margin: 5px;
  color: red;
}
.tab-info-group input {
  margin-bottom: 10px;
}
</style>