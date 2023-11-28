import { createStore } from 'vuex';
import { auth } from './auth.module';
import { profile } from './profile.module';
import { notification } from './notification.module';

const store = createStore({
  modules: {
    auth,
    profile,
    notification,
  },
});

export default store;
