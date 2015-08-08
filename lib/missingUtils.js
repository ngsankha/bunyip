var crypto = require('crypto');

var randomID = function() {
  return crypto.randomBytes(20).toString('hex');
};
exports.randomID = randomID;
