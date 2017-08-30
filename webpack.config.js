const { CheckerPlugin } = require('awesome-typescript-loader')
const { resolve, join } = require('path')

module.exports = {
  entry: [
    './src/index.ts'
  ],
  output: {
    filename: 'bundle.js',
    path: join(__dirname, '/dist'),
    publicPath: '/'
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  },

  module: {
    rules: [
      { test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        exclude: resolve(__dirname, 'node_modules'),
        include: resolve(__dirname, 'src')
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },

      { test: /\.s[ac]ss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      }
    ]
  },

  plugins: [
    new CheckerPlugin()
  ],

  devServer: {
    historyApiFallback: true
  }
}
