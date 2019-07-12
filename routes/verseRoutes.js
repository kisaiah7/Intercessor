const passport = require("passport");
const mongoose = require("mongoose");
const Verse = mongoose.model("verses");

module.exports = app => {
  /*
      Fetch random Bible verse
  */
  app.get("/api/get_verse", async (req, res) => {
    let now = new Date();

    const random_verse = await Verse.findOne().skip(now.getDate());
    res.send(random_verse);
  });
};
