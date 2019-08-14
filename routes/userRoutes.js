const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("users");

module.exports = app => {
  //UPDATING NEW USER INFO
  app.post("/api/userInfo", async (req, res, next) => {
    let { fname, lname, email, currentPw, newPw, newVpw } = req.body;
    let checkList = 0;

    const user = await User.findOne({ email });

    if (!fname) {
      return res.send({
        success: false,
        message: "First name can't be blank."
      });
    } else if (!lname) {
      return res.send({ success: false, message: "Last name can't be blank." });
    } else if (currentPw || newPw || newVpw) {
      if (!user.validPassword(currentPw, user.password)) {
        return res.send({ success: false, message: "Incorrect password." });
      } else {
        checkList++;
      }

      if (currentPw && (!newPw || !newVpw)) {
        return res.send({ success: false, message: "Enter new password." });
      } else {
        checkList++;
      }

      if (currentPw && newPw !== newVpw) {
        return res.send({
          success: false,
          message: "New passwords don't match."
        });
      } else {
        checkList++;
      }

      if (newPw.length < 6 || newVpw.length < 6) {
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
      user.password = user.generateHash(newPw);
    }
    user.save((err, user) => {
      if (err) {
        return err;
      }
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
        return err;
      }
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
    const { userInfo } = req.body;

    let userResults = [];

    const email = await User.find({ email: userInfo }).lean();
    const fname = await User.find({ firstName: userInfo }).lean();
    const lname = await User.find({ lastName: userInfo }).lean();
    const flname = await User.find({ fullName: userInfo }).lean();
    const acronym = await User.find({ acronym: userInfo }).lean();

    userResults = email.concat(fname, lname, acronym);

    if (userResults.length > 0) {
      res.send({ success: true, user: userResults, message: "Fetching..." });
    } else {
      return res.send({ success: false, message: "No results found." });
    }
  });

  app.post("/api/member_info", async (req, res) => {
    const { acronyms } = req.body;
    let memberResults = [];

    for (let i = 0; i < acronyms.length; i++) {
      const member = await User.find({ acronym: acronyms[i] });
      memberResults.push(member);
    }

    if (memberResults.length > 0) {
      res.send({ success: true, user: memberResults });
    } else {
      return res.send({ success: false, message: "No members found." });
    }
  });

  app.post("/api/user_gender", async (req, res) => {
    const { userAcronym } = req.body;

    const user = await User.find({ acronym: userAcronym }, "gender");

    return res.send(user);
  });

  //Delete - for testing
  app.get("/api/all_users", (req, res) => {
    User.find((err, user) => {
      if (err) {
        return res.send(err);
      }
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
