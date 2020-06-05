const merge = require('webpack-merge')
const path = require('path')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const common = require('./common.js')

const host = '0.0.0.0'
const port = 8086


module.exports = merge(common, {
  mode: 'development',

  plugins: common.plugins.concat([
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../template/index.html'),
      filename: path.resolve(__dirname, '../public/index.html'),
      hash: true
    }),
  ]),

  devServer: {
    contentBase: [path.join(__dirname, '..', '..', 'se-mobile-front', 'public')],
    port,
    disableHostCheck: true,
    allowedHosts: [
      '127.0.0.1:8085',
      '127.0.0.1:3000'
    ],
    hot: true,
    proxy: {
      '/api': 'http://127.0.0.1:8084',//
      '/ws': {
        target: 'ws://127.0.0.1:8084',
        ws: true
      },
    },
    inline: true,
    host,
    headers: { 'Access-Control-Allow-Origin': '*' }
  },
})
