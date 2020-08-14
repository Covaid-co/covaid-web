const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Schema = mongoose.Schema;

let RefreshTokensSchema = new Schema({
  user_id: { type: String, require: false },
  key: { type: String, required: true },
});

module.exports = mongoose.model("RefreshTokens", RefreshTokensSchema);
