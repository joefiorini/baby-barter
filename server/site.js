module.exports = require("fortune")({
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
});
