const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    index: { unique: true }
  },
  password: String,
  googleID: String,
  firstName: String,
  lastName: String,
  fullName: String,
  acronym: String,
  gender: String,
  favGroups: [String],
  groups: [String],
  receviedPrayers: [String],
  ownPrayers: [String],
  timer: { type: Number, default: 3 },
  isVerified: { type: Boolean, default: false },
  newUser: { type: Boolean, default: true },
  theme: { type: String, default: "light" }
});

userSchema.methods.generateHash = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = (password, crypt) => {
  return bcrypt.compareSync(password, crypt);
};

module.export = userSchema;

mongoose.model("users", userSchema);
