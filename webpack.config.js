const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: [
    './tests/index.js'
  ],
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'test.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    alias: {
      utils: path.join(__dirname, './src/utils/'),
      renders: path.join(__dirname, './src/renders/'),
      component: path.join(__dirname, './src/component/'),
      instances: path.join(__dirname, './src/instances/'),
      vdom: path.join(__dirname, './src/vdom/')
    }
  },
  plugins: [new HtmlWebpackPlugin()]
}