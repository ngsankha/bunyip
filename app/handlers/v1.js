var upload = function(req, res) {
  var wait = req.body.wait;

  res.json({done: true});
};

exports.upload = upload;
