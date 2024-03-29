var express = require('express'),
    morgan = require('morgan'),
    app = express(),
    jobs = require('./lib/jobs'),
    winston = require('winston'),
    config = require('./config');

app.use(morgan(config.log.level.morgan));
winston.level = config.log.level.winston;

app.get('/', function(req, res) {
  res.json({
    name: 'Bunyip Download Service',
    version: '1.0.0',
    status: 'OK'
  });
});

app.get('/*', function(req, res) {
  var id = req.path.substring(1);
  jobs.getJob(id, function(err, data) {
    if (err || !data) {
      res.status(404);
      res.json({error: true, message: 'An error occured fetching your file'});
    } else {
      if (data.status === 'pending') {
        res.json({error: true, message: 'File has not been processed yet'});
      } else {
        res.sendFile(data.path);
      }
    }
  });
});

var port = config.ports.download;
var server = app.listen(port);
console.log("Download server listening on port %d in %s mode", port, app.settings.env);
