// config-overrides.js
//
const path = require("path");
const { override, addWebpackPlugin } = require("customize-cra");
const { BundleStatsWebpackPlugin } = require("bundle-stats-webpack-plugin");

module.exports = override(
  addWebpackPlugin(
    new BundleStatsWebpackPlugin({
      html: false,
      json: true,
      baselineFilepath: "../baseline-stats.json",
    }),
  ),
);
