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
    var adapter = App.__container__.lookup("adapter:_rest");
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var xhr = $.ajax({
        url: "http://ember-dev-27896.use1.actionbox.io:3000/sessions",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(self)
      });
      xhr.then(function(token) {
        self.set("token", token);
        self.cacheToken();
        resolve(self);
      }, reject);
    });
  },
  cacheToken: function() {
    var token = this.get("token");
    window.localStorage.setItem("session-token", token);
  }
});

export default Session;
