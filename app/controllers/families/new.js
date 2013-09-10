var NewController = Ember.ObjectController.extend({
  signUp: function() {
    var self = this;
    this.get("model").save().then(function() {
      self.transitionToRoute("families.index");
    }).fail(Ember.RSVP.rethrow);
  }
});

export default NewController;
