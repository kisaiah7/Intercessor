module.exports = async (req, res, next) => {
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
};
