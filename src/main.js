import Vue from 'vue'
import App from './App'
import axios from 'axios'
import router from './router'
import "babel-polyfill"
import userInfo from './util/config.js'
import ElementUI from 'element-ui'
import '../static/projectTheme/theme/index.css' // ElementUI主题样式
import './assets/font/iconfont.css' // 字体图标
import store from './store'
Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.userInfo = userInfo;
Vue.prototype.$store = store;
Vue.prototype.$reqs = axios

Vue.filter('time', function (val) {
  let time = '';
  if (val) {
    if (val.length == 8) {
      time = val.substring(0, 4) + '-' + val.substring(4, 6) + '-' + val.substring(6, 8);
    } else if (val == '' || val == null || val == undefined) {
      time = '暂无时间'
    } else {
      time = val.substring(0, 4) + '-' + val.substring(4, 6) + '-' + val.substring(6, 8) + ' ' + val.substring(8, 10) + ':' + val.substring(10, 12) + ':' + val.substring(12, 14);
    }
  }
  return time;
})


router.beforeEach((to, from, next) => {
  window.document.title = "运营系统";
  next();
})

new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
