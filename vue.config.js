const VueSSRPlugin = require('vue-server-renderer/server-plugin')
const VueClientPlugin = require('vue-server-renderer/client-plugin')
const nodeExternals = require('webpack-node-externals')
const merge = require('lodash.merge')
const TARGET_NODE = process.env.WEBPACK_TARGET === 'node'
const target = TARGET_NODE ? 'server' : 'client'

module.exports = {
  publicPath: 'http://127.0.0.1:3000',
  css: {
    extract: process.env.NODE_ENV === 'production'
  },
  configureWebpack: () => ({
    entry: `./entry/entry-${target}.js`,
    devtool: 'source-map',
    target: TARGET_NODE ? 'node' : 'web',
    node: TARGET_NODE ? undefined : false,
    output: {
      libraryTarget: TARGET_NODE ? 'commonjs2' : undefined
    },
    externals: TARGET_NODE ? nodeExternals({
      allowlist: [/\.css$/]
    }) : undefined,
    optimization: {
      splitChunks: TARGET_NODE ? false : undefined
    },
    plugins: [TARGET_NODE ? new VueSSRPlugin() : new VueClientPlugin()]
  }),
  chainWebpack: config => {
    config.module.rule('vue').use('vue-loader').tap(options => {
      merge(options, {
        optimizeSSR: false
      })
    })
    if (TARGET_NODE) {
      config.plugins.delete('hmr')
    }
  }
}
