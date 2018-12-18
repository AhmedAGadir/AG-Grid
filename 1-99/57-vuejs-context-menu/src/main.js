import Vue from 'vue'
import App from './App.vue';
import "../node_modules/ag-grid-community/dist/styles/ag-grid.css";
import "../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css";
import 'ag-grid-enterprise';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')