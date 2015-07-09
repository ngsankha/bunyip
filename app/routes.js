function setup(app, handlers) {
  app.get('/', handlers.index);
}

exports.setup = setup;
