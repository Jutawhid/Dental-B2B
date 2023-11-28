import ProfileService from '../services/profile.service';
export const explore = {
  namespaced: true,
  state: {
    user: 'Data Loading...',
  },
  mutations: {
    GET_EXPLORE(state, user) {
      state.user = user;
    },
    GETFailure(state) {
      state.user = null;
    },
  },
  actions: {
    loadExplore({ commit }) {
      return ProfileService.getExploreAllUser().then(
        user => {
          commit('GET_EXPLORE', user);
        },
        error => {
          commit('GETFailure');
          return Promise.reject(error);
        },
      );
    },
  },
};
