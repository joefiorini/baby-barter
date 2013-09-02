var NewController = Ember.ObjectController.extend({
  signUp: function() {
    this.get("model").save();
  }
});

export default NewController;
