const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let OrgSignupSchema = new Schema({
  name: String,
  contact: String,
  details: String,
});

module.exports = mongoose.model("OrgSignup", OrgSignupSchema);
