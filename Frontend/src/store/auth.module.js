import AuthService from '../services/auth.service';
import ProfileService from '../services/profile.service';
import ls from 'localstorage-slim';
import { AES } from 'crypto-js';
import encUTF8 from 'crypto-js/enc-utf8';

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

const user = JSON.parse(ls.get('user'));

const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, user) {
      return AuthService.login(user).then(
        user => {
          commit('loginSuccess', user);
          // console.log(user.data.role);
          return Promise.resolve(user);
        },
        error => {
          commit('loginFailure');
          return Promise.reject(error);
        },
      );
    },
    logout({ commit }) {
      AuthService.logout();
      commit('logout');
    },
    register({ commit }, user) {
      return AuthService.register(user).then(
        response => {
          commit('registerSuccess');
          return Promise.resolve(response.data);
        },
        error => {
          commit('registerFailure');
          return Promise.reject(error);
        },
      );
    },
    refreshToken({ commit }, accessToken) {
      commit('refreshToken', accessToken);
    },
    reloadPhoto({ commit }){
      return ProfileService.getUser().then(
        photo => {
         commit('reLoadPhoto', photo.profile_image);
        },
        error => {
          commit('GETFailure');
          return Promise.reject(error);
        },
      );
    },
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    reLoadPhoto(state, photo) {
      state.user.profile.profile_image = photo;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    },
    refreshToken(state, accessToken) {
      state.status.loggedIn = true;
      state.user = { ...state.user, accessToken: accessToken };
    },
  },
};
