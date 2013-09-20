var crypto = require('crypto');
var auth = require("./auth-transform"),
    fortune = require("fortune");

function printResource(request) {
  console.log("resource for: ", request.path, this);
  return this;
}

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
  displayName: String,
  email: String,
  password: String,
  salt: Buffer,
  tokens: ['token'],
  sittings: ['sitting']
}).transform(auth.before, auth.after).

resource("sitting", {
  startedAt: Date,
  endedAt: Date,
  requestedBy: 'family',
  performedBy: {ref: 'family', inverse: 'sittings'}
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

    return app.adapter.create('token', token).then(function(token) {
      return { token: token.value, user: user };
    });
  }, function() {
    // fortune.RSVP.rethrow();
    return res.send(403);
  })

  .then(function(result) {
    res.send(200, result);
  }, function(e) {
    fortune.RSVP.rethrow(e);
    console.error("error authenticating user: ", e);
    res.send(500);
  });
}

global.app = app;

module.exports = app;
