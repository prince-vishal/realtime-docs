import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Axios from "axios";
import {loadProgressBar} from 'axios-progress-bar'
import 'axios-progress-bar/dist/nprogress.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import titleMixin from './mixins/titleMixin'

window.Pusher = require('pusher-js');

Axios.defaults.baseURL = "https://docs-backend.herokuapp.com";
Vue.prototype.$http = Axios;

loadProgressBar({}, Axios);

Vue.mixin(titleMixin);


const token = localStorage.getItem('token');
if (token) {
    Vue.prototype.$http.defaults.headers.common['Authorization'] = token;
}

Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
    store,
    router
}).$mount('#app');
