var ApplicationRoute = Ember.Route.extend({
  actions: {
    error: function(reason) {
      if(reason.status && reason.status == 401) {
        this.controllerFor("sessions/new").set("flash.denied", true);
        this.transitionTo("sessions.new");
      }
    }
  }
});

export default ApplicationRoute;
