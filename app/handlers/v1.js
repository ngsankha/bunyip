var upload = function(req, res) {
  var username = req.body.username,
      api_key = req.body.api_key,
      wait = req.body.wait;

  auth.api_auth(username, api_key, function(authed) {
    if (authed) {
      res.json({auth: true});
    } else
      res.json({error: "Invalid username/api_key."});
  });
};

exports.upload = upload;
