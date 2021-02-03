const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const slsw = require('serverless-webpack');
const { NODE_ENV = 'production' } = process.env;

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: slsw.lib.entries,
  mode: NODE_ENV,
  target: 'node',
  externals: [nodeExternals()],
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.mjs', '.json', '.ts'],
    symlinks: false,
    cacheWithContext: false,
    alias: {
      '@config': path.resolve(__dirname, '../src/config/'),
      '@core': path.resolve(__dirname, '../src/core/'),
      '@lib': path.resolve(__dirname, '../src/lib/'),
      '@handlers': path.resolve(__dirname, '../src/handlers/'),
      '@tests': path.resolve(__dirname, '../tests/'),
    },
  },
  plugins: [new CleanWebpackPlugin(), new Dotenv()],
  module: {
    rules: [
      {
        test: /\.(tsx?)$/,
        loader: 'ts-loader',
        exclude: [
          [
            path.resolve(__dirname, '../.node_modules'),
            path.resolve(__dirname, '../.serverless'),
            path.resolve(__dirname, '../.webpack'),
          ],
        ],
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
      },
    ],
  },
};
