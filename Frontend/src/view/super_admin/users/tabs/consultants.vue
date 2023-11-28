<template>
  <div class="row">
    <div class="col-lg-9">
      <div class="table-responsive">
        <table id="datatable4">
          <thead>
            <tr>
              <th class="pic">ID</th>
              <th class="case">Case</th>
              <th class="name d-none">State</th>
              <th class="action">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="TR d-flex justify-content-between"
              v-for="user in consultants.data"
              :key="user.id"
            >
              <td>
                <img
                  v-if="!user.profile_image_path"
                  class="imgAvatar"
                  src="https://i.pinimg.com/736x/b9/cf/b8/b9cfb82fb98e5805d62c07bf8c707330.jpg"
                  alt="img"
                />
                <img
                  v-if="user.profile_image_path"
                  class="imgAvatar"
                  :src="baseImg + user.profile_image_path"
                  alt="img"
                />
                <router-link :to="'/cpanel/user/' + user.user_id">
                  <span>
                    <b>{{ user.first_name + ' ' + user.last_name }}</b>
                  </span>
                </router-link>
              </td>
              <td class="center">
                <span>Total Case: <b>24</b></span>
              </td>
              <td class="d-none">State: {{ user.state_name }}</td>
              <td class="justify_end">
                <router-link :to="'/messages/' + user.user_id" tag="button">
                  <div class="chatIcon">
                    <i class="feather icon-message-circle"></i>
                  </div>
                </router-link>
                <button class="chatIcon" @click="confirmDelete(user.user_id)">
                  <i class="feather icon-trash-2"></i>
                </button>
                <div class="mx-1">
                  <div
                    class="custom-control custom-switch custom-control-inline"
                  >
                    <input
                      v-if="user.status === 1"
                      type="checkbox"
                      class="custom-control-input"
                      checked
                      :id="user.user_id"
                      @input="changeStatus(user.user_id)"
                    />
                    <input
                      v-if="user.status === 2"
                      type="checkbox"
                      class="custom-control-input"
                      :id="user.user_id"
                      @input="changeStatus(user.user_id)"
                    />
                    <label
                      class="custom-control-label"
                      :for="user.user_id"
                    ></label>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="col-lg-3">
      <div class="filterContainer">
        <form>
          <div class="col-12 py-1 px-0">
            <i class="feather icon-filter"></i>
            <label>Filter</label>
          </div>

          <div class="box row mx-0">
            <div class="col-8 px-0">
              <p>Location</p>
            </div>
            <div class="col-4 px-0 text-right">
              <button class="resetBtn" @click.prevent="resetLocation">
                Clear
              </button>
            </div>
            <div class="col-12 px-0">
              <Multiselect
                v-model="locationState.value"
                v-bind="locationState"
                :searchable="true"
                :close-on-select="true"
                :clear-on-select="false"
                :canClear="false"
                @select="updateState(locationState.value)"
                :option="this.locationState.options"
              />
            </div>
          </div>

          <div class="box">
            <p>Cases Solved</p>
            <div class="col-12 px-0">
              <vue-slider
                v-model="value"
                :min="0"
                :max="1000"
                :interval="1"
                :enable-cross="false"
              ></vue-slider>
            </div>
            <div class="col-12 px-0 pt-1">
              <div class="row">
                <div class="col-6">
                  <input
                    type="number"
                    class="form-control"
                    :value="value[0]"
                    @input="value[0] = $event.target.value"
                  />
                </div>
                <div class="col-6">
                  <input
                    type="number"
                    class="form-control"
                    :value="value[1]"
                    @input="value[1] = $event.target.value"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="box">
            <p>Rating</p>
            <div class="col-12 px-0">
              <star-ratings
                starSize="32"
                :showControl="false"
                v-model="rating"
                :numberOfStars="5"
                controlSize="0"
                :step="1"
              />
            </div>
          </div>

          <div class="d-flex justify-content-lg-end">
            <button @click.prevent="resetLocation" class="resetBtn">
              Reset
            </button>
            <button class="applyBtn">Apply</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
 
<script>
// import 'jquery/dist/jquery.min.js';
// import 'datatables.net-dt/js/dataTables.dataTables';
import $ from 'jquery';
import userAPI from '../../../../services/user.API';
import Swal from 'sweetalert2';
import { createToast } from 'mosha-vue-toastify';
//range slider
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';
import Multiselect from '@vueform/multiselect';
import Vue3StarRatings from 'vue3-star-ratings';

export default {
  components: {
    'star-ratings': Vue3StarRatings,
    'vue-slider': VueSlider,
    Multiselect,
  },
  mounted() {
    userAPI.getAllUserAccessList().then(res => {
      if (res.data.data.map(e => e.role_id === 4)) {
        this.consultants = res.data.data.filter(e => e.role_id === 4)[0];
        this.baseImg = this.consultants && this.consultants.imageFolderPath;

        let locationState = this.consultants.data.map(e => e.state_name);
        this.locationState.options = [...new Set(locationState.flat())];
      }
      setTimeout(() => {
        $('#datatable4').DataTable({
          lengthMenu: [
            [5, 10, 25, 50, -1],
            [5, 10, 25, 50, 'All'],
          ],
          pageLength: 10,
          info: false,
          language: {
            paginate: {
              next: '<i class="fa fa-angle-right  btn-primary btn-sm"></i>',
              previous:
                '<i class="fa fa-angle-left btn btn-primary btn-sm"></i>',
              last: '<i class="fa fa-angle-double-right  btn-primary btn-sm"></i>',
              first:
                '<i class="fa fa-angle-double-left  btn-primary btn-sm"></i>',
            },
          },
          bLengthChange: false,
        });
      });
    });
  },
  data: function () {
    return {
      consultants: [],
      baseImg: '',
      rating: 2.5,
      filterData: {
        // services: [
        //   {
        //     id: 4,
        //     name: 'Case Advisor / Concierge',
        //     selected: false,
        //   },
        //   {
        //     id: 3,
        //     name: 'Treatment Planning Software',
        //     selected: false,
        //   },
        //   {
        //     id: 1,
        //     name: 'Aligner Fabrication',
        //     selected: false,
        //   },
        //   {
        //     id: 2,
        //     name: 'Case Monitoring',
        //     selected: false,
        //   },
        // ],
        location: [],
        cases_solved: [],
        // rating: [],
      },
      range: { min: '', max: '' },
      value: [100, 200],
      locationState: {
        // mode: 'single',
        value: '',
        placeholder: 'Search Location',
        search: true,
        trackBy: 'name',
        label: 'name',
        options: [],
      },
    };
  },
  methods: {
    confirmDelete(userID) {
      if (userID) {
        Swal.fire({
          title: 'Do you want to Delete this user?',
          icon: 'warning',
          // showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Yes, Delete It!',
          // denyButtonText: `Don't save`,
          confirmButtonColor: 'red',
          denyButtonColor: '#123c3d',
          cancelButtonColor: 'red',
        }).then(result => {
          if (result.isConfirmed) {
            userAPI.deleteUser(userID).then(res => {
              console.log(res);
              if (res.data.success === true) {
                let removingData = this.consultants.data.findIndex(
                  e => e.user_id === userID,
                );
                console.log(removingData);
                if (removingData > -1) {
                  this.consultants.data.splice(removingData, 1);
                }
                createToast('Successfully Deleted!', {
                  position: 'top-right',
                  type: 'success',
                  transition: 'bounce',
                  showIcon: 'true',
                  timeout: 2000,
                });
              }
            });
          } else if (result.isDenied) {
            createToast('Deletion canceled', {
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

    changeStatus(userID) {
      if (userID) {
        Swal.fire({
          title: 'Do you want to change Active Status?',
          icon: 'warning',
          showDenyButton: true,
          // showCancelButton: true,
          confirmButtonText: 'Yes, Change it',
          denyButtonText: `Cancel`,
          confirmButtonColor: 'red',
          denyButtonColor: '#123c3d',
        }).then(result => {
          if (result.isConfirmed) {
            userAPI.changeUserStatus(userID).then(
              res => {
                if (res.data.success == true) {
                  createToast(res.data.message, {
                    position: 'top-right',
                    type: 'success',
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
          } else if (result.isDenied) {
            location.reload();
          }
        });
      }
    },

    // update user method
    updateState(value) {
      if (value) {
        $('#datatable4').DataTable().column(2).search(value).draw();
      }
    },
    resetLocation() {
      $('#datatable4').DataTable().column(2).search('').draw();
    },
  },
};
</script>

<style scoped>
table#datatable4 {
  width: 100% !important;
}
tr.TR.odd,
tr.TR.even {
  background: #ffffff;
  box-shadow: 0px 2px 3px #00000029;
  border-radius: 9px;
  margin: 15px 0;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
table#datatable4 {
  border-bottom: none;
  border: none;
}
img.imgAvatar {
  width: 50px;
  height: 50px;
  border-radius: 9px;
  /* padding: 5px; */
  background: #ffffff;
  box-shadow: 0px 3px 6px #00000029;
}
#datatable4 thead {
  display: none;
}
#datatable4 td {
  align-items: center;
  display: flex;
  width: 30%;
}
#datatable4 span {
  color: #131313;
  font-size: 16px;
  /* font-weight: bold; */
  margin-left: 20px;
  text-transform: capitalize;
}
.chatIcon {
  background: #123c3d;
  border: 1px solid #123c3d;
  border-radius: 50%;
  color: white;
  height: 35px;
  width: 35px;
  cursor: pointer;
  margin: auto 5px;
}
td.justify_end {
  justify-content: end;
}
td.center {
  justify-content: center;
}
#datatable4 .icon-message-circle {
  content: '\e890';
  font-size: 20px;
  margin-top: 6px;
  position: absolute;
  margin-left: 8px;
}
.chatIcon:hover {
  background: #ffd700;
  color: #123c3d;
}

.custom-control-input:checked ~ .custom-control-label::before {
  color: #ffd700;
  border-color: #184b4c;
  background-color: #bebebe;
}
.custom-switch .custom-control-input:checked ~ .custom-control-label::after {
  background-color: #123c3d;
}
.dataTables_wrapper .dataTables_filter input:focus-visible {
  outline: none;
}

.dataTables_wrapper .dataTables_paginate .paginate_button.current,
.dataTables_wrapper .dataTables_paginate .paginate_button.current:hover {
  color: #333 !important;
  border: 1px solid #979797;
  background-color: white;
  background: linear-gradient(to bottom, #e11313 0%, #901c1c 100%);
}
/* Filter Starts */
.filterContainer {
  background: #b9d0d2;
  border-radius: 10px;
  width: 20%;
  padding: 10px 20px;
  margin: -15px 0px;
  height: 89%;
  position: fixed;
  top: 90px;
  right: 20px;
}
.filterContainer p {
  font-size: 12px;
  font-weight: bold;
  color: #000000;
  padding: 15px 0 0 0;
}
.filter input {
  background: #f0f1f1;
  border-radius: 10px;
  height: auto;
  margin-bottom: 10px;
}
/* .filter select.form-control:not([multiple="multiple"]){

} */
#service,
#status {
  background: #f0f1f1;
  border-radius: 10px;
  height: auto;
  margin-bottom: 10px;
}
.filterContainer .box {
  background: #ffffff;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 10px;
  padding: 5px 20px 25px;
  width: 100%;
  margin-bottom: 10px;
  font-weight: normal;
}
.filterContainer .box label {
  font-size: 12px;
  letter-spacing: 0px;
  color: #000000;
  font-family: 'Poppins';
}
.resetBtn {
  background: #ffffff;
  box-shadow: 0px 1px 3px #00000029;
  border-radius: 10px;
  margin: 5px;
  padding: 5px 15px;
  font: normal normal normal 13px/20px Poppins;
  color: #ff0000;
  border: 1px solid #fff;
}
.applyBtn {
  background: #123c3d;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 10px;
  margin: 5px;
  padding: 5px 15px;
  font: normal normal medium 13px/20px Poppins;
  letter-spacing: 0px;
  color: #ffffff;
  text-transform: uppercase;
  border: 1px solid #123c3d;
}
input#search .form-control:focus {
  border-color: #c9d3d4 !important;
}
.filter input {
  background: #f0f1f1;
  border-radius: 10px;
  height: auto;
  margin-bottom: 10px;
}
.filterContainer .filterPart label {
  margin: 5px;
  font-weight: normal !important;
  width: 100% !important;
}
.filterContainer label {
  color: black;
  font-weight: bold;
}
i.feather.icon-filter {
  color: black;
  font-weight: bold;
}
/* Filter End */
.vue3-star-ratings__wrapper {
  display: block;
  margin: 0 auto;
  text-align: center;
  padding: 5px;
}
</style>