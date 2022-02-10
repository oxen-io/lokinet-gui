/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    mainFields: ['main', 'module', 'browser']
  },
  entry: './src/app/app.tsx',
  target: 'electron-renderer',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        use: [{ loader: 'babel-loader' }],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|woff2|woff|ttf|svg|eot)$/i,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      }
    ]
  },
  devServer: {
    static: { directory: path.join(__dirname, './dist'), publicPath: '/' },
    historyApiFallback: true,
    compress: true,
    hot: true,
    port: 4000
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name].js',
    publicPath: '/'
  },
  plugins: [new HtmlWebpackPlugin({ title: 'Lokinet GUI' })],
  optimization: {
    minimize: false
  }
};
