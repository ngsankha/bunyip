var util = require('./missingUtils'),
    fs = require('fs'),
    path = require('path'),
    jobs = require('./jobs'),
    winston = require('winston'),
    rename = require('gulp-rename'),
    Imagemin = require('imagemin');

var getMinifier = function(filename) {
  if (path.extname(filename) === '.jpg' || path.extname(filename) === '.jpeg') {
    return Imagemin.jpegtran({progressive: true});
  }
};

var minify = function(id, src, dest, callback) {
  winston.debug("Minifying image for job %s", id);
  new Imagemin()
    .src(src)
    .dest(dest)
    .use(getMinifier(src))
    .use(rename(id + path.extname(src)))
    .run(function (err, files) {
      callback(err, files[0].contents);
      jobs.markForDeletion(id, files[0].path);
      fs.unlink(src);
    });
};

exports.minify = minify;
