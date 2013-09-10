var crypto = require('crypto');
var auth = require("./auth-transform"),
    fortune = require("fortune");

var app = fortune({
  db: "fortune-sandbox",
  host: "paulo.mongohq.com",
  port: "10066",
  username: "admin",
  password: "msmonkey"
}).

use(authentication).

resource("family", {
  display_name: String,
  email: String,
  password: String,
  salt: Buffer
}).transform(auth.before, auth.after).

resource("token", {
  owner: 'family',
  value: String
});

fortune.RSVP.configure("onerror", function(error) {
  console.error("error resolving promise: ", error.stack);
});

var pbkdf2 = {
    iterations: Math.pow(2, 16),
      keylen: Math.pow(2, 8)
};

function authentication(req, res, next) {
  console.log("path: ", req.path);
  if(!req.path.match(/sessions/i)) return next();
  if(!req.header('content-type').match(/^application\/json/)) {
    return res.send(412);
  }
  var email, password;
  console.log(req.body);
  try {
    email = req.body.email;
    password = req.body.password;
  } catch(error) {
    res.send(400);
  }
  app.adapter.find('family', {email: email}).then(function(user) {
    console.log("got user: ", user);
    var derivedKey = crypto.pbkdf2Sync(
      password, user.salt.buffer, pbkdf2.iterations, pbkdf2.keylen
    );
    if(derivedKey != user.password) return res.send(401);
    var token = {
      value: crypto.randomBytes(Math.pow(2, 6)).toString('base64'),
      links: {
        owner: user.id
      }
    };
    return app.adapter.create('token', token);
  }, function() {
    res.send(403);
  })

  .then(function(token) {
    res.send(200, token.value);
  }, function(e) {
    console.error("error authenticating user: ", e);
    res.send(500);
  });
}

module.exports = app;
