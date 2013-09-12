var crypto = require('crypto');
var auth = require("./auth-transform"),
    fortune = require("fortune");

var app = fortune({
  db: "fortune-sandbox",
  adapter: "mongodb",
  host: "paulo.mongohq.com",
  port: "10066",
  username: "admin",
  password: "msmonkey",
  cors: {
    headers: ['Accept', 'Content-Type', 'X-SignedInAs', 'X-Authorization']
  }
}).

use(authentication).
use(auth.checkToken).

resource("family", {
  display_name: String,
  email: String,
  password: String,
  salt: Buffer,
  tokens: ['token']
}).transform(auth.before, auth.after).

resource("sitting", {
  started_at: Date,
  ended_at: Date,
  requested_by: 'family',
  performed_by: 'family'
}).

resource("token", {
  owner: 'family',
  value: String
});

fortune.RSVP.configure("onerror", function(error) {
  if(error) {
    console.error("error resolving promise: ", error.stack);
  }
});

var pbkdf2 = {
    iterations: Math.pow(2, 16),
      keylen: Math.pow(2, 8)
};

function authentication(req, res, next) {
  if(!req.path.match(/sessions/i)) return next();
  if(!req.header('content-type').match(/^application\/json/)) {
    return res.send(412);
  }
  var email, password;

  try {
    email = req.body.email;
    password = req.body.password;
  } catch(error) {
    return res.send(400);
  }

  app.adapter.find('family', {email: email}).then(function(user) {
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
    // fortune.RSVP.rethrow();
    return res.send(403);
  })

  .then(function(token) {
    res.send(200, token.value);
  }, function(e) {
    fortune.RSVP.rethrow(e);
    console.error("error authenticating user: ", e);
    res.send(500);
  });
}

global.app = app;

module.exports = app;
