import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import dynamicForm from 'vue-dynamic-form-iview'
import 'vue-dynamic-form-iview/dist/vue-dynamic-form.css'
Vue.use(ViewUI)
Vue.use(dynamicForm)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
