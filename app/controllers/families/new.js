import Session from 'appkit/models/session';

var NewController = Ember.ObjectController.extend({
  init: function() {
    this.set("newSession", Session.create({ container: this.container }));
    this._super();
  },
  emailDidChange: function() {
    this.set("newSession.email", this.get("email"));
  }.observes("email"),
  passwordDidChange: function() {
    this.set("newSession.password", this.get("password"));
  }.observes("password"),
  signUp: function() {
    var self = this;
    var password = this.get("password");
    this.get("model").save().then(function() {
      self.set("newSession.password", password);
      var complete = self.get("newSession").save();
      complete.then(function(data) {
        self.target.send("userDidChange", data);
        self.transitionToRoute("families.index");
      }, function(error) {
        self.set("errorCode", error.status);
        Ember.RSVP.rethrow(error);
      });
    }).fail(Ember.RSVP.rethrow);
  }
});

export default NewController;
