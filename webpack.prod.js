const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
  mode: 'production',
  entry: {
    'zap-curve-chart': [path.resolve(__dirname, './src/index.ts')],
    'CurveSvgLineChart': [path.resolve(__dirname, './src/CurveSvgLineChart.ts')],
    'CurveLineChart': [path.resolve(__dirname, './src/CurveLineChart.ts')],
    'CurveDoughnutChart': [path.resolve(__dirname, './src/CurveDoughnutChart.ts')],
  },
  output: {
    filename: "[name].js",
    library: 'ZapCurveChart',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    'chart.js': {
      commonjs: 'chart.js',
      commonjs2: 'chart.js',
      amd: 'chart.js',
      root: 'Chart'
    },
    'bignumber.js': {
      commonjs: 'bignumber.js',
      commonjs2: 'bignumber.js',
      amd: 'bignumber.js',
      root: 'BigNumber'
    },
  },
  optimization: {
    minimize: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new MiniCssExtractPlugin({filename: 'style.css'})
  ]
});
