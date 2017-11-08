var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var webpack = require('webpack')
var env = process.env.MIX_ENV || 'dev'
var isProduction = (env === 'prod')

module.exports = {
  entry: {
    'app': ['./js/app.js', './css/app.scss']
  },
  output: {
    path: path.resolve(__dirname, '../priv/static/'),
    filename: 'js/[name].js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [{
      test: /\.(sass|scss)$/,
      include: /css/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          {loader: 'css-loader'},
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                path.resolve('node_modules/bootstrap/scss')
              ],
              sourceComments: !isProduction
            }
          }
        ]
      })
    }, {
      test: /\.(js|jsx)$/,
      include: /js/,
      use: [
        { loader: 'babel-loader' }
      ]
    }]
  },
  plugins: [
    new CopyWebpackPlugin([{ from: './static' }]),
    new ExtractTextPlugin('css/app.css'),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      Popper: ['popper.js', 'default']
    })
  ]
}
