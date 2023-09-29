// config-overrides.js
const { override, addWebpackPlugin } = require("customize-cra");
const { BundleStatsWebpackPlugin } = require("bundle-stats-webpack-plugin");

module.exports = override(
  addWebpackPlugin(
    new BundleStatsWebpackPlugin({
      baseline: !process.env.COMPARE,
      compare: process.env.COMPARE,
    }),
  ),
);
