var NewRoute = Ember.Route.extend({
  model: function() {
    return this.store.createRecord('family');
  }
});

export default NewRoute;
