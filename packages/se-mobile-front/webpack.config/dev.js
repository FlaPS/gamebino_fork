const merge = require('webpack-merge')
const path = require('path')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const common = require('./common.js')
const WebpackMonitor = require('webpack-monitor')
const Jarvis = require('webpack-jarvis')
//common.devServer.proxy["/api"] = "http://165.22.73.253:3000/"
module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimize: false,
    },
  plugins: common.plugins.concat([
    new Dotenv({
      path: './.env.development',
      systemvars: true,
    }),
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../template/app.html'),
        filename: path.resolve(__dirname, '../public/app.html'),
        hash: true,
        excludeChunks: ['sw']
    })

  ]),

})
