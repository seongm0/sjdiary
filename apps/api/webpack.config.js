const { composePlugins, withNx } = require('@nx/webpack');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), (config) => {
  // Update the webpack configs as needed here.
  // e.g. `configs.plugins.push(new MyPlugin())`
  return config;
});
