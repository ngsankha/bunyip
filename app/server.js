var express = require('express'),
    app = express(),
    routes = require('./routes'),
    index = require('./handlers/index');

var handlers = {
  index: index
};

function start() {
  routes.setup(app, handlers);
  var port = process.env.PORT || 3000;
  app.listen(port);
  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
}

exports.start = start;
exports.app = app;
