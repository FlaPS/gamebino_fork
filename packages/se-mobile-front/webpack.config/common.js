const path = require('path')
const webpack = require('webpack')

var buildDate = new Date()

function normalize(val) {
    if(String(val).length === 4)
      return String(val).slice(2,4)
    if(val === 0)
      return '00'
    if (val < 10)
      return '0' + val
  return val
}

function getVersionString() {
    var date = new Date()
    return normalize(date.getFullYear()) + '' +
        normalize(date.getMonth() + 1) + '' +
        normalize(date.getDate()) + '/' +
        normalize(date.getHours()) + '' +
        normalize(date.getMinutes()) + '' +
        normalize(date.getSeconds()) + ''
}

var __VERSION__ = getVersionString()

console.log(__VERSION__)

module.exports = {
  entry: {
    mobile: './src/indexDev.tsx',
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../public'),
    publicPath: '/',
  },

  plugins: [
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ru/),
    new webpack.IgnorePlugin( /faker/)
  ],

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: './',
              },
            },
          },
        ],
      },
      {
        test: /.ts?$|.tsx?$/,
        exclude: /\.story\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              // disable type checker - we will use it in fork plugin
              transpileOnly: true,
              allowTsInNodeModules: true
            },
          },
        ],
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(__VERSION__)
    })
  ]
}
