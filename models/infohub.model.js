const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/*
 * For mediaType:
 * 0 = link or article
 * 1 = video
 * 2 = podcast
 */

/*
 * For sectionID:
 * 0 = The Basics on Coronavirus
 * 1 = Necessities: Food and Jobs
 * 2 = Entertaining and Caring for Yourself
 * 3 = Communities to Join
 */

let ResourceSchema = new Schema({
  url: { type: String, require: true },
  name: { type: String, require: true },
  description: { type: String, require: true },
  mediaType: { type: Number, required: false },
  sectionID: { type: Number, required: false },
  associationID: {type: String, required: false}
});

module.exports = mongoose.model("Resources", ResourceSchema);
