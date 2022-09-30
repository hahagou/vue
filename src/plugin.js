export default {

    install(Vue){

        // console.log('@@@install');
        
        Vue.filter('mySlice',function(value){

                return value.slice(0,4)

        })
        

        Vue.directive('fbind', {
            bind(){
              console.log('bind');
            },
            inserted(){
              console.log('inserted');
            },
            update(){
              console.log('update');
            }
  
  
          })


          Vue.mixin({

            data(){
               return{ 
                 x:100,
                 y:200
                }
             }

          })


          Vue.prototype.hello =()=>(alert('proto wtf'))


    }

}