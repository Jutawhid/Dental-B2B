import ProfileService from '../services/profile.service';
export const profile = {
  namespaced: true,
  state: {
    user: '',
    role_id: null,
    user_id: null,
  },
  mutations: {
    GET_USER(state, user) {
      state.user = user;
      // console.log(state);
      // console.log(state.user);
    },
    GET_ROLE(state, role_id) {
      state.role_id = role_id;
      // console.log(state);
      // console.log(state.role_id);
    },
    GET_USERID(state, user_id) {
      state.user_id = user_id;
      // console.log(state);
      // console.log(state.user_id);
    },
    GETFailure(state) {
      state.user = null;
      state.role_id = null;
      state.user_id = null;
    },
  },
  actions: {
    loadUser({ commit }) {
      return ProfileService.getUser().then(
        user => {
          commit('GET_USER', user);
          commit('GET_ROLE', user.role.role_id);
          commit('GET_USERID', user.user_id);
        },
        error => {
          commit('GETFailure');
          return Promise.reject(error);
        },
      );
    },
    logout({ commit }) {
      commit('GETFailure');
    },
  },
};
