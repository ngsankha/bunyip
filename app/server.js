var express = require('express'),
    app = express(),
    routes = require('./routes');

var handlers = {
  index: function(req, res) {
    res.json({
      name: 'Bunyip API',
      version: '1.0.0',
      status: 'OK',
    });
  }
};

function start() {
  routes.setup(app, handlers);
  var port = process.env.PORT || 3000;
  app.listen(port);
  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
}

exports.start = start;
exports.app = app;
