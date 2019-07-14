const mongoose = require("mongoose");
const { Schema } = mongoose;

const verseSchema = new Schema({
  verse: String,
  ref: String
});

mongoose.model("verses", verseSchema);
