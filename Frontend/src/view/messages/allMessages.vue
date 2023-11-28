<template>
  <div>
    <!-- Container Fluid-->
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="row content-wrapper pt-0">
        <div class="col-lg-8 px-lg-0 msgContact">
          <div class="topDiv row">
            <h1
              class="text-bold-700 mb-0 headerTXT col-lg-4"
              data-v-964885d6=""
            >
              Messages List
            </h1>
            <label class="col-lg-3">
              <input
                class="search"
                type="text"
                placeholder="Search by Name..."
                @keyup.enter="searchUser"
                :value="searchText" />
              <i @click="reset" class="fa fa-times-circle" v-if="searchOn"></i
            ></label>
          </div>
          <!-- Loader -->
          <div
            class="h-100 overflow-y-auto mr-lg-0 mxChatHeight"
            v-if="loading"
          >
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
          <!-- Loader -->
          <div
            class="h-100 overflow-y-auto mr-lg-0 mxChatHeight"
            v-if="!loading && users?.length >= 0"
          >
            <div v-for="user in users" :key="user.messageId">
              <router-link :to="'/messages/' + user.messageId" tag="button">
                <div
                  class="msgContactGroup"
                  :class="user.isSeen === 'Unseen' ? 'unseen' : ''"
                  @click="seen(user.id)"
                >
                  <div
                    class="row"
                    v-if="
                      user.receiverId === currentUserId ||
                      user.senderId === currentUserId
                    "
                  >
                    <div class="col-2 d-block">
                      <img
                        :src="user.photo"
                        alt="pic"
                        @error="replaceByDefaultProImage"
                      />
                    </div>
                    <div class="col-3 d-flex">
                      <span class="my-auto">
                        {{ user.TitleName }} {{ user.receiverId }}
                      </span>
                    </div>
                    <div class="col-7 d-flex flex-column">
                      <span class="my-auto message">
                        {{ user.messageBody }} {{ user.id }}
                      </span>
                      <span
                        v-if="user.messageBody === '\n'"
                        class="my-auto message"
                      >
                        Blank Message Found
                      </span>
                      <span class="my-auto time">
                        {{
                          moment(user.createdAt).format('MMMM Do YY - h:mma')
                        }}
                      </span>
                    </div>
                    <!-- <div class="col-3">
                    <span class="mb-0">
                      R = {{ user.receiverId }} || S = {{ user.senderId }} || MY
                      ={{ currentUserId }}
                    </span>
                  </div> -->
                  </div>
                </div>
              </router-link>
            </div>
            <div v-if="!loading && this.users <= 0">
              <div class="msgContactGroup">
                <div class="row">
                  <div class="col-12 d-flex">
                    <span class="m-1">
                      <!-- {{ user.messageBody }} -->
                      No Messages History Founded
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4"></div>
      </div>
    </div>
    <!---Container Fluid-->
  </div>
</template>

<script type="javascript">
import userAPI from '../../services/user.API';
import proImg from '../../assets/images/profile/no-user.png';
import moment from 'moment';
export default {
  name: 'allMessage',
  data() {
    return {
      // loading: true,
      users: [],
      currentUserId: null,
      currentPhotoPath: null,
      imageFolder: null,
      searchText: '',
      searchOn: false,
      loading: true,
    };
  },
  mounted() {
    this.moment = moment;
    // Current User
    userAPI.getUserProfile().then(response => {
      // console.log(response);
      this.currentUserId = response.data.data.user_id;
      this.currentUserName = response.data.data.user_name;
      this.currentPhotoPath = response.data.data.imageFolderPath;
      this.currentUserPhoto =
        response.data.data.imageFolderPath +
        '/' +
        response.data.data.profile_image;
      // console.log('My ID = ' + this.currentUserId);
    });
    // Get All Messages
    // setInterval(() => {
    //    this.getAllMessages();
    // }, 50000);

    this.getAllMessages();
  },
  methods: {
    getAllMessages() {
      userAPI.getAllMessages().then(response => {
        // console.log(response.data.data);
        this.imageFolder = response.data.imageFolder;
        let allUsers = response.data.data.map(user => {
          return {
            id: user.id,
            messageId:
              user.sender_id === this.currentUserId
                ? user.receiver_id
                : user.sender_id,
            TitleName: user.receiver_name
              ? user.receiver_name
              : user.sender_name,
            receiverId: user.receiver_id,
            photo: this.imageFolder + '/' + user.profile_image,
            messageBody: user.message_body,
            senderId: user.sender_id,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
            isSeen:
              user.receiver_id === this.currentUserId &&
              user.is_seen === 0
                ? 'Unseen'
                : 'Seen',
          };
        });
        this.users = [...new Set(allUsers)];
        this.loading = false;
      });
    },
    searchUser(e) {
      this.searchText = e.target.value;
      if (this.searchText == '') {
        this.searchOn = false;
        this.getAllMessages();
      } else {
        // console.log(this.users);
        this.users = this.users.filter(user => {
          return user.TitleName.toLowerCase().includes(
            this.searchText.toLowerCase(),
          );
        });
        this.searchOn = true;
      }
    },
    reset() {
      this.searchText = '';
      this.searchOn = false;
      this.getAllMessages();
    },
    replaceByDefaultProImage(e) {
      e.target.src = proImg;
    },
    seen(messageId) {
      // console.log(messageId);
      userAPI.seenMessage(messageId).then(response => {
        console.log(response);
        // this.getAllMessages();
      });
    },
  },
};
</script>

<style type="text/css" scoped>
html body .content .content-wrapper {
  padding: calc(2.2rem - 0.4rem) 2.2rem 0;
  margin-top: 4.51rem;
  margin-bottom: 0rem;
}
html body .app-content {
  padding-top: 0rem;
}
.topDiv {
  background: #f2f2f2;
  border: 1px solid #e8e8e8;
  width: 100%;
  padding: 10px 20px;
  display: flex;
  min-height: 75px;
  height: auto;
  position: fixed;
  z-index: 1;
  margin-left: -17px;
}
.msg .topDiv p {
  color: #000000;
  font-size: 15px;
  font-weight: 600;
  margin: auto 15px;
  height: 100%;
}
.msg .topDiv img {
  background: #aededf;
  border-radius: 10px;
  height: 50px;
  width: 50px;
}
.msgContact .topDiv input.search {
  background: #ffffff;
  border: 1px solid #c8c8c8;
  border-radius: 3rem;
  height: 3rem;
  width: 100%;
  padding: 1rem 1.5rem;
}
.fa-times-circle {
  position: absolute;
  right: 2rem;
  font-size: 1.5rem;
  top: 0.7rem;
  color: #123c3d;
  cursor: pointer;
}
.msgContact .msgContactGroup {
  background: #ebecf6;
  border-radius: 10px;
  opacity: 1;
  max-height: 80px;
  height: auto;
  padding: 10px;
  /* display: flex; */
  width: 98%;
  margin: 10px auto;
}
.msgContact .msgContactGroup img {
  background: #ffffff;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 10px;
  width: 50px;
  height: 50px;
  padding: 2px;
}
.msgContact .msgContactGroup p {
  color: #000000;
  font-size: 15px;
  font-weight: 600;
  word-break: break-word;
}
.msgContact .msgContactGroup span {
  font-size: 16px;
  color: #6a6a6a;
  word-break: break-word;
  max-height: 60px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: unset;
}
.msgContact .msgContactGroup span.time {
  font-size: 10px;
}
.msgContact .msgContactGroup.unseen {
  font-weight: 800;
}
.msgContact .msgContactGroup.seen {
  font-weight: 400;
}
.msgContact .mxChatHeight {
  /* max-height: 83vh;
  overflow-y: auto; */
  overflow-x: hidden;
  margin-top: 80px;
}
.msg .messageBody .leftMsgBody {
  background: #e1e1e1;
  border: 1px solid #c4c4c4;
  border-radius: 20px 20px 20px 0px;
  /* min-height: 65px; */
  height: auto;
  color: #000;
  word-break: break-word;
  width: fit-content;
  max-width: 80%;
  padding: 10px;
  margin-left: 40px;
  font-weight: 400;
}

.msg .messageBody .rightMsgBody {
  background: #123c3d;
  border: 1px solid #c4c4c4;
  border-radius: 20px 20px 0px 20px;
  height: auto;
  color: #fff;
  word-break: break-word;
  max-width: 80%;
  width: auto;
  padding: 10px 20px;
  margin: 10px 20px;
  font-weight: 400;
}
.msg .messageBody {
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 100px;
  padding-bottom: 70px;
}
.msg input.writeBox {
  background: #ffffff;
  border: 2px solid #c9c9c9;
  border-radius: 20px;
  color: #000000;
  font-size: 15px;
  opacity: 0.7;
  text-align: left;
  font-weight: 400;
  min-height: 52px;
  width: 100%;
  padding: 10px 25px;
}
.msg .bottomBox {
  position: fixed;
  z-index: 10;
  background: #f8f8f8;
  bottom: 0px;
  padding: 10px 0px;
  display: flex;
  width: 64%;
  margin-left: 25px;
}
.msg .sendMsg {
  position: absolute;
  right: 25px;
  background: transparent;
  border-radius: 50%;
  padding: 5px !important;
  border: none;
  color: #123c3d;
  margin: 5px 30px;
  font-size: 20px;
}
.rtmgsPhoto {
  width: 30px;
  height: 30px;
  margin-right: 20px;
  bottom: 10px;
  /* margin-top: 30px; */
  position: absolute;
  background-color: #000;
  border: 2px solid #e8e8e8;
  border-radius: 10px;
}
@media (max-width: 767px) {
  html body .content .content-wrapper {
    padding: calc(2.2rem - 0.4rem) 1.2rem 0;
  }
  .msg .bottomBox {
    width: -webkit-fill-available;
    padding: 10px 40px 10px 10px !important;
    margin: 0;
    /* left: 0; */
    bottom: 60px !important;
  }
  .topDiv {
    padding: 10px 0px;
    margin-left: -17;
    text-align: center;
  }
  .msgContact .topDiv input.search {
    height: 40px;
    width: 50%;
    padding: 2px 15px;
    margin: 10px auto;
  }
  .msgContact .mxChatHeight {
    margin-top: 130px;
  }
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
</style>
