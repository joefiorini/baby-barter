var crypto = require('crypto');

var pbkdf2 = {
    iterations: Math.pow(2, 16),
      keylen: Math.pow(2, 8)
};

// before storing in database
function before(resolve, reject, request) {
  var user = this
    , password = user.password
    , id = user.id || request.path.split('/').pop();

  // require a password on user creation
  if(request.method == 'POST') {
    if(!!password) {
      return resolve(hashPassword(user, password));
    } else {
      reject();
    }
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
function after(resolve, reject, request) {
  var user = this;
  delete user.password;
  delete user.salt;
  resolve(user);
}

module.exports = { before: before, after: after };

