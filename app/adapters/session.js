import Base from 'appkit/adapters/application';

var Adapter = Base.extend({
  find: function(store, type, id) {
      if(id === "current") {
        return new Ember.RSVP.Promise(function(resolve, reject) {
          var session = window.localStorage.getItem("session");

          if(!session) reject("Requested current session, but it was not found in localStorage");

          session = JSON.parse(session);
          resolve({ session: session });
        });
      } else {
        return this._super(store, type, query);
      }
  }
});

export default Adapter;
