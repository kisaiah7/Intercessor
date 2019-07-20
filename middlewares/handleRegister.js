module.exports = async (req, res, next) => {
  let { email, password, vpassword } = req.body;

  if (!password || !vpassword) {
    return res.send({ success: false, message: "Password is required." });
  }
  if (password !== vpassword) {
    return res.send({ success: false, message: "Mismatching passwords." });
  }
  if (!email) {
    return res.send({ success: false, message: email.includes("@gmail.com") });
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
    res.send({ success: true, message: "Registering...", user: user });
    next();
  });
};
