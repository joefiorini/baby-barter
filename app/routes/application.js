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
    },
    signOut: function() {
      var self = this;
      this.store.find("session", "current").then(function(session) {
        debugger;
        session.deleteRecord();
        session.save().then(function() {
          self.transitionTo("sessions.new");
        }, function(e) {
          debugger;
        });
      });
    }
  }
});

export default ApplicationRoute;
