function setup(app, handlers) {
  app.get('/', handlers.index.index);
}

exports.setup = setup;
