const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config) => {
  // Update the webpack configs as needed here.
  // e.g. `configs.plugins.push(new MyPlugin())`
  return config;
});
