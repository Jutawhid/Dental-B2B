<template>
  <div class="row">
    <div class="col-lg-9">
      <div class="list-container" :class="caseSidebar ? 'active' : ''">
        <button
          class="more-button"
          aria-label="Menu Button"
          @click.prevent="caseShow()"
        >
          <div class="menu-icon-wrapper">
            <div class="menu-icon-line half first"></div>
            <div class="menu-icon-line"></div>
            <div class="menu-icon-line half last"></div>
          </div>
        </button>
      </div>
      <div class="table-responsive">
        <table id="dentistTable" v-if="dentists?.data?.length > 0">
          <thead>
            <tr>
              <th class="pic">ID</th>
              <th class="case">Case</th>
              <th class="case d-none">Case</th>
              <th class="name d-none">State</th>
              <th class="action">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="TR d-lg-flex justify-content-between"
              v-for="user in dentists.data"
              :key="user.id"
            >
              <td>
                <img
                  v-if="!user.profile_image"
                  class="imgAvatar"
                  src="https://i.pinimg.com/736x/b9/cf/b8/b9cfb82fb98e5805d62c07bf8c707330.jpg"
                  @error="replaceByDefaultProImage"
                  alt="img"
                />
                <img
                  v-if="user.profile_image"
                  class="imgAvatar"
                  :src="baseImg + user.profile_image"
                  @error="replaceByDefaultProImage"
                  alt="img"
                />
                <router-link :to="'/cpanel/user/' + user.user_id">
                  <span class="col-12 col-lg-auto">
                    <b>{{ user.first_name + ' ' + user.last_name }}</b>
                  </span>
                </router-link>
              </td>
              <td class="center">
                <span
                  >Total Case: <b>{{ user.total_case }}</b></span
                >
              </td>
              <td class="center d-none">
                {{ user.total_case }}
              </td>
              <td class="d-none">State: {{ user.state_name }}</td>
              <td class="justify_end">
                <router-link :to="'/messages/' + user.user_id" tag="button">
                  <div class="chatIcon">
                    <i class="feather icon-message-circle"></i>
                  </div>
                </router-link>
                <button
                  class="chatIcon"
                  v-if="userRole === 1"
                  @click="confirmDelete(user.user_id)"
                >
                  <i class="feather icon-trash-2"></i>
                </button>
                <div class="mx-1" v-if="userRole === 1">
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
        <p
          class="alert alert-info"
          v-if="!loading && dentists?.data?.length === 0"
        >
          No data found
        </p>
      </div>
    </div>
    <!-- loader -->
    <div class="col-xl-9" v-show="loading">
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
        <div class="col-xl-12">
          <div class="placeholder wave">
            <div class="line"><br /></div>
            <div class="line"><br /></div>
            <div class="line"><br /></div>
          </div>
        </div>
      </div>
    </div>
    <!-- loader -->
    <div class="col-lg-3">
      <div
        class="filterContainer"
        :class="caseSidebar ? 'menuOpen' : 'menuClose'"
      >
        <form>
          <div class="col-12 py-1 px-0">
            <i class="feather icon-filter"></i>
            <label>Filter</label>
          </div>

          <div class="box row mx-0">
            <div class="col-8 px-0">
              <p>Location</p>
            </div>
            <!-- <div class="col-4 px-0 text-right">
              <button class="resetBtn" @click.prevent="resetLocation">
                Clear
              </button>
            </div> -->
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

          <!-- <div class="box">
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
                    @change="this.value[1] = $event.target.value"
                  />
                </div>
              </div>
            </div>
          </div> -->

          <div class="d-flex justify-content-lg-end">
            <button @click.prevent="resetLocation" class="resetBtn">
              Reset
            </button>
            <button class="applyBtn" @click.prevent="applyFilter">Apply</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import userAPI from '../../../../../services/user.API';
import Swal from 'sweetalert2';
import { createToast } from 'mosha-vue-toastify';

//range slider
// import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';
import Multiselect from '@vueform/multiselect';
import proImg from '../../../../../assets/images/profile/no-user.png';

export default {
  components: {
    // 'vue-slider': VueSlider,
    Multiselect,
  },

  mounted() {
    // get all access list
    userAPI.getAllUserAccessList().then(res => {
      if (res.data.data.map(e => e.role_id === 3)) {
        this.dentists = res.data.data.filter(e => e.role_id === 3)[0];
        this.dentistMain = res.data.data.filter(e => e.role_id === 3)[0];
        this.baseImg = this.dentists && this.dentists.imageFolderPath;
        console.log(this.dentistMain);
        console.log(this.baseImg);
        let locationState = this.dentists.data.map(e => e.state_name);
        this.locationState.options = [...new Set(locationState.flat())];
        this.loading = false;
      }
      setTimeout(() => {
        $('#dentistTable').DataTable({
          lengthMenu: [
            [5, 10, 25, 50, -1],
            [5, 10, 25, 50, 'All'],
          ],
          pageLength: 5,
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
      caseSidebar: false,
      dentistMain: [],
      dentists: [],
      baseImg: '',
      filterData: {
        services: [],
        location: [],
        cases_solved: [],
      },
      range: { min: '', max: '' },
      value: [100, 200],
      locationState: {
        value: '',
        placeholder: 'Search Location',
        search: true,
        trackBy: 'name',
        label: 'name',
        options: [],
      },
      selectedLocation: '',
      loading: true,
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
                let removingData = this.dentists.data.findIndex(
                  e => e.user_id === userID,
                );
                console.log(removingData);
                if (removingData > -1) {
                  this.dentists.data.splice(removingData, 1);
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
    applyFilter() {
      console.log(this.dentistMain);
      // let dentistData;
      // userAPI.getAllUserAccessList().then(res => {
      //   if (res.data.data.map(e => e.role_id === 3)) {
      //     dentistData = res.data.data.filter(e => e.role_id === 3)[0];
      // this.dentists.data = dentistData?.data?.filter(
      //   e => e.total_case >= this.value[0] && e.total_case <= this.value[1],
      // );
      // }
      // });

      if (this.selectedLocation) {
        this.dentists.data = this.dentists.data.filter(
          e => e.state_name === this.selectedLocation,
        );
      }

      // if (!this.selectedLocation && this.value.length > 0) {
      //   this.dentists.data = this.dentists.data.filter(
      //     e => e.total_case >= this.value[0] && e.total_case <= this.value[1],
      //   );
      // }
      this.caseSidebar = !this.caseSidebar;
    },
    caseShow() {
      this.caseSidebar = !this.caseSidebar;
    },
    // update user method
    updateState(value) {
      if (value) {
        this.selectedLocation = value;
      }
    },
    resetLocation() {
      // this.getUsers();
      let dentistData;
      userAPI.getAllUserAccessList().then(res => {
        if (res.data.data.map(e => e.role_id === 3)) {
          dentistData = res.data.data.filter(e => e.role_id === 3)[0];
          this.dentists.data = dentistData.data;
        }
      });

      this.selectedLocation = '';
      this.value = [100, 200];
    },
    replaceByDefaultProImage(e) {
      e.target.src = proImg;
    },
  },
  props: ['userRole'],
};
</script>

<style scoped>
@media screen and (max-width: 991px) {
  .filterContainer.menuOpen {
    min-width: 300px;
  }
}
tr.TR.d-lg-flex.justify-content-between {
  background: #ffffff;
  box-shadow: 0px 2px 3px #00000029;
  border-radius: 9px;
  margin: 5px 0;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 8px 10px;
}
table#dentistTable {
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
table#dentistTable {
  border-bottom: none;
  border: none;
}
img.imgAvatar {
  width: 50px;
  height: 50px;
  border-radius: 9px;
  /* padding: 5px; */
  background: #ffffff;
  /* box-shadow: 0px 3px 6px #00000029; */
}
#dentistTable thead {
  display: none;
}
#dentistTable td {
  align-items: center;
  display: flex;
  min-width: 30%;
}
#dentistTable span {
  color: #131313;
  font-size: 16px;
  /* font-weight: bold; */
  text-transform: capitalize;
  margin-left: 20px;
}
.chatIcon {
  background: #123c3d;
  border: 1px solid #123c3d;
  border-radius: 50%;
  color: white;
  height: 40px;
  width: 40px;
  cursor: pointer;
  margin: 5px;
  padding: 10px 11px;
}
td.justify_end {
  justify-content: end;
}
td.center {
  justify-content: center;
}
i.feather.icon-trash-2 {
  /* margin: 2px; */
  font-size: 16px;
}
#dentistTable .icon-message-circle {
  content: '\e890';
  font-size: 20px;
  /* margin-top: 6px;
  position: absolute;
  margin-left: 8px; */
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
.vue3-star-ratings__wrapper {
  display: block;
  margin: 0 auto;
  text-align: center;
  padding: 5px;
}

/* *********************************** */
.placeholder {
  margin: 15px;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  background-color: #e3e3e3;
  border-radius: 20px;
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
@media only screen and (min-width: 1000px) and (max-width: 1450px) {
  #dentistTable td {
    align-items: center;
    display: flex;
    min-width: 25%;
  }
}
</style>
