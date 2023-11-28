<template>
  <div>
    <!-- Container Fluid-->
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="row content-wrapper pt-0">
        <!-- chat message -->
        <div class="col-lg-9 px-lg-0 msg">
          <!-- Lab/ Tech company name -->
          <div class="topDiv">
            <router-link :to="{ name: 'allMessages' }">
              <button class="backBtn">
                <img
                  src="../../assets/images/icons/common/back.svg"
                  alt="back"
                />
              </button>
            </router-link>
            <img
              class="pprofile"
              :src="this.photo"
              alt="pic"
              @error="replaceByDefaultProImage"
            />
            <p class="pointerC" @click.prevent="goToUserProfile">
              {{ user_name }}
            </p>
            <!-- <button @click="scrollToElement">scroll to bottom</button> -->
          </div>
        </div>
        <div class="col-lg-3 px-lg-0 msgContact">
          <div class="topDiv px-lg-3">
            <!-- <div class="topDiv"> -->
            <!-- <label> -->
            <input
              class="search"
              type="text"
              @keyup.enter="searchUser"
              placeholder="Search by Name..."
              :value="searchText"
            />
            <i @click="reset" class="fa fa-times-circle" v-if="searchOn"></i>
            <!-- </label> -->
            <!-- </div> -->
          </div>
        </div>
        <div class="col-lg-9 px-lg-0 msg" ref="container">
          <div class="messageBody">
            <div class="row" v-for="(message, i) in messages" :key="i">
              <!-- left side -->
              <div class="col-12" v-if="message.sender !== currentUserId">
                <div class="d-flex justify-content-start">
                  <img
                    class="rtmgsPhoto"
                    :src="photo"
                    alt="pic"
                    @error="replaceByDefaultProImage"
                  />
                  <p class="leftMsgBody">
                    {{ message.message }}
                  </p>
                </div>
                <p class="mess-time-l">{{ message.messageTime }}</p>
              </div>
              <!-- right side -->
              <div
                class="col-12"
                ref="explore"
                v-if="message.sender === currentUserId"
              >
                <div class="d-flex justify-content-end">
                  <p class="rightMsgBody">
                    {{ message.message }}
                  </p>
                  <img
                    class="rtmgsPhoto"
                    :src="currentUserPhoto"
                    alt="pic"
                    @error="replaceByDefaultProImage"
                  />
                </div>
                <div class="mess-time-r float-right">
                  <p>{{ message.messageTime }}</p>
                </div>
              </div>
            </div>
            <div class="scroll-to-me"></div>
          </div>
          <!-- chat box / write message -->
          <div class="row">
            <div class="col-12 bottomBox">
              <textarea
                v-model="text"
                class="writeBox"
                placeholder="Type a message ... "
                @keyup="sendMessageKey($event)"
              ></textarea>
              <button class="sendMsg" @click.prevent="sendMessage">
                <i class="fa fa-send"></i>
              </button>
            </div>
          </div>
        </div>
        <!-- chat contacts -->
        <div class="col-lg-3 px-lg-0 msgContact noDisplay">
          <div class="h-100 overflow-y-auto mr-lg-0 mxChatHeight">
            <div v-for="user in users" :key="user.messageId">
              <a @click="gotoMyMessage(user.messageId)">
                <div
                  class="msgContactGroup d-block"
                  :class="{ active: user.messageId === user_id }"
                >
                  <div
                    class="row"
                    v-if="
                      user.receiverId === currentUserId ||
                      user.senderId === currentUserId
                    "
                  >
                    <div class="col-3 d-block m-auto mr-1">
                      <img
                        :src="user.photo"
                        alt="pic"
                        @error="replaceByDefaultProImage"
                      />
                    </div>
                    <div class="col-9 d-flex flex-column">
                      <p class="font-weight-bold mb-0">
                        {{ user.TitleName }}
                      </p>
                      <p class="font-weight-light mb-0" style="color: #999">
                        {{ user.messageBody }}
                      </p>
                    </div>
                    <!-- <div class="col-3">
                    <span class="mb-0">
                      R = {{ user.receiverId }} || S = {{ user.senderId }} || MY
                      ={{ currentUserId }}
                    </span>
                  </div> -->
                  </div>
                </div>
              </a>
            </div>
            <div class="msgContactGroup" v-if="users.length === 0">
              <div class="row">
                <div class="col-12 d-block m-auto text-bold-700">
                  No Message List Founded
                </div>
                <!-- <div class="col-3">
                    <span class="mb-0">
                      R = {{ user.receiverId }} || S = {{ user.senderId }} || MY
                      ={{ currentUserId }}
                    </span>
                  </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!---Container Fluid-->
  </div>
</template>

<script type="javascript">
// import VueChatScroll from "vue-chat-scroll";
import userAPI from '../../services/user.API';
import proPic from '../../assets/images/profile/no-user.png';
import SOCKET_URL from '../../api/SocketURL';
import moment from 'moment';


export default {
  data() {
    return {
      newMessage: null,
      joined: false,
      currentUserRole: '',
      currentUserId: '',
      currentUserName: '',
      currentUserPhoto: '',
      text: '',
      messages: [],
      user_id: this.$route.params.id,
      user_name: '',
      photo: '',
      sender: '',
      receiver: '',
      imageFolder: '',
      users: [],
      searchText: '',
      searchOn: false,
    };
  },
  created() {
    this.moment = moment;
    // Get All Messages
    this.getAllMessages();
    this.getCurrentrProfile();
    this.getMyMessage();
    // set USER ID
    if (this.$route.params.id) {
      this.user_id = Number(this.$route.params.id);
      // console.log('User ID'+this.user_id);
      this.receiver = this.user_id;
    }
  },
  updated() {
    var elem = this.$el;
    elem.scrollTop = elem.clientHeight;
  },
  mounted() {
    setTimeout(() => {
      this.scrollToElement();
    }, 1000);
    // console.log(this.token);

    SOCKET_URL.on('my broadcast message', data => {
      // console.log(data);
      this.messages.push({
        message: data.message,
        sender: data.senderId,
        receiver: data.receiverId,
      });
    });
  },
  methods: {
    getCurrentrProfile() {
      userAPI.getUserProfile().then(response => {
        // console.log(response.data.data.role.role_id);
        this.currentUserRole = response.data.data.role.role_id;
        this.currentUserId = response.data.data.user_id;
        this.currentUserName = response.data.data.user_name;
        this.currentUserPhoto =
          response.data.data.imageFolderPath +
          '/' +
          response.data.data.profile_image;
        // console.log('My Role = ' + this.currentUserRole);
        // Get All Messages
      });
    },
    getAllMessages() {
      // Get All Messages
      userAPI.getAllMessages().then(response => {
        // console.log(response.data.data);
        this.imageFolder = response.data.imageFolder;
        this.users = response?.data?.data?.map(user => {
          return {
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
          };
        });
      });
    },
    gotoMyMessage(user_id) {
      this.user_id = user_id;
      this.$router.push('/messages/' + user_id);

      // get messages
      this.getMyMessage(user_id);

      // get Users
      // this.getUsers(user_id);
      this.scrollToElement();
    },

    // profile
    goToUserProfile() {
      if(this.currentUserRole === 1 || this.currentUserRole === 2){
      this.$router.push('/cpanel/user/' + this.user_id);
      }else{
      this.$router.push('/user/' + this.user_id);
      }
      this.scrollToElement();
    },

    // get messages
    getMyMessage() {
      // set messages
      // set ROLE ID
      if (this.user_id) {
        userAPI.getMyMessage(this.user_id).then(response => {
          // console.log(response.data);
          this.photo =
            response.data.imageFolder +
            '/' +
            response.data.messagingWith.profile_image;
          this.user_name = response.data.messagingWith.user_name;
          // console.log(this.user_name);
          this.messages = response.data.data.map(message => {
            return {
              message: message.message_body,
              sender: message.sender_id,
              receiver: Number(this.$route.params.id),
              messageTime: moment(message.updated_at).format(
                'MMMM Do YYYY h:mm a',
              ),
            };
          });
          // console.log(this.messages);
        });
        // console.log('Role = ' + this.currentUserRole);
      }
    },

    replaceByDefaultProImage(e) {
      e.target.src = proPic;
    },

    sendMessage() {
      this.getAllMessages();
      // console.log(this.text);
      // console.log(this.text.length);
      if (this.text.length !== 0) {
        this.addMessage();
      }
      this.text = '';
      this.scrollToElement();
    },

    sendMessageKey(ev) {
      if (ev.keyCode === 13 && ev.ctrlKey) {
        // console.log(' I am shift enter', ev.target.value);
        // console.log(ev.srcElement.value);
        ev.preventDefault();
        if (ev.target.value !== '') {
          this.text = ev.target.value += '\n';
        }
      } else if (ev.keyCode === 13) {
        ev.preventDefault();
        // console.log(' I am enter', ev.target.value);
        // console.log(this.text);
        if (ev.target.value !== '' || ev.target.value !== null) {
          this.addMessage();
          this.getAllMessages();
        }
        this.text = '';
        this.scrollToElement();
      }
    },
    addMessage() {
      // console.log(this.text.length);
      if (this.text.length > 1) {

        const msgObject = {
          message: this.text,
          receiverId: Number(this.$route.params.id),
        };

        // this.messages = this.messages.concat(msgObject);
         SOCKET_URL.emit('my message', msgObject);
      }
    },
    scrollToElement() {
      const el = document.getElementsByClassName('scroll-to-me')[0];

      if (el) {
        // Use el.scrollIntoView() to instantly scroll to the element
        el.scrollIntoView({ behavior: 'smooth' });
      }
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
  },
  name: 'ChatApp',
};
</script>

<style type="text/css" scoped>
html body .content .content-wrapper {
  padding: calc(2.2rem - 0.4rem) 0 0 calc(2.2rem - 0.4rem);
  margin-top: 4.51rem;
  margin-bottom: 0rem;
}
html body .app-content {
  padding-top: 0rem;
}
.topDiv {
  background: #f2f2f2;
  /* border-bottom: 1px solid #e8e8e8; */
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
.msg .topDiv .pprofile {
  background: #aededf;
  border-radius: 10px;
  height: 50px;
  width: 50px;
}
.msgContact .topDiv input.search {
  background: #ffffff;
  border: 1px solid #c8c8c8;
  border-radius: 15px;
  height: 50px;
  width: 19%;
  padding: 10px 20px;
}
.msgContact .msgContactGroup {
  background: #ebecf6;
  border-radius: 10px;
  opacity: 1;
  /* min-height: 80px; */
  height: auto;
  padding: 0.5rem;
  display: flex;
  width: 100%;
  margin: 0.5rem 0;
}
.msgContact .msgContactGroup:hover {
  background: #e8e8e8;
}
.msgContact .msgContactGroup.active {
  background: #123c3d;
  color: #fff;
}
.msgContact .msgContactGroup img {
  background: #ffffff;
  box-shadow: 0px 1px 2px #00000029;
  border-radius: 10px;
  width: 3rem;
  height: 3rem;
  padding: 0.2rem;
}
.msgContact .msgContactGroup p {
  /* color: #000000; */
  font-size: 15px;
  font-weight: 600;
  word-break: break-word;
  height: 20px;
  overflow: hidden;
}
.msgContact .msgContactGroup span {
  font-size: 12px;
  font-weight: 400;
  word-break: break-word;
}
.msgContact .mxChatHeight {
  max-height: 83vh;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 80px;
  padding: 0 25px 0 15px;
  background-color: #f8f8f8;
}
.msg .messageBody .leftMsgBody {
  background: #e1e1e1;
  border: 1px solid #c4c4c4;
  border-radius: 20px 20px 20px 0px;
  height: auto;
  color: #000;
  word-break: break-word;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  max-width: 80%;
  padding: 10px;
  margin: 0 0 0px 4rem;
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
  margin: 10px 30px 0;
  font-weight: 400;
  margin-right: 50px;
  white-space: pre-line;
}
/* .msg .messageBody {
  max-height: 65vh;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 90px;
  padding-bottom: 45px;
  margin-right: 10px;
  border-right: 1px solid #e3e3e3;
} */
.msg .messageBody {
  height: calc(90vh - 70px);
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 6.5rem;
  padding-bottom: 60px;
  margin-right: 10px;
  border-right: 1px solid #e3e3e3;
}
.msg textarea.writeBox {
  background: #ffffff;
  border: 2px solid #c9c9c9;
  border-radius: 20px;
  color: #000000;
  font-size: 15px;
  opacity: 0.7;
  text-align: left;
  font-weight: 400;
  height: 50px;
  width: 100%;
  padding: 10px 60px 10px 20px;
}
.msg .bottomBox {
  position: fixed;
  z-index: 10;
  background: #f8f8f8;
  bottom: 0px;
  padding: 10px 20px;
  display: flex;
  width: 63%;
  left: 260px;
}
.msg .sendMsg {
  position: absolute;
  right: 25px;
  background: transparent;
  border-radius: 50%;
  padding: 5px !important;
  border: none;
  color: #123c3d;
  margin: 5px 0px;
  font-size: 24px;
}
.rtmgsPhoto {
  width: 30px;
  height: 30px;
  margin: 0 15px;
  bottom: 10px;
  margin-bottom: 30px;
  position: absolute;
  background-color: #000;
  border: 2px solid #e8e8e8;
  border-radius: 25px;
}
.mess-time-r {
  font-size: 0.6rem;
  margin-right: 4rem;
}
.mess-time-l {
  font-size: 0.6rem;
  margin-left: 4rem;
}
.fa-times-circle {
  position: relative;
  right: 40px;
  font-size: 30px;
  top: 5px;
  color: #123c3d;
  cursor: pointer;
}
.backBtn {
  background: #123c3d;
  border: 1px solid #123c3d;
  border-radius: 10px;
  padding: 5px 10px;
  color: white;
  margin: 10px;
  margin-left: 0;
  margin-right: 20px;
}
@media (max-width: 767px) {
  .msg .messageBody {
    max-height: 80vh !important;
  }
  .msg .bottomBox {
    width: -webkit-fill-available;
    padding: 10px 40px 10px 10px !important;
    margin: 0;
    /* left: 0; */
    bottom: 60px !important;
  }
  .rtmgsPhoto {
    margin: 0 0px;
  }
  .topDiv {
    margin-left: -11px;
  }
  .msgContact {
    display: none;
  }
  .msg {
    padding-left: 0;
  }
  .msg .bottomBox {
    width: 100%;
  }
  .msg .sendMsg {
    right: 17px;
  }
  .msg .bottomBox {
    bottom: 0px !important;
  }
  .msg .bottomBox {
    padding: 10px 0px 10px 20px !important;
  }
  .msg .messageBody {
    margin-left: 10px;
  }
  .msg .messageBody .rightMsgBody {
    padding: 10px 20px;
    margin: 10px 10px;
    font-weight: 400;
    margin-right: 35px;
  }
  .msg .messageBody .leftMsgBody {
    margin-left: 35px;
  }
}
p.pointerC {
  cursor: pointer;
}
@media screen and (min-width: 768px) and (max-width: 900px) {
  .noDisplay {
    display: none;
  }
  input.search {
    min-width: 300px;
  }
}
</style>
