const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let PersonalInfo = new Schema(
  {
    requester_name: String,
    requester_email: String,
    requester_phone: String,
    languages: [String],
    contact_option: Number
  },
  { noId: true }
);

let RequestInfo = new Schema(
  {
    resource_request: [String],
    payment: Number,
    details: String,
    time: String,
    date: String,
    behalf: Boolean,
  },
  { noId: true }
);

let LocationInfo = new Schema(
  {
    type: { type: String },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
  },
  { noId: true }
);

let AdminInfo = new Schema(
  {
    note: String,
    assignee: String,
    last_modified: Date,
  },
  { noId: true }
);

let VolunteerStatus = new Schema(
  {
    current_status: Number,
    volunteer: String,
    volunteer_response: String,
    last_notified_time: Date,
    adminMessage: String,
  },
  { noID: true }
);

let RequestSchema = new Schema({
  personal_info: PersonalInfo,
  request_info: RequestInfo,
  admin_info: AdminInfo,
  location_info: LocationInfo,
  status: {
    current_status: Number,
    volunteer_quota: Number,
    volunteers: [VolunteerStatus],
    completed_reason: String,
    completed_date: Date,
  },
  association: String,
  time_posted: Date,
  delete: Boolean,
});

module.exports = mongoose.model("Requests", RequestSchema);
