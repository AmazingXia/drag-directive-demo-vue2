import Vue from 'vue';
import App from './App.vue';
import './directives/drag';
import './directives/resizer';

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
