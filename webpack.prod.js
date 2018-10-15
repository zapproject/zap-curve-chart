const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'production',
  entry: {
    index: [path.resolve(__dirname, './src/index.ts')],
  },
  output: {
    library: 'ZapCurve',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    'chart.js': {
      commonjs: 'Chart',
      commonjs2: 'Chart',
      amd: 'Chart',
      root: 'Chart'
    },
  },
  optimization: {
    minimize: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
});
