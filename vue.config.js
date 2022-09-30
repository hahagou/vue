const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,  
  runtimeCompiler: true,
  pages:{
      index:{
        entry:"./src/main.js"
      },
  },
  lintOnSave:false,
  // devServer:{  // 代理服务器

  //   proxy:'http://localhost:5000'

  // }
  // 方式2：


  devServer:{   

    proxy:{

        '/atg':{

          target:'http://localhost:5000',
          pathRewrite:{'^/atg':''},
          // ws:true,
          changeOrigin:false  // 控制请求头中的 host 值

        },
        '/diao':{

          target:'http://localhost:5001',
          pathRewrite:{'^/diao':''},
          // ws:true,
          changeOrigin:false  // 控制请求头中的 host 值

        },  

        // '/foo':{


        // }


    }
  
  }
    

})
