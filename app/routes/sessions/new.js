var NewRoute = Ember.Route.extend({
  model: function() {
    return this.store.createRecord('session');
  }
});

export default NewRoute;
