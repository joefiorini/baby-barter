// before storing in database
function before(resolve, reject, request) {
  var user = this
    , password = user.password
    , id = user.id || request.path.split('/').pop();

  // require a password on user creation
  if(request.method == 'post') {
    if(!!password) {
      return resolve(hashPassword(user, password));
    } else {
      reject();
    }
  }

  // update a user
  checkUser(id, request).then(function(resource) {
    if(!password) return resolve(user);

    user = hashPassword(user, password);

    // clear tokens after password change
    RSVP.all((resource.links.tokens || []).map(function(id) {
      return app.adapter.delete('token', id);
    })).then(function() {
      resolve(user);
    }, reject);

  }, reject);

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
  checkUser(user.id, request).then(function() {
    resolve(user);
  }, function() {
    delete user.links;
    resolve(user);
  });
}

module.exports = { before: before, after: after };
