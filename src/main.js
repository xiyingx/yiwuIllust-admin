import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router/index'
import store from './store/index'
import { VueMasonryPlugin } from 'vue-masonry';
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueMasonryPlugin);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
