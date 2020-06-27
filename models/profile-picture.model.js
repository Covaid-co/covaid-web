const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let ProfilePictureSchema = new Schema({
  user_id: { type: String },
  filename: { type: String },
  fileId: { type: String },
});

module.exports = mongoose.model("ProfilePicture", ProfilePictureSchema);
