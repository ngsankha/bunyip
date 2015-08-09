var winston = require('winston'),
    util = require('./missingUtils'),
    redis = require('redis'),
    fs = require('fs'),
    client = redis.createClient();

client.on('error', function(err) {
  winston.error('Error connecting to redis');
  winston.error(err);
});

client.on('connect', function() {
  winston.info('Connected to redis');
});

var newJob = function(callback) {
  var id = util.randomID();
  winston.debug("Creating new job %s", id);
  client.multi()
    .set('bunyip::job::' + id, { status: 'pending' })
    .expire('bunyip::job::' + id, 3600)
    .exec(function(err, replies) {
      if (err) {
        callback(err, undefined);
      } else {
        callback(undefined, id);
      }
    });
};
exports.newJob = newJob;

var markForDeletion = function(id, filename, callback) {
  winston.debug("Marking job %s for deletion", id);
  client.set('bunyip::job::' + id, { status: 'done', path: filename }, function(err, res) {
    if (err) {
      winston.error("Error marking job %s for deletion", id);
      winston.error(err);
      callback(err);
    } else {
      callback();
      setTimeout(function() {
        fs.unlink(filename, function(err) {
          if (err) {
            winston.error("Error deleting file %s", filename);
            winston.error(err);
          }
        });
      }, 10000);
    }
  });
};
exports.markForDeletion = markForDeletion;
