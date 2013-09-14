var crypto = require('crypto');
var fortune = require('fortune');

var pbkdf2 = {
    iterations: Math.pow(2, 16),
      keylen: Math.pow(2, 8)
};

/**
 * Check if it's allowed to read/write based on the "owner" value.
 */
function checkToken(req, res, next) {
  // /families/new is the sign-up endpoint, so it should be public
  if(req.path.match(/families\/new/)) { return next(); }
  if(req.path.match(/sessions/)) { return next(); }
  if(req.get('X-Authorization') === undefined) { return res.send(401); }
  if(req.get('X-SignedInAs') === undefined) { return res.send(401); }

  var resource = this,
      email = req.get('X-SignedInAs'),
      token = req.get('X-Authorization');

  global.app.adapter.find('family', { email: email }).then(function(owner) {
    checkUser(owner, token).then(function() {
      return next();
    }, function(e) {
      console.error("error authenticating user: ", e);
      return res.send(401);
    });
  }, function(e) {
    console.error("error finding family: ", e);
    return res.send(401);
  });

}

function checkUser(user, compareToken) {
  return new fortune.RSVP.Promise(function(resolve, reject) {
    if(!compareToken) return reject();

    global.app.adapter.findMany('token', user.links.tokens).then(function(tokens) {

      var tokenFound = false;

      tokens.forEach(function(token) {
        if(token.value == compareToken) {
          tokenFound = true;
          resolve(user);
        }
      });

      if(!tokenFound) reject("token not found");

    }, function() {
      console.log("d'oh");
    });

  });
}

// before storing in database
function before(request) {
  var user = this
    , password = user.password
    , id = user.id || request.path.split('/').pop();

  // require a password on user creation
  if(request.method == 'POST') {
    if(!!password) {
      return hashPassword(user, password);
    } else {
      throw new Error("Authentication failed");
    }
  } else {
    return user;
  }

  function hashPassword(user, password) {
    var salt = crypto.randomBytes(Math.pow(2, 4));
    user.password = crypto.pbkdf2Sync(
      password, salt, pbkdf2.iterations, pbkdf2.keylen
    );
    user.salt = salt;
    return user;
  }
}

// after retrieving from database
function after(request) {
  var user = this;
  delete user.password;
  delete user.salt;
  return user;
}

module.exports = { before: before, after: after, checkToken: checkToken };

