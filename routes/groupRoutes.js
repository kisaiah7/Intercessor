const passport = require("passport");
const mongoose = require("mongoose");
const Group = mongoose.model("groups");
const User = mongoose.model("users");

module.exports = app => {
  /*
      CREATE A NEW GROUP
  */
  app.post("/api/create_group", createNewGroup, updateUserGroups);

  async function createNewGroup(req, res, next) {
    let {
      grp_name,
      grp_acronym,
      grp_description,
      memberCount,
      selected_users,
      isPrivate
    } = req.body;

    /*
        Checking params for null requests
    */
    if (!grp_name) {
      return res.send({ success: false, message: "Group name is required." });
    }

    if (!grp_acronym) {
      return res.send({
        success: false,
        message: "Group acronym is required."
      });
    } else {
      const existingGroup = await Group.findOne({ acronym: grp_acronym });

      if (existingGroup) {
        return res.send({
          success: false,
          message: "Acronym is already taken."
        });
      }
    }

    if (!grp_description) {
      return res.send({
        success: false,
        message: "Group description is required."
      });
    }

    if (selected_users.length < 1) {
      return res.send({ success: false, message: "Members are required." });
    }

    /*
        Creating a new group
    */
    const newGroup = await new Group();

    /*
        Include group details
    */
    newGroup.name = grp_name;
    newGroup.acronym = grp_acronym;
    newGroup.description = grp_description;
    newGroup.members = selected_users;
    newGroup.memberCount = memberCount;
    newGroup.isPrivate = isPrivate;
    newGroup.save(async (err, group) => {
      if (err) {
        return console.log(err);
      }
      next();
    });
  }

  async function updateUserGroups(req, res, next) {
    let { selected_users, grp_acronym } = req.body;

    /*
        Update each User's group [array] property
    */
    for (let i = 0; i < selected_users.length; i++) {
      const user = await User.findOne({ acronym: selected_users[i] });
      user.groups.push(grp_acronym);
      user.save(() => {
        res.send({ success: true, message: "Creating group..." });
      });
    }
  }

  /*
      Set group as PRIVATE
  */
  app.post("/api/privacy_group", async (req, res) => {
    let { isPrivate, group_acronym } = req.body;

    const group = await Group.findOne({ acronym: group_acronym });
    group.isPrivate = isPrivate;
    group.save();
  });

  /*
      Search groups and return array of group
  */
  app.post("/api/search_groups", async (req, res) => {
    let { query } = req.body;
    let results = [];

    const groups_byacronym = await Group.find({ acronym: query }).lean();
    if (groups_byacronym.length > 0) {
      results.push(groups_byacronym);
    }

    const groups_byname = await Group.find({ name: query }).lean();
    if (groups_byname.length > 0) {
      results.push(groups_byname);
    }

    res.send(results);
  });

  /*
      Get user's groups [array]
  */
  app.get("/api/user_groups", async (req, res) => {
    return res.send(req.user.groups);
  });

  app.post("/api/group_members", async (req, res) => {
    let { group_acronym } = req.body;

    let group = await Group.findOne({
      acronym: group_acronym
    }).lean();

    res.send({ members: group.members });
  });

  app.post("/api/listed_group_details", async (req, res) => {
    let { group_acronyms } = req.body;
    let listed_group_details = [];

    for (let i = 0; i < group_acronyms.length; i++) {
      let group = await Group.findOne({
        acronym: group_acronyms[i]
      }).lean();
      listed_group_details.push(group);
    }

    res.send({ groups: listed_group_details });
  });

  app.post("/api/favorite_group", async (req, res) => {
    let { acronym, isFavorite, user_email } = req.body;

    const user = req.user;

    if (isFavorite) {
      user.favGroups.push(acronym);
    } else {
      let index = user.favGroups.indexOf(acronym);
      user.favGroups.splice(index, 1);
    }
    user.save();
    res.send({ success: isFavorite });
  });

  app.post("/api/join_group", async (req, res) => {
    let { group_acronym, userAcronym } = req.body;

    const group = await Group.findOne({
      acronym: group_acronym
    });

    group.members.push(userAcronym);
    group.save(async (err, group) => {
      if (!err) {
        const user = await User.findOne({
          acronym: userAcronym
        });
        user.groups.push(group_acronym);
        user.save(() => {
          res.send({ success: true });
        });
      }
    });
  });

  app.post("/api/leave_group", async (req, res) => {
    let { group_acronym, userAcronym } = req.body;

    const group = await Group.findOne({
      acronym: group_acronym
    });

    let index = group.members.indexOf(userAcronym);
    group.members.splice(index, 1);
    group.save(async (err, group) => {
      if (!err) {
        const user = await User.findOne({
          acronym: userAcronym
        });

        let index = user.groups.indexOf(group_acronym);
        user.groups.splice(index, 1);
        user.save((err, user) => {
          if (!err) {
            if (user.favGroups.includes(group_acronym)) {
              let index = user.favGroups.indexOf(group_acronym);
              user.favGroups.splice(index, 1);
              user.save((err, user) => {
                if (!err) {
                  res.send({ success: true });
                }
              });
            } else {
              res.send({ success: true });
            }
          }
        });
      }
    });
  });
};
