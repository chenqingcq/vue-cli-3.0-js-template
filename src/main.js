// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import md5 from 'js-md5';
import Iview from 'iview';
import ElementUI from 'element-ui';
import router from './router';
import store from './store/store';
import i18n from '@/common/lang/lang';
import Popup from '@/common/popup/popup';
import Toast from '@/common/toast/toast';
import Preview from '@/common/preview/preview';
import Ebus from '@/utils/ebus';
import { filters } from '@/utils/filter';

import 'iview/dist/styles/iview.css';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Popup);
Vue.use(Toast);
Vue.use(Preview);
Vue.use(Iview);
Vue.use(Ebus);
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
});
Vue.prototype.$md5 = md5;
Vue.config.productionTip = false;

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});

console && (Object.keys(console).forEach(key => {
  global[key] = console[key];
}));

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  components: { App },
  template: '<App/>'
})
