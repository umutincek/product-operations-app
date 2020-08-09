import Vue from 'vue'
import App from './App.vue'
import { router } from "./router";
import store from "./store";
import axios from 'axios'

axios.defaults.baseURL = 'https://urun-islemleri-prod-1e38e.firebaseio.com'

Vue.filter('currency', (value) => {
  return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits : 2 }) + ' TL'
})

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
})
