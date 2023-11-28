import notificationList from '../services/user.API';
// import ProfileService from '../services/profile.service';
import { AES } from 'crypto-js';
import encUTF8 from 'crypto-js/enc-utf8';
import ls from 'localstorage-slim';
// import SOCKET_URL from '../api/SocketURL.js';
// import io from 'socket.io-client';
ls.config.encrypt = true;
ls.config.secret = 'my-secret-password';
ls.config.decrypter = (data, secret) => {
  try {
    return JSON.parse(AES.decrypt(data, secret).toString(encUTF8));
  } catch (e) {
    // incorrect secret, return the encrypted data instead / or null
    return data; // or return null;
  }
};
// let user = JSON.parse(ls.get('user'));
// const currentUser = async () => {
//   await ProfileService.getUser().then(users => {
//     return users;
//   });
// };
// console.log(currentUser);

export const notification = {
  namespaced: true,
  state: {
    notifications: 'No Data',
    count: null,
  },
  actions: {
    notiList({ commit }) {
      return notificationList.getNotificationList().then(
        notifications => {
          commit(
            'GET_NOTIFICATIONLIST',
            notifications.data.data.map(item => {
              return {
                id: item.id,
                title: item.title,
                url: item.url,
                is_seen: item.is_seen,
              };
            }),
          );
          return Promise.resolve(notifications);
        },
        error => {
          commit('GETNOTIFailure');
          return Promise.reject(error);
        },
      );
    },
    notiCount({ commit }) {
      return notificationList.getNotificationList().then(
        count => {
          commit('GET_NOTIFICATIONCOUNTT', count.data.unseen);
          return Promise.resolve(count);
        },
        error => {
          commit('GETNOTIFailure');
          return Promise.reject(error);
        },
      );
    },
    logout({ commit }) {
      commit('GETNOTIFailure');
    },
    addNotification({ commit }, notifications) {
      commit('PUSH_NOTIFICATION', notifications);
    },
    addNotiCount({ commit }) {
      // console.log(count);
      commit('PUSH_NOTICOUNT');
    },
    removeNotiCount({ commit }) {
      // console.log(count);
      commit('POP_NOTICOUNT');
    },
  },
  mutations: {
    GET_NOTIFICATIONLIST(state, notifications) {
      state.notifications = notifications;
      // console.log(state);
      // console.log(state.notifications);
    },
    GET_NOTIFICATIONCOUNTT(state, count) {
      state.count = count;
      // console.log(state);
      // console.log(state.count);
    },
    GETNOTIFailure(state) {
      state.notifications = null;
      state.count = null;
    },
    PUSH_NOTIFICATION(state, notifications) {
      state.notifications.unshift(notifications);
    },
    PUSH_NOTICOUNT(state) {
      state.count = state.count + 1;
      // console.log(state.count);
    },
    POP_NOTICOUNT(state) {
      state.count = state.count - 1;
      // console.log(state.count);
    },
  },
};
