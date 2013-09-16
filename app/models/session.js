var attr = DS.attr;

function extractUser(store, container, payload) {
  var raw,
      factory = container.lookupFactory('model:family'),
      serializer = store.serializerFor("family");

  payload = {
    family: payload.user
  };

  raw = serializer.extract(store, factory, payload, payload.family.id, 'find');
  return store.push("family", raw);
}

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
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var store = self.get("container").lookup("store:main");
      var adapter = store.adapterForType("family")

      var xhr = $.ajax({
        url: adapter.host + "/sessions",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(self)
      });
      xhr.then(function(result) {
        var user;

        adapter.headers = adapter.headers || {};
        adapter.headers["X-Authorization"] = result.token;
        adapter.headers["X-SignedInAs"] = self.get("email");

        user = extractUser(store, self.get("container"), result);

        self.set("token", result.token);
        self.set("user", user);

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
