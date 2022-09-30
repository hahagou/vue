<template>
   <div class="app">   
       <!-- <Student name='李四' sex='女' :age="18"/>     
       -->

       <!-- {{msg}}
        <School/>
        <Student/> -->
        <Hello/>

        <!-- {{msg}} {{studName}} -->


       <!-- <School :getSchName="getSchName"/> -->
       <!-- <Student @atguigu="getstud" @demo="m1"/> -->

        <!-- <Student ref="studn"/> -->

        
         <!-- <Student ref="studn" @click.native="show"/> -->

       


   </div>
</template>

<script>


// import Student from './components/Student'
// import School from './components/School'
 
 
import Hello from './components/Hello'

//import Test from './components/Test'

export default {

    name:'App',
    // data(){
    //    return {
    //        msg:"这是APP:",
    //        studName:""
    //    }        
    // },
    components:{
    // School,
    // Student
    //Test 
    Hello
    },
    // methods:{

    //    getSchName(name){
    //        console.log('收到了学校名:',name);

    //    },

    //    getstud(name){

    //        console.log('getstud调用了',name);
    //        this.studName=name
    //    },

    //    m1(name){
    //       console.log('demo被触发了'); 
    //    },

    //    show(){
    //        alert("aaa")

    //    }



    // },
    // mounted(){

    //   //  this.$refs.studn.$on('atguigu',this.getstud)
        
    // }


}
</script>

 <style scoped>
 
 .app{
     background-color:bisque;
     
}

 </style>