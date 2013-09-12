var NewRoute = Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
      sitting: this.store.createRecord('sitting'),
      families: this.store.find('family')
    });
  },
  setupController: function(controller, model) {
    controller.set("content", model.sitting);
    controller.set("families", model.families);
  }
});

export default NewRoute;
