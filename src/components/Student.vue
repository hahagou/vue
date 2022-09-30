<template>

   <div class="student">
     <!-- <h1>{{msg}}</h1> -->
     <h2 >学生名:{{name}}</h2>
     <!-- <h2 @click="addage" >学生年龄:{{age}}</h2> -->
     <h2 >学生性别:{{sex}}</h2>
     <button @click="sendStudName">Student To School</button>

      <!-- <button >年岁增长，无法修补</button> -->
    <!-- <button @click="sendStudName" >获取学生名给app</button>
    <button @click="unbind">解绑</button>
    <button @click="teardwn">销毁当前组件的实例对象VC</button> -->
     <!-- <input type="text" v-fbind:value="name" /> -->

  </div>
</template>

<script>
  
  //  import {shar,shar2} from '../shar'

   import pubsub from "pubsub-js"

   export default {

    name:"Student",

        data(){
            return {
                msg:'我是尚硅谷的学生', 
                name:"几把猫",
                sex:"男",
                // myage:this.age              
                age:18
            }
        },
        // props:{
          
        //   name:String,
        //   age:Number,
        //   sex:String

        // // },
          methods:{

            sendStudName(){    

        //          // 触发student 组件实例身上的atguigu事件
        //          this.$emit('atguigu',this.name)
        //        //   this.$emit('demo')

               // this.$bus.$emit('hello',this.name)

              pubsub.publish('hello',666)
            },
        //      unbind(){

        //        //解绑单个自定义事件  
        //       this.$off('atguigu') //     

        //        // 解绑多个自定义事件
        //       //  this.$off(['atguigu','demo'])

        //       // 解绑所有的自定义事件
        //       //  this.$off()

        //      },
        //      teardwn(){

        //          this.$destroy()

        //      },
        //      addage(){
        //          console.log('年岁增长');   
        //          this.age++
        //      }

        // //   // updatage(){

        // //   //       this.myage++   
        // //   // },
        // //   showName(){

        // //       alert(this.name)
        // //   }

         }
        // mixins:[shar,shar2]
  }

 //   export default school;


</script>


<style scoped>
 .student{
     background-color: rgb(233, 141, 20);
     color:black
 }



</style>

