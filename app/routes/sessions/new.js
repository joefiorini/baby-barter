import Session from 'appkit/models/session';

var NewRoute = Ember.Route.extend({
  model: function() {
    return Session.create({ container: this.container });
  }
});

export default NewRoute;
