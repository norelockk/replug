const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');

const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin();

// const BuildHashPlugin = require('build-hash-webpack-plugin');
// const fs = require('fs');

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
      // new BuildHashPlugin({
      //   filename: 'build-hash.json',
      // }),
      new webpack.DefinePlugin({
        'process.env.DEV_VERSION': JSON.stringify(gitRevisionPlugin.version()),
      })
    ]
  },
  productionSourceMap: false,
  transpileDependencies: [
    'vuetify'
  ],
})
