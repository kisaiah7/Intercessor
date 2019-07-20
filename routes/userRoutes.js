const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("users");

module.exports = app => {
  /*
      UPDATING NEW USER INFO
  */
  app.post("/api/user_info", async (req, res, next) => {
    let { fname, lname, email, current_pw, new_pw, new_vpw } = req.body;
    let checkList = 0;

    const user = await User.findOne({ email: email });

    if (!fname) {
      return res.send({
        success: false,
        message: "First name can't be blank."
      });
    }

    if (!lname) {
      return res.send({ success: false, message: "Last name can't be blank." });
    }

    if (current_pw || new_pw || new_vpw) {
      if (!user.validPassword(current_pw, user.password)) {
        return res.send({ success: false, message: "Incorrect password." });
      } else {
        checkList++;
      }

      if (current_pw && (!new_pw || !new_vpw)) {
        return res.send({ success: false, message: "Enter new password." });
      } else {
        checkList++;
      }

      if (current_pw && new_pw !== new_vpw) {
        return res.send({
          success: false,
          message: "New passwords don't match."
        });
      } else {
        checkList++;
      }

      if (new_pw.length < 6 || new_vpw.length < 6) {
        pass_check = false;
        return res.send({
          success: false,
          message: "Password must be at least 6 characters long."
        });
      } else {
        checkList++;
      }
    }

    user.firstName = fname;
    user.lastName = lname;
    if (checkList === 4) {
      user.password = user.generateHash(new_pw);
    }
    user.save((err, user) => {
      if (err) {
        return console.log(err);
      }
      console.log("updating...");
      res.send({ success: true, message: "Updating..." });
    });
  });

  /*
      UPDATING TIMER
  */
  app.post("/api/user_timer", async (req, res, next) => {
    let { timer } = req.body;

    const user = req.user;

    user.timer = timer;
    user.save((err, user) => {
      if (err) {
        return console.log(err);
      }
      console.log("updating...");
      res.send({ success: true, message: "Updating..." });
    });
  });

  /*
      UPDATING THEME PREFERENCE
  */
  app.post("/api/user_theme", async (req, res, next) => {
    let { theme } = req.body;

    const user = req.user;

    user.theme = theme;
    user.save((err, user) => {
      if (err) {
        return console.log(err);
      }
      console.log("updating...");
      res.send({ success: theme });
    });
  });

  /*
      FINDING USER INFO FOR GROUPS
  */
  app.post("/api/find_user", async (req, res) => {
    const { user_info } = req.body;
    console.log(user_info);
    let user_results = [];

    const email = await User.find({ email: user_info }).lean();
    const fname = await User.find({ firstName: user_info }).lean();
    const lname = await User.find({ lastName: user_info }).lean();
    const flname = await User.find({ fullName: user_info }).lean();
    const acronym = await User.find({ acronym: user_info }).lean();

    user_results = email.concat(fname, lname, acronym);

    if (user_results.length > 0) {
      res.send({ success: true, user: user_results, message: "Fetching..." });
    } else {
      return res.send({ success: false, message: "No results found." });
    }
  });

  app.post("/api/member_info", async (req, res) => {
    const { acronyms } = req.body;
    let member_results = [];

    for (let i = 0; i < acronyms.length; i++) {
      const member = await User.find({ acronym: acronyms[i] });
      console.log(member);
      member_results.push(member);
    }

    if (member_results.length > 0) {
      res.send({ success: true, user: member_results });
    } else {
      return res.send({ success: false, message: "No members found." });
    }
  });

  app.post("/api/user_gender", async (req, res) => {
    const { user_acronym } = req.body;

    const user = await User.find({ acronym: user_acronym }, "gender");

    console.log(user[0]);
    return res.send(user);
  });

  //Delete - for testing
  app.get("/api/all_users", (req, res) => {
    User.find((err, user) => {
      if (err) return res.send(err);
      return res.send(user);
    });
  });

  /*
      GET CURRENT USER MODEL
  */
  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });
};
