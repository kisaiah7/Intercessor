const mongoose = require("mongoose");
const { Schema } = mongoose;

const prayersSchema = new Schema({
  title: String,
  body: String,
  recipients: [String],
  userAcronym: String,
  user_name: String,
  user_gender: String,
  dateSent: Date,
  lastResponded: Date
});

mongoose.model("prayers", prayersSchema);
