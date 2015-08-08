var minify = require('../../lib/minifyImage').minify,
    winston = require('winston'),
    util = require('../../lib/missingUtils');

var destPath = function(username) {
  return 'dl/' + username + '_' + util.randomID();
}

var upload = function(req, res) {
  var wait = req.body.wait;
  if (wait === 'true') {
    var image = req.files.image;
    minify(image.path, destPath(req.body.username), function(err, buffer) {
      winston.info("Minified file %s for user %s", image.name, req.body.username);
      if (err) {
        console.err(err);
        res.json({error: true, message: 'An error occured when converting your file'});
      } else {
        res.send(buffer);
      }
    });
  }
};

exports.upload = upload;
