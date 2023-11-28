<template>
  <div>
    <!-- Start -->
    <div
      :key="service.name"
      v-for="service in userServices"
      class="services-wrapper"
    >
      <h5 class="font-weight-bolder" style="opacity: 0.5"></h5>
      <div class="card">
        <div class="card-content">
          <!--<img class="card-img-top img-fluid" src="../../../app-assets/images/slider/06.jpg" alt="Card image cap">-->
          <div class="">
            <div class="service-card-title">
              <h2 class="font-weight-bolder">
                {{ service.name }}
                <input type="hidden" v-model="service.price" />
              </h2>
              <div class="mbl_res">
                <button
                  class="btn btn-cancel"
                  v-show="service.edit"
                  v-on:click="cancelServices(service)"
                >
                  <i class="feather icon-x mr-50"></i>Cancel
                </button>
                <button
                  class="btn btn-update"
                  v-show="service.edit"
                  v-on:click="saveServices(service)"
                >
                  <i class="feather icon-check mr-50"></i>Update
                </button>
                <button
                  class="btn btn-danger"
                  v-show="service.delete"
                  v-on:click="deleteServices(service)"
                >
                  <i class="feather icon-delete mr-50"></i>Delete
                </button>
                <button
                  class="btn btn-edit"
                  v-show="!service.edit"
                  v-on:click="editServices(service)"
                >
                  <i class="feather icon-edit-1 mr-50"></i>Edit
                </button>
              </div>
            </div>
            <p class="card-text my-2" v-show="!service.delete">
              {{ service.description }}
            </p>
            <textarea
              class="form-control detail"
              v-model="service.description"
              v-show="service.edit"
            >
              { service.detail }</textarea
            >
            <div class="btn-with-price" v-show="!service.edit">
              {{ service.price }}$
            </div>
            <input
              type="text"
              class="form-control price"
              v-model="service.price"
              v-show="service.edit"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="alert alert-info mt-2" v-if="options.length !== 0">
      You have {{ options.length }} service remaining!
    </div>
    <div class="alert alert-danger mt-2" v-if="options.length === 0">
      Sorry, you can't add more service!
    </div>
    <div class="w-100 text-center">
    <router-link
      :to="{ name: 'AddProfileService' }"
      v-if="options.length !== 0"
    >
      <button class="col-lg-4 add-new">+ Add New Service</button>
    </router-link>
  </div>

    <!---End -->
  </div>
</template>

<script type="javascript">
import profileService from '../../../../../services/profile.service';
import UserServiceList from '../../../../../services/user.service';
import axios from '../../../../../api/BaseURL';
import authHeader from '../../../../../services/auth-header';
import Swal from 'sweetalert2';
export default {
  name: 'servicesDetals',
  async created() {
    await profileService.getActiveService().then(res => {
      if (res.success === true) {
        this.userServices = res.data;
        console.log(this.userServices);
      }
    });
    await UserServiceList.getUserServiceList().then(res => {
      // console.log(res.data);
      if (res.data.success === true) {
        this.options = res.data.data['service-list'];
        console.log(this.options.length);
      }
    });
  },
  data() {
    return {
      serviceList: [''],
      options: [],
      userServices: [
        {
          name: '',
          description: '',
          price: '',
          edit: false,
          delete: false,
        },
      ],
      message: '',
    };
  },
  computed: {
    services2: function () {
      var _services = [];
      for (var i = 0, services; (services = this.userServices[i]); i++) {
        services.edit = false;
        _services.push(services);
      }
      return _services;
    },
  },
  methods: {
    editServices: function (services) {
      this._originalServices = Object.assign({}, services);
      services.edit = true;
      services.delete = true;
      UserServiceList.getUserServiceList().then(res => {
        if (res.success === true) {
          this.userServiceList = res.data;
          console.log(this.userServiceList);
        }
      });
    },
    cancelServices: function (services) {
      Object.assign(services, this._originalServices);
      services.edit = false;
      services.delete = false;
    },
    saveServices: function (services) {
      axios
        .put(
          '/my-service/update',
          {
            id: services.id,
            price: services.price,
            description: services.description,
          },
          { headers: authHeader() },
        )
        .then(res => {
          console.log(res);
          this.message = res.data.message;
          if (res.data.status === 200) {
            services.edit = false;
            services.delete = false;
            this.$moshaToast(this.message, {
              position: 'top-right',
              showIcon: 'true',
              type: 'success',
              hideProgressBar: 'false',
              timeout: 5000,
              swipeClose: 'false',
            });
          }
        })
        .catch(err => {
          this.progress = 0;
          this.message = 'Update failed! ' + err.response.data.message;
          console.log(this.message);
          this.$moshaToast(this.message, {
            position: 'top-right',
            showIcon: 'true',
            type: 'danger',
            hideProgressBar: 'false',
            timeout: 5000,
            swipeClose: 'false',
          });
        });
    },
    deleteServices: function (services) {
      if (services.id) {
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
            console.log(services.id);
            location.reload();
            axios
              .delete('/my-service/delete', {
                // headers: {
                //   'x-access-token': JSON.parse(localStorage.getItem('user')).token
                //   },
                headers: authHeader(),

                data: {
                  id: services.id,
                },
              })
              .then(res => {
                console.log(res);
                this.message = res.data.message;
                if (res.data.status === 200) {
                  services.edit = false;
                  this.$moshaToast(this.message, {
                    position: 'top-right',
                    showIcon: 'true',
                    type: 'success',
                    hideProgressBar: 'false',
                    timeout: 5000,
                    swipeClose: 'false',
                  });
                }
              })
              .catch(err => {
                this.progress = 0;
                this.message = 'Update failed! ' + err.response.data.message;
                console.log(this.message);
                this.$moshaToast(this.message, {
                  position: 'top-right',
                  showIcon: 'true',
                  type: 'danger',
                  hideProgressBar: 'false',
                  timeout: 5000,
                  swipeClose: 'false',
                });
              });
          }
        });
      }
    },
  },
};
</script>

<style type="text/css" scoped>
.services-wrapper .name {
  font-size: 1.74rem;
  font-weight: bolder;
  opacity: 0.7;
  width: 70%;
  margin: 0px 30px 30px 0px;
}
.services-wrapper .detail {
  min-height: 150px;
  margin-bottom: 30px;
  font-size: 16px;
  color: #123c3d;
  font-weight: 400;
}
.services-wrapper .price {
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
  margin: 0 0.5rem 0.5rem !important;
  padding: 1rem;
}
.btn-update {
  background: #ffd700;
  color: #000000;
  margin: 0 0.5rem 0.5rem !important;
  padding: 1rem;
}
.btn-danger {
  margin: 0 0.5rem !important;
  padding: 1rem;
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
.service-card-title .font-weight-bolder {
  width: 100%;
  display: flex;
}
.service-card-title .mbl_res {
  width: 45%;
  display: flex;
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
    font-size: 1.2rem;
  }
  .btn {
    margin: -1rem 4px 10px !important;
    padding: 5px 5px;
    height: 2rem;
  }
}
</style>
