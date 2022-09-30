 

<script>
    // import {shar,shar2} from '../shar'

   import pubsub from "pubsub-js"

   export default {

    name:"School",
    props:['getSchName'],
    template:`<div class='school'>
    <h2>学校名:{{name}}</h2>
    <h2>学校地址:{{address}}</h2>  
    </div>`,

        data(){
            return {
                name:"尚硅谷啊古灌灌灌灌",
                address:"北京昌平"
            }
        },        
        methods:{

            // showName(){

            //     alert(this.schoolName)

            // }

            sendSchName(){

               this.getSchName(this.name)      

            }

        },
        // mixins:[shar,shar2],
        mounted(){

            // this.$bus.$on('hello',(data)=>{

            //       console.log('This is School',data);  
            // })
            
         this.pubid=  pubsub.subscribe('hello',(msg,data)=>{
                console.log('student发布了消息,school订阅消息,回调执行',data);
            })
        },
        beforeDestroy(){


           //  this.$bus.$off('hello')
           pubsub.unsubscribe(this.pubid)

        }
  }
 

</script>

<style scoped>
 .school{
     background-color: rgba(32, 195, 216, 0.89);
 }
</style>