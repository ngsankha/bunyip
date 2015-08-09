var express = require('express'),
    app = express(),
    morgan = require('morgan'),
    winston = require('winston'),
    bodyParser = require('body-parser'),
    multipart = require('connect-multiparty'),
    routes = require('./routes'),
    auth = require('../lib/auth'),
    index = require('./handlers/index'),
    v1 = require('./handlers/v1'),
    config = require('../config');

var handlers = {
  index: index,
  v1: v1
};

var multipartMiddleware = multipart();

app.use(morgan(config.log.level.morgan));
app.use(multipartMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(auth.api_auth);

winston.level = config.log.level.winston;

function start() {
  routes.setup(app, handlers);
  var port = config.ports.api;
  app.listen(port);
  console.log("REST API server listening on port %d in %s mode", port, app.settings.env);
}

exports.start = start;
exports.app = app;
