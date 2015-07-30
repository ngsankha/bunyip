var express = require('express'),
    app = express(),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    routes = require('./routes'),
    auth = require('../lib/auth'),
    index = require('./handlers/index'),
    v1 = require('./handlers/v1');

var handlers = {
  index: index,
  v1: v1
};

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(auth.api_auth);

function start() {
  routes.setup(app, handlers);
  var port = process.env.PORT || 3000;
  app.listen(port);
  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
}

exports.start = start;
exports.app = app;
