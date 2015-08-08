var crypto = require('crypto');

var strEndsWith = function(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
};
exports.strEndsWith = strEndsWith;

var randomID = function() {
  return crypto.randomBytes(20).toString('hex');
};
exports.randomID = randomID;