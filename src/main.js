import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

import 'axios-progress-bar/dist/nprogress.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import titleMixin from './mixins/titleMixin'
import Api from './Api'
window.Pusher = require('pusher-js');


Vue.mixin(titleMixin);

Vue.prototype.$http = Api();
Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
    store,
    router
}).$mount('#app');
