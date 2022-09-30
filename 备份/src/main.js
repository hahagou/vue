//import Vue from 'vue/dist/vue.esm.js'
import Vue from 'vue'

import App from './App.vue'


new Vue({

    el:"#root",
     template:"<App></App>",
     components:{App},
    //render: h => h(App),

    // render(createElement){

    //     return createElement("h1","what the fuck")
    // }
  
})