<template>
  <div>
      <!-- <button @click="isShow=!isShow">按我消失</button>
      <h1 class="come" v-show="isShow">{{msg}}</h1> -->

        <button @click="getStudent">获取学生消息</button>  

         <button @click="getCar">获取汽车消息</button>  

  </div>
</template>


<script> 

 import axios from 'axios'
export default {
  name: 'Test',
  // data () {
  //   return {
  //     msg: 'Welcome to Your Vue.js App',
  //     isShow:true
  //   }
  // },
   
     methods:{
       getStudent(){
                    // http://localhost:5000/students  http://localhost:8080/students
          axios.get('http://localhost:8080/atg/students').then(

                response=>{
                    console.log('获取成功：',response.data);
                },
                error=>{
                  console.log('获取失败：',error.message);
                }

          )
       },
        getCar(){
                    // http://localhost:5000/students  http://localhost:8080/students
          axios.get('http://localhost:8080/diao/cars').then(

                response=>{
                    console.log('获取成功：',response.data);
                },
                error=>{
                  console.log('获取失败：',error.message);
                }

          )
       }



     }


 
  // template:`<div class='test'><hr> <h2>这是Test组件</h2>
  //       <h1>只写template字段而不写标签是可以的</h1>
  // </div>`
}




</script>

<style scoped>
  

  .test{
      background-color: chartreuse;
  }


  .come{
    animation: atgui 1s linear;
  }

  .go{
    animation: atgui 1s reverse;  
  }

  @keyframes atgui{

      from{
        transform: translateX(-100%);
      }

      to{
         transform: translateX(0px);
      }
  }


</style>