<template>

   <div>
     <h1>{{msg}}</h1>
     <h2>学生名:{{name}}</h2>
     <h2>学生年龄:{{age}}</h2>
     <h2>学生性别:{{sex}}</h2>
  </div>
</template>

<script>


   export default {

    name:"Student",

        data(){
            return {
              msg:'我是尚硅谷的学生',
              name:"张三",
              age:18,
              sex:'男' 
            }
        }
        
  }

 //   export default school;


</script>

