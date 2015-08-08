var minify = require('../../lib/minifyImage').minify,
    jobs = require('../../lib/jobs'),
    winston = require('winston'),
    util = require('../../lib/missingUtils');

var processJob = function(id, req, res) {
  var wait = req.body.wait;
  if (wait === 'true') {
    var image = req.files.image;
    minify(id, image.path, 'dl/' + req.body.username, function(err, buffer) {
      winston.info("Minified file %s for user %s", image.name, req.body.username);
      if (err) {
        winston.error(err);
        res.json({error: true, message: 'An error occured when converting your file'});
      } else {
        res.send(buffer);
      }
    });
  } else {
    // TODO
  }
};

var upload = function(req, res) {
  jobs.newJob(function(err, id) {
    if (err) {
      winston.error(err);
    } else {
      processJob(id, req, res);
    }
  });
};

exports.upload = upload;
