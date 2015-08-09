var fs = require('fs');

conf = JSON.parse(fs.readFileSync('config.json'));

module.exports = conf;
