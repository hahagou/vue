<template>
  <div>
      <h1 v-text="msg" ref="title"></h1>
      <button @click="show" >点我</button>
      <School/>
  </div>
</template>

<script>

import School from './components/School.vue'

export default {
    name:"App",
    data(){
        return {
            
            msg:"run far away"
        }
    },
    components:{
        School
    },
    methods:{
        show(){
            console.log(this.$refs.title);
        }
    }

}
</script>

 