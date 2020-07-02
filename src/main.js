/*
 * @Author: your name
 * @Date: 2020-06-15 16:26:17
 * @LastEditTime: 2020-06-30 22:21:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \moties_cli\src\main.js
 */ 
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


import Calendar from 'v-calendar/lib/components/calendar.umd'
import DatePicker from 'v-calendar/lib/components/date-picker.umd'
Vue.component('v-calendar', Calendar)
Vue.component('v-date-picker', DatePicker)





Vue.config.productionTip = false
Vue.use(ElementUI);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
