const merge = require('webpack-merge')
const path = require('path')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const common = require('./common.js')

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, '../../se-mobile-front/public/'),
    publicPath: '/',
  },


  plugins: common.plugins.concat([
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../template/index.html'),
      filename: path.resolve(__dirname, '../../se-mobile-front/public/adminApp.html'),
      hash: true,
      minify: false,
    }),
    new Dotenv({
      path: './.env.prod',
      safe: true,
      systemvars: true,
    }),
  ]),
})
