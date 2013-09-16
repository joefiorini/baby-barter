var Session = {
  name: "Session",
  initialize: function(container, app) {
    var session, controller, store, adapter;

    if(session = window.localStorage.getItem("session")) {
      var store = container.lookup("store:main");
      var adapter = store.adapterForType("family");
      session = JSON.parse(session);

      adapter.headers = adapter.headers || {};
      adapter.headers["X-Authorization"] = session.token;
      adapter.headers["X-SignedInAs"] = session.email;

      container.register("session:current", session, {instantiate: false});
      app.inject('controller', 'currentSession', 'session:current');
    } else {
      container.register("session:current", null, {instantiate: false});
    }

    controller = container.lookupFactory("controller:current-user")
    container.register("user:current", controller, {singleton: true});

    app.inject('route', 'currentUser', 'user:current');
    app.inject('controller', 'currentUser', 'user:current');

  }
};

export default Session;
