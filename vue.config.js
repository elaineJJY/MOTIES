module.exports = {
    publicPath: '/',
    outputDir: 'dist',
    assetsDir:'', 
    productionSourceMap: false,
    configureWebpack:()=>{}, 
    chainWebpack:()=>{},  
    css: {
        extract: true,
        sourceMap: false,
        loaderOptions:{}
    },
   
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        open:true
    },
   
    pluginOptions: {
    // ...
    }
}