var ApplicationRoute = Ember.Route.extend({
  actions: {
    error: function(reason) {
      if(reason.status && reason.status == 401) {
        this.controllerFor("sessions/new").set("flash.denied", true);
        this.transitionTo("sessions.new");
      }
    },
    userDidChange: function(user) {
      this.get("currentUser").set("content", user);
    }
  }
});

export default ApplicationRoute;
