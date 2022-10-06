const withAntdLess = require("next-plugin-antd-less");

module.exports = withAntdLess({
  // modifyVars: { "@primary-color": "#d0504c" },
  modifyVars: { "@primary-color": "#3417af" },

  reactStrictMode: true,

  webpack(config) {
    return config;
  },
});
