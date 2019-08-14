const mongoose = require("mongoose");
const Prayer = mongoose.model("prayers");
const Group = mongoose.model("groups");
const User = mongoose.model("users");

module.exports = app => {
  app.post("/api/new_prayer", (req, res) => {
    const { title, body, recipients } = req.body;
    const prayer = new Prayer({
      title,
      body,
      recipients,
      user_gender: req.user.gender,
      userAcronym: req.user.acronym,
      user_name: req.user.firstName + " " + req.user.lastName,
      dateSent: Date.now()
    }).save(() => {
      res.send({ success: true, prayer: prayer });
    });
  });

  app.post("/api/prayer_detail", (req, res) => {
    const { title, body, recipients } = req.body;

    console.log(title);

    const prayer = new Prayer({
      title,
      body,
      recipients: recipients
        .split(",")
        .map(acronym => ({ acronym: acronym.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    }).save(() => {
      res.send({ success: true, prayer: prayer });
    });
  });

  app.post("/api/personal_prayers", async (req, res) => {
    const { acronym } = req.user;

    const prayers = await Prayer.find({ recipients: acronym }).lean();

    res.send(prayers);
  });

  app.post("/api/filter_prayers", async (req, res) => {
    const { group_acronym, load_page } = req.body;
    let prayers;

    console.log("PAGE LOAD", load_page);
    const skip_count = load_page * 10;

    if (group_acronym !== "personal") {
      prayers = await Prayer.find({ recipients: group_acronym })
        .sort("-dateSent")
        .skip(skip_count)
        .limit(10)
        .lean();
    } else {
      prayers = await Prayer.find({ recipients: req.user.acronym })
        .sort("-dateSent")
        .skip(skip_count)
        .limit(10)
        .lean();
    }

    res.send(prayers);
  });
};
