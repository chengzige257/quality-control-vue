const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8081,
    host: '127.0.0.1',
    proxy: {//再配置一个代理程序:
      '/': {
        target: `http://127.0.0.1:8080`,//后端接口地址
        changeOrigin: true,
        ws: false,
        pathRewrite: {
          '^/': ''
        }
      }
    }
  }
})
