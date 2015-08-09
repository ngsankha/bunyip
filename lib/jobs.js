var winston = require('winston'),
    util = require('./missingUtils'),
    redis = require('redis'),
    fs = require('fs'),
    config = require('../config'),
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
    .set(config.jobs.prefix + id, JSON.stringify({ status: 'pending' }))
    .expire(config.jobs.prefix + id, config.jobs.timeout)
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
  client.set(config.jobs.prefix + id, JSON.stringify({ status: 'done', path: filename }), function(err, res) {
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
      }, config.jobs.timeout * 1000);
    }
  });
};
exports.markForDeletion = markForDeletion;

var getJob = function(id, callback) {
  winston.debug("Fetching job %s status", id);
  client.get(config.jobs.prefix + id, function(err, reply) {
    if (err) {
      winston.error("Error fetching job %s", id);
      winston.error(err);
      callback(err);
    } else {
      callback(undefined, JSON.parse(reply));
    }
  });
};
exports.getJob = getJob;
