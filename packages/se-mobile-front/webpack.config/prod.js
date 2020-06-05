const merge = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const common = require('./common.js')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const WebpackMonitor = require('webpack-monitor')
const Jarvis = require('webpack-jarvis')
const webpack = require('webpack')


module.exports = merge(common, {
  mode: 'production',

  plugins: common.plugins.concat([
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../template/app.html'),
      filename: path.resolve(__dirname, '../public/app.html'),
      excludeChunks: ['sw'],
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new BundleAnalyzerPlugin(),
    new Dotenv({
      path: './.env.prod',
      safe: true,
      systemvars: true,
    }),
   /* new WebpackMonitor({
      capture: true, // -> default 'true'
    target: '../monitor/myStatsStore.json', // default -> '../monitor/stats.json'
    launch: true, // -> default 'false'
    port: 3030, // default -> 8081
    excludeSourceMaps: true // default 'true'
    }),

    new Jarvis({
      port: 1337 // optional: set a port
    })*/
  ]),
})
