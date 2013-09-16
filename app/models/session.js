var attr = DS.attr;

var Session = Ember.Object.extend({
  email: null,
  password: null,
  token: null,
  user: null,
  toJSON: function() {
    return { email: this.get("email"), password: this.get("password") };
  },
  save: function() {
    var self = this;
    var store = this.get("container").lookup("store:main");
    var adapter = store.adapterForType("family")
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var xhr = $.ajax({
        url: adapter.host + "/sessions",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(self)
      });
      xhr.then(function(result) {
        adapter.headers = adapter.headers || {};
        adapter.headers["X-Authorization"] = result.token;
        adapter.headers["X-SignedInAs"] = self.get("email");
        self.set("token", result.token);
        self.set("user", result.user);

        self.cacheCredentials();

        debugger;
        resolve(result.user);

      }, reject);
    });
  },
  cacheCredentials: function() {
    var obj = this.getProperties("email", "token");
    obj.userId = this.get("user.id");
    window.localStorage.setItem("session", JSON.stringify(obj));
  }
});

export default Session;
