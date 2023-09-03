const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');
const BuildHashPlugin = require('build-hash-webpack-plugin');
const fs = require('fs');

module.exports = defineConfig({
  terser: {
    minify: 'terser'
  },
  parallel: false,
  publicPath: '',
  configureWebpack: {
    optimization: {
      runtimeChunk: 'single',
    },
    plugins: [
      new BuildHashPlugin({
        filename: 'build-hash.json',
      }),
      new webpack.DefinePlugin({
        // 'process.env.BUILD_HASH': JSON.parse(fs.readFileSync('./build-hash.json', { encoding: 'utf-8'})).hash
      })
    ]
  },
  productionSourceMap: false,
  transpileDependencies: [
    'vuetify'
  ],
})
