var attr = DS.attr;

var Session = DS.Model.extend({
  email: attr("string"),
  password: attr("string"),
  token: attr("string"),
  user: DS.belongsTo("family"),
  didCreate: function() {
    this.setHeaders();
    this.cacheCredentials();
  },
  didDelete: function() {
    window.localStorage.removeItem("session");
  },
  setHeaders: function() {
    var adapter = this.store.adapterForType("family");
    adapter.headers = adapter.headers || {};
    adapter.headers = {
      "X-Authorization": this.get("token"),
      "X-SignedInAs":    this.get("email")
    };
  },
  cacheCredentials: function() {
    window.localStorage.setItem("session", JSON.stringify(this.toJSON({includeId: true})));
  }
});

export default Session;
