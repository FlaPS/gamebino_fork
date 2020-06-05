const merge = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const common = require('./common.js')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin




module.exports = merge(common, {
  mode: 'production',
  /*
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  */
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, '../../se-mobile-front/public'),
    publicPath: '/',
  },


  plugins: common.plugins.concat([
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../template/index.html'),
      filename: path.resolve(__dirname, '../../se-mobile-front/public/adminApp.html'),
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
    new Dotenv({
      path: './.env.prod',
      safe: true,
      systemvars: true,
    }),
  ]),
})
