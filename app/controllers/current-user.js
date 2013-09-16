var Controller = Ember.ObjectController.extend({
  init: function() {
    var self = this;
    var session = this.get("currentSession");
    var store = this.container.lookup("store:main");

    if(session) {
      store.find("family", session.userId).then(function(result) {
        self.set("content", result);
      });
    }

    this._super();
  }
});

export default Controller;
