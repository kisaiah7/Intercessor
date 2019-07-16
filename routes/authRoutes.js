const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("users");

module.exports = app => {
  /*
      LOGIN/REGISTER GOOGLE STRATEGY
  */
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      prompt: "select_account"
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/"
    }),
    (req, res) => {
      if (req.user.newUser) {
        return res.redirect("/newUser");
      }
      return res.redirect("/menu");
    }
  );

  /*
      LOGIN LOCAL STRATEGY
  */
  app.post(
    "/api/login",
    handleLogin,
    passport.authenticate("local", {
      failureRedirect: "/"
    }),
    (req, res) => {
      return res.send({ success: true, user: req.user });
    }
  );

  async function handleLogin(req, res, next) {
    console.log("login pressed");
    let email = req.body.email;
    let password = req.body.password;

    if (!email) {
      res.send({ success: false, message: "Email is required." });
      return next();
    }
    if (!password) {
      return res.send({ success: false, message: "Password is required." });
    }

    email = email.toLowerCase();
    email = email.trim();

    const existingUser = await User.findOne({ email: email });

    if (existingUser == null) {
      return res.send({
        success: false,
        message: "User with email does not exist."
      });
    }
    if (!existingUser.validPassword(password, existingUser.password)) {
      return res.send({ success: false, message: "Incorrect password!" });
    }
    if (existingUser) {
      return next();
    }
  }

  /*
      CHECK FOR LOGIN
  */
  function requireLogin(req, res, next) {
    if (!req.user) return res.redirect("/");
    next();
  }

  app.get("/menu", requireLogin, function(req, res) {
    res.send("Menu", { user: req.user });
  });

  /*
      REGISTER LOCAL STRATEGY
  */
  app.post(
    "/api/register",
    handleRegister,
    passport.authenticate("local", {
      failureRedirect: "/"
    }),
    (req, res) => {
      return res.send({ success: true, user: req.user });
    }
  );

  app.post("/api/new_user", async (req, res, next) => {
    let { firstName, lastName, church, acronym, gender, email } = req.body;

    if (!firstName) {
      return res.send({ success: false, message: "First name is required." });
    }
    if (!lastName) {
      return res.send({ success: false, message: "Last name is required." });
    }
    if (!gender) {
      return res.send({
        success: false,
        message: "Gender selection is required."
      });
    }
    if (!acronym) {
      return res.send({ success: false, message: "User acronym is required." });
    }

    const checkAcronym = await User.findOne({ acronym: acronym });

    if (checkAcronym) {
      return res.send({ success: false, message: "User acronym is taken." });
    }

    const user = await User.findOne({ email: email });
    user.firstName = firstName;
    user.lastName = lastName;
    user.acronym = acronym;
    user.gender = gender;
    user.church = church;
    user.newUser = false;
    user.save((err, user) => {
      if (err) {
        return console.log(err);
      }
      console.log("updating...");
      res.send({ success: true, message: "Updating..." });
    });
  });

  async function handleRegister(req, res, next) {
    let { email, password, vpassword } = req.body;

    if (!email) {
      return res.send({ success: false, message: "Email is required." });
    }
    if (email.includes("@gmail.com")) {
      return res.send({ success: false, message: "<- Login with Google." });
    }
    if (!password || !vpassword) {
      return res.send({ success: false, message: "Password is required." });
    }
    if (password !== vpassword) {
      return res.send({ success: false, message: "Mismatching passwords." });
    }
    if (password.length < 6) {
      return res.send({
        success: false,
        message: "Password should be at least 6 characters."
      });
    }

    email = email.toLowerCase();
    email = email.trim();

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.send({ success: false, message: "Email already in use." });
    }

    const user = await new User();
    user.email = email;
    user.password = user.generateHash(password);
    user.save((err, user) => {
      if (err) {
        return console.log(err);
      }
      console.log("yay");
      return next();
    });
  }

  /*
      LOGOUT USER
  */
  app.get("/api/logout", (req, res) => {
    req.logout();
    res.send("asdf");
  });
};
