const merge = require('webpack-merge')
const path = require('path')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const common = require('./common.js')
const host = '0.0.0.0'
const port = 8085

module.exports = merge(common, {
  mode: 'development',

  plugins: common.plugins.concat([
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../template/app.html'),
      filename: path.resolve(__dirname, '../public/app.html'),
      hash: true,
      excludeChunks: ['sw']
    }),

  ]),

  devServer: {
    historyApiFallback: {
      logger: console.log.bind(console),
      verbose: true,
      rewrites: [
        { from: /\/app\/.*/, to: '/app.html' }
      ]
    },
    contentBase: [path.join(__dirname, '..', 'public')],
    port,
    host,
    disableHostCheck: true,
    allowedHosts: [
      '127.0.0.1:8085',
      '127.0.0.1:3000',
      '127.0.0.1:80',
    ],
    hot: true,
    proxy: {
      '/api': 'http://127.0.0.1:8084',
      '/ws': {
        target: 'ws://127.0.0.1:8084',
        ws: true
      },
    },
    inline: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
})
