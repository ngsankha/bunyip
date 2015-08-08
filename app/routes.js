function setup(app, handlers) {
  app.get('/', handlers.index.index);
  app.post('/v1/upload', handlers.v1.upload);
}

exports.setup = setup;
