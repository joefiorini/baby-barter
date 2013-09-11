var attr = DS.attr;

var Session = Ember.Object.extend({
  email: null,
  password: null,
  token: null,
  toJSON: function() {
    return { email: this.get("email"), password: this.get("password") };
  },
  save: function() {
    var self = this;
    var adapter = this.get("container").lookup("store:main").adapterForType("family")
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var xhr = $.ajax({
        url: adapter.host + "/sessions",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(self)
      });
      xhr.then(function(token) {
        adapter.headers = adapter.headers || {};
        adapter.headers["X-Authorization"] = token;
        adapter.headers["X-SignedInAs"] = self.get("email");
        self.set("token", token);
        self.cacheCredentials();
        resolve(self);
      }, reject);
    });
  },
  cacheCredentials: function() {
    var obj = this.getProperties("email", "token");
    window.localStorage.setItem("session", JSON.stringify(obj));
  }
});

export default Session;
