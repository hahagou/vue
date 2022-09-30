<template>
    <div class="demo">
    <h2>学校名:{{schoolName}}</h2>
    <h2>学校地址:{{address}}</h2>  
    </div>
</template>

<script>


   export default {

    name:"School",

    template:`<div>
    <h2>学校名:{{schoolName}}</h2>
    <h2>学校地址:{{address}}</h2>  
    </div>`,

        data(){
            return {
                schoolName:"尚硅谷",
                address:"北京昌平"
            }
        },
        methods:{

            show(){
                
            }
        }
  }

 //   export default school;


</script>

<style>
 .demo{
     background-color: orange;
 }
</style>