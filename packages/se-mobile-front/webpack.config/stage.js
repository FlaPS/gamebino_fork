const merge = require('webpack-merge')
const path = require('path')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const common = require('./common.js')

module.exports = merge(common, {
  mode: 'development',

  plugins: common.plugins.concat([
    new Dotenv({
      path: './.env.stage',
      safe: true,
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
