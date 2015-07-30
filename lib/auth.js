var Sequelize = require('sequelize'),
    sequelize = new Sequelize('bunyip', '', '', {
      dialect: 'sqlite',
      storage: 'db.sqlite',
      logging: false
    }),
    User = require('../models/user')(sequelize);

requires_auth = ['/v1/upload']

var api_auth = function(req, res, next) {
  if (requires_auth.indexOf(req.path) === -1)
    next();
  else {
    var username = req.body.username,
        api_key = req.body.api_key;
    User.findOne({
      where: {
        username: username,
        api_key: api_key
      }
    }).then(function(user) {
      if (!user)
        res.json({error: "Invalid username/api_key."});
      else
        next();
    });
  }
};

exports.api_auth = api_auth;
