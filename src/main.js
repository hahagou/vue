import Vue from 'vue' 
import App from './App.vue'
Vue.config.productionTip=false

// import {shar,shar2} from './shar'

// Vue.mixin(shar)
// Vue.mixin(shar2)

// import plugins from './plugin'
// Vue.use(plugins)


// 方法一： 用 VC 做中介 传递 兄弟之间的消息
// const Demo= Vue.extend({})
// const d=new Demo()
// Vue.prototype.x=d


new Vue({

    el:'#root',
    render:h =>h(App),

    // beforeCreate(){

    //     Vue.prototype.$bus= this  // 这就是全局事件总线
    // }

    


})