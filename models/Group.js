const mongoose = require("mongoose");
const { Schema } = mongoose;

const groupSchema = new Schema({
  name: String,
  acronym: String,
  location: String,
  description: String,
  memberCount: { type: Number, default: 0 },
  members: [String],
  isPrivate: { type: Boolean, default: false }
});

module.exports = groupSchema;

mongoose.model("groups", groupSchema);
