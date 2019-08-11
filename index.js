const sslRedirect = require("heroku-ssl-redirect");
const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const keys = require("./config/keys");
require("dotenv").config();
require("./models/User");
require("./models/Prayers");
require("./models/Group");
require("./models/Verses");

require("./services/passport");

mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

const app = express();

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

// enable ssl redirect
app.use(sslRedirect());

require("./routes/authRoutes")(app);
require("./routes/prayerRoutes")(app);
require("./routes/userRoutes")(app);
require("./routes/groupRoutes")(app);
require("./routes/verseRoutes")(app);
require("./routes/mailRoutes")(app);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
