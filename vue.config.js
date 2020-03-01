const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const debug = process.env.NODE_ENV !== 'production';
const resolve = function (dir) {
    return path.resolve(__dirname, dir);
}

module.exports = {
    // 基本路径
    publicPath: debug ? "/" : "././",
    // 输出文件目录
    outputDir: 'iim-vip-client-system',
    assetsDir: 'assets', // 静态资源目录 (js, css, img, fonts)
    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,
    // use the full build with in-browser compiler?
    // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
    // compiler: false,

    // webpack配置
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md   webpack链接API，用于生成和修改webapck配置
    chainWebpack: (config) => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                options.compilerOptions.preserveWhitespace = false
                return options
            })
        config.resolve.alias
            .set('vue$', 'vue/dist/vue.esm.js')
            .set('@', resolve('src'))

    },
    configureWebpack: (config) => {// webpack配置，值位对象时会合并配置，为方法时会改写配置
        // 确保静态资源
        config.resolve.extensions = ['.js', '.vue', '.json', '.css']
        config.plugins.push(
            new CopyWebpackPlugin([{ from: 'public/', to: 'public' }]),
        )
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true, // Must be set to true if using source-maps in production
                terserOptions: {
                    compress: {
                        drop_console: true,
                        drop_debugger: true
                    }
                }
            })
        } else {
            // 为开发环境修改配置...
        }

    },
    // vue-loader 配置项
    // https://vue-loader.vuejs.org/en/options.html
    // vueLoader: {},

    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: true,
    // css相关配置 配置高于chainWebpack中关于css loader的配置
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        // 开启 CSS source maps?true
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {},
        // 启用 CSS modules for all css / pre-processor files.
        requireModuleExtension: true
    },
    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores 构建时开启多进程处理babel编译
    parallel: require('os').cpus().length > 1,
    // 是否启用dll
    // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
    // dll: true,

    // PWA 插件相关配置
    // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    pwa: {},
    // webpack-dev-server 相关配置
    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
        proxy: null, // 设置代理
        before: app => { }
    },
    // 第三方插件配置
    pluginOptions: {
        // ...
    }
}