import path from 'path';
import webpack from 'webpack';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';
import {
  webpackIsomorphicToolsConfig,
} from './config';

const {
  authUrl,
  baseUrl,
} = process.env;

const _DEV_ = (process.env.NODE_ENV || 'development') === 'development';

const isomorphicPlugin = new WebpackIsomorphicToolsPlugin(webpackIsomorphicToolsConfig).development(_DEV_);

const config = {
  context: path.resolve('./'),
  devtool: _DEV_ ? 'inline-source-map' : false,
  debug: _DEV_,
  entry: [
    'babel-polyfill',
    'webpack-hot-middleware/client',
    './src/client',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        authUrl,
        baseUrl,
      }),
    }),
    isomorphicPlugin,
  ],
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
    ],
    loaders: [
      {
        test: isomorphicPlugin.regular_expression('images'),
        loader: 'url',
        query: {
          limit: 10240,
        },
      },
      {
        test: isomorphicPlugin.regular_expression('style'),
        loaders: [
          'style',
          'css?modules&localIdentName=[path][name]__[local]--[hash:base64:3]',
          'postcss',
          'sass',
        ],
      },
      {
        test: /\.jsx?$/,
        loaders: [
          'react-hot',
          'babel',
        ],
        include: path.join(__dirname, 'src'),
      },
    ],
  },
  resolve: {
    modulesDirectories: [
      `${__dirname}/src`,
      `${__dirname}/src/common`,
      'node_modules',
    ],
    extensions: [
      '',
      '.js',
      '.jsx',
      '.html',
      '.scss',
      '.css',
    ],
  },
};

module.exports = config;
