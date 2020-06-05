const path = require('path')

module.exports = {
  entry: {
    adminApp: './src/index.tsx',
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../public'),
    publicPath: '/',
  },

  plugins: [],

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
         /* {
            loader: 'postcss-loader',
            options: {
              config: {
                path: './',
              },
            },
          },*/
        ],
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
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
              allowTsInNodeModules: true,
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
}
