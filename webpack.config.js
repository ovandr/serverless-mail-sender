const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: slsw.lib.entries,
  target: "node",
  // Generate sourcemaps for proper error messages
  devtool: 'source-map',

  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },

  // Since 'aws-sdk' is not compatible with webpack,
  // we exclude all node dependencies
  externals: [nodeExternals()],

  mode: slsw.lib.webpack.isLocal ? "development" : "production",

  optimization: {
    // We do not want to minimize our code.
    minimize: false
  },

  performance: {
    // Turn off size warnings for entry points
    hints: false
  },

  module: {
    rules: [{
      test: /\.ts(x?)$/,
      loader: "ts-loader"
    }]
  }
};
