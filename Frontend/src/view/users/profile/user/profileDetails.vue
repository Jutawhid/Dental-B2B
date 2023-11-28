<template>
  <div>
    <!-- Top Lab/Tech company Profile details-->
    <div class="row">
      <div class="col-lg-12">
        <div class="profile-header d-flex">
          <div class="cover-container">
            <img
              v-if="!userData?.cover_image"
              class="img-fluid bg-cover w-100"
              src="../../../../assets/images/profile/user-uploads/defult_cover.jpg"
              alt="User Cover Image"
              style="border-radius: 20px"
            />
            <img
              v-if="userData?.cover_image"
              :src="coverImage"
              class="img-fluid bg-cover"
              alt="User Cover Image"
              @error="replaceByDefaultCoverImage"
            />
          </div>
        </div>
      </div>
      <div class="profile-photo-wrapper">
        <div class="profile-img-container">
          <img
            v-if="!userData?.profile_image"
            src="../../../../assets/images/profile/no-user.png"
            class="box-shadow-1"
            alt="Card image"
          />
          <img
            v-if="userData?.profile_image"
            :src="profileImage"
            class="box-shadow-1"
            alt="Card image"
            @error="replaceByDefaultProImage"
          />
        </div>
      </div>
      <div class="profile-detail-wrapper pl-lg-0">
        <div class="card profile-card">
          <div class="card-body">
            <div class="row">
              <div class="col-lg-10">
                <div class="profile-card-head">
                  <div class="profile-card-title d-flex">
                    <div v-if="userData?.role?.role_id === 5">
                      <h2 class="nameCls">
                        {{ this.userData.name }}
                      </h2>
                    </div>
                    <div v-if="userData?.role?.role_id === 6">
                      <h2 class="font-weight-bolder">
                        {{ this.userData.name }}
                      </h2>
                    </div>
                    <div v-if="userData?.role?.role_id === 4">
                      <h2 class="font-weight-bolder">
                        {{ this.userData.first_name }}
                        {{ this.userData.last_name }}
                      </h2>
                    </div>
                    <!-- <a href="#"><i class="feather icon-heart"></i></a> -->
                  </div>
                </div>
              </div>
              <div class="col-lg-2">
                <div
                  v-if="
                    userData?.role?.role_id === 4 ||
                    userData?.role?.role_id === 5 ||
                    userData?.role?.role_id === 6
                  "
                >
                  <router-link to="/edit/user-profile" tag="button">
                    <button
                      class="btn msg-btn btn-edit waves-effect waves-light"
                    >
                      <i class="feather icon-edit-1 mr-50"></i>Edit
                    </button>
                  </router-link>
                </div>
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
                    class="ml-0 font-weight-500 pl-0 count-cases cursor-pointer"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    data-bs-whatever="@fat"
                  >
                    ({{
                      completedCaseList?.length > 0
                        ? completedCaseList.length
                        : 'No service found'
                    }})
                  </span>
                </div>
              </div>
              <div class="col-lg-12 mb-2">
                <!-- <div class="ratings-box d-flex flex-wrap">
                  <span class="font-medium-3" style="letter-spacing: 3px">
                    <i class="fa fa-star text-positive"></i>
                    <i class="fa fa-star text-positive"></i>
                    <i class="fa fa-star text-positive"></i>
                    <i class="fa fa-star text-positive"></i>
                    <i class="fa fa-star text-negative"></i>
                  </span>
                  <span class="ml-75 font-weight-500"
                    >(
                    {{ userData.star_rating ? userData.star_rating : 0 }} cases
                    )</span
                  >
                </div> -->
              </div>
              <div class="col-lg-12 mb-2 user-description">
                <p>
                  {{ userData.description }}
                </p>
              </div>
              <div class="w-auto d-flex align-items-center">
                <h4 class="black font-weight-bolder">Services</h4>
              </div>
              <div class="col-lg-10">
                <div v-if="this.userServices.length">
                  <div
                    v-for="service in userServices"
                    :key="service.id"
                    class="chip chip-cat"
                  >
                    <div class="chip-body">
                      <div class="chip-text">{{ service.name }}</div>
                    </div>
                  </div>
                </div>
                <div v-if="this.userServices.length === 0">
                  <div class="chip chip-cat">
                    <div class="chip-body">
                      <div class="chip-text">No Service Available</div>
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
                                <th class="tableHeader" align="center">
                                  Rating
                                </th>
                                <th class="tableHeader" align="center">
                                  Review
                                </th>
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
                                    moment(item.updated_at).format(
                                      'MMMM Do YYYY',
                                    )
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
                                  <p
                                    class="h-100 d-flex justify-content-center"
                                  >
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
    </div>
    <!---Top Lab/Tech company Profile details-->
  </div>
</template>

<script type="javascript">
//Star rating
import StarRating from 'vue-star-rating';
import $ from 'jquery';
import moment from 'moment';
import ProfileService from '../../../../services/profile.service';
import proImg from '../../../../assets/images/profile/no-user.png';
import coverImg from '../../../../assets/images/profile/defult_cover.jpg';
import caseAPI from '../../../../services/case.API';
import { setTimeout } from 'timers';

export default {
  name: 'profileDetals',
  components: {
    // vue3starRatings,
    StarRating,
  },
  async created() {
    this.moment = moment;
    await ProfileService.getActiveService().then(
      res => {
        if (res.success === true) {
          this.userServices = res.data;
          //  console.log(this.userServices);
        }
      },
      error => {
        this.user =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      },
    );

      setTimeout(() => {
      // console.log(this.profileInfo);
        if(this?.profileInfo){
          this.userData = this.profileInfo;
          this.coverImage =
            this.userData?.imageFolderPath + '/' + this.userData?.cover_image;
          this.profileImage =
            this.userData?.imageFolderPath + '/' + this.userData?.profile_image;
          this.value = this.userData?.ratings;
          this.user_id = this?.profileInfo?.user_id;
        }
      }, 100);

    if (this?.userData?.user_id) {
      await caseAPI.getCompletedCase(this.userData?.user_id).then(
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
      profileImage: '',
      coverImage: '',
      userServices: [],
      ratings: 2,
      user_id: '',
      completedCaseList: [],
    };
  },
  methods: {
    replaceByDefaultProImage(e) {
      e.target.src = proImg;
    },
    replaceByDefaultCoverImage(e) {
      e.target.src = coverImg;
    },
  },
  mounted() {
    //get completed cases
    if (this.userData?.user_id) {
      caseAPI.getCompletedCase(this.userData?.user_id).then(
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
  props: {
    profileInfo: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style type="text/css" scoped>
#user-profile .profile-header {
  flex-flow: column;
  /* margin-bottom: -10rem; */
  max-height: 350px;
  overflow: hidden;
  border-radius: 15px;
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
  /* border-radius: 20px; */
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
  padding: 0px 15px 0px 50px;
}

#user-profile .profile-img-container img {
  border: 0.3rem solid #fff;
  height: auto;
  min-height: 10rem;
  max-height: 20rem;
  min-width: 10rem;
  max-width: 20rem;
  width: 100%;
  border-radius: 1.5rem;
  box-shadow: 0px 3px 6px #00000029;
  max-height: 150px;
  max-width: 150px;
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

.profile-photo-wrapper {
  width: 20%;
}

.profile-detail-wrapper {
  width: 80%;
}
@media (max-width: 1440px) {
  #user-profile .profile-img-container {
    top: -5rem;
  }
  #user-profile .card.profile-card {
    top: -5rem;
  }
  #profile-info .top-m {
    margin-top: -5rem;
  }
}

@media (max-width: 767.98px) {
  .profile-photo-wrapper {
    width: 0%;
  }
  .profile-detail-wrapper {
    width: 100%;
  }
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

  #user-profile .card.profile-card {
    margin-left: 0px;
    padding: 0px;
  }

  #user-profile .profile-card .btn-edit {
    margin: 10px 0px 20px;
    /* float: left; */
    padding: 5px 10px !important;
  }

  #user-profile .profile-card .chip-cat {
    width: 100%;
  }

  #profile-info .card {
    margin-top: -5rem;
  }
  .profile-detail-wrapper {
    width: 100%;
  }
  #user-profile .card.profile-card {
    border-radius: 15px;
    margin-right: 0px;
    padding: 1rem;
  }
  #user-profile .profile-img-container {
    top: -6rem;
    left: 0.6rem;
  }

  #user-profile .profile-img-container img {
    min-height: 6rem;
  }
  #profile-info .top-m {
    margin-left: 0px;
  }
  .btn {
    margin: -20px 5px 10px !important;
    height: 30px;
  }
}
h2.nameCls {
  font-weight: 700;
  margin: 0px 15px 20px 0px;
  text-transform: initial;
}
.font-weight-500 {
  font-weight: 500;
}
/* .vue-star-rating {
 
  max-width: 170px;
  margin-top: -5px;
} */
.vue-star-rating {
  margin-top: -4px;
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
