const mongoose = require("mongoose");
const crypto = require("crypto");

const Schema = mongoose.Schema;

var passwordSchema = new Schema(
  {
    hash: { type: String, required: true },
    salt: { type: String, required: true },
  },
  { noId: true }
);


let AssociationAdminSchema = new Schema({
  email: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: false },
  password: { type: passwordSchema, required: true },
  association_id: { type: String, required: true },
});

AssociationAdminSchema.methods.setPassword = function (password) {
  console.log(password)
  adminPass = this.password
  console.log(adminPass)
  this.password.salt = crypto.randomBytes(16).toString("hex");
  this.password.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

module.exports = mongoose.model("AssociationAdmin", AssociationAdminSchema);
