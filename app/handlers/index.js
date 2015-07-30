var index = function(req, res) {
  res.json({
    name: 'Bunyip API',
    version: '1.0.0',
    status: 'OK'
  });
};

exports.index = index;
