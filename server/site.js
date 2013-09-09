var auth = require("./auth-transform"),
    fortune = require("fortune");

module.exports = fortune({
  db: "fortune-sandbox",
  host: "paulo.mongohq.com",
  port: "10066",
  username: "admin",
  password: "msmonkey"
}).

resource("family", {
  display_name: String,
  email: String,
  password: String
}).transform(auth.before, auth.after);

fortune.RSVP.configure("onerror", function(error) {
  console.error("error resolving promise: ", error.stack);
});
