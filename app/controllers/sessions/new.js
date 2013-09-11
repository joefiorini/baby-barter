var NewController = Ember.ObjectController.extend({
  flash: Ember.Object.create(),
  hasServerError: function() {
    console.log("serverError?", this.get("errorCode"));
    if(this.get("errorCode") >= 500) {
      return true;
    } else {
      return false;
    }
  }.property("errorCode"),
  hasAccessDenied: function() {
    console.log("accessDenied?", this.get("errorCode"));
    if(this.get("errorCode") >= 400 && this.get("errorCode") < 500) {
      return true;
    } else {
      return false;
    }
  }.property("errorCode"),
  actions: {
    signIn: function() {
      var self = this;

      this.setProperties({ hasError: false });

      this.get("model").save().then(function(data) {
        self.transitionToRoute("families.index");
      }).fail(function(error) {
        self.set("errorCode", error.status);
        Ember.RSVP.rethrow(error);
      });
    }
  }
});

export default NewController;
