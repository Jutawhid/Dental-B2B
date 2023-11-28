<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-3">
        <div class="profile-img-container d-flex">
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
          />
        </div>
      </div>
      <div class="col-lg-9">
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
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container mt-1">
    <div class="row">
      <div class="col-lg-12">
        <div class="card profile-card">
          <div class="card-body">
            <div class="row">
              <div class="col-lg-10">
                <div class="profile-card-head">
                  <div class="profile-card-title d-flex">
                    <div v-if="userData?.role?.role_id === 5">
                      <h2 class="font-weight-bolder">
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
                    <button class="btn msg-btn btn-edit waves-effect waves-light">
                      <i class="feather icon-edit-1 mr-50"></i>Edit
                    </button>
                  </router-link>
                </div>
              </div>
              <div class="col-lg-12">
                <div class="ratings-box d-flex flex-wrap">
                  <span class="font-medium-3" style="letter-spacing: 3px">
                    <i class="fa fa-star text-positive"></i>
                    <i class="fa fa-star text-positive"></i>
                    <i class="fa fa-star text-positive"></i>
                    <i class="fa fa-star text-positive"></i>
                    <i class="fa fa-star text-negative"></i>
                  </span>
                  <span class="ml-75 font-weight-bolder"
                    >(
                    {{ userData.star_rating ? userData.star_rating : 0 }} cases
                    )</span
                  >
                </div>
              </div>
              <div class="col-lg-12 my-2 user-description">
                <p>
                  {{ userData.description }}
                </p>
              </div>
              <div class="col-lg-2 d-flex align-items-center">
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
import ProfileService from '../../../../services/profile.service';

export default {
  name: "profileDetals",
  async created() {
    await ProfileService.getActiveService().then(res => {
      if(res.success === true ){
        this.userServices = res.data;
         console.log(this.userServices);
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
    await ProfileService.getUser().then(
      (response) => {
        console.log(response)
        // if (response.data === 0) {
        //   this.user = response.data;
        // }
        if (response) {
          this.userData = response;
          // this.proimage = FileApi + this.userData.profile_image_path;
          // this.coverImage = FileApi + this.userData.cover_image_path;
          // console.log(response.data.data);
          this.coverImage = this.userData?.imageFolderPath +'/'+ this.userData?.cover_image;
          this.profileImage = this.userData?.imageFolderPath  +'/'+  this.userData?.profile_image;
          console.log(this.userData);
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
    console.log(this.profileImage);
  },
  // computed: {
  //   // profile() {
  //   //   return this.$store.state.profile.user;
  //   // },
  // },
  data() {
    return {
      userData: {},
      user: {},
      activeItem: "servicesDetals",
      profileImage: "",
      coverImage: '',
      userServices: [],
    };
  },
};
</script>

<style type="text/css" scoped>
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
}

#user-profile .card.profile-card {
  border-radius: 15px 15px 0 0;
  /* margin-right: 50px;
  top: -10rem; */
  margin-bottom: 0px;
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
  /* top: -10rem; */
}

#user-profile .profile-img-container img {
  border: 0.3rem solid #fff;
  height: 200px;
  width: 200px;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 0px 3px 6px #00000029;
  margin: auto;
}

#user-profile .profile-header {
  flex-flow: column;
  /* margin-bottom: -10rem; */
  max-height: 350px;
  overflow: hidden;
  border-radius: 25px;
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
    min-width: 6rem
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
    float: left;
  }

  #user-profile .profile-card .chip-cat {
    width: 100%;
  }

  #profile-info .card {
    margin-top: -5rem;
  }
}
</style>
