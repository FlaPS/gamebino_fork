const merge = require('webpack-merge')
const Dotenv = require('dotenv-webpack')
const common = require('./commonDev.js')

module.exports = merge(common, {
  plugins: common.plugins.concat(
      [
          new Dotenv({
            path: './.env.local',
            safe: true,
            systemvars: true,
          }),
      ]
  ),
})
