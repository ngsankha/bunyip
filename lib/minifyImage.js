var util = require('./missingUtils'),
    fs = require('fs'),
    Imagemin = require('imagemin');

var getMinifier = function(filename) {
  if (util.strEndsWith(filename, '.jpg') || util.strEndsWith(filename, '.jpeg'))
    return Imagemin.jpegtran({progressive: true});
};

var minify = function(src, dest, callback) {
  new Imagemin()
    .src(src)
    .dest(dest)
    .use(getMinifier(src))
    .run(function (err, files) {
      callback(err, files[0].contents);
      fs.unlink(src);
    });
};

exports.minify = minify;
