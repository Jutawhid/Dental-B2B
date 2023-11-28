<template>
  <div class="row">
    <div class="col-lg-9">
      <div class="table-responsive">
        <table id="labTable">
          <thead>
            <tr>
              <th class="id">Image</th>
              <th class="name">Name</th>
              <!-- <th class="name d-none">Case</th> -->
              <th class="name d-none">State</th>
              <th class="name">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr class="TR d-flex" v-for="lab in labs.data" :key="lab.id">
              <!-- <td class="td_image">
              <img
                v-if="!lab?.profile_image"
                class="imgAvatar"
                src="https://i.pinimg.com/736x/b9/cf/b8/b9cfb82fb98e5805d62c07bf8c707330.jpg"
                alt="img"
              />
              <img
                v-if="lab?.profile_image"
                class="imgAvatar"
                :src="baseImg + '/' + lab.profile_image"
                alt="img"
              />
            </td>
            <td class="td_name col-lg-12 mt-2 mt-lg-0">
              
                <div class="d-flex flex-wrap">
                  <router-link :to="'/cpanel/user/' + lab.user_id">
                    <span>
                      <b>{{ lab.name }}</b>
                    </span>
                  </router-link>
                  <div class="justify_end mr-lg-2">
                    <star-ratings
                      starSize="15"
                      :id="'L' + lab.id"
                      :showControl="false"
                      v-model="rating"
                      :numberOfStars="5"
                      controlSize="0"
                      :step="0.5"
                      disableClick="true"
                    />
                  </div>
                </div>
                <div class="name">
                  <div class="d-flex flex-wrap col-12 px-0">
                    <span class="serviceDiv">Aligner Fabrication</span>
                    <span class="serviceDiv">Case Monitoring</span>
                    <span class="serviceDiv">Case Advisor / Concierge</span>
                  </div>
                </div>
            </td> -->
              <td class="d-flex justify-content-between col-lg-9">
                <div class="col-lg-10 px-0">
                  <div class="row">
                    <div class="col-lg-auto img align-items-center d-flex">
                      <img
                        v-if="!lab?.profile_image"
                        @error="replaceByDefaultProImage"
                        class="imgAvatar"
                        src="https://i.pinimg.com/736x/b9/cf/b8/b9cfb82fb98e5805d62c07bf8c707330.jpg"
                        alt="img"
                      />
                      <img
                        v-if="lab?.profile_image"
                        @error="replaceByDefaultProImage"
                        class="imgAvatar"
                        :src="baseImg + '/' + lab.profile_image"
                        alt="img"
                      />
                    </div>
                    <div class="col-lg-10 pt-1 mt-lg-0">
                      <div class="d-flex flex-wrap">
                        <router-link :to="'/cpanel/user/' + lab.user_id">
                          <span>
                            <b>{{ lab.name }}</b>
                          </span>
                        </router-link>
                        <star-ratings
                          starSize="15"
                          :id="'L' + lab.id"
                          :showControl="false"
                          v-model="rating"
                          :numberOfStars="5"
                          controlSize="0"
                          :step="0.5"
                          disableClick="true"
                        />
                      </div>
                      <div class="name">
                        <div
                          class="
                            d-flex
                            flex-wrap flex-lg-nowrap
                            col-12
                            px-0
                            align-items-center
                          "
                        >
                          <span class="serviceDiv">Aligner Fabrication</span>
                          <span class="serviceDiv">Case Monitoring</span>
                          <span class="serviceDiv"
                            >Case Advisor / Concierge</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="d-none">Total Case: {{ lab.total_case }}</td>
              <td class="d-none">State: {{ lab.state_name }}</td>
              <td class="d-flex justify-content-center">
                <router-link :to="'/messages/' + lab.user_id" tag="button">
                  <div class="chatIcon">
                    <i class="feather icon-message-circle"></i>
                  </div>
                </router-link>
                <button class="chatIcon" @click="confirmDelete(lab.user_id)">
                  <i class="feather icon-trash-2"></i>
                </button>
                <div class="mx-1">
                  <div
                    class="custom-control custom-switch custom-control-inline"
                  >
                    <input
                      v-if="lab.status === 1"
                      type="checkbox"
                      class="custom-control-input"
                      checked
                      :id="lab.user_id"
                      @input="changeStatus(lab.user_id)"
                    />
                    <input
                      v-if="lab.status === 2"
                      type="checkbox"
                      class="custom-control-input"
                      :id="lab.user_id"
                      @input="changeStatus(lab.user_id)"
                    />
                    <label
                      class="custom-control-label"
                      :for="lab.user_id"
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

          <div class="box">
            <p>Services</p>
            <div class="col-12 filterPart px-0">
              <label v-for="service in filterData.services" :key="service.id">
                <input
                  type="checkbox"
                  :value="service.selected"
                  v-on:input="service.selected = $event.target.value"
                />
                {{ service.name }}
              </label>
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
import $ from 'jquery';
import Vue3StarRatings from 'vue3-star-ratings';
import userAPI from '../../../../services/user.API';
import Swal from 'sweetalert2';
import { createToast } from 'mosha-vue-toastify';
//range slider
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';
import Multiselect from '@vueform/multiselect';
import proImg from '../../../../assets/images/profile/no-user.png';

export default {
  name: 'Labs',
  components: {
    'star-ratings': Vue3StarRatings,
    'vue-slider': VueSlider,
    Multiselect,
  },
  mounted() {
    // filter lab from user list API
    userAPI.getAllUserAccessList().then(res => {
      if (res.data.data.map(e => e.role_id === 5)) {
        this.labs = res.data.data.filter(e => e.role_id === 5)[0];
        this.baseImg = this.labs && this.labs.imageFolderPath;
        // console.log(this.labs.data.map(e => e.state_name));
        let locationState = this.labs.data.map(e => e.state_name);
        this.locationState.options = [...new Set(locationState.flat())];
      }
      setTimeout(() => {
        $('#labTable').DataTable({
          lengthMenu: [
            [5, 10, 25, 50, -1],
            [5, 10, 25, 50, 'All'],
          ],
          pageLength: 10,
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
          info: false,
          bLengthChange: false,
        });
      });
    });
  },
  data: function () {
    return {
      labs: [],
      rating: 2.5,
      baseImg: '',
      filterData: {
        services: [
          {
            id: 4,
            name: 'Case Advisor / Concierge',
            selected: false,
          },
          {
            id: 3,
            name: 'Treatment Planning Software',
            selected: false,
          },
          {
            id: 1,
            name: 'Aligner Fabrication',
            selected: false,
          },
          {
            id: 2,
            name: 'Case Monitoring',
            selected: false,
          },
        ],
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
                let removingData = this.labs.data.findIndex(
                  e => e.user_id === userID,
                );
                console.log(removingData);
                if (removingData > -1) {
                  this.labs.data.splice(removingData, 1);
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
        // let index = this.labs.data.findIndex(e => e.state_name === value);
        // this.labs.data.filter(e => e.state_name === value);
        // console.log(index + ' ' + value);
        $('#labTable').DataTable().column(2).search(value).draw();
      }
    },
    resetLocation() {
      $('#labTable').DataTable().column(2).search('').draw();
    },
    replaceByDefaultProImage(e) {
      e.target.src = proImg;
    },
  },
  computed: {
    selectedNames() {
      return this.filterData.services
        .filter(service => service.selected)
        .map(service => service.name);
    },
  },
  mouseOverRatingText() {
    return this.mouseOverRating
      ? 'Click to select ' + this.mouseOverRating + ' stars'
      : 'No Rating';
  },
};
</script>

<style scoped>
table#labTable {
  width: 100% !important;
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
  /* right: 20px; */
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
tr.TR.odd,
tr.TR.even {
  background: #ffffff;
  box-shadow: 0px 2px 3px #00000029;
  border-radius: 9px;
  margin: 15px 0;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 0px;
}
@media screen and (min-width: 1200px) {
  /* tr.TR.odd,
  tr.TR.even {
    max-height: 130px;
  } */
}

td {
  justify-content: center;
}
table#labTable {
  border-bottom: none;
  border: none;
}
img.imgAvatar {
  width: 70px;
  height: 70px;
  border-radius: 9px;
  background: #ffffff;
  box-shadow: 0px 3px 6px #00000029;
}
#labTable thead {
  display: none;
}
#labTable td {
  align-items: center;
  margin: auto 0;
}
#labTable span {
  color: #131313;
  font-size: 16px;
  /* font-weight: bold; */
  /* margin-left: 20px; */
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
#labTable .icon-message-circle {
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
tr.img {
  width: 10% !important;
}
/* td.name{
	text-align: left !important; 
	 width: 77%; 
	 margin-top: -25px; 
} */
td.action {
  float: right;
  width: auto;
}
.vue3-star-ratings__wrapper {
  display: block;
  margin: 0;
  text-align: center;
  /* margin-top: -25px; */
  margin-left: 15px;
  padding: 0;
  /* position: absolute; */
  /* left: 130px; */
}
#labTable span {
  color: #131313;
  font-size: 16px;
  /* margin-left: 20px; */
}

.stars .stars-outer .stars svg {
  display: flex;
  height: 10px !important;
}
.stars-inner svg {
  height: 10px !important;
}

#labTable .name .serviceDiv {
  color: #000000;
  text-transform: capitalize;
  background: #e2e2e2;
  border-radius: 10px;
  padding: 10px 20px;
  margin: 20px 5px 15px 0;
  font-size: 12px;
  font-weight: 500;
}
.img.td_image {
  align-items: center;
  display: flex;
}
td.td_name {
  text-align: left;
  width: 40%;
}
.TR.d-flex.flex-wrap {
  align-items: center;
}
.d-flex.flex-wrap.col-12 {
  margin-top: -15px;
}
svg {
  height: 12px !important;
}
</style>
