/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  devtool: 'source-map',
  entry: './main.ts',
  target: 'electron-main',
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
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js'
  },
  // node: {
  //   __dirname: true
  // },
  optimization: {
    minimize: false
  }
};
