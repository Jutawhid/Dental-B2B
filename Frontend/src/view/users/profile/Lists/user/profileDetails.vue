<template>
  <div>
    <!-- Top Lab/Tech company Profile details-->
    <div class="row">
      <div class="col-lg-12">
        <div class="profile-header d-flex">
          <div class="cover-container">
            <img
              v-if="userData.cover_image"
              @error="replaceByDefaultCoverImage"
              class="img-fluid bg-cover w-100"
              :src="
                userData.cover_image_folder_path + '/' + userData.cover_image
              "
              alt="User Profile Image"
              style="border-radius: 20px"
            />
            <img
              v-if="!userData.cover_image"
              class="img-fluid bg-cover w-100"
              src="../../../../../assets/images/explore/cover_img.jpg"
              alt="User Cover Image"
              style="border-radius: 20px"
              @error="replaceByDefaultCoverImage"
            />
          </div>
        </div>
      </div>
      <div class="col-lg-3 d-flex justify-content-lg-end">
        <div class="profile-img-container d-flex">
          <img
            v-if="!userData.profile_image"
            src="../../../../../assets/images/profile/no-user.png"
            class="box-shadow-1"
            alt="Card image"
          />
          <img
            v-if="userData.profile_image"
            :src="userData.image_folder_path + '/' + userData.profile_image"
            class="box-shadow-1"
            alt="Card image"
            @error="replaceByDefaultProImage"
          />
        </div>
      </div>
      <div class="col-lg-9 pl-lg-0">
        <div class="card profile-card">
          <div class="card-body">
            <div class="row">
              <div class="col-lg-10">
                <div class="profile-card-head">
                  <div class="profile-card-title d-flex">
                    <h2 class="nameCls">
                      {{
                        userData.name
                          ? userData.name
                          : userData.first_name + ' ' + userData.last_name
                      }}
                    </h2>
                    <img
                      class="favorite-icon"
                      v-if="
                        (user_role == 3 || user_role == 4 || user_role == 5) &&
                        userData.is_favorite === false &&
                        this.currentUser.user_id !== this.user_id &&
                        this.currentUser.role.role_id !== userData.role_id
                      "
                      src="../../../../../assets/images/icons/common/not-favorite.svg"
                      alt="not-favorite"
                      @click="addToFavorite(userData.user_id)"
                    />
                    <img
                      class="favorite-icon"
                      v-if="
                        (user_role == 3 || user_role == 4 || user_role == 5) &&
                        userData.is_favorite === true
                      "
                      src="../../../../../assets/images/icons/common/favorite.svg"
                      alt="favorite"
                      @click="removeFromFavorite(userData.user_id)"
                    />
                  </div>
                </div>
              </div>
              <div
                class="col-lg-2"
                v-if="this.currentUser.user_id !== this.user_id"
              >
                <router-link :to="'/messages/' + userData.user_id" tag="button">
                  <button class="btn msg-btn btn-edit waves-effect waves-light">
                    <i class="feather icon-message-circle mr-50"></i>Message
                  </button>
                </router-link>
              </div>

              <div class="col-12">
                <div class="d-flex">
                  <star-rating
                    read-only
                    :rating="userData.ratings"
                    :star-size="20"
                    :show-rating="false"
                    :border-width="2"
                    :rounded-corners="true"
                    :padding="4"
                  ></star-rating>

                  <span
                    class="ml-0 font-weight-500 pl-0 count-cases cursor-pointer count-cases"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    data-bs-whatever="@fat"
                  >
                    <!-- ({{
                      userData.total_case
                        ? userData.total_case
                        : 'No case found'
                    }}) -->
                    ({{
                      completedCaseList?.length > 0
                        ? completedCaseList.length
                        : 'No service found'
                    }})
                  </span>
                  <!-- </button> -->
                </div>
              </div>
              <div class="col-lg-12 mb-2"></div>
              <!-- </div> -->
              <div class="col-lg-12 mb-2" v-if="userData.description">
                <p>
                  {{
                    userData.description
                      ? userData.description
                      : 'No Description'
                  }}
                </p>
              </div>
              <div
                class="w-auto d-flex align-items-center"
                v-if="userData?.service?.length >= 0"
              >
                <h4 class="black font-weight-bolder">Services</h4>
              </div>
              <div class="col-lg-10">
                <div
                  class="chip chip-cat"
                  v-for="service in userData.service"
                  :key="service.id"
                >
                  <div class="chip-body">
                    <div class="chip-text">
                      {{ service.name ? service.name : 'No service available' }}
                    </div>
                  </div>
                </div>
                <div
                  class="chip chip-cat"
                  v-if="userData?.service?.length == 0"
                >
                  <div class="chip-body">
                    <div class="chip-text">No service available</div>
                  </div>
                </div>
              </div>

              <!-- Modal for Review Details Start -->
              <div
                class="modal fade"
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog modal-xl modal-dialog-scrollable">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">
                        Completed Case List
                      </h5>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      <!-- table -->
                      <div class="table-responsive">
                        <table
                          class="table tableBorder w-100"
                          id="completedCaseTbl"
                        >
                          <thead>
                            <tr align="center">
                              <th class="tableHeader" align="center">Date</th>
                              <th class="tableHeader" align="center">
                                Rated By
                              </th>
                              <th class="tableHeader" align="center">
                                Service
                              </th>
                              <th class="tableHeader" align="center">Rating</th>
                              <th class="tableHeader" align="center">Review</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(item, index) in this?.completedCaseList"
                              :key="index"
                            >
                              <td
                                class="normalFont"
                                align="center"
                                aria-label="Date"
                              >
                                {{
                                  moment(item.updated_at).format('MMMM Do YYYY')
                                }}
                              </td>
                              <td
                                class="normalFont"
                                align="center"
                                aria-label="Rated By"
                              >
                                {{ item.sender_name }}
                              </td>
                              <td
                                class="normalFont"
                                align="center"
                                aria-label="Service"
                              >
                                {{ item.service_name }}
                              </td>
                              <td
                                class="normalFont"
                                align="center"
                                aria-label="Rating"
                              >
                                <p class="h-100 d-flex justify-content-center">
                                  <star-rating
                                    read-only
                                    :rating="item.rating"
                                    :star-size="12"
                                    :show-rating="false"
                                    :border-width="2"
                                    :rounded-corners="true"
                                    :padding="4"
                                  ></star-rating>
                                </p>
                              </td>
                              <td
                                class="normalFont"
                                align="center"
                                aria-label="Review"
                              >
                                {{ item.review }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Modal for Review Details End -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!---Top Lab/Tech company Profile details-->
  </div>
</template>

<script type="javascript">
//Star rating
import StarRating from 'vue-star-rating';
import moment from 'moment';
import $ from 'jquery';
import Swal from 'sweetalert2';
import userAPI from '../../../../../services/user.API';
import { createToast } from 'mosha-vue-toastify';
import profileService from '../../../../../services/profile.service';
import proImg from '../../../../../assets/images/profile/no-user.png';
import coverImg from '../../../../../assets/images/profile/defult_cover.jpg';
import caseAPI from '../../../../../services/case.API';
export default {
  name: 'profileDetals',
  components: {
    StarRating,
  },
  created() {
    this.moment = moment;
  },
  mounted() {
    if (this.$route.params.user_id) {
      console.log(Number(this.$route.params.user_id));
      console.log(this.user_details.user_id);
      this.user_id = Number(this.$route.params.user_id);
    }
    if (this.user_details) {
      this.userData = this.user_details;
      this.value = this.user_details.ratings.toString();
    }
    console.log(this.value);
    profileService.getUser().then(response => {
      console.log(response);
      this.currentUser = response;
      this.user_role = response.role.role_id;
      // console.log(this.user_role);
    });
    //get completed cases
    if (this.user_id) {
      caseAPI.getCompletedCase(this.user_id).then(
        response => {
          this.completedCaseList = response.data.data;
          setTimeout(() => {
            $('#completedCaseTbl').DataTable({
              lengthMenu: [
                [10, 25, 50, -1],
                [10, 25, 50, 'All'],
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
              // targets: 'no-sort',
              bSort: false,
              bInfo: true,
              bLengthChange: false,
            });
          });
        },
        err => {
          console.log(err);
        },
      );
    }
  },
  data() {
    return {
      userData: {},
      user: {},
      activeItem: 'servicesDetals',
      BASE_IMG: '',
      user_role: '',
      value: this.user_details.ratings.toString(),
      user_id: 0,
      currentUser: {},
      completedCaseList: [],
    };
  },
  methods: {
    // add to favorite
    addToFavorite(id) {
      if (id) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to add this lab to your favorite list!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#0b2425',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, add it!',
        }).then(result => {
          if (result.isConfirmed) {
            userAPI.addToFavorite(id).then(
              response => {
                if (response.data.success === true) {
                  this.userData.is_favorite = true;
                  createToast(response.data.message, {
                    type: 'success',
                    position: 'top-right',
                    duration: 3000,
                  });
                }
              },
              error => {
                if (error.response.data.success === false) {
                  createToast(error.response.data.message, {
                    type: 'danger',
                    position: 'top-right',
                    duration: 3000,
                  });
                }
              },
            );
          } else {
            createToast('Your favorite list is unchanged!', {
              type: 'success',
              position: 'top-right',
              duration: 3000,
            });
          }
        });
      }
    },

    // remove from favorite list
    removeFromFavorite(id) {
      if (id) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to remove this from your favorite list!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#0b2425',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, remove it!',
        }).then(response => {
          if (response.isConfirmed) {
            userAPI.removeFromFavorites(id).then(
              response => {
                if (response.data.success === true) {
                  this.userData.is_favorite = false;
                  createToast(response.data.message, {
                    icon: 'success',
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
                    icon: 'error',
                    position: 'top-right',
                    type: 'danger',
                    transition: 'bounce',
                    showIcon: 'true',
                    timeout: 2000,
                  });
                }
              },
            );
          } else if (response.dismiss === Swal.DismissReason.cancel) {
            createToast('Your favorite list is unchanged!', {
              icon: 'success',
              type: 'success',
              position: 'top-right',
              showIcon: 'true',
              duration: 3000,
            });
          }
        });
      }
    },

    // get user details
    replaceByDefaultProImage(e) {
      e.target.src = proImg;
    },
    replaceByDefaultCoverImage(e) {
      e.target.src = coverImg;
    },
  },
  props: ['user_details'],
};
</script>

<style type="text/css" scoped>
#user-profile .profile-header {
  flex-flow: column;
  /* margin-bottom: -10rem; */
  max-height: 350px;
  overflow: hidden;
  border-radius: 25px;
}
img.favorite-icon {
  margin-top: 5px;
  height: 18px;
  cursor: pointer;
}
#user-profile .cover-edit-button {
  position: absolute;
  top: 1rem;
  left: 5%;
}

#user-profile .cover-edit-button .btn-edit {
  background: #ffffffba;
  color: #000000;
  font-weight: 600;
  font-family: 'Poppins';
  box-shadow: 0px 3px 6px #00000029;
  margin: 0px 0px 20px;
}

#user-profile .cover-edit-button .btn-edit:hover {
  background: #ffd700;
  color: #000000;
}

#user-profile .cover-edit-button i {
  font-weight: 600;
  margin-right: 15px;
}

#user-profile .profile-card .btn-edit {
  background: #ffd700;
  color: #000000;
  font-weight: 600;
  font-family: 'Poppins';
  box-shadow: 0px 3px 6px #00000029;
  float: right;
  border-radius: 20px;
}

#user-profile .card.profile-card {
  border-radius: 15px;
  margin-right: 50px;
  top: -10rem;
}

#user-profile .card.profile-card p {
  font-size: 12px;
}

#user-profile .profile-card .btn-edit:hover {
  background: #ffd700;
  color: #000000;
}

#user-profile .profile-card i {
  font-weight: 600;
}

#user-profile .profile-card .chip-cat {
  margin-right: 5px;
  border-radius: 10px;
  padding: 10px 20px;
  font-weight: 600;
}

#user-profile .profile-card .chip-cat-add {
  background-color: #00e2f2;
  border-radius: 10px;
  padding: 10px 20px;
  font-weight: 600;
}

#user-profile .profile-img-container {
  position: relative;
  top: -10rem;
  padding: 0px 20px;
}

#user-profile .profile-img-container img {
  border: 0.3rem solid #fff;
  height: 200px;
  width: 200px;
  border-radius: 20px;

  box-shadow: 0px 3px 6px #00000029;
}

#user-profile .profile-header {
  flex-flow: column;
  /*margin-bottom: -10rem;*/
}

#user-profile .profile-header .icon-heart {
  font-size: 24px;
  line-height: 1.2;
  margin: 0px 20px;
}

#user-profile .profile-header .icon-heart {
  font-size: 24px;
  line-height: 1.2;
  margin: 0px 20px;
}

#user-profile .profile-card-title a {
  color: #000000;
  font-size: 20px;
  margin-left: 20px;
}

#profile-info .top-m {
  margin-top: -10rem;
}

@media (max-width: 767.98px) {
  #user-profile .profile-img-container {
    flex-flow: column;
    top: -4rem;
    padding: 0px;
    align-items: center;
  }
  .p-mobile-0 {
    padding-left: 0px;
    padding-right: 0px;
  }

  #user-profile .profile-img-container img {
    border: 0.2rem solid #fff;
    height: 6rem;
    width: 6rem;
    border-radius: 10px;
    margin-bottom: 20px;
    min-width: 6rem;
  }

  #user-profile .cover-edit-button .btn-edit {
    margin: 0px 5px;
    padding: 5px;
  }
  #user-profile .cover-edit-button .btn-edit > span {
    display: none;
  }
  #user-profile .cover-edit-button i {
    font-weight: 600;
    margin-right: 0px;
  }

  #user-profile .profile-card .btn-edit {
    margin: 10px 0px 20px;
    float: left;
  }

  #user-profile .profile-card .chip-cat {
    width: 100%;
  }

  #profile-info .card {
    margin-top: -5rem;
  }
  #user-profile .card.profile-card {
    margin-right: 0;
  }
  #user-profile .card.profile-card {
    top: -5rem;
  }
  .card {
    padding: 10px 0px;
  }
  #user-profile .profile-img-container {
    flex-flow: column;
    top: -6rem;
    padding: 2px;
    align-items: center;
  }
  #user-profile .profile-header {
    border-radius: 15px;
  }
}
h2.nameCls {
  font-weight: 700;
  margin: 0px 15px 15px 0px;
  text-transform: initial;
}
.font-weight-500 {
  font-weight: 500;
}
.vue-star-rating {
  margin-top: -3px;
}
span.count-cases {
  cursor: pointer;
  color: #123c3d;
}
/*  */
table.dataTable thead tr {
  background-color: #ffffff;
  padding-top: 50px;
  padding-bottom: 30px;
}
.tableBorder {
  padding-top: 20px !important;
  padding: 10px 0;
  background: #ffffff;
  border: 1px solid #bebebe;
  border-radius: 15px;
  opacity: 1;
}
.tableHeader {
  font: normal normal bold 13px/20px Poppins;
  letter-spacing: 0px;
  color: #000000;
  opacity: 1;
  /* min-width: 150px; */
}
.blueFont {
  font-size: 13px;
  color: #1492e6;
  font-weight: 600;
}
.normalFont {
  min-width: 150p;
  max-width: 250px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0px;
  color: #000000;
  border: none;
  border-top: 1px solid #b9b3b3 !important;
  padding: 15px 20px;
}
table.dataTable thead th,
table.dataTable thead td {
  border-bottom: none !important;
  text-align: center;
}
/* tr {
  height: 80px;
} */
table.dataTable thead .sorting:before,
table.dataTable thead .sorting_asc:before,
table.dataTable thead .sorting_desc:before {
  display: none;
}
table.dataTable thead .sorting:after,
table.dataTable thead .sorting_asc:after,
table.dataTable thead .sorting_desc:after {
  font-family: 'feather';
  content: '\e842';
  font-size: 1rem;
  margin-left: 5px;
}
table.dataTable thead .sorting {
  /* display: none !important; */
  background-image: none !important;
}
th.tableHeader.sorting {
  text-align: center;
  padding-bottom: 20px;
}
</style>
