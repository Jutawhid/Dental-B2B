<template>
  <div>
    <!-- Container Fluid-->
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="content-wrapper">
        <div class="row">
          <div class="col-lg-9">
            <div class="row m-0">
              <div class="col-lg-6 my-lg-0 mb-1">
                <h1 class="text-bold-700 mb-0 headerTXT">Sort Order</h1>
              </div>
              <div
                class="col-lg-6 col-sm-12 d-flex justify-content-lg-end justify-content-center align-items-center"
              >
                <router-link :to="{ name: 'featureList' }">
                  <button type="submit" class="btn back_btn mr-2">
                    <i class="feather icon-arrow-left"></i>
                    Back
                  </button>
                </router-link>
                <button class="update__btn" @click="onSubmit">
                  <i class="fa fa-save"></i>
                  Save Changes
                </button>
              </div>
              <div class="col-lg-12">
                <hr />
              </div>
              <div class="col-lg-12 py-1 px-0">
                <!--  Section -->
                <div class="card p-2 p-lg-2">
                  <div class="card-body p-0 px-lg-1">
                    <div class="list">
                      <transition-group name="flip-list" tag="div">
                        <li
                          @dragover="e => onDragOver(item, i, e)"
                          @dragend="e => finishDrag(item, i, e)"
                          @dragstart="e => startDrag(item, i, e)"
                          v-for="(item, i) in items"
                          class="item"
                          :class="{
                            over: item === over.item && item !== dragFrom,
                            [over.dir]: item === over.item && item !== dragFrom,
                          }"
                          draggable="true"
                          :key="item"
                        >
                          <div class="row">
                            <div class="col-1 m-auto">
                              <i class="fa fa-bars"></i>
                            </div>
                            <div class="col-1 m-auto">{{ item.order }}</div>
                            <div class="col-lg-3 col-12">
                              <img
                                class="imgAvatar"
                                :src="item.path + '/' + item.image"
                                alt="img"
                                @error="replaceImgByDefault"
                              />
                            </div>

                            <div
                              class="col m-auto text-center text-lg-left text-center text-capitalize pt-lg-0 pt-2"
                            >
                              <h4 style="color: #fff">{{ item.title }}</h4>
                            </div>

                            <div
                              class="col m-auto text-center text-lg-left text-center text-capitalize pt-lg-0 pt-2"
                            >
                              <h4 style="color: #fff">{{ item.role }}</h4>
                            </div>

                            <input type="hidden" name="id" :value="item.id" />
                          </div>
                        </li>
                      </transition-group>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userAPI from '../../../services/user.API';
import replaceImg from '../../../assets/images/profile/defult_cover.jpg';
export default {
  data() {
    return {
      items: [],
      over: {},
      startLoc: 0,
      dragging: false,
      dragFrom: {},
      i: [],
      message: '',
    };
  },
  created() {
    userAPI.getFeatureList().then(
      res => {
        this.items = res.data.data
          .map(e => {
            // console.table(e.serial_no);
            return {
              id: e.id,
              title: e.userProfileInfo.name,
              path: e.userProfileInfo.profileImageFolderPath,
              image: e.userProfileInfo.cover_image,
              role: e.role.title,
              order: e.serial_no,
            };
          })
          .sort((a, b) => a.order - b.order);
      },
      error => {
        console.log(error);
      },
    );
  },
  methods: {
    replaceImgByDefault(e) {
      e.target.src = replaceImg;
    },
    startDrag(item, i, e) {
      this.startLoc = e.clientY;
      this.dragging = true;
      this.dragFrom = item;
      console.log(this.dragFrom);
      // console.log('Id = ' + this.dragFrom.id);
      // console.log('Order = ' + i);
      console.log(e.clientY);
    },
    finishDrag(item, pos) {
      this.items.splice(pos, 1);
      this.items.splice(this.over.pos, 0, item);
      this.over = {};
    },

    onDragOver(item, pos, e) {
      const dir = this.startLoc < e.clientY ? 'down' : 'up';
      setTimeout(() => {
        this.over = { item, pos, dir };
      }, 50);
    },
    onSubmit() {
      console.log(this.items);
      let data = this.items.map(e => e.id);
      console.log(data);
      userAPI.updateSerial(data).then(
        res => {
          console.log(res);
          if (res.data.success == true) {
            // redirect
            this.$router.push('/feature/list');

            this.message = res.data.message;
            // show success alert
            this.$moshaToast(this.message, {
              position: 'top-right',
              showIcon: 'true',
              type: 'success',
              hideProgressBar: 'false',
              timeout: 2000,
              swipeClose: 'false',
            });
          } else {
            this.$moshaToast(this.message, {
              position: 'top-right',
              showIcon: 'true',
              type: 'danger',
              hideProgressBar: 'false',
              timeout: 2000,
              swipeClose: 'false',
            });
          }
        },
        error => {
          console.log(error);
        },
      );
    },
  },
};
</script>

<style scoped>
.list > div {
  display: flex;
  flex-direction: column;
}

.item {
  width: 100%;
  padding: 10px;
  margin: 10px 0 10px 0;
  background: #123c3d;
  color: white;
  font-family: sans-serif;
  border-radius: 5px;
  display: inline-block;
  /* transition: opacity .3s ease-in-out; */
  cursor: grab;
  /*   transition: opacity .3s ease-in-out; */
}

.flip-list-move {
  transition: transform 0.2s;
}

.over {
  opacity: 0.6;
}

img.imgAvatar {
  width: 100%;
  height: 50px;
  border-radius: 9px;
  /* padding: 5px; */
  background: #ffffff;
  box-shadow: 0px 3px 6px #00000029;
}
@media screen and (max-width: 576px) {
  img.imgAvatar {
    min-height: 90px;
    width: 100%;
    margin-top: 10px;
  }
}
@media screen and (min-width: 577px) and (max-width: 767px) {
  img.imgAvatar {
    height: 100px !important;
  }
}
@media screen and (min-width: 768px) and (max-width: 1000px) {
  img.imgAvatar {
    height: 100px !important;
  }
}
@media screen and (min-width: 1001px) {
  img.imgAvatar {
    max-width: 120px !important;
  }
}
</style>
