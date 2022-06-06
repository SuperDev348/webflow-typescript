// https://github.com/necolas/react-native-web/issues/1192#issuecomment-459867802
const {
  addWebpackAlias,
  addBabelPreset,
  babelInclude,
  fixBabelImports,
  override,
  addBabelPlugin,
} = require('customize-cra')

const path = require('path')

module.exports = override(
  addBabelPreset("@babel/preset-env", { loose: true }),
  addBabelPreset("@babel/preset-react", {
    runtime: "automatic",
    importSource: '@emotion/react',
  }),
  addBabelPlugin("@babel/plugin-syntax-jsx"),
  addBabelPlugin("@babel/plugin-proposal-class-properties", { loose: true }),
  addBabelPlugin("@babel/plugin-proposal-private-methods", { loose: true }),
  addBabelPlugin("@babel/plugin-proposal-private-property-in-object", { loose: true }),
  fixBabelImports('module-resolver', {
    alias: {
      '^react-native$': 'react-native-web',
    },
  }),
  addWebpackAlias({
    'react-native': 'react-native-web',
    'react-native-svg': 'react-native-svg-web', // not necessary unless you wanted to do this
  }),
  babelInclude([
    path.resolve('src'), // make sure you link your own source
    // any react-native modules you need babel to compile
    path.resolve('node_modules/@pathwaymd'),
    path.resolve('node_modules/react-native-chart-kit'),
    path.resolve('node_modules/react-native-scalable-image'),
    path.resolve('node_modules/@react-native-segmented-control'),
    path.resolve('node_modules/@react-native-seoul')
  ])
)