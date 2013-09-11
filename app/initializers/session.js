var Session = {
  name: "Session",
  initialize: function(container, app) {
    var session;
    if(session = window.localStorage.getItem("session")) {
      var adapter = container.lookup("store:main").adapterForType("family");
      adapter.headers = adapter.headers || {};
      session = JSON.parse(session);
      adapter.headers["X-Authorization"] = session.token;
      adapter.headers["X-SignedInAs"] = session.email;

    }
  }
};

export default Session;
