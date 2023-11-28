import { createApp } from 'vue';
import App from './view/App';
import router from './router';
import store from './store';
// import setupInterceptors from './services/setupInterceptors';

// setupInterceptors(store);

//Bootstrap
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery';

// Mosha Toast
import moshaToast from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css';

//Custom CSS
import './assets/css/main.css';


//FontAwesome
import { FontAwesomeIcon } from './plugins/font-awesome';

createApp(App)
  .use(router)
  .use(store)
  .use(moshaToast)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
