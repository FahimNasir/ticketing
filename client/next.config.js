module.export = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
  },
};
