var IndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.find("family");
  }
});

export default IndexRoute;
